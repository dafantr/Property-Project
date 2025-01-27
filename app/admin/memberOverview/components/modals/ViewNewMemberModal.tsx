import { SubmitButton } from "@/components/form/Buttons"
import FormInput from "@/components/form/FormInput";
import Select from "react-select";
import { useTheme } from "next-themes";
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import { parse } from "date-fns";
import { approveMemberRequestAction, fetchCitizenshipOptions, updateProfileImageAction } from "@/utils/actions";
import { redirect, useRouter } from "next/navigation";
import FormContainer from "@/components/form/FormContainer";
import ErrorModal from "@/components/ui/ErrorModal";
import SuccessModal from "@/components/ui/SuccessModal";

interface ViewNewMemberModalProps {
    isOpen: boolean
    onClose: () => void
    memberData: MemberData | null
}

  type MemberData = {
	id: string,
	memberId: string,
	member: {
	  profile: {
		firstName: string,
		lastName: string,
		email: string,
	  },
	  tier: {
		tierName: string,
	  },
	  dob: string | null,
	  citizen: string | null,
	  phone: string | null,
	  address: string | null,
	  gender: string | null,
	  bankName: string | null,
	  bankAccNum: string | null,
	  bankAccName: string | null,
	  isActive: number;
	},
	referalCode: string | null,
	closerId: string | null,
	paymentMethod: string,
	proofOfPayment: string | null,
	paymentStatus: boolean,
	createdAt: Date;
  };
  
