'use server';

import { createReviewSchema, imageSchema, profileSchema, propertySchema, validateWithZodSchema } from './schemas';
import db from './db';
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
//import { use } from 'react';
import { uploadImage } from './supabase';
import { calculateTotals } from './calculateTotals';
import { formatDate } from './format';
import { RegistrationDetails } from './types';

const getAuthUser = async () => {
    const user = await currentUser()
    if (!user) {
    return redirect('/');
    }
    // if (!user.privateMetadata.hasProfile) redirect('/profile/create');
    return user;
    }

const getAdminUser = async () => {
  const user = await getAuthUser();
  if (user.id !== process.env.ADMIN_USER_ID) redirect('/');
  return user;
};

const renderError = (error: unknown): { message: string } => {
  console.log(error);
  return {
    message: error instanceof Error ? error.message : 'An error occurred',
  };
};

export const createProfileAction = async (
  prevState: any,
  formData: FormData
) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error('Please login to create a profile');

    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(profileSchema, rawData);
    await db.profile.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        profileImage: user.imageUrl ?? '',
        ...validatedFields
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
  redirect('/');
};


export const fetchProfileImage = async () => {
  const user = await currentUser()
  if (!user) return null
    const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id,
    }
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
    revalidatePath('/profile');
    return { message: 'Profile updated successfully' };
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
    const image = formData.get('image') as File;
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
    revalidatePath('/profile');
    return { message: 'Profile image updated successfully' };
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
    const file = formData.get('image') as File;

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
  redirect('/');
};

export const fetchProperties = async ({
  search = '',
  category,
}: {
  search?: string;
  category?: string;
}) => {
  const properties = await db.property.findMany({
    where: {
      category,
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { tagline: { contains: search, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      name: true,
      tagline: true,
      city: true,
      image: true,
      price: true,
    },
    orderBy: {
      createdAt: 'desc',
    }
  });
  return properties;
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
    return { message: favoriteId ? 'Removed from your Favorite' : 'Added to your Favorite' };
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
  return favorites.map((favorite: { property: any; }) => favorite.property);
};

export const fetchPropertyDetails = (id: string) => {
  return db.property.findUnique({
    where: {
      id,
    },
    include: {
      profile: true,
      bookings: {
        select: {
          checkIn: true,
          checkOut: true,
        },
      },
    },
  });
};

export async function createReviewAction(prevState: any, formData: FormData) {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);

    const validatedFields = validateWithZodSchema(createReviewSchema, rawData);
    await db.review.create({
      data: {
        ...validatedFields,
        profileId: user.id,
      },
    });
    revalidatePath(`/properties/${validatedFields.propertyId}`);
    return { message: 'Review submitted successfully... Thank you for your honest review!' };
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
          firstName: true,
          profileImage: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
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

    revalidatePath('/reviews');
    return { message: 'Review deleted successfully' };
  } catch (error) {
    return renderError(error);
  }
};

export async function fetchPropertyRating(propertyId: string) {
  const result = await db.review.groupBy({
    by: ['propertyId'],
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

    if (!profile) {
      return renderError('Profile not found');
    }

    await db.booking.deleteMany({
      where: {
        profileId: profile?.clerkId,
        paymentStatus: false,
      },
    });

    const { propertyId, checkIn, checkOut, referalCode } = prevState
    const property = await db.property.findUnique({
      where: { id: propertyId }, select: { price: true },
    });
    
    if (!property) {
      return { message: 'Property not found' }
    }
    if(!await validateReferalCode(referalCode)){
      return { message: 'Referal code not valid' };
    }
    const { orderTotal, totalNights, discount } = calculateTotals({
      checkIn, checkOut, price: property.price, referalCode
    });

    const booking = await db.booking.create({
      data: {
        checkIn, checkOut, orderTotal, totalNights, profileId: profile?.clerkId, propertyId
      }
    })
    bookingId = booking.id;

    //hitung commission
    let commission = 0;
    if (referalCode && referalCode.trim() !== '') {
      commission = orderTotal * 0.1

      //buat bookingCommissionTransaction dengan referal
      const bookingTrans = await db.bookingCommissionTransaction.create({
        data:{
          profileId : profile?.clerkId,
          bookingId : booking.id,
          commission : commission,
          referalCode : referalCode
        }
      })

      await updateMemberCommission(referalCode, commission, 'booking');

    } else {
      //buat bookingCommissionTransaction tanpa referal
      const bookingTrans = await db.bookingCommissionTransaction.create({
        data:{
          profileId : profile?.clerkId,
          bookingId : booking.id
        }
      })
    }
  } catch (error) {
    return renderError(error);
  }
  redirect(`/checkout?bookingId=${bookingId}`);
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
      createdAt: 'desc',
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

    revalidatePath('/bookings');
    return { message: 'Your reservation has been canceled. We\'re sorry to see you go!' };
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

    revalidatePath('/rentals');
    return { message: 'Rental deleted successfully' };
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
  const propertyId = formData.get('id') as string;

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
    return { message: 'Update Successful' };
  } catch (error) {
    return renderError(error);
  }
};

