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
		const file = formData.get("image") as File;

		const validatedFields = validateWithZodSchema(propertySchema, rawData);
		const validatedFile = validateWithZodSchema(imageSchema, { image: file });
		const fullPath = await uploadImage(validatedFile.image);

		await db.property.create({
			data: {
				...validatedFields,
				image: fullPath,
				profileId: user.id,
			},
		});
	} catch (error) {
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
        { name: { contains: search, mode: 'insensitive' } },
        { tagline: { contains: search, mode: 'insensitive' } },
      ],
      ...(category ? { category } : {}),
    },
    select: {
      id: true,
      name: true,
      tagline: true,
      city: true,
      image: true,
      price: true,
      createdAt: true,
      reviews: {
        select: {
          rating: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return properties.map((property) => {
    const ratings = property.reviews.map((review) => review.rating);
    const averageRating = ratings.length
      ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)
      : null; // Default to null if no reviews

    return {
      ...property,
      rating: averageRating ? parseFloat(averageRating) : null, // Ensure rating is null if no reviews
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
	const { propertyId, favoriteId, pathname } = prevState;
	try {
		if (favoriteId) {
			await db.favorite.delete({
				where: {
					id: favoriteId,
				},
			});
		} else {
			await db.favorite.create({
				data: {
					propertyId,
					profileId: user.id,
				},
			});
		}
		revalidatePath(pathname);
		return {
			message: favoriteId
				? "Removed from your Favorite"
				: "Added to your Favorite",
		};
	} catch (error) {
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
        ? (property.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
        : '0'; // Rounding to 1 decimal place

    return {
      ...property,
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
	let transactionId = null;

	try {
		const profile = await fetchProfile();

		if (profile === null) {
			return renderError("Profile not found");
		}

		await db.booking.deleteMany({
			where: {
				profileId: profile?.clerkId,
				paymentStatus: false,
			},
		});

		const { propertyId, checkIn, checkOut, referalCode } = prevState;
		const property = await db.property.findUnique({
			where: { id: propertyId },
			select: { price: true },
		});

		if (!property) {
			return { message: "Property not found" };
		}
		if (referalCode.length > 0 && !(await validateReferalCode(referalCode, "booking"))) {
			return { message: "Referal code not valid" };
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
			},
		});
		bookingId = booking.id;

		//hitung commission
		let commission = 0;
		if (referalCode.length > 0) {
			commission = orderTotal * 0.1;

			//buat bookingCommissionTransaction dengan referal
			const bookingTrans = await db.bookingCommissionTransaction.create({
				data: {
					profileId: profile?.clerkId,
					bookingId: booking.id,
					commission: commission,
					referalCode: referalCode,
				},
			});
			transactionId = bookingTrans.id;
		} else {
			//buat bookingCommissionTransaction tanpa referal
			const bookingTrans = await db.bookingCommissionTransaction.create({
				data: {
					profileId: profile?.clerkId,
					bookingId: booking.id,
				},
			});
			transactionId = bookingTrans.id;
		}
	} catch (error) {
		return renderError(error);
	}
	redirect(`/checkout?bookingId=${bookingId}&trId=${transactionId}`);
};

export const fetchBookings = async () => {
	const profile = await fetchProfile();
	const bookings = await db.booking.findMany({
		where: {
			profileId: profile?.clerkId,
			paymentStatus: true,
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
	const rentals = await db.property.findMany({
		where: {
			profileId: user.id,
		},
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
					paymentStatus: true,
				},
				_sum: {
					totalNights: true,
				},
			});

			const orderTotalSum = await db.booking.aggregate({
				where: {
					propertyId: rental.id,
					paymentStatus: true,
				},
				_sum: {
					orderTotal: true,
				},
			});

			return {
				...rental,
				totalNightsSum: totalNightsSum._sum.totalNights,
				orderTotalSum: orderTotalSum._sum.orderTotal,
			};
		})
	);

	return rentalsWithBookingSums;
};

export async function deleteRentalAction(prevState: { propertyId: string }) {
	const { propertyId } = prevState;
	const user = await getAuthUser();

	try {
		await db.property.delete({
			where: {
				id: propertyId,
				profileId: user.id,
			},
		});

		revalidatePath("/rentals");
		return { message: "Rental deleted successfully" };
	} catch (error) {
		return renderError(error);
	}
}

export const fetchRentalDetails = async (propertyId: string) => {
	const user = await getAuthUser();

	return db.property.findUnique({
		where: {
			id: propertyId,
			profileId: user.id,
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
		await db.property.update({
			where: {
				id: propertyId,
				profileId: user.id,
			},
			data: {
				...validatedFields,
			},
		});

		revalidatePath(`/rentals/${propertyId}/edit`);
		return { message: "Update Successful" };
	} catch (error) {
		return renderError(error);
	}
};

export const updatePropertyImageAction = async (
	prevState: any,
	formData: FormData
): Promise<{ message: string }> => {
	const user = await getAuthUser();
	const propertyId = formData.get("id") as string;

	try {
		const image = formData.get("image") as File;
		const validatedFields = validateWithZodSchema(imageSchema, { image });
		const fullPath = await uploadImage(validatedFields.image);

		await db.property.update({
			where: {
				id: propertyId,
				profileId: user.id,
			},
			data: {
				image: fullPath,
			},
		});
		revalidatePath(`/rentals/${propertyId}/edit`);
		return { message: "Property Image Updated Successful" };
	} catch (error) {
		return renderError(error);
	}
};

export const fetchReservations = async () => {
	const user = await getAuthUser();

	const reservations = await db.booking.findMany({
		where: {
			paymentStatus: true,
			property: {
				profileId: user.id,
			},
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
				},
			},
		},
	});
	return reservations;
};

export const fetchStats = async () => {
	await getAdminUser();

	const usersCount = await db.profile.count();
	const propertiesCount = await db.property.count();
	const bookingsCount = await db.booking.count({
		where: {
			paymentStatus: true,
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
			paymentStatus: true,
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
	const properties = await db.property.count({
		where: {
			profileId: user.id,
		},
	});

	const totals = await db.booking.aggregate({
		_sum: {
			orderTotal: true,
			totalNights: true,
		},
		where: {
			property: {
				profileId: user.id,
			},
		},
	});

	return {
		properties,
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
		const title = formData.get("title") as String;
		const subtitle = formData.get("subtitle") as String;
		const category = formData.get("category") as string;
		const description = formData.get("description") as String;
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
): Promise<{ message: string, status: string }> => {
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
	const proofOfPayment = formData.get("paymentProof") as File;

	let closerCode = formData.get("closerCode") as string;
	
	let closerValid = false;
	let referalValid = false;

	const memberId = await generateUniqueMemberId();

	let transactionId = null;

	try {
		const profile = await fetchProfile();

		if (!profile) {
			return { message: "Profile not found", status: "error" };
		}

		await deleteIncompleteMember(profile?.clerkId);

		// cek if member already exist
		if (await fetchMember(profile?.clerkId)) {
			return { message: "Member already exist", status: "error" };
		}

		// cek referalCode
		if (referalCode.length > 0 ) {
			referalValid = await validateReferalCode(referalCode, "member");
			if(!referalValid){
				return { message: "Invalid referral code", status: "error" };
			}
		}

		if(closerCode.length > 0){
			closerValid = await validateReferalCode(closerCode, "member");
			if(!closerValid){
				return { message: "Invalid closer code", status: "error" };
			}
		}

		// cek closerCode
		if(referalCode.length > 0 && referalValid && (closerCode.length === 0 || closerCode === null || closerCode === undefined || closerCode === "")){
		  closerCode = referalCode;
		}

		const tier = await fetchTierByLevel(1);
		if(tier === null) return { message: "Tier not found", status: "error" };

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
				referalCode,
				closerCode,
				profile?.clerkId,
				parseInt(totalPrice),
				paymentMethod,
				proofOfPayment.name
			);
		transactionId = membershipCommissionTransactionId.toString();

	} catch (error) {
		return { message: "Failed to create member, " + error, status: "error" };
	}

	if(paymentMethod === "CC"){
		redirect(`/member/checkout?mId=${memberId}&trId=${transactionId}`);
	} else {
		revalidatePath('/');
		redirect('/');
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
): Promise<{ message: string, status: string }> => {
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
		if (member === null) return { message: "Member not found", status: "error" };

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
		return { message: "Member profile updated successfully", status: "success" };
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
			},
		});
		if (member != null) {
			//penjagaan penggunaan referal code sendiri
			// if (member.profileId == profile?.clerkId) {
			// 	return false;
			// }
			if(member.isActive === 0) {
				return false;
			}

			if(from === "booking" && member.isMarketing === true) {
				return false;
			}
		}

		//jika referal kosong atau tidak ditemukan
		if (member === null || referalCode == "") return false;

		return true;
	} catch (error) {
		return false;
	}
};

export const updateMemberCommission = async (
	memberId: string,
	commission: any,
	type: string
) => {
	try {
		const member = await fetchMember(undefined, memberId);

		if (member === null) throw new Error("Member Not Found!");

		if (type === "booking") {
			await db.member.update({
				where: {
					id: member.id,
				},
				data: {
					commission: member.commission + commission,
				},
			});
		} else {
			await db.member.update({
				where: {
					id: member.id,
				},
				data: {
					commission: member.commission + commission,
					point: member.point + 1,
				},
			});
		}
	} catch (error) {
		return renderError(error);
	}
};

export const updateCloserCommission = async (
	memberId: string,
	commission: any
) => {
	try {
		const member = await fetchMember(undefined, memberId);

		if (member === null) throw new Error("Member Not Found!");

		await db.member.update({
			where: {
				id: member.id,
			},
			data: {
				commission: member.commission + commission,
			},
		});

	} catch (error) {
		return renderError(error);
	}
};

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

export const fetchDownline = async (memberId: string) => {
	return await db.member.findMany({
		where: {
			parentId: memberId,
		},
	});
};

export const fetchDownlines = async (memberId: string, depth: number) => {
	return await db.member.findUnique({
		where: { id: memberId },
		select: createDownlineSelect(depth) // Get 5 levels of downlines
	  });
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
			profile: { select: profileSelect }
		};
	  }
  
	  return {
		id: true,
		memberId: true,
		profile: { select: profileSelect },
		downlines: {
		  select: buildSelect(currentDepth - 1)
		}
	  };
	};
  
	return {
	  id: true,
	  profile: { select: profileSelect },
	  memberId: true,
	  isActive: true,
	  downlines: {
		select: buildSelect(depth - 1)
	  }
	};
  };

export const fetchBookingCommissionTransaction = async (
	referalCode: string
) => {
	try {
		return await db.bookingCommissionTransaction.findMany({
			where: {
				referalCode: referalCode,
			},
			select: {
				id: true,
				profileId: true,
				bookingId: true,
				referalCode: true,
				commission: true,
				createdAt: true,
				booking: {
					select: {
						paymentStatus: true,
					},
				},
				profile: {
					select: {
						firstName: true,
						lastName: true,
					},
				},
			},
		});
	} catch (error) {
		console.error("Error fetching booking commission transaction:", error);
		return { message: "Error fetching booking commission transaction" };
	}
};

// First, create a fetch function in your actions.ts
export const fetchRewards = async () => {
	try {
		const rewards = await db.reward.findMany({});
		return rewards;
	} catch (error) {
		console.error("Error fetching rewards:", error);
		return { message: "Error fetching rewards" };
	}
};

export const createMembershipCommissionTransaction = async (
	referalCode: string,
	closerCode: string,
	clerkId: string,
	totalPrice: number,
	paymentMethod: string,
	proofOfPayment: string
) => {
	try {
		let membershipCommissionTransaction = null;

		let closerPercentage = await getGeneralVariable("closerPercentage");
		if(closerPercentage === null) throw new Error("Closer percentage not found");

		if(referalCode.length > 0){
			const refCommission = await calculateCommission(referalCode, totalPrice);
			membershipCommissionTransaction =
			await db.membershipCommissionTransaction.create({
				data: {
					profileId: clerkId,
					commission: refCommission,
					closerId: closerCode,
					closerCommission: totalPrice * (Number(closerPercentage.variableValue) / 100),
					referalCode: referalCode,
					paymentStatus: false,
					paymentMethod: paymentMethod,
					proofOfPayment: proofOfPayment,
				},
			});

		} else {
			membershipCommissionTransaction =
			await db.membershipCommissionTransaction.create({
				data: {
					profileId: clerkId,
					paymentStatus: false,
					paymentMethod: paymentMethod,
					proofOfPayment: proofOfPayment,
				},
			});
		}
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
	
	if(referal.isMarketing === true) {
		tier = await fetchTierByName("Marketing");
	} else {
		tier = await fetchTierById(referal.tierId);
	}

	if(tier === null) throw new Error("Tier not found");

	refCommission = totalPrice * (tier.commission / 100);

	if (tier === null) throw new Error("Tier not found");

	return refCommission;
}

export async function redeemReward(reward: reward): Promise<void> {
	try {
		const profile = await fetchProfile();
		if (profile === null) throw new Error("Profile not found");

    const member = await fetchMember(profile.clerkId);
    if(member === null) throw new Error("Member not found");

		if (member.point >= reward.pointReq) {
			//create pointTransaction
			await db.pointTransaction.create({
				data: {
					profileId: profile.clerkId,
					rewardId: reward.id,
				},
			});

      //deduct the member's point
      const newMember = await db.member.update({
        where: {
          id: member.id,
        },
        data: {
          point: member.point - reward.pointReq,
        }
      })
    }
  } catch (error) {
    throw new Error("failed to redeem reward. " + error);
  }
}

// Insert Dummy Data
export const insertGeneralVariable = async (
	variableName: string,
	variableValue: string,
	variableType: string
) => {
	try {
		await db.generalVariable.create({
			data: {
				variableName: "exclusiveMemberPrice",
				variableValue: "15000000",
				variableType: "number",
			},
		});
	} catch (error) {
		throw new Error("failed to insert general variable. " + error);
	}
};

export const getGeneralVariable = async (variableName: string) => {
	const variable = await db.generalVariable.findFirst({
		where: {
			variableName: variableName,
		},
	});
	return variable;
};

export const deleteIncompleteMember = async (clerkId: string) => {
	await db.member.deleteMany({
		where: {
			profileId: clerkId,
			isActive: 0,
		},
	});

	await db.membershipCommissionTransaction.deleteMany({
		where: {
			profileId: clerkId,
		},
	});
};

export const updateMemberTier = async (memberId: string) => {
	const member = await fetchMember(undefined, memberId);
	if (member === null) throw new Error("Member not found");

	if(member.isMarketing === false) {
		const tier = await fetchTierById(member.tierId);
		if (tier === null) throw new Error("Tier not found");
	
		const downline = await fetchDownline(memberId);
		if (downline.length >= tier.requiredDownline) {
			const nextTier = await fetchTierByLevel(tier.tierLevel + 1);
			if (nextTier === null) throw new Error("Next tier not found");
	
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

export const fetchReferralDetails = async (member: member) => {
	try {
		const membershipCommissionTransaction =
			await db.membershipCommissionTransaction.findMany({
				where: {
					referalCode: member.memberId,
				},
				select: {
					id: true,
					profile: {
						select: {
							firstName: true,
							lastName: true,
						},
					},
					commission: true,
					createdAt: true,
					paymentStatus: true,
				},
			});

		const bookingCommissionTransaction =
			await db.bookingCommissionTransaction.findMany({
				where: {
					referalCode: member.memberId,
				},
				select: {
					id: true,
					profile: {
						select: {
							firstName: true,
							lastName: true,
						},
					},
					commission: true,
					createdAt: true,
					booking: {
						select: {
							paymentStatus: true,
						},
					},
				},
			});

    const referralDetails: referralDetails[] = [
      ...membershipCommissionTransaction.map((transaction: { id: any; profile: any; commission: any; createdAt: any; paymentStatus: any; }) => ({
      id: transaction.id,
      profile: transaction.profile,
      commission: transaction.commission,
      createdAt: transaction.createdAt,
      paymentStatus: transaction.paymentStatus,
      type: 'Membership' as const
    })),
    ...bookingCommissionTransaction.map((transaction: { id: any; profile: any; commission: any; createdAt: any; booking: { paymentStatus: any; }; }) => ({
      id: transaction.id,
      profile: transaction.profile,
      commission: transaction.commission,
      createdAt: transaction.createdAt,
      paymentStatus: transaction.booking.paymentStatus,
      type: 'Booking' as const
    }))];

		return referralDetails;
	} catch (error) {
		console.error("Error fetching rewards:", error);
		return { message: "Error fetching rewards" };
	}
};

export const fetchMemberAll = async () => {
	try {
		const members = await db.member.findMany({
			include: {
				profile: true,
				tier: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});
		return members;
	} catch (error) {
		console.error("Error fetching members:", error);
		throw new Error("Failed to fetch members");
	}
};

export const fetchMemberRequests = async () => {
	try {
		const memberRequest = await db.membershipCommissionTransaction.findMany({
			where: {
			  paymentStatus: false,
			  paymentMethod: 'TRF'
			},
			select: {
			  id: true,
			  referalCode: true,
			  closerId: true,
			  paymentMethod: true,
			  paymentStatus: true,
			  profile: {
				select: {
				  firstName: true,
				  lastName: true,
				  clerkId: true,
				}
			  }
			}
		});
		  
		const profileIds = memberRequest.map(request => request.profile.clerkId);
		  
		const members = await db.member.findMany({
			where: {
			profileId: {
				in: profileIds
			}
			}, 
			select: {
				profileId: true,
				memberId: true,
				createdAt: true,
			}
		});
		  
		const combinedData = memberRequest.map(request => ({
			...request,
			member: members.find(member => member.profileId === request.profile.clerkId)
		}));
		return combinedData;
	} catch (error) {
		console.error("Error fetching member request :", error);
		throw new Error("Failed to fetch member request");
	}
}

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
		await db.member.delete({
			where: {
				id: memberId,
			},
		});
		revalidatePath("/cms");
		return { message: "Member deleted successfully" };
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
		const membershipCommissionTransaction =
			await db.membershipCommissionTransaction.findMany({
				where: {
					referalCode: member.memberId,
				},
				select: {
					id: true,
					profile: {
						select: {
							firstName: true,
							lastName: true,
						},
					},
					createdAt: true,
				},
			});

		const pointTransaction = await db.pointTransaction.findMany({
			where: {
				profileId: member.profileId,
			},
			select: {
				id: true,
				reward: {
					select: {
						rewardName: true,
						pointReq: true,
					},
				},
				profile: {
					select: {
						firstName: true,
						lastName: true,
					},
				},
				createdAt: true,
			},
		});

    const loyaltyPointDetails: loyaltyPointDetails[] = [
      ...membershipCommissionTransaction.map((transaction: { id: any; profile: any; createdAt: any; }) => ({
      id: transaction.id,
      profile: transaction.profile,
      createdAt: transaction.createdAt,
      point: 1,
      type: 'Membership Referral' as const
    })),
    ...pointTransaction.map((transaction: { id: any; profile: any; createdAt: any; reward: { pointReq: any; rewardName: any; }; }) => ({
      id: transaction.id,
      profile: transaction.profile,
      createdAt: transaction.createdAt,
      point: transaction.reward.pointReq,
      type: `Redeem Reward: ${transaction.reward.rewardName}` as const
    }))];

    return loyaltyPointDetails;
  } catch (error) {
    console.error('Error fetching rewards:', error);
    return { message: 'Error fetching rewards' };
  }
}

export const createWithdrawalRequest = async (prevState: any, formData: FormData) => {
  try {

    const profile = await fetchProfile();
    if(profile === null) throw new Error("Profile not found");

    const member = await fetchMember(profile.clerkId);
    if(member === null) throw new Error("Member not found");

    const amountWithdrawn = parseFloat(formData.get('amountWithdrawn') as string);
    const bankName = formData.get('bankName') as string;
    const accountName = formData.get('bankAccName') as string;
    const accountNumber = formData.get('bankAccNum') as string;
    const notes = formData.get('notes') as string;

    if(amountWithdrawn > member.commission) return { message: "Amount withdrawn is greater than the commission", status: 'error' };
    if(amountWithdrawn < 1) return { message: "Amount withdrawn must be greater than 0", status: 'error' };
    
    await db.withdrawCommissionRequest.create({
      data: {
        profileId: profile.clerkId,
        amount: amountWithdrawn,
        bankName: bankName,
        bankAccNumber: accountNumber,
        bankAccName: accountName,
        notes: notes,
        status: 'Pending',
      },
    });

    return { message: 'Withdrawal request created successfully', status: 'success' };
  } catch (error) {
    return { message: "failed to create withdrawal request. " + error, status: 'error' };
  }
}

export const fetchWithdrawalRequest = async (profileId: string) => {
  const withdrawalRequest = await db.withdrawCommissionRequest.findMany({
    where: {
      profileId: profileId,
    },
    select: {
      id: true,
      profile: {
        select: {
          firstName: true,
          lastName: true,
        }
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
}

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
		const [firstName, ...lastNameParts] = data.name.trim().split(' ');
		const lastName = lastNameParts.join(' ');

		// Create the profile first
		const profile = await db.profile.create({
			data: {
				firstName,
				lastName,
				email: data.email,
				clerkId: 'aa', // Add required clerkId field
				username: `${firstName.toLowerCase()}-${Date.now()}`, // Generate a unique username
				profileImage: '/default-avatar.png', // Set a default profile image
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

		revalidatePath('/admin/memberOverview');
		return { message: "Member created successfully" };
	} catch (error) {
		return renderError(error);
	}
};

export { getAdminUser };
