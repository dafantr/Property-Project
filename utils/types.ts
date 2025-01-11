import { BookingCommissionTransaction } from "@prisma/client";

export type actionFunction = (
    prevState: any,
    formData: FormData
) => Promise<{ message: string }>;

export type PropertyCardProps = {
    image: string;
    id: string;
    name: string;
    tagline: string;
    city: string;
    price: number;
  };

  export type DateRangeSelect = {
    startDate: Date;
    endDate: Date;
    key: string;
  };
  
  export type Booking = {
    checkIn: Date;
    checkOut: Date;
  };

  export type tier = {
    id: string;
    tierName: string;
    commission: number;
  };

  export type dashboardMemberProps = {
    profile: {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
        citizen?: string | null;
        dob?: string | null;
        phone?: string | null;
        address?: string | null;
        gender?: string | null;
        bankName?: string | null;
        bankAccNum?: string | null;
        bankAccName?: string | null;
	};

    member: {
        id: string;
        memberId: string;
        isActive: number;
        commission: number;
        point: number;
        tierId: string;
    };

    rewards: {
        id: string;
        rewardName: string;
        pointReq: number;
    }[];

    tier: {
        id: string;
        tierName: string;
        commission: number;
    };

    bookingCommissionDetails: {
      id: string;
      profileId: string;
      bookingId: string;
      referalCode: string | null;
      commission: number;
      createdAt: Date;
      booking: {
        paymentStatus: boolean;
      };
      profile: {
        firstName: string;
        lastName: string;
      };
    }[];
}

export type LoyaltiPointsProps = {
  member: {
      id: string;
      memberId: string;
      isActive: number;
      commission: number;
  point: number;
  };
  rewards: {
      id: string;
      rewardName: string;
      pointReq: number;
  }[];
}

export type Member = {
  memberId: string;
  id: string;
  name: string;
  downlines?: Member[];
};

export type DownlineProps = {
  member: Member;
  level?: number;
};

export type CitizenshipOption = {
	value: string;
	label: string;
};

export type CreateMemberFormProps = {
	profile: {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
	};
	citizenshipOptions: CitizenshipOption[];
}

export type ReferralCommissionProps = {
  member: {
      id: string;
      memberId: string;
      isActive: number;
      commission: number;
  };

  bookingCommissionDetails: {
    id: string;
    profileId: string;
    bookingId: string;
    referalCode: string | null;
    commission: number;
    createdAt: Date;
    booking: {
      paymentStatus: boolean;
    };
    profile: {
      firstName: string;
      lastName: string;
    };
  }[];
}

export type UpdateMemberFormProps = {
	profile: {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
        citizen?: string | null;
        dob?: string | null;
        phone?: string | null;
        address?: string | null;
        gender?: string | null;
        bankName?: string | null;
        bankAccNum?: string | null;
        bankAccName?: string | null;
	};

    member: {
        id: string;
        memberId: string;
        isActive: number;
    };
	citizenshipOptions: CitizenshipOption[];
}

export type RegistrationDetails = {
  subTotal: number;
  tax: number;
  discount: number;
  orderTotal: number;
};