export const updatePropertyImageAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  const propertyId = formData.get('id') as string;

  try {
    const image = formData.get('image') as File;
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
    return { message: 'Property Image Updated Successful' };
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
      createdAt: 'desc',
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
    }
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
      createdAt: 'asc',
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
            firstName: true,
            profileImage: true,
          },
        },
      },
    });

    return reviews;
  } catch (error) {
    console.error('Error fetching 5-star reviews:', error);
    throw new Error('Failed to fetch 5-star reviews');
  }
};

export const fetchGalleries = async () => {
  const user = await getAuthUser();
  const galleries = await db.gallery.findMany({
    // where: {
    //   profileId: user.id,
    // },
    select: {
      id: true,
      title: true,
      media: true,
      createdAt: true
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
    const title = formData.get('title') as string;
    const file = formData.get('image') as File;

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
  redirect('/gallery');
};

export async function deleteGaleryAction(prevState: { galeryId: string }) {
  const { galeryId } = prevState; // `id` corresponds to MongoDB `_id` via Prisma

  const user = await getAuthUser(); // Ensure user is authenticated

  try {
    await db.gallery.delete({
      where: {
        id : galeryId, // Prisma maps `id` to MongoDB `_id`
      },
    });

    revalidatePath('/gallery'); // Revalidate gallery page
    return { message: 'Gallery deleted successfully' };
  } catch (error) {
    console.error('Error deleting gallery:', error); // Debug error
    return renderError(error); // Handle errors gracefully
  }
}

export const fetchPromotions = async () => {
  const user = await getAuthUser();
  const promotions = await db.promotion.findMany({
    // where: {
    //   profileId: user.id,
    // },
    select: {
      id: true,
      title: true,
      subtitle: true,
      description: true,
      media: true,
      createdAt: true
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
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const description = formData.get('description') as string;
    const file = formData.get('image') as File;

    // const validatedFields = validateWithZodSchema(propertySchema, rawData);
    const validatedFile = validateWithZodSchema(imageSchema, { image: file });
    const fullPath = await uploadImage(validatedFile.image);

    await db.promotion.create({
      data: {
        title: title,
        subtitle: subtitle,
        description: description,
        media: fullPath,
        profileId: user.id,
      },
    });
  } catch (error) {
    return renderError(error);
  }
  redirect('/promotions');
};

export async function deletePromotionAction(prevState: { promotionId: string }) {
  const { promotionId } = prevState; // `id` corresponds to MongoDB `_id` via Prisma

  const user = await getAuthUser(); // Ensure user is authenticated

  try {
    await db.promotion.delete({
      where: {
        id : promotionId, // Prisma maps `id` to MongoDB `_id`
      },
    });

    revalidatePath('/promotions'); // Revalidate gallery page
    return { message: 'Promotion deleted successfully' };
  } catch (error) {
    console.error('Error deleting promotion:', error); // Debug error
    return renderError(error); // Handle errors gracefully
  }
}


export const fetchPromotionDetails = async (promotionId: string) => {
  const user = await getAuthUser();

  return db.promotion.findUnique({
    where: {
      id: promotionId,
      profileId: user.id,
    },
  });
};

export const updatePromotionAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  const promotionId = formData.get('id') as string;

  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(promotionSchema, rawData);
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
    // revalidatePath('/promotions'); // Revalidate gallery page
    return { message: 'Update Successful' };
  } catch (error) {
    return renderError(error);
  }
};


export const updatePromotionImageAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  const promotionId = formData.get('id') as string;

  try {
    const image = formData.get('image') as File;
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
    return { message: 'Promotion Image Updated Successful' };
  } catch (error) {
    return renderError(error);
  }
};

// MEMBERSHIP
export const createMemberAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const profile = await fetchProfile();

  if (!profile) {
    return renderError('Profile not found');
  }

  try {
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const citizen = formData.get('citizen') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const gender = formData.get('gender') as string;
    const bankName = formData.get('bankName') as string;
    const bankAccNum = formData.get('bankAccNum') as string;
    const bankAccName = formData.get('bankAccName') as string;
    const referalCode = formData.get('referalCode') as string; //parentId
    const dob = formData.get('birthDate') as string;
    const formattedDate = dob.slice(0, 10);

    const tier = await fetchTierByName('Tier 1');
    const memberId = await generateUniqueMemberId();

    // cek referalCode
    if(referalCode.length > 0 && !await validateReferalCode(referalCode)){
      throw new Error("Invalid referral code");
    }

    // cek if member already exist
    if(await fetchMember(profile?.clerkId)){
      throw new Error("Member already exist");
    }

    await db.member.create({
      data: {
        memberId: memberId,
        profileId: profile?.clerkId,
        parentId: referalCode,
        tierId: tier?.id == null? '' : tier.id
      },
    });

    await db.profile.update({
      where: {
        clerkId: profile?.clerkId,
      },
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        citizen: citizen,
        dob: formattedDate,
        phone: phone,
        address: address,
        gender: gender,
        bankName: bankName,
        bankAccNum: bankAccNum,
        bankAccName: bankAccName
      },
    });

    if(referalCode.length > 0){
      await createMembershipCommissionTransaction(referalCode, profile?.clerkId);
    }
  } catch (error) {
    return renderError(error);
  }
  redirect('/promotions');
};