export default function ViewNewMemberModal({
     isOpen, onClose, memberData 
    }: ViewNewMemberModalProps) {

    if (!isOpen || !memberData) return null

    const { theme } = useTheme();
	const router = useRouter();

	const [birthDate, setBirthDate] = useState<Date | null>(null);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [showErrorModal, setShowErrorModal] = useState(false);

	useEffect(() => {
		if (memberData?.member.dob) {
		  try {
			// Parse the date string from memberData.dob
			const parsedDate = parse(memberData.member.dob, 'yyyy-MM-dd', new Date());
			setBirthDate(parsedDate);
		  } catch (error) {
			console.error('Error parsing date:', error);
			setBirthDate(null);
		  }
		}
	  }, [memberData]);

	  useEffect(() => {
		console.log('Full memberData:', memberData);
		console.log('Member object:', memberData?.member);
		console.log('isActive value:', memberData?.member?.isActive);
		console.log('Type of isActive:', typeof memberData?.member?.isActive);
	  }, [memberData]);

	const [citizenshipOptions, setCitizenshipOptions] = useState([]);
  	const [citizen, setCitizen] = useState(null);
	
	// Fetch citizenship options
	useEffect(() => {
		const loadCitizenshipOptions = async () => {
		  try {
			const options = await fetchCitizenshipOptions();
			setCitizenshipOptions(options);
		  } catch (error) {
			console.error('Error loading citizenship options:', error);
		  }
		};
	
		loadCitizenshipOptions();
	  }, []);

	// Set selected citizen when memberData loads
	useEffect(() => {
		if (memberData?.member.citizen && citizenshipOptions.length > 0) {
		const selectedCitizen = citizenshipOptions.find(
			(option: { value: string }) => option.value === memberData.member.citizen
		);
		if (selectedCitizen) {
			setCitizen(selectedCitizen);
		}
		}
	}, [memberData, citizenshipOptions]);

    const darkModeStyles = {
		input: "dark:bg-zinc-800 dark:border-zinc-700 dark:text-white",
		inputReadOnly: "bg-gray-50 dark:bg-zinc-900 cursor-not-allowed opacity-75",
		label: "dark:text-gray-300",
		select: {
			control: (base: any) => ({   
				...base,
				backgroundColor: theme === "dark" ? "#18181b" : base.backgroundColor, // zinc-900
				borderColor: theme === "dark" ? "#3f3f46" : base.borderColor, // zinc-700
				color: theme === "dark" ? "#fff" : base.color,
				"&:hover": {
					borderColor: theme === "dark" ? "#C4A777" : base.borderColor
				}
			}),
			menu: (base: any) => ({
				...base,
				backgroundColor: theme === "dark" ? "#18181b" : base.backgroundColor, // zinc-900
			}),
			option: (base: any, state: any) => ({
				...base,
				backgroundColor:
					theme === "dark"
						? state.isFocused
							? "#27272a" // zinc-800
							: "#18181b" // zinc-900
						: state.isFocused
						? "#f4f4f5" // zinc-100
						: base.backgroundColor,
				color: theme === "dark" ? "#fff" : "#000",
				"&:hover": {
					backgroundColor: theme === "dark" ? "#C4A777" : "#f4f4f5",
					color: theme === "dark" ? "#fff" : "#000"
				}
			}),
			singleValue: (base: any) => ({
				...base,
				color: theme === "dark" ? "#fff" : "#000",
			}),
			input: (base: any) => ({
				...base,
				color: theme === "dark" ? "#fff" : "#000",
			}),
		},
	};
  
    return (
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-black p-6 rounded-lg w-full max-w-[500px] max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold dark:text-white">Member Registration Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            >
              ✕
            </button>
          </div>
		  	<FormContainer
				action={async () => {
				// Pass the updated formData to the action
				const result = await approveMemberRequestAction(memberData?.memberId);
				if(result.status === 'success') {
					setShowSuccessModal(true);
					setTimeout(() => {
						setShowSuccessModal(false);
						router.refresh();
					}, 2000);
				} else if (result.status === 'error') {
					setShowErrorModal(true);
					setTimeout(() => {
						setShowErrorModal(false);
						router.refresh();
					}, 2000);
				}
				return { message: result.message, status: result.status };
			}}>
				<div className="grid md:grid-cols-1 gap-4 mt-4">
					<FormInput
						type="text"
						name="memberId"
						defaultValue={memberData?.memberId}
						label="Member ID"
						className={`${darkModeStyles.input} transition-colors ${darkModeStyles.inputReadOnly}`}
						labelClassName={darkModeStyles.label}
						readonly
					/>
					<FormInput
						type="text"
						name="membershipStatus"
						defaultValue={memberData?.member.isActive === 1 ? "Active" : "Inactive"}
						label="Membership Status"
						className={`${darkModeStyles.input} transition-colors ${darkModeStyles.inputReadOnly}`}
						labelClassName={darkModeStyles.label}
						readonly
					/>
					<FormInput
						type="text"
						name="fullName"
						defaultValue={memberData?.member.profile.firstName + " " + memberData?.member.profile.lastName}
						label="Full Name"
						className={`${darkModeStyles.input} transition-colors ${darkModeStyles.inputReadOnly}`}
						labelClassName={darkModeStyles.label}
						readonly
					/>
					<FormInput
						type="text"
						name="tier"
						defaultValue={memberData?.member.tier.tierName || 'noTier' || ''}
						label="Tier"
						className={`${darkModeStyles.input} transition-colors ${darkModeStyles.inputReadOnly}`}
						labelClassName={darkModeStyles.label}
						readonly
					/>
					<div className="form-group">
						<label
							htmlFor="citizen"
							className={`block mb-2 text-sm font-medium ${darkModeStyles.label}`}>
							Citizenship
						</label>
						<Select
							id="citizen"
							options={citizenshipOptions}
							value={citizen}
							placeholder="Select your citizenship"
							className="w-full dark:bg-zinc-800 dark:border-zinc-700"
							styles={darkModeStyles.select}
							isDisabled
						/>
					</div>
					<div className="form-group">
						<label
							htmlFor="birthDate"
							className={`block mb-2 text-sm font-medium ${darkModeStyles.label}`}>
							Date of Birth
						</label>
						<DatePicker
							id="birthDate"
							selected={birthDate}
							maxDate={new Date()}
							showYearDropdown
							scrollableYearDropdown
							yearDropdownItemNumber={100}
							dateFormat="yyyy-MM-dd"
							placeholderText="SeleNct your birth date"
							className={`w-full px-4 py-2 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:placeholder-gray-400`}
							disabled
						/>
					</div>
					<FormInput
						type="tel"
						name="address"
						label="Address"
						defaultValue={memberData?.member.address || ''}
						className={`${darkModeStyles.input} transition-colors`}
						labelClassName={darkModeStyles.label}
						readonly
					/>
					<div className="form-group">
						<label
							htmlFor="gender"
							className={`block mb-2 text-sm font-medium ${darkModeStyles.label}`}>
							Gender
						</label>
						<select
							id="gender"
							name="gender"
							className={`w-full px-4 py-2 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700 dark:text-white`}
							defaultValue={memberData?.member.gender || ''}
							disabled>
							<option value="">Select Gender</option>
							<option value="male">Male</option>
							<option value="female">Female</option>
							<option value="other">Other</option>
						</select>
					</div>
					<FormInput
						type="text"
						name="email"
						label="Email"
						defaultValue={memberData?.member.profile.email || ''}
						className={`${darkModeStyles.input} transition-colors`}
						labelClassName={darkModeStyles.label}
						readonly
					/>
					<FormInput
						type="text"
						name="phone"
						label="Phone Number"
						defaultValue={memberData?.member.phone || ''}
						className={`${darkModeStyles.input} transition-colors`}
						labelClassName={darkModeStyles.label}
						readonly
					/>
					<FormInput
						type="text"
						name="bankName"
						label="Bank Name"
						defaultValue={memberData?.member.bankName || ''}
						className={`${darkModeStyles.input} transition-colors`}
						labelClassName={darkModeStyles.label}
						readonly
					/>
					<FormInput
						type="text"
						name="bankAccNum"
						label="Bank Account Number"
						defaultValue={memberData?.member.bankAccNum || ''}
						className={`${darkModeStyles.input} transition-colors`}
						labelClassName={darkModeStyles.label}
						readonly
					/>
					<FormInput
						type="text"
						name="bankAccName"
						label="Bank Account Name"
						defaultValue={memberData?.member.bankAccName || ''}
						className={`${darkModeStyles.input} transition-colors`}
						labelClassName={darkModeStyles.label}
						readonly
					/>
					<div className="form-group">
					<label
						htmlFor="proofOfPayment"
						className={`block mb-2 text-sm font-medium ${darkModeStyles.label}`}
					>
						Proof of Payment
					</label>
					{memberData?.proofOfPayment ? (
						<div className="relative w-full h-48 border rounded-lg overflow-hidden">
						<img
							src={memberData.proofOfPayment}
							alt="Proof of Payment"
							className="object-contain"
						/>
						{/* Optional: Add a view full size button */}
						<button 
							onClick={() => window.open(memberData.proofOfPayment || '', '_blank')}
							className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm hover:bg-black/70"
						>
							View Full Size
						</button>
						</div>
					) : (
						<div className="w-full h-48 border rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">
						No proof of payment uploaded
						</div>
					)}
					</div>
					
				</div>
				<SubmitButton
					text="Approve"
					className="mt-4 w-full bg-[#C4A777] hover:bg-[#B39665] text-white py-3 rounded-lg transition-colors"
				/>
				<SubmitButton
					text="Reject"
					className="mt-4 w-full bg-[#C4A777] hover:bg-[#B39665] text-white py-3 rounded-lg transition-colors"
				/>
			</FormContainer>
        </div>
		{showSuccessModal && (
            <SuccessModal message="Member request approved successfully" />
        )}

        {showErrorModal && (
            <ErrorModal message="Failed to approve member request" />
        )}
      </div>
    )
}