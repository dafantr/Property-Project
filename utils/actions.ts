"use server";

import {
	createReviewSchema,
	imageSchema,
	profileSchema,
	promotionSchema,
	propertySchema,
	validateWithZodSchema,
} from "./schemas";
import db from "./db";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
//import { use } from 'react';
import { uploadImage } from "./supabase";
import { calculateTotals } from "./calculateTotals";
import { formatDate } from "./format";
import { reward, member, referralDetails, loyaltyPointDetails } from "./types";
import { MemberActions } from "@/app/admin/memberOverview/components/MemberActions";
import { supabase } from "./supabase"; // ✅ Import the existing Supabase client
import { DownlineType } from "@/utils/types";
import prisma from "./db";
import { AnyZodTuple } from "zod";

const bucket = "Property-Project";

const getAuthUser = async () => {
	const user = await currentUser();
	if (!user) {
		return redirect("/");
	}
	// if (!user.privateMetadata.hasProfile) redirect('/profile/create');
	return user;
};

const getAdminUser = async () => {
	const user = await getAuthUser();
	if (user.id !== process.env.ADMIN_USER_ID) {
		redirect("/");
	}
	return user;
};

const renderError = (error: unknown): { message: string } => {
	console.log(error);
	return {
		message: error instanceof Error ? error.message : "An error occurred",
	};
};

export const createProfileAction = async (
	prevState: any,
	formData: FormData
) => {
	try {
		const user = await currentUser();
		if (!user) throw new Error("Please login to create a profile");

		const rawData = Object.fromEntries(formData);
		const validatedFields = validateWithZodSchema(profileSchema, rawData);
		await db.profile.create({
			data: {
				clerkId: user.id,
				email: user.emailAddresses[0].emailAddress,
				profileImage: user.imageUrl ?? "",
				...validatedFields,
			},
		});
		await clerkClient.users.updateUserMetadata(user.id, {
			privateMetadata: {
				hasProfile: true,
			},
		});
	} catch (error) {
		return renderError(error);
	}
	redirect("/");
};

export const fetchProfileImage = async () => {
	const user = await currentUser();
	if (!user) return null;
	const profile = await db.profile.findUnique({
		where: {
			clerkId: user.id,
		},
	});
	return profile?.profileImage;
};

export const fetchProfile = async () => {
	const user = await getAuthUser();
	const profile = await db.profile.findUnique({
		where: {
			clerkId: user.id,
		},
	});
	if (!profile) return null;
	return profile;
};

export const updateProfileAction = async (
	prevState: any,
	formData: FormData
): Promise<{ message: string }> => {
	const user = await getAuthUser();
	try {
		const rawData = Object.fromEntries(formData);
		const validatedFields = validateWithZodSchema(profileSchema, rawData);
		await db.profile.update({
			where: {
				clerkId: user.id,
			},
			data: validatedFields,
		});
		revalidatePath("/profile");
		return { message: "Profile updated successfully" };
	} catch (error) {
		return renderError(error);
	}
};

export const updateProfileImageAction = async (
	prevState: any,
	formData: FormData
) => {
	const user = await getAuthUser();
	try {
		const image = formData.get("image") as File;
		const validatedFields = validateWithZodSchema(imageSchema, { image });
		const fullPath = await uploadImage(validatedFields.image);

		await db.profile.update({
			where: {
				clerkId: user.id,
			},
			data: {
				profileImage: fullPath,
			},
		});
		revalidatePath("/profile");
		return { message: "Profile image updated successfully" };
	} catch (error) {
		return renderError(error);
	}
};

export const createPropertyAction = async (
	prevState: any,
	formData: FormData
): Promise<{ message: string }> => {
	const user = await getAuthUser();

	try {
		const rawData = Object.fromEntries(formData);
		const files = formData.getAll("image") as File[];
		const googleMapsUrl = formData.get("googleMapsUrl") as string | null; // Explicitly cast to string or null

		// Ensure at least one image is provided
		if (!files.length) {
			throw new Error("At least one image is required");
		}

		// Ensure googleMapsUrl is a string
		if (typeof googleMapsUrl !== "string") {
			throw new Error("Invalid Google Maps URL");
		}

		const validatedFields = validateWithZodSchema(propertySchema, rawData);

		// Upload all images and store their URLs
		const uploadedImages = await Promise.all(
			files.map(async (file) => {
				const validatedFile = validateWithZodSchema(imageSchema, { image: file });
				return await uploadImage(validatedFile.image);
			})
		);

		// Store property with multiple images
		await db.property.create({
			data: {
				...validatedFields,
				image: uploadedImages, // Store array of image URLs
				googleMapsUrl, // Now guaranteed to be a string
				profileId: user.id,
			},
		});

		return { message: "Property created successfully!" };
	} catch (error) {
		console.error(error);
		return renderError(error);
	}

	redirect("/");
};



export const fetchProperties = async ({
    search = "",
    category,
}: {
    search?: string;
    category?: string;
}) => {
    const properties = await db.property.findMany({
        where: {
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { city: { contains: search, mode: "insensitive" } },
            ],
            ...(category ? { category } : {}),
        },
        select: {
            id: true,
            name: true,
            tagline: true,
            city: true,
            price: true,
            createdAt: true,
            image: true,
            category: true, // ✅ Fix: Add category
            reviews: {
                select: { rating: true },
            },
        },
    });

    return properties.map((property) => {
        const ratings = property.reviews.map((review) => review.rating);
        const averageRating = ratings.length
            ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
            : null;

        return {
            ...property,
            rating: averageRating,
            count: ratings.length,
        };
    });
};

export const fetchFavoriteId = async ({
	propertyId,
}: {
	propertyId: string;
}) => {
	const user = await getAuthUser();
	const favorite = await db.favorite.findFirst({
		where: {
			propertyId,
			profileId: user.id,
		},
		select: {
			id: true,
		},
	});
	return favorite?.id || null;
};

export const toggleFavoriteAction = async (prevState: {
	propertyId: string;
	favoriteId: string | null;
	pathname: string;
}) => {
	const user = await getAuthUser();
	if (!user?.id) {
		// Handle case where user is not authenticated
		throw new Error("User not authenticated");
	}

	const { propertyId, favoriteId, pathname } = prevState;

	try {
		// If the property is already favorited, remove it
		if (favoriteId) {
			await db.favorite.delete({
				where: {
					id: favoriteId,
				},
			});
		} else {
			// If not favorited, add it to the favorites
			await db.favorite.create({
				data: {
					propertyId,
					profileId: user.id, // Make sure to link the favorite with the correct user
				},
			});
		}

		// Revalidate the page (if needed)
		revalidatePath(pathname);

		return {
			message: favoriteId
				? "Removed from your Favorite"
				: "Added to your Favorite",
		};
	} catch (error) {
		console.error("Error toggling favorite:", error);
		return renderError(error);
	}
};


export const fetchFavorites = async () => {
	const user = await getAuthUser();
	const favorites = await db.favorite.findMany({
		where: {
			profileId: user.id,
		},
		select: {
			property: {
				select: {
					id: true,
					name: true,
					tagline: true,
					price: true,
					city: true,
					image: true,
				},
			},
		},
	});
	return favorites.map((favorite: { property: any }) => favorite.property);
};

export const fetchPropertyDetails = async (id: string) => {
	const property = await db.property.findUnique({
		where: { id },
		include: {
			profile: true,
			bookings: {
				select: {
					checkIn: true,
					checkOut: true,
				},
			},
			reviews: true, // Include reviews in the response to calculate rating
		},
	});

	if (property) {
		const totalReviews = property.reviews.length;

		// Calculate the average rating if there are reviews
		const averageRating =
			totalReviews > 0
				? (
					property.reviews.reduce((sum, review) => sum + review.rating, 0) /
					totalReviews
				).toFixed(1)
				: "0"; // Rounding to 1 decimal place

		return {
			...property,
			googleMapsUrl: property.googleMapsUrl, // 🔥 Ensure this is included
			rating: parseFloat(averageRating), // Convert to float for numerical accuracy
			count: totalReviews,
		};
	}

	return null;
};


export async function createReviewAction(prevState: any, formData: FormData) {
	const user = await getAuthUser();
	try {
		//console.log(Object.fromEntries(formData));
		const rawData = Object.fromEntries(formData);

		const validatedFields = validateWithZodSchema(createReviewSchema, rawData);
		await db.review.create({
			data: {
				...validatedFields,
				profileId: user.id,
			},
		});
		revalidatePath(`/properties/${validatedFields.propertyId}`);
		return {
			message:
				"Review submitted successfully... Thank you for your honest review!",
		};
	} catch (error) {
		return renderError(error);
	}
}