const generateUniqueMemberId = async () => {
  // Generate and verify uniqueness
  let code = generateCode();
  let isUnique = false;
  let maxAttempts = 10; // Prevent infinite loops

  while (!isUnique && maxAttempts > 0) {
    // Check if code exists in database
    const existingMember = await db.member.findFirst({
      where: { memberId: code }
    });

    if (!existingMember) {
      isUnique = true;
    } else {
      code = generateCode();
      maxAttempts--;
    }
  }

  if (!isUnique) {
    throw new Error('Failed to generate unique member ID, Please try again');
  }

  return code;
}

const generateCode = () => {
  // Characters to use for generating the code (alphanumeric)
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  let result = '';
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
): Promise<{ message: string }> => {
  try {
    // const rawData = Object.fromEntries(formData);
    // const validatedFields = validateWithZodSchema(profileSchema, rawData);
    
    const memberId = formData.get('memberId') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const citizen = formData.get('citizen') as string;
    const gender = formData.get('gender') as string;
    const bankName = formData.get('bankName') as string;
    const bankAccNum = formData.get('bankAccNum') as string;
    const bankAccName = formData.get('bankAccName') as string;
    const dob = formData.get('birthDate') as string;
    const formattedDate = dob.slice(0, 10);

    const member = await fetchMember(undefined,memberId);
    await db.profile.update({
      where: {
        clerkId: member?.profileId,
      },
      // data: validatedFields,
      data : {
        email: email,
        phone: phone,
        address: address,
        dob: formattedDate,
        citizen: citizen,
        gender: gender,
        bankName: bankName,
        bankAccNum: bankAccNum,
        bankAccName: bankAccName
      }
    });
    revalidatePath('/member/dashboard');
    return { message: 'Profile updated successfully' };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchMember = async ( profileId?: string, memberId?: string) => {
  return await db.member.findFirst({
    where: {
      profileId : profileId,
      memberId : memberId
    },
  });
};

export const validateReferalCode = async (referalCode: string): Promise<boolean> => {
  const profile = await fetchProfile();

  const member = await db.member.findFirst({
    where: {
      memberId: referalCode,
    },
  });

  // if(member != null){
  //   if(member.profileId == profile?.clerkId){
  //     return false;
  //   }
  // }
  if (!member || referalCode == '') return false;
  return true;
};

export const updateMemberCommission = async ( memberId : string, commission : any, type : string) => {
  try {
    const member = await fetchMember(undefined, memberId);

    if(!member) throw new Error ("Member Not Found!");

    if (type == 'booking'){
      await db.member.update({
        where: {
          id: member.id,
        },
        data : {
          commission: member.commission + commission,
        }
      });
    } else {
      await db.member.update({
        where: {
          id: member.id,
        },
        data : {
          commission: member.commission + commission,
          point: member.point + 1
        }
      });
    }
  } catch (error) {
    return renderError(error);
  }
};

export const fetchTierByName = async (tierName: string) => {
  return await db.tier.findFirst({
    where: {
      tierName: tierName,
    },
  });
};

export const fetchTierById = async ( id: string) => {
  return await db.tier.findUnique({
    where: {
      id: id,
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
// END MEMBERSHIP

export const fetchBookingCommissionTransaction = async (referalCode: string) => {
  return await db.bookingCommissionTransaction.findMany({
    where: {
      referalCode: referalCode
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
        }
      },
      profile: {
        select: {
          firstName: true,
          lastName: true,
        }
      }
    },
  });
};

// First, create a fetch function in your actions.ts
export const fetchRewards = async () => {
  try {
    const rewards = await db.reward.findMany({
    });
    return rewards;
  } catch (error) {
    console.error('Error fetching rewards:', error);
    return { message: 'Error fetching rewards' };
  }
};


export const createMembershipCommissionTransaction = async (referalCode: string, clerkId: string) => {

  let commission = 0;

  commission = await calculateCommission();

  await db.membershipCommissionTransaction.create({
    data: {
      profileId: clerkId,
      commission: 100,
      closerId: referalCode,
      closerCommission: 100,
      referalCode: referalCode,
      paymentStatus: false,
    },
  });
}

function calculateCommission(): number {
  
}


