export type actionFunction = (
    prevState: any,
    formData: FormData
) => Promise<{ message: string }>;

export interface PropertyCardProps {
  id: string;
  name: string;
  tagline: string;
  city: string;
  price: number;
  rating: number | null;
  count: number;
  reviews: { rating: number }[];
  createdAt: string; // Ensure createdAt is a string
  image: string | string[]; // Allow image to be a single string or array
  category: string; // ✅ Add this line to include category
}

  export type DateRangeSelect = {
    startDate: Date;
    endDate: Date;
    key: string;
  };

  export type Booking = {
    checkIn: Date;
    checkOut: Date;
  };

  export type ExclusiveCardProps = {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    createdAt: Date;
    media: string; // This represents the image, we will map it below
    category: string; // Ensure this is included
};

  export type tier = {
    id: string;
    tierName: string;
    tierLevel: number;
    commission: number;
    requiredDownline: number;
  };

  export type member = {
    id: string;
    profileId: string;
    parentMemberId: string | null;
    parentId: string | null;
    memberId: string;
    createdAt: Date;
    isActive: number;
    commission: number;
    point: number;
    tierId: string;
    citizen?: string | null;
    dob?: string | null;
    phone?: string | null;
    address?: string | null;
    gender?: string | null;
    bankName?: string | null;
    bankAccNum?: string | null;
    bankAccName?: string | null;
    isMarketing: boolean;
  }

  export type profile = {
    id: string;
		firstName: string;
		lastName: string;
		email: string;
  }

  export type reward = {
    id: string;
    rewardName: string;
    pointReq: number;
  }

  export type bookingCommissionDetails = {
    id: string;
    profileId: string;
    bookingId: string;
    referalCode: string | null;
    commission: number;
    createdAt: Date;
    booking: {
      paymentStatus: boolean;
    };
  }

  export type dashboardMemberProps = {
    profile: profile;
    member: member;
    tier: tier;
    rewards: reward[];
    referralDetails: referralDetails[];
    loyaltyPointDetails: loyaltyPointDetails[];
    downlines: any;
}

export type LoyaltiPointsProps = {
  member: member;
  rewards: reward[];
  loyaltyPointDetails: loyaltyPointDetails[];
}

export type Downline = {
  id: string;
  profile: {
    firstName: string;
    lastName: string;
    profileImage: string;
  },
  memberId: string;
  isActive: number;
  isDeleted: number;
  downlines: Downline[];
};

export type DownlineProps = {
  member: any;
  level?: number;
};

export type CitizenshipOption = {
	value: string;
	label: string;
};

export type CreateMemberFormProps = {
	profile: profile;
	citizenshipOptions: CitizenshipOption[];
}

export type ReferralCommissionProps = {
  member: member;
  tier: tier;
  referralDetails: referralDetails[];
  withdrawalRequestDetails: WithdrawalRequestDetails[];
  generalVariable: generalVariable;
}

export type UpdateMemberFormProps = {
	profile: profile;
	member: member;
	tier: tier;
	citizenshipOptions: CitizenshipOption[];
}

export type RegistrationDetails = {
  subTotal: number;
  tax: number;
  orderTotal: number;
};

export type membershipCommissionTransaction = {
  id: string;
  memberId: string;
  closerId: string | null;
  referalCode: string | null;
  totalPrice: number;
  proofOfPayment: string | null;
  paymentMethod: string;
  paymentStatus: boolean;
}

export type referralDetails = {
  id: string;
  member: {
    profile: {
      firstName: string;
      lastName: string;
    };
  } | null;
  commission: number;
  type: string;
  createdAt: Date;
  membershipCommissionTransaction: {
    paymentStatus: boolean;
  } | null;
  booking: {
    paymentStatus: boolean;
  } | null;
}

export type loyaltyPointDetails = {
  id: string;
  createdAt: Date;
  profile: {
    firstName: string;
    lastName: string;
  };
  type: 'Membership Referral' | `Redeem Reward: ${string}`;
  point: number;
}

export type ConfirmWithdrawModalProps = {
  member: member;
  setShowWithdrawModal: (show: boolean) => void;
  setShowSuccessModal: (show: boolean) => void;
  setShowErrorModal: (show: boolean) => void;
}

export type ConfirmWithdrawalApprovalModalProps = {
  request: WithdrawalRequestDetails | null;
  setConfirmWithdrawalApprovalModal: (show: boolean) => void;
  handleCloseWithdrawalModal: () => void;
  handleApprove: (id: string, amount: number) => void;
}

export type ConfirmWithdrawalRejectionModalProps = {
  request: WithdrawalRequestDetails | null;
  setConfirmWithdrawalRejectionModal: (show: boolean) => void;
  handleCloseWithdrawalModal: () => void;
  handleReject: (id: string, amount: number) => void;
}

export type WithdrawalRequestDetails = {
  id: string;
  memberId: string;
  member: {
    profile: {
      firstName: string;
      lastName: string;
    };
  } | null;
  amount: number;
  bankName: string;
  bankAccNumber: string;
  bankAccName: string;
  status: string;
  createdAt: Date;
}

export type WithdrawalHistoryModalProps = {
  member: member;
  withdrawalRequestDetails: WithdrawalRequestDetails[];
  setShowWithdrawalHistoryModal: (show: boolean) => void;
}

export type dashboardMarketingProps = {
  member: member;
  profile: profile;
  referralDetails: referralDetails[];
	tier: tier;
}

export type generalVariable = {
  id: string;
  variableName: string;
  variableValue: string;
  createdAt: Date;
  updatedAt: Date;
}