export async function fetchPropertyReviews(propertyId: string) {
	const reviews = await db.review.findMany({
		where: {
			propertyId,
		},
		select: {
			id: true,
			rating: true,
			comment: true,
			profile: {
				select: {
					username: true,
					profileImage: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});
	return reviews;
}

export const fetchPropertyReviewsByUser = async () => {
	const user = await getAuthUser();
	const reviews = await db.review.findMany({
		where: {
			profileId: user.id,
		},
		select: {
			id: true,
			rating: true,
			comment: true,
			property: {
				select: {
					name: true,
					image: true,
				},
			},
		},
	});
	return reviews;
};

export const deleteReviewAction = async (prevState: { reviewId: string }) => {
	const { reviewId } = prevState;
	const user = await getAuthUser();

	try {
		await db.review.delete({
			where: {
				id: reviewId,
				profileId: user.id,
			},
		});

		revalidatePath("/reviews");
		return { message: "Review deleted successfully" };
	} catch (error) {
		return renderError(error);
	}
};

export async function fetchPropertyRating(propertyId: string) {
	const result = await db.review.groupBy({
		by: ["propertyId"],
		_avg: {
			rating: true,
		},
		_count: {
			rating: true,
		},
		where: {
			propertyId,
		},
	});

	return {
		rating: result[0]?._avg.rating?.toFixed(1) ?? 0,
		count: result[0]?._count.rating ?? 0,
	};
}

export const findExistingReview = async (
	userId: string,
	propertyId: string
) => {
	return db.review.findFirst({
		where: {
			profileId: userId,
			propertyId: propertyId,
		},
	});
};

export const createBookingAction = async (prevState: {
	propertyId: string;
	checkIn: Date;
	checkOut: Date;
	referalCode: string;
}) => {
	let bookingId: null | string = null;

	try {
		const profile = await fetchProfile();

		if (profile === null) {
			return renderError("Profile not found");
		}

		const { propertyId, checkIn, checkOut, referalCode } = prevState;
		const property = await db.property.findUnique({
			where: { id: propertyId },
			select: { price: true },
		});

		if (!property) {
			return { message: "Property not found" };
		}

		// cek referalCode
		if (referalCode.length > 0) {
			const referalValid = await validateReferalCode(referalCode, "booking");
			if (!referalValid) {
				return { message: "Invalid referral code", status: "error" };
			}
		}

		const { orderTotal, totalNights, discount } = calculateTotals({
			checkIn,
			checkOut,
			price: property.price,
			referalCode,
		});

		const booking = await db.booking.create({
			data: {
				checkIn,
				checkOut,
				orderTotal,
				totalNights,
				profileId: profile?.clerkId,
				propertyId,
				referalCode: referalCode,
			},
		});
		bookingId = booking.id;
	} catch (error) {
		return renderError(error);
	}
	redirect(`/choosepayment?bookingId=${bookingId}`);
};

export const fetchBookings = async () => {
	const profile = await fetchProfile();
	const bookings = await db.booking.findMany({
		where: {
			profileId: profile?.clerkId,
			paymentStatus: { in: ["PENDING", "COMPLETED"] }, // Fetch both
		},
		include: {
			property: {
				select: {
					id: true,
					name: true,
					city: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});
	return bookings;
};

export async function deleteBookingAction(prevState: { bookingId: string }) {
	const { bookingId } = prevState;
	const user = await getAuthUser();

	try {
		const result = await db.booking.delete({
			where: {
				id: bookingId,
				profileId: user.id,
			},
		});

		revalidatePath("/bookings");
		return {
			message: "Your reservation has been canceled. We're sorry to see you go!",
		};
	} catch (error) {
		return renderError(error);
	}
}

export const fetchRentals = async () => {
	const user = await getAuthUser();

	// Get the admin ID from the environment variable
	const adminId = process.env.ADMIN_USER_ID;

	// Check if the logged-in user is an admin
	const isAdmin = user.id === adminId; // If the user matches the admin ID

	const rentals = await db.property.findMany({
		where: isAdmin ? {} : { profileId: user.id }, // If admin, fetch all properties
		select: {
			id: true,
			name: true,
			price: true,
			createdAt: true,
		},
	});

	const rentalsWithBookingSums = await Promise.all(
		rentals.map(async (rental) => {
			const totalNightsSum = await db.booking.aggregate({
				where: {
					propertyId: rental.id,
					paymentStatus: "COMPLETED", // Change from true to "COMPLETED"
				},
				_sum: {
					totalNights: true,
				},
			});
			
			const orderTotalSum = await db.booking.aggregate({
				where: {
					propertyId: rental.id,
					paymentStatus: "COMPLETED", // Change from true to "COMPLETED"
				},
				_sum: {
					orderTotal: true,
				},
			});			

			return {
				...rental,
				totalNightsSum: totalNightsSum._sum.totalNights || 0,
				orderTotalSum: orderTotalSum._sum.orderTotal || 0,
			};
		})
	);

	return rentalsWithBookingSums;
};


export async function deleteRentalAction(prevState: { propertyId: string }) {
	const { propertyId } = prevState;
	const user = await getAuthUser(); // Get the authenticated user

	try {
		// Ensure the user is an admin
		await getAdminUser(); // This will throw an error if the user is not an admin

		// Proceed with deleting the property if the user is an admin
		await db.property.delete({
			where: {
				id: propertyId, // Only need to specify the property ID for admin users
			},
		});

		revalidatePath("/rentals");
		return { message: "Rental deleted successfully" };
	} catch (error) {
		return renderError(error); // Handle any errors (including permission errors)
	}
}


export const fetchRentalDetails = async (propertyId: string) => {
	const user = await getAuthUser();

	// Get the admin ID from the environment variable
	const adminId = process.env.ADMIN_USER_ID;

	// Check if the logged-in user is an admin
	const isAdmin = user.id === adminId; // If the user matches the admin ID

	return db.property.findUnique({
		where: {
			id: propertyId,
			// If the user is an admin, allow fetching any property
			profileId: isAdmin ? undefined : user.id, // If admin, no profileId filter
		},
	});
};

export const updatePropertyAction = async (
    prevState: any,
    formData: FormData
): Promise<{ message: string }> => {
    const user = await getAuthUser();
    const propertyId = formData.get("id") as string;

    try {
        const rawData = Object.fromEntries(formData);
        const validatedFields = validateWithZodSchema(propertySchema, rawData);

        // Get the combined image string from the hidden input
        const allImages = formData.get("image")?.toString() || "";
        
        // Split into array and filter out empty strings
        const imageArray = allImages.split(",").filter(Boolean);

        // Get deleted images
        const deletedImages = formData.get("deletedImages")?.toString().split(",").filter(Boolean) || [];

        // Filter out deleted images from the final array
        const finalImages = imageArray.filter(img => !deletedImages.includes(img));

        console.log("Final images to save:", finalImages);

        // Update the database with all fields including the final image array
        await db.property.update({
            where: { id: propertyId },
            data: {
                ...validatedFields,
                image: finalImages,
            },
        });

        revalidatePath(`/rentals/${propertyId}/edit`);
        return { message: "Update Successful" };
    } catch (error) {
        console.error('Error updating property:', error);
        return renderError(error);
    }
};

export const updatePropertyImageAction = async (
	prevState: any,
	formData: FormData
): Promise<{ message: string; imageUrls: string[] }> => {
	const user = await getAuthUser();
	const propertyId = formData.get("id") as string;

	try {
		const adminId = process.env.ADMIN_USER_ID;
		const isAdmin = user.id === adminId;

		const images = formData.getAll("image") as File[];
		if (images.length === 0) {
			return { message: "No images uploaded", imageUrls: [] };
		}

		const imageUrls = await Promise.all(
			images.map(async (image) => {
				const validatedFields = validateWithZodSchema(imageSchema, { image });
				const fullPath = await uploadImage(validatedFields.image);
				return fullPath;
			})
		);

		const property = await db.property.findUnique({
			where: { id: propertyId },
			select: { image: true },
		});

		const updatedImages = Array.isArray(property?.image)
			? [...property.image, ...imageUrls]
			: imageUrls;

		// Update the property with new images
		await db.property.update({
			where: { id: propertyId },
			data: {
				image: { push: imageUrls },
			},
		});

		revalidatePath(`/rentals/${propertyId}/edit`);

		return { message: "Property Images Updated Successfully", imageUrls };
	} catch (error) {
		return { message: "Failed to update property images", imageUrls: [] }; // ✅ Fix: Ensure 'imageUrls' is always returned
	}
};

export const fetchReservations = async () => {
	//const user = await getAuthUser();
	const reservations = await db.booking.findMany({
		where: {
			paymentStatus: { in: ["PENDING", "COMPLETED"] },
		},
		orderBy: {
			createdAt: "desc",
		},
		include: {
			profile: {
				select: {
					firstName: true,
					lastName: true,
				},
			},
			property: {
				select: {
					id: true,
					name: true,
					price: true,
					city: true,
					profileId: true, // Include the property owner's ID
				},
			},
		},
	});

	//console.log("Logged-in User ID:", user.id);
	return reservations;
};

export const fetchStats = async () => {
	await getAdminUser();

	const usersCount = await db.profile.count();
	const propertiesCount = await db.property.count();
	const bookingsCount = await db.booking.count({
		where: {
			paymentStatus: "COMPLETED", // Change from true to "COMPLETED"
		},
	});	

	return {
		usersCount,
		propertiesCount,
		bookingsCount,
	};
};

export const fetchChartsData = async () => {
	await getAdminUser();
	const date = new Date();
	date.setMonth(date.getMonth() - 6);
	const sixMonthsAgo = date;

	const bookings = await db.booking.findMany({
		where: {
			paymentStatus: "COMPLETED", // Change from true to "COMPLETED"
			createdAt: {
				gte: sixMonthsAgo,
			},
		},
		orderBy: {
			createdAt: "asc",
		},
	});
	
	let bookingsPerMonth = bookings.reduce((total, current) => {
		const date = formatDate(current.createdAt, true);

		const existingEntry = total.find((entry) => entry.date === date);
		if (existingEntry) {
			existingEntry.count += 1;
		} else {
			total.push({ date, count: 1 });
		}
		return total;
	}, [] as Array<{ date: string; count: number }>);
	return bookingsPerMonth;
};

export const fetchReservationStats = async () => {
	const user = await getAuthUser();

	const completedBookings = await db.booking.count({
		where: {
			paymentStatus: "COMPLETED",
		},
	});

	const totals = await db.booking.aggregate({
		_sum: {
			orderTotal: true,
			totalNights: true,
		},
		where: {
			paymentStatus: "COMPLETED",
		},
	});

	return {
		properties: completedBookings, 
		nights: totals._sum.totalNights || 0,
		amount: totals._sum.orderTotal || 0,
	};
};

export const fetchFiveStarReviews = async () => {
	try {
		const reviews = await db.review.findMany({
			where: {
				rating: 5,
			},
			select: {
				id: true,
				comment: true,
				rating: true,
				profile: {
					select: {
						username: true,
						profileImage: true,
					},
				},
			},
		});

		return reviews;
	} catch (error) {
		console.error("Error fetching 5-star reviews:", error);
		throw new Error("Failed to fetch 5-star reviews");
	}
};

export const fetchGalleries = async () => {
	const galleries = await db.gallery.findMany({
		select: {
			id: true,
			title: true,
			media: true,
			createdAt: true,
		},
	});

	const galleriesWithBookingSums = await Promise.all(
		galleries.map(async (galleries) => {
			return {
				...galleries,
			};
		})
	);

	return galleriesWithBookingSums;
};

export const createGalleryAction = async (
	prevState: any,
	formData: FormData
): Promise<{ message: string }> => {
	const user = await getAuthUser();
	try {
		const title = formData.get("title") as string;
		const file = formData.get("image") as File;

		// const validatedFields = validateWithZodSchema(propertySchema, rawData);
		const validatedFile = validateWithZodSchema(imageSchema, { image: file });
		const fullPath = await uploadImage(validatedFile.image);

		await db.gallery.create({
			data: {
				title: title,
				media: fullPath,
				profileId: user.id,
			},
		});
	} catch (error) {
		return renderError(error);
	}
	redirect("/gallery");
};

export async function deleteGaleryAction(prevState: { galeryId: string }) {
	const { galeryId } = prevState; // `id` corresponds to MongoDB `_id` via Prisma

	const user = await getAuthUser(); // Ensure user is authenticated

	try {
		await db.gallery.delete({
			where: {
				id: galeryId, // Prisma maps `id` to MongoDB `_id`
			},
		});

		revalidatePath("/gallery"); // Revalidate gallery page
		return { message: "Gallery deleted successfully" };
	} catch (error) {
		console.error("Error deleting gallery:", error); // Debug error
		return renderError(error); // Handle errors gracefully
	}
}

export const fetchPromotions = async () => {
	const promotions = await db.promotion.findMany({
		select: {
			id: true,
			title: true,
			subtitle: true,
			category: true,
			description: true,
			media: true,
			createdAt: true,
		},
	});

	const promotionsWithBookingSums = await Promise.all(
		promotions.map(async (promotions) => {
			return {
				...promotions,
			};
		})
	);

	return promotionsWithBookingSums;
};

export const createPromotionAction = async (
	prevState: any,
	formData: FormData
): Promise<{ message: string }> => {
	const user = await getAuthUser();
	try {
		const title = formData.get("title") as string;
		const subtitle = formData.get("subtitle") as string;
		const category = formData.get("category") as string;
		const description = formData.get("description") as string;
		const file = formData.get("image") as File;

		// const validatedFields = validateWithZodSchema(propertySchema, rawData);
		const validatedFile = validateWithZodSchema(imageSchema, { image: file });
		const fullPath = await uploadImage(validatedFile.image);

		await db.promotion.create({
			data: {
				title: title,
				subtitle: subtitle,
				description: description,
				category: category,
				media: fullPath,
				profileId: user.id,
			},
		});
	} catch (error) {
		return renderError(error);
	}
	redirect("/promotions");
};

export async function deletePromotionAction(prevState: {
	promotionId: string;
}) {
	try {
		await getAdminUser(); // This will redirect if not admin

		await db.promotion.delete({
			where: {
				id: prevState.promotionId,
			},
		});

		revalidatePath("/promotions");
		redirect("/promotions");
	} catch (error) {
		return renderError(error);
	}
}

export async function fetchPromotionDetails(promotionId: string) {
	const user = await getAdminUser();

	const promotion = await db.promotion.findUnique({
		where: {
			id: promotionId,
		},
	});
	return promotion;
}

export const fetchPromotionDetailsPublic = async (promotionId: string) => {
	return db.promotion.findUnique({
		where: {
			id: promotionId,
		},
	});
};

export const updatePromotionAction = async (
	prevState: any,
	formData: FormData
): Promise<{ message: string }> => {
	const user = await getAuthUser();
	const promotionId = formData.get("id") as string;

	try {
		//console.log("FormData received:", Object.fromEntries(formData));
		const rawData = Object.fromEntries(formData);
		//console.log("test raw data : ", rawData);
		const validatedFields = validateWithZodSchema(promotionSchema, rawData);
		//console.log("Validated fields:", validatedFields);
		await db.promotion.update({
			where: {
				id: promotionId,
				profileId: user.id,
			},
			data: {
				...validatedFields,
			},
		});

		revalidatePath(`/promotions/${promotionId}/edit`);
		return { message: "Update Successful" };
	} catch (error) {
		return renderError(error);
	}
};

export const updatePromotionImageAction = async (
	prevState: any,
	formData: FormData
): Promise<{ message: string }> => {
	const user = await getAuthUser();
	const promotionId = formData.get("id") as string;

	try {
		const image = formData.get("image") as File;
		const validatedFields = validateWithZodSchema(imageSchema, { image });
		const fullPath = await uploadImage(validatedFields.image);

		await db.promotion.update({
			where: {
				id: promotionId,
				profileId: user.id,
			},
			data: {
				media: fullPath,
			},
		});
		revalidatePath(`/promotions/${promotionId}/edit`);
		return { message: "Promotion Image Updated Successful" };
	} catch (error) {
		return renderError(error);
	}
};

// MEMBERSHIP
export const createMemberAction = async (
	prevState: any,
	formData: FormData
): Promise<{ message: string; status: string }> => {
	const citizen = formData.get("citizen") as string;
	const phone = formData.get("phone") as string;
	const address = formData.get("address") as string;
	const gender = formData.get("gender") as string;
	const bankName = formData.get("bankName") as string;
	const bankAccNum = formData.get("bankAccNum") as string;
	const bankAccName = formData.get("bankAccName") as string;
	const referalCode = formData.get("referalCode") as string;
	const dob = formData.get("birthDate") as string;
	const formattedDate = dob.slice(0, 10);
	const totalPrice = formData.get("totalPrice") as string;
	const paymentMethod = formData.get("paymentMethod") as string;

	let fullPath = null;
	if (paymentMethod === 'TRF') {
		const proofOfPayment = formData.get("image") as File;
		const validatedFile = validateWithZodSchema(imageSchema, { image: proofOfPayment });
		fullPath = await uploadImage(validatedFile.image);
	}

	let closerCode = formData.get("closerCode") as string;

	let closerValid = false;
	let referalValid = false;

	const memberId = await generateUniqueMemberId();

	let transactionId = null;

	try {
		const profile = await fetchProfile();

		if (profile === null) {
			return { message: "Profile not found", status: "error" };
		}

		const member = await fetchMember(profile.clerkId, undefined);

		if (member !== null) {
			if (member.isActive === 0 && member.isDeleted === 0) {
				await deleteIncompleteMember(profile.clerkId, member.memberId);
			} else if (member.isActive === 1 && member.isDeleted === 0) {
				return { message: "Member already exist", status: "error" };
			}
		}

		// cek referalCode
		if (referalCode.length > 0) {
			referalValid = await validateReferalCode(referalCode, "member");
			if (!referalValid) {
				return { message: "Invalid referral code", status: "error" };
			}
		}

		if (closerCode.length > 0) {
			closerValid = await validateReferalCode(closerCode, "member");
			if (!closerValid) {
				return { message: "Invalid closer code", status: "error" };
			}
		}

		// set closerCode = referalCode jika closerCode kosong
		if (
			referalCode.length > 0 &&
			referalValid &&
			(!closerCode || closerCode.trim().length === 0)
		) {
			closerCode = referalCode;
		}

		const tier = await fetchTierByLevel(1);
		if (tier === null) return { message: "Tier not found", status: "error" };

		const parentMember = await fetchMember(undefined, referalCode);

		await db.member.create({
			data: {
				memberId: memberId,
				profileId: profile?.clerkId,
				parentMemberId: referalCode,
				parentId: parentMember?.id,
				tierId: tier.id,
				citizen: citizen,
				dob: formattedDate,
				phone: phone,
				address: address,
				gender: gender,
				bankName: bankName,
				bankAccNum: bankAccNum,
				bankAccName: bankAccName,
			},
		});

		const membershipCommissionTransactionId =
			await createMembershipCommissionTransaction(
				memberId,
				closerCode,
				referalCode,
				paymentMethod,
				fullPath,
				parseInt(totalPrice),
			);
		transactionId = membershipCommissionTransactionId.toString();
	} catch (error) {
		return { message: "Failed to create member, " + error, status: "error" };
	}

	if (paymentMethod === "CC") {
		redirect(`/member/checkout?mId=${memberId}&trId=${transactionId}`);
	} else {
		return { message: "Member created successfully, please wait for approval", status: "success" };
	}
};

const generateUniqueMemberId = async () => {
	// Generate and verify uniqueness
	let code = generateCode();
	let isUnique = false;
	let maxAttempts = 10; // Prevent infinite loops

	while (!isUnique && maxAttempts > 0) {
		// Check if code exists in database
		const existingMember = await db.member.findFirst({
			where: { memberId: code },
		});

		if (!existingMember) {
			isUnique = true;
		} else {
			code = generateCode();
			maxAttempts--;
		}
	}

	if (!isUnique) {
		throw new Error("Failed to generate unique member ID, Please try again");
	}

	return code;
};

const generateCode = () => {
	// Characters to use for generating the code (alphanumeric)
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

	let result = "";
	// Generate 6 characters
	for (let i = 0; i < 6; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		result += characters[randomIndex];
	}
	return result;
};

export const updateMemberAction = async (
	prevState: any,
	formData: FormData
): Promise<{ message: string; status: string }> => {
	try {
		const memberId = formData.get("memberId") as string;
		const email = formData.get("email") as string;
		const phone = formData.get("phone") as string;
		const address = formData.get("address") as string;
		const citizen = formData.get("citizen") as string;
		const gender = formData.get("gender") as string;
		const bankName = formData.get("bankName") as string;
		const bankAccNum = formData.get("bankAccNum") as string;
		const bankAccName = formData.get("bankAccName") as string;
		const dob = formData.get("birthDate") as string;
		const formattedDate = dob.slice(0, 10);

		const member = await fetchMember(undefined, memberId);
		if (member === null)
			return { message: "Member not found", status: "error" };

		await db.profile.update({
			where: {
				clerkId: member?.profileId,
			},
			// data: validatedFields,
			data: {
				email: email,
			},
		});

		await db.member.update({
			where: {
				id: member.id,
			},
			data: {
				phone: phone,
				address: address,
				dob: formattedDate,
				citizen: citizen,
				gender: gender,
				bankName: bankName,
				bankAccNum: bankAccNum,
				bankAccName: bankAccName,
			},
		});
		revalidatePath("/member/dashboard");
		return {
			message: "Member profile updated successfully",
			status: "success",
		};
	} catch (error) {
		return { message: "Failed to update member profile", status: "error" };
	}
};

export const fetchMember = async (profileId?: string, memberId?: string) => {
	return await db.member.findFirst({
		where: {
			profileId: profileId,
			memberId: memberId,
		},
	});
};

export const validateReferalCode = async (
	referalCode: string,
	from: string
): Promise<boolean> => {
	try {
		const profile = await fetchProfile();
		const member = await db.member.findFirst({
			where: {
				memberId: referalCode,
				isDeleted: 0,
				isActive: 1,
			},
		});
		if (member !== null) {
			//penjagaan penggunaan referal code sendiri
			// if (member.profileId == profile?.clerkId) {
			// 	return false;
			// }

			//penjagaan referal code marketing untuk booking
			if (from === "booking" && member.isMarketing === true) {
				return false;
			}
		}

		//jika referal kosong atau tidak ditemukan
		if (member === null) return false;

		return true;
	} catch (error) {
		return false;
	}
};

export const distributeCommission = async (
	transactionId: string,
	type: string
) => {
	try {
		if (type === "booking") {
			const booking = await db.booking.findFirst({
				where: { id: transactionId },
			});
			if (booking === null) throw new Error("Booking Not Found!");

			if (booking.referalCode) {
				const member = await fetchMember(undefined, booking.referalCode as string);
				if (member === null) throw new Error("Member Not Found!");

				const commissionRate = await getGeneralVariable("bookingCommissionRate");
				if (commissionRate === null) {
					throw new Error("Commission rate not found");
				}
				let commission = booking.orderTotal * (Number(commissionRate.variableValue) / 100);

				await db.commissionDistribution.create({
					data: {
						memberId: member.memberId,
						bookingId: booking.id,
						commission: commission,
						type: 'booking',
					},
				});
				await updateMemberCommission(member.memberId, commission);
			}
		} else if (type === "membership") {
			const transaction = await db.membershipCommissionTransaction.findFirst({
				where: { id: transactionId },
			});
			if (transaction === null) throw new Error("Transaction Not Found!");

			const member = await fetchMember(undefined, transaction.referalCode as string);
			if (member === null) throw new Error("Member Not Found!");

			const memberTier = await fetchTierById(member.tierId);
			if (memberTier === null) throw new Error("Tier Not Found!");

			if (member.parentMemberId && member.isActive === 1 && member.isDeleted === 0) {
				const parentMember = await fetchMember(undefined, member.parentMemberId);
				if (parentMember === null) throw new Error("Parent Member Not Found!");

				const parentMemberTier = await fetchTierById(parentMember.tierId);
				if (parentMemberTier === null) throw new Error("Parent Tier Not Found!");

				if (parentMemberTier.tierLevel > memberTier.tierLevel) {
					let passiveCommissionRate = parentMemberTier.commission - memberTier.commission;
					let passiveCommission = transaction.totalPrice * (passiveCommissionRate / 100);

					await db.commissionDistribution.create({
						data: {
							memberId: parentMember.memberId,
							membershipCommissionTransactionId: transaction.id,
							commission: passiveCommission,
							type: 'passive',
						},
					});
					await updateMemberCommission(parentMember.memberId, passiveCommission);
				}
				await updateMemberPoint(parentMember.memberId, transaction.id, "passive");
			}

			let refCommission = await calculateCommission(transaction.referalCode as string, transaction.totalPrice);

			await db.commissionDistribution.create({
				data: {
					memberId: member.memberId,
					membershipCommissionTransactionId: transaction.id,
					commission: refCommission,
					type: 'referral',
				},
			});
			await updateMemberCommission(member.memberId, refCommission);
			await updateMemberPoint(member.memberId, transaction.id, "referral");

		} else if (type === "closer") {

			const transaction = await db.membershipCommissionTransaction.findFirst({
				where: { id: transactionId },
			});
			if (transaction === null) throw new Error("Transaction Not Found!");

			const member = await fetchMember(undefined, transaction.closerId as string);
			if (member === null) throw new Error("Member Not Found!");

			const closerCommissionRate = await getGeneralVariable("closerPercentage");
			if (closerCommissionRate === null) {
				throw new Error("Commission rate not found");
			}
			let closerCommission = transaction.totalPrice * (Number(closerCommissionRate.variableValue) / 100);

			await db.commissionDistribution.create({
				data: {
					memberId: member.memberId,
					membershipCommissionTransactionId: transaction.id,
					commission: closerCommission,
					type: 'closer',
				},
			});
			await updateMemberCommission(member.memberId, closerCommission);
		}
	} catch (error) {
		return renderError(error);
	}
};

export const updateMemberCommission = async (memberId: string, commission: number) => {
	const member = await fetchMember(undefined, memberId);
	if (member === null) throw new Error("Member Not Found!");

	await db.member.update({
		where: { id: member.id },
		data: { commission: member.commission + commission },
	});
}

export const updateMemberPoint = async (memberId: string, transactionId: string, type: string) => {
	const member = await fetchMember(undefined, memberId);
	if (member === null) throw new Error("Member Not Found!");

	await db.pointDistributionHistory.create({
		data: {
			memberId: member.memberId,
			point: 1,
			membershipCommissionTransactionId: transactionId,
			type: type,
		},
	});

	await db.member.update({
		where: { id: member.id },
		data: { point: member.point + 1 },
	});
}

export const fetchTierById = async (id: string) => {
	return await db.tier.findUnique({
		where: {
			id: id,
		},
	});
};

export const fetchTierByName = async (name: string) => {
	return await db.tier.findFirst({
		where: {
			tierName: name,
		},
	});
};

export const fetchTierByLevel = async (level: number) => {
	return await db.tier.findFirst({
		where: {
			tierLevel: level,
		},
	});
};

export const fetchTierAll = async () => {
	return await db.tier.findMany();
};

export const fetchDownline = async (memberId: string) => {
	return await db.member.findMany({
		where: {
			parentId: memberId,
		},
	});
};

export const fetchDownlines = async (memberId: string, depth: number): Promise<DownlineType | null> => {
    return await db.member.findUnique({
        where: { id: memberId },
        select: createDownlineSelect(depth), // Ensure this function matches DownlineType[]
    }) as DownlineType | null; // Explicitly cast the return type
};

const createDownlineSelect = (depth: number) => {
	const profileSelect = {
		firstName: true,
		lastName: true,
		profileImage: true,
	};

	const buildSelect = (currentDepth: number): any => {
		if (currentDepth === 0) {
			return {
				id: true,
				memberId: true,
				profile: { select: profileSelect },
			};
		}

		return {
			id: true,
			memberId: true,
			profile: { select: profileSelect },
			downlines: {
				select: buildSelect(currentDepth - 1),
			},
		};
	};

	return {
		id: true,
		profile: { select: profileSelect },
		memberId: true,
		isActive: true,
		isDeleted: true,
		downlines: {
			select: buildSelect(depth - 1),
		},
	};
};

// Fetch Rewards Action
export const fetchRewards = async () => {
	try {
		const rewards = await db.reward.findMany({
			select: {
				id: true,
				rewardName: true,
				pointReq: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});
		return rewards;
	} catch (error) {
		console.error('Error fetching rewards:', error);
		return [];
	}
};

export const createMembershipCommissionTransaction = async (
	memberId: string,
	closerCode: string,
	referalCode: string,
	paymentMethod: string,
	proofOfPayment: string | null,
	totalPrice: number,
) => {
	try {
		let membershipCommissionTransaction = null;

		membershipCommissionTransaction =
			await db.membershipCommissionTransaction.create({
				data: {
					memberId: memberId,
					closerId: closerCode,
					referalCode: referalCode,
					paymentStatus: false,
					paymentMethod: paymentMethod,
					proofOfPayment: proofOfPayment,
					totalPrice: totalPrice,
				},
			});
		return membershipCommissionTransaction.id;
	} catch (error) {
		console.error("Error creating membership commission transaction", error);
		return { message: "Error creating membership commission transaction" };
	}
};

export async function calculateCommission(
	referalCode: string,
	totalPrice: number
): Promise<number> {
	const referal = await fetchMember(undefined, referalCode);

	if (referal === null) throw new Error("Member not found");

	let refCommission = 0;
	let tier = null;

	if (referal.isMarketing === true) {
		tier = await fetchTierByName("Marketing");
	} else {
		tier = await fetchTierById(referal.tierId);
	}

	if (tier === null) throw new Error("Tier not found");

	refCommission = totalPrice * (tier.commission / 100);

	if (tier === null) throw new Error("Tier not found");

	return refCommission;
}

export async function redeemReward(reward: reward): Promise<void> {
	try {
		const profile = await fetchProfile();
		if (profile === null) throw new Error("Profile not found");

		const member = await fetchMember(profile.clerkId);
		if (member === null) throw new Error("Member not found");

		if (member.point >= reward.pointReq) {
			//create pointTransaction
			await db.pointTransaction.create({
				data: {
					memberId: member.memberId,
					rewardId: reward.id,
				},
			});

			//deduct the member's point
			await db.member.update({
				where: {
					id: member.id,
				},
				data: {
					point: member.point - reward.pointReq,
				},
			});
		} else {
			throw new Error("Member does not have enough points");
		}
	} catch (error) {
		throw new Error("failed to redeem reward. " + error);
	}
}

export const getGeneralVariable = async (variableName: string) => {
	const variable = await db.generalVariable.findFirst({
		where: {
			variableName: variableName,
		},
	});
	return variable;
};

export const deleteIncompleteMember = async (clerkId: string, memberId: string) => {

	await db.membershipCommissionTransaction.deleteMany({
		where: {
			memberId: memberId,
			paymentStatus: false,
		},
	});

	await db.member.deleteMany({
		where: {
			profileId: clerkId,
			isActive: 0,
		},
	});
};

export const updateMemberTier = async (memberId: string) => {
	const member = await fetchMember(undefined, memberId);
	if (member === null) throw new Error("Member not found");

	if (member.isMarketing === false) {
		const tier = await fetchTierById(member.tierId);
		if (tier === null) throw new Error("Tier not found");

		const downline = await fetchDownline(memberId);

		const nextTier = await fetchTierByLevel(tier.tierLevel + 1);
		if (nextTier === null) throw new Error("Next tier not found");

		if (downline.length >= nextTier.requiredDownline) {
			await db.member.update({
				where: {
					id: member.id,
				},
				data: {
					tierId: nextTier.id,
				},
			});
		}
	}
};

export const fetchReferralDetails = async (member: { memberId: string }) => {
	try {
		const transactions = await db.commissionDistribution.findMany({
			where: { memberId: member.memberId },
			select: {
				id: true,
				member: {
					select: {
						profile: {
							select: {
								firstName: true,
								lastName: true,
							},
						},
					},
				},
				commission: true,
				type: true,
				createdAt: true,
				membershipCommissionTransaction: {
					select: { paymentStatus: true }, 
				},
				booking: {
					select: { paymentStatus: true }, 
				},
			},
		});

		const formattedTransactions = transactions.map((txn) => ({
			...txn,
			booking: txn.booking
				? {
						...txn.booking,
						paymentStatus: txn.booking.paymentStatus === "COMPLETED", // Convert to boolean
				  }
				: null,
		}));

		return formattedTransactions;
	} catch (error) {
		console.error("Error fetching referral details:", error);
		return { message: error instanceof Error ? error.message : "Error fetching referral details" };
	}
};

export const fetchMemberAll = async (startDate?: Date | null, endDate?: Date | null) => {
	try {
		const dateFilter = startDate && endDate ? {
			createdAt: {
				gte: startDate,
				lte: endDate
			}
		} : {};

		const members = await db.member.findMany({
			where: {
				...dateFilter,
				isDeleted: 0,
			},
			include: {
				profile: true,
				tier: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		const deletedMembers = await db.member.findMany({
			where: {
				...dateFilter,
				isDeleted: 1,
			},
			include: {
				profile: true,
				tier: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		const allMembers = [...members, ...deletedMembers];

		return allMembers;
	} catch (error) {
		console.error("Error fetching members:", error);
		throw new Error("Failed to fetch members");
	}
};

export const fetchMemberRequests = async (startDate?: Date | null, endDate?: Date | null) => {
	try {
		const dateFilter = startDate && endDate ? {
			createdAt: {
				gte: startDate,
				lte: endDate
			}
		} : {};

		const memberRequests = await db.membershipCommissionTransaction.findMany({
			where: {
				...dateFilter,
				paymentMethod: "TRF",
				paymentStatus: false,
			},
			select: {
				id: true,
				memberId: true,
				member: {
					select: {
						profile: {
							select: {
								firstName: true,
								lastName: true,
								email: true,
							}
						},
						tier: {
							select: {
								tierName: true,
							}
						},
						dob: true,
						citizen: true,
						phone: true,
						address: true,
						gender: true,
						bankName: true,
						bankAccNum: true,
						bankAccName: true,
						isActive: true,
					}
				},
				referalCode: true,
				closerId: true,
				paymentMethod: true,
				proofOfPayment: true,
				paymentStatus: true,
				createdAt: true,
			}
		});

		return memberRequests;
	} catch (error) {
		console.error("Error fetching member requests:", error);
		throw new Error("Failed to fetch member requests");
	}
};

export const clearMemberPointsAndCommission = async (memberId: string) => {
	try {
		await db.member.update({
			where: {
				id: memberId,
			},
			data: {
				point: 0,
				commission: 0,
			},
		});
		revalidatePath("/cms");
		return { message: "Points and commission cleared successfully" };
	} catch (error) {
		return renderError(error);
	}
};

export const deleteMember = async (memberId: string) => {
	try {
		await db.member.update({
			where: {
				id: memberId,
			},
			data: {
				isDeleted: 1,
				isActive: 0,
			},
		});
		revalidatePath("/cms");
		return { message: "Member deleted successfully" };
	} catch (error) {
		return renderError(error);
	}
};

export const undoDeleteMember = async (memberId: string) => {
	try {
		await db.member.update({
			where: {
				id: memberId,
			},
			data: {
				isDeleted: 0,
				isActive: 1,
			},
		});
		revalidatePath("/cms");
		return { message: "Member undeleted successfully" };
	} catch (error) {
		return renderError(error);
	}
};

export const makeMarketingMember = async (memberId: string) => {
	try {
		const marketingTier = await fetchTierByName("Marketing");
		if (marketingTier === null) throw new Error("Marketing tier not found");

		await db.member.update({
			where: {
				id: memberId,
			},
			data: {
				isMarketing: true,
				tierId: marketingTier.id,
			},
		});
		revalidatePath("/cms");
		return { message: "Updated to marketing member successfully" };
	} catch (error) {
		return renderError(error);
	}
};

export const removeMarketingMember = async (memberId: string) => {
	try {
		const downline = await fetchDownline(memberId);
		
		let newTier: any;

		if (downline.length === 0) {
			newTier = await fetchTierByLevel(1);
		} else {
			const tiers = await db.tier.findMany({
				orderBy: {
					tierLevel: "asc",
				},
			});
	
			for (const tier of tiers) {
				if (downline.length >= tier.requiredDownline) {
					newTier = tier;
				} else {
					break;
				}
			}
		}
		
		await db.member.update({
			where: {
				id: memberId,
				isMarketing: true,
			},
			data: {
				isMarketing: false,
				tierId: newTier.id,
			},
		});
		revalidatePath("/cms");
		return { message: "Removed from marketing member successfully" };
	} catch (error) {
		return renderError(error);
	}
};

export const fetchMemberById = async (id: string) => {
	try {
		const member = await db.member.findUnique({
			where: {
				id: id,
			},
			include: {
				profile: true,
				tier: true,
			},
		});
		return member;
	} catch (error) {
		console.error("Error fetching member:", error);
		return null;
	}
};

export const fetchProfileById = async (id: string) => {
	const profile = await db.profile.findUnique({
		where: { id },
	});
	return profile;
};

export const fetchLoyaltyPointDetails = async (member: member) => {
	try {
		const pointDistributionHistory = await db.pointDistributionHistory.findMany({
			where: {
				memberId: member.memberId,
			},
			select: {
				id: true,
				point: true,
				member: {
					select: {
						profile: {
							select: {
								firstName: true,
								lastName: true,
							},
						},
					},
				},
				createdAt: true,
			},
		});

		const pointTransaction = await db.pointTransaction.findMany({
			where: {
				memberId: member.memberId,
			},
			select: {
				id: true,
				reward: {
					select: {
						rewardName: true,
						pointReq: true,
					},
				},
				member: {
					select: {
						profile: {
							select: {
								firstName: true,
								lastName: true,
							},
						},
					},
				},
				createdAt: true,
			},
		});

		const loyaltyPointDetails: loyaltyPointDetails[] = [
			...pointDistributionHistory.map(
				(transaction: { id: any; member: any; createdAt: any; point: any }) => ({
					id: transaction.id,
					profile: transaction.member.profile,
					createdAt: transaction.createdAt,
					point: transaction.point,
					type: "Membership Referral" as const,
				})
			),
			...pointTransaction.map(
				(transaction: {
					id: any;
					member: any;
					createdAt: any;
					reward: { pointReq: any; rewardName: any };
				}) => ({
					id: transaction.id,
					profile: transaction.member,
					createdAt: transaction.createdAt,
					point: transaction.reward.pointReq,
					type: `Redeem Reward: ${transaction.reward.rewardName}` as const,
				})
			),
		];

		return loyaltyPointDetails;
	} catch (error) {
		console.error("Error fetching rewards:", error);
		return { message: "Error fetching rewards" };
	}
};

export const createWithdrawalRequest = async (
	prevState: any,
	formData: FormData
) => {
	try {
		const profile = await fetchProfile();
		if (profile === null) throw new Error("Profile not found");

		const member = await fetchMember(profile.clerkId);
		if (member === null) throw new Error("Member not found");

		const amountWithdrawn = parseFloat(
			formData.get("amountWithdrawn") as string
		);
		const bankName = formData.get("bankName") as string;
		const accountName = formData.get("bankAccName") as string;
		const accountNumber = formData.get("bankAccNum") as string;
		const notes = formData.get("notes") as string;

		if (amountWithdrawn > member.commission)
			return {
				message: "Amount withdrawn is greater than the commission",
				status: "error",
			};
		if (amountWithdrawn < 1)
			return {
				message: "Amount withdrawn must be greater than 0",
				status: "error",
			};

		await db.withdrawCommissionRequest.create({
			data: {
				memberId: member.memberId,
				amount: amountWithdrawn,
				bankName: bankName,
				bankAccNumber: accountNumber,
				bankAccName: accountName,
				notes: notes,
				status: "Pending",
			},
		});

		return {
			message: "Withdrawal request created successfully",
			status: "success",
		};
	} catch (error) {
		return {
			message: "failed to create withdrawal request. " + error,
			status: "error",
		};
	}
};

export const fetchWithdrawalRequest = async (memberId: string) => {
	const member = await fetchMember(undefined, memberId);
	if (member === null) throw new Error("Member not found");

	const withdrawalRequest = await db.withdrawCommissionRequest.findMany({
		where: {
			memberId: member.memberId,
		},
		select: {
			id: true,
			memberId: true,
			member: {
				select: {
					profile: {
						select: {
							firstName: true,
							lastName: true,
						},
					},
				},
			},
			amount: true,
			bankName: true,
			bankAccNumber: true,
			bankAccName: true,
			status: true,
			createdAt: true,
		},
	});

	return withdrawalRequest;
};

export const createMemberAdminAction = async (
	prevState: any,
	data: {
		name: string;
		email: string;
		phone: string;
		address: string;
	}
): Promise<{ message: string }> => {
	try {
		await getAdminUser(); // Ensure only admin can create members

		// Split the full name into first and last name
		const [firstName, ...lastNameParts] = data.name.trim().split(" ");
		const lastName = lastNameParts.join(" ");

		// Create the profile first
		const profile = await db.profile.create({
			data: {
				firstName,
				lastName,
				email: data.email,
				clerkId: "aa", // Add required clerkId field
				username: `${firstName.toLowerCase()}-${Date.now()}`, // Generate a unique username
				profileImage: "/default-avatar.png", // Set a default profile image
			},
		});

		// Generate a unique member ID
		const memberId = await generateUniqueMemberId();

		// Get the initial tier (assuming tier level 1)
		const initialTier = await fetchTierByLevel(1);
		if (!initialTier) {
			throw new Error("Initial tier not found");
		}

		// Create the member record
		await db.member.create({
			data: {
				memberId: memberId,
				profileId: profile.id,
				tierId: initialTier.id,
				phone: data.phone,
				address: data.address,
				isActive: 1, // Set as active since it's created by admin
				point: 0,
				commission: 0,
			},
		});

		revalidatePath("/admin/memberOverview");
		return { message: "Member created successfully" };
	} catch (error) {
		return renderError(error);
	}
};

export const fetchAdminWithdrawalRequests = async () => {
	try {
		const withdrawalRequests = await db.withdrawCommissionRequest.findMany({
			select: {
				id: true,
				memberId: true,
				amount: true,
				status: true,
				bankName: true,
				bankAccNumber: true,
				bankAccName: true,
				createdAt: true,
				member: {
					select: {
						profile: {
							select: {
								firstName: true,
								lastName: true,
								clerkId: true,
							},
						},
						phone: true,
					}
				}
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return withdrawalRequests;
	} catch (error) {
		console.error("Error fetching withdrawal requests:", error);
		throw new Error("Failed to fetch withdrawal requests");
	}
};

export const updateWithdrawalStatus = async (
	id: string,
	amount: number,
	status: "Approved" | "Rejected"
) => {
	try {
		await getAdminUser(); // Ensure only admin can update status

		await db.$transaction(async (tx) => {
			// Update withdrawal request and member commission in a single transaction
			const withdrawalRequest = await tx.withdrawCommissionRequest.update({
				where: { id },
				data: {
					status,
					...(status === "Approved" && {
						member: {
							update: {
								commission: {
									decrement: amount
								}
							}
						}
					})
				},
				include: {
					member: true
				}
			});

			if (!withdrawalRequest.member) {
				throw new Error("Member not found");
			}
		});

		revalidatePath("/admin/referralNcommision");
		return {
			message: `Withdrawal request ${status.toLowerCase()} successfully`,
			status: "success",
		};
	} catch (error) {
		console.error("Error updating withdrawal status:", error);
		return {
			message: `Failed to update withdrawal status: ${error}`,
			status: "error",
		};
	}
};

export const fetchCommissionHistory = async () => {
	try {
		await getAdminUser(); // Ensure only admin can access

		// Fetch booking commissions
		const transactions = await db.commissionDistribution.findMany({
			select: {
				id: true,
				commission: true,
				createdAt: true,
				memberId: true,
				member: {
					select: {
						profile: {
							select: {
								firstName: true,
								lastName: true,
							},
						},
						tier: {
							select: {
								commission: true,
							},
						},
					},
				},
				type: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		const commissionData = transactions.map((transaction) => ({
			id: transaction.id,
			name: `${transaction.member?.profile.firstName} ${transaction.member?.profile.lastName}`,
			memberId: transaction.memberId || "N/A",
			commission: transaction.commission,
			type: transaction.type,
			dateTime: transaction.createdAt
		}));

		return commissionData;
	} catch (error) {
		console.error("Error fetching commission data:", error);
		throw new Error("Failed to fetch commission data");
	}
};

export const fetchCommissionStats = async (startDate?: Date | null, endDate?: Date | null) => {
	try {
		const dateFilter = startDate && endDate ? {
			createdAt: {
				gte: startDate,
				lte: endDate
			}
		} : {};

		// Get total commission amount
		const totalCommission = await db.member.aggregate({
			_sum: {
				commission: true
			}
		});

		// Get total withdrawal requests count with date filter
		const withdrawalRequestsCount = await db.withdrawCommissionRequest.count({
			where: dateFilter
		});

		// Get successful referral transactions with date filter
		const commissions = await db.commissionDistribution.count({
			where: {
				...dateFilter,
			}
		});

		// Calculate total payable commission
		const membersWithCommission = await db.member.aggregate({
			_sum: {
				commission: true
			},
			where: {
				commission: {
					gt: 0
				}
			}
		});

		return {
			overallCommission: totalCommission._sum.commission || 0,
			payableCommission: membersWithCommission._sum.commission || 0,
			withdrawalRequests: withdrawalRequestsCount,
			successfulTransactions: commissions
		};
	} catch (error) {
		console.error('Error fetching commission stats:', error);
		throw new Error('Failed to fetch commission stats');
	}
};

export const fetchDashboardStats = async (startDate?: Date | null, endDate?: Date | null) => {
	try {
		const dateFilter = startDate && endDate ? {
			createdAt: {
				gte: startDate,
				lte: endDate
			}
		} : {};

		// Get total commission amount
		const totalCommission = await db.member.aggregate({
			_sum: {
				commission: true
			}
		});

		// Get total loyalty points
		const totalLoyaltyPoints = await db.member.aggregate({
			_sum: {
				point: true
			}
		});


		return {
			referralCommission: totalCommission._sum.commission || 0,
			loyaltyPoints: totalLoyaltyPoints._sum.point || 0
		};
	} catch (error) {
		console.error('Error fetching commission stats:', error);
		throw new Error('Failed to fetch commission stats');
	}
};

export const fetchPointDistributionHistory = async () => {
	try {
		const transactions = await db.pointDistributionHistory.findMany({
			select: {
				id: true,
				createdAt: true,
				memberId: true,
				member: {
					select: {
						profile: {
							select: {
								firstName: true,
								lastName: true,
							}
						}
					}
				},
				type: true,
				point: true,
			},
			orderBy: {
				createdAt: 'desc'
			}
		});

		return transactions.map(transaction => ({
			id: transaction.id,
			name: `${transaction.member?.profile.firstName} ${transaction.member?.profile.lastName}`,
			memberId: transaction.memberId || 'N/A',
			type: transaction.type,
			point: transaction.point,
			dateTime: transaction.createdAt
		}));
	} catch (error) {
		console.error('Error fetching point distribution history:', error);
		return [];
	}
};

type DatePeriod = 'today' | 'week' | 'month' | '';

export async function fetchTotalDistributedPoints(period: DatePeriod = '') {
	try {
		let dateFilter = {};

		if (period === 'today') {
			dateFilter = {
				createdAt: {
					gte: new Date(new Date().setHours(0, 0, 0, 0))
				}
			};
		} else if (period === 'week') {
			const lastWeek = new Date();
			lastWeek.setDate(lastWeek.getDate() - 7);
			dateFilter = {
				createdAt: {
					gte: lastWeek
				}
			};
		} else if (period === 'month') {
			const lastMonth = new Date();
			lastMonth.setMonth(lastMonth.getMonth() - 1);
			dateFilter = {
				createdAt: {
					gte: lastMonth
				}
			};
		}

		const totalPoints = await db.pointDistributionHistory.aggregate({
			_sum: {
				point: true
			},
			where: {
				...dateFilter
			}
		});

		return totalPoints._sum.point || 0;
	} catch (error) {
		console.error('Error fetching total distributed points:', error);
		return 0;
	}
}

export async function fetchRedemptionHistory(period: DatePeriod = '') {
	try {
		let dateFilter = {};

		if (period === 'today') {
			dateFilter = {
				createdAt: {
					gte: new Date(new Date().setHours(0, 0, 0, 0))
				}
			};
		} else if (period === 'week') {
			const lastWeek = new Date();
			lastWeek.setDate(lastWeek.getDate() - 7);
			dateFilter = {
				createdAt: {
					gte: lastWeek
				}
			};
		} else if (period === 'month') {
			const lastMonth = new Date();
			lastMonth.setMonth(lastMonth.getMonth() - 1);
			dateFilter = {
				createdAt: {
					gte: lastMonth
				}
			};
		}

		const redemptionHistory = await db.pointTransaction.findMany({
			where: {
				...dateFilter
			},
			include: {
				member: {
					select: {
						profile: {
							select: {
								firstName: true,
								lastName: true,
							}
						},
						memberId: true
					}
				},
				reward: {
					select: {
						rewardName: true,
						pointReq: true
					}
				}
			}
		});

		return redemptionHistory;
	} catch (error) {
		console.error('Error fetching redemption requests:', error);
		return [];
	}
}

export const approveMemberRequestAction = async (memberId: string) => {
	try {
		await getAdminUser(); // Ensure only admin can approve

		// Get the member first
		const member = await fetchMember(undefined, memberId);
		if (member === null) {
			throw new Error("Member not found");
		}

		// Update the member status to active
		await db.member.update({
			where: {
				memberId: memberId
			},
			data: {
				isActive: 1
			}
		});

		// Update the payment status of the membership transaction
		await db.membershipCommissionTransaction.updateMany({
			where: {
				memberId: memberId,
				paymentStatus: false // Only update pending transactions
			},
			data: {
				paymentStatus: true
			}
		});

		return { message: "Member request approved successfully", status: "success" };
	} catch (error) {
		return { message: "Failed to approve member request," + error, status: "error" };
	}
};

export const rejectMemberRequestAction = async (memberId: string) => {
	try {
		await getAdminUser(); // Ensure only admin can reject

		// Get the member first
		const member = await fetchMember(undefined, memberId);
		if (!member) {
			throw new Error("Member not found");
		}

		// Update the member status to inactive
		await db.member.update({
			where: {
				memberId: memberId
			},
			data: {
				isActive: 0
			}
		});

		// Update the payment status of the membership transaction
		await db.membershipCommissionTransaction.updateMany({
			where: {
				memberId: memberId,
				paymentStatus: false // Only update pending transactions
			},
			data: {
				paymentStatus: false
			}
		});

		revalidatePath('/admin/memberOverview');
		return { message: "Member request rejected successfully" };
	} catch (error) {
		console.error("Error rejecting member:", error);
		return renderError(error);
	}
};

export const fetchMemberData = async (memberId: string) => {
	const member = await db.member.findFirst({
		where: {
			memberId: memberId
		},
		select: {
			id: true,
			memberId: true,
			profile: true,
			tier: true,
			membershipCommissionTransactions: true,
			dob: true,
			citizen: true,
			phone: true,
			address: true,
			gender: true,
			bankName: true,
			bankAccNum: true,
			bankAccName: true,
			isActive: true,
		}
	});
	if (member === null) {
		throw new Error('Member not found');
	}
	return member;
};

export const fetchCitizenshipOptions = async () => {
	const response = await fetch("https://countriesnow.space/api/v0.1/countries");
	const data = await response.json();
	return data.data.map((item: { country: string, iso2: string }) => ({
		value: item.iso2, // Using iso2 code (e.g., "AF", "AL")
		label: item.country, // Using country name (e.g., "Afghanistan", "Albania")
	}));
};

export const fetchAdminMemberDownline = async (memberId: string) => {
	try {
		const member = await db.member.findFirst({
			where: {
				OR: [
					{ memberId: memberId },
					{
						profile: {
							OR: [
								{ firstName: { contains: memberId, mode: 'insensitive' } },
								{ lastName: { contains: memberId, mode: 'insensitive' } }
							]
						}
					}
				],
			},
			include: {
				profile: true
			}
		});

		return member;
	} catch (error) {
		console.error('Error fetching member:', error);
		return null;
	}
};

export { getAdminUser };

// Create Reward Action
export const createRewardAction = async (prevState: any, formData: FormData) => {
	await getAdminUser(); // Ensure only admin can create rewards

	try {
		const rewardName = formData.get('name') as string;
		const pointReq = parseInt(formData.get('points') as string);

		await db.reward.create({
			data: {
				rewardName,
				pointReq,
			},
		});

		revalidatePath('/admin/memberLoyaltyOverview');
		return { message: 'Reward created successfully' };
	} catch (error) {
		return renderError(error);
	}
};

// Delete Reward Action
export const deleteRewardAction = async (id: string) => {
	await getAdminUser(); // Ensure only admin can delete rewards

	try {
		await db.reward.delete({
			where: { id },
		});

		revalidatePath('/admin/memberLoyaltyOverview');
		return { message: 'Reward deleted successfully' };
	} catch (error) {
		return renderError(error);
	}
};

// Update Reward Action
export const updateRewardAction = async (prevState: any, formData: FormData) => {
	await getAdminUser(); // Ensure only admin can update rewards

	try {
		const id = formData.get('id') as string;
		const rewardName = formData.get('name') as string;
		const pointReq = parseInt(formData.get('points') as string);

		await db.reward.update({
			where: { id },
			data: {
				rewardName,
				pointReq,
			},
		});

		revalidatePath('/admin/memberLoyaltyOverview');
		return { message: 'Reward updated successfully' };
	} catch (error) {
		return renderError(error);
	}
};

export const fetchGeneralVariables = async () => {
	await getAdminUser(); // Ensure only admin can access

	try {
		const variables = await db.generalVariable.findMany({
			orderBy: {
				createdAt: 'desc'
			}
		});
		return variables;
	} catch (error) {
		console.error('Error fetching general variables:', error);
		throw new Error('Failed to fetch general variables');
	}
};

export const updateGeneralVariableAction = async (
	prevState: any,
	formData: FormData
): Promise<{ message: string; status: string }> => {
	await getAdminUser();

	try {
		const id = formData.get('id') as string;
		const value = formData.get('value') as string;

		await db.generalVariable.update({
			where: { id },
			data: {
				variableValue: value
			}
		});

		revalidatePath('/admin/generalVariable');
		return { message: 'Variable updated successfully', status: 'success' };
	} catch (error) {
		return { message: 'Failed to update variable', status: 'error' };
	}
};

export const createGeneralVariableAction = async (
	prevState: any,
	formData: FormData
): Promise<{ message: string; status: string }> => {
	await getAdminUser();

	try {
		const name = formData.get('name') as string;
		const value = formData.get('value') as string;
		const type = formData.get('type') as string;

		await db.generalVariable.create({
			data: {
				variableName: name,
				variableValue: value,
				variableType: type
			}
		});

		revalidatePath('/admin/generalVariable');
		return { message: 'Variable created successfully', status: 'success' };
	} catch (error) {
		return { message: 'Failed to create variable', status: 'error' };
	}
};

export const deleteGeneralVariableAction = async (id: string): Promise<{ message: string; status: string }> => {
	await getAdminUser();

	try {
		await db.generalVariable.delete({
			where: { id }
		});

		revalidatePath('/admin/generalVariable');
		return { message: 'Variable deleted successfully', status: 'success' };
	} catch (error) {
		return { message: 'Failed to delete variable', status: 'error' };
	}
};

export const uploadPaymentProofAction = async (formData: FormData) => {
    const user = await getAuthUser();
    const bookingId = formData.get("bookingId") as string;
    const file = formData.get("image") as File;

    if (!bookingId || !file) {
        return { error: "Missing booking ID or image file." };
    }

    try {
        // Validate file using Zod schema
        const validatedFile = validateWithZodSchema(imageSchema, { image: file });

        // Upload image and get full path URL
        const fullPath = await uploadImage(validatedFile.image);

        // Update Booking record with payment proof
        await db.booking.update({
            where: { id: bookingId },
            data: { paymentProof: fullPath, paymentStatus: "PENDING" },
        });

        return redirect("/bookings"); // Redirect after successful upload
    } catch (error) {
        console.error("Upload error:", error);
        return { error: "Failed to upload proof of payment." };
    }
};

export async function fetchBookingById(id: string) {
	try {
	  const booking = await prisma.booking.findUnique({
		where: { id },
		include: {
		  profile: true, // Include profile data
		  property: true, // Include property data
		},
	  });
  
	  if (!booking) {
		throw new Error("Booking not found");
	  }
  
	  const { id: propertyId, name, city } = booking.property;
	  const { username, firstName, lastName, email, profileImage } = booking.profile;
	  const startDate = formatDate(new Date(booking.checkIn)); // Format check-in date
	  const endDate = formatDate(new Date(booking.checkOut)); // Format check-out date
  
	  return {
		id: booking.id,
		user: {
		  username: username,
		  name: `${firstName} ${lastName}`,
		  email: email,
		  profileImage: profileImage || "/default-avatar.jpg", // Default avatar if no profile image
		},
		property: {
		  id: propertyId,
		  name: name,
		  city: city,
		},
		status: booking.paymentStatus,
		checkIn: startDate, // Return formatted check-in date
		checkOut: endDate, // Return formatted check-out date
		orderTotal: booking.orderTotal,
		images: booking.paymentProof ? [booking.paymentProof] : [],
	  };
	} catch (error) {
	  console.error("Error fetching booking:", error);
	  return null;
	}
  }

  export async function updateBookingStatus(bookingId: string, newStatus: "PENDING" | "COMPLETED"): Promise<any> {
	try {
	  const updatedBooking = await prisma.booking.update({
		where: {
		  id: bookingId, // Find the booking by its ID
		},
		data: {
		  paymentStatus: newStatus, // Set the new payment status
		},
	  });
  
	  return updatedBooking; // Return the updated booking
	} catch (error) {
	  console.error("Error updating booking status:", error);
	  throw error; // Throw the error to be handled by the caller
	}
  }
  
	  
