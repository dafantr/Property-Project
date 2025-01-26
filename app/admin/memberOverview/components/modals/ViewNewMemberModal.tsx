import { SubmitButton } from "@/components/form/Buttons"
import FormInput from "@/components/form/FormInput";
import Select from "react-select";
import { CitizenshipOption, member, profile, tier } from "@/utils/types";
import { useTheme } from "next-themes";
import DatePicker from "react-datepicker";

interface ViewNewMemberModalProps {
    isOpen: boolean
    onClose: () => void
    request: {
        profile: profile
        member: member,
        citizenshipOptions: CitizenshipOption[]
        tier: tier
    }
  }
  
export default function ViewNewMemberModal({
     isOpen, onClose, request 
    }: ViewNewMemberModalProps) {

    if (!isOpen || !request) return null

    const { theme } = useTheme();

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
			<div className="grid md:grid-cols-2 gap-4 mt-4">
				<FormInput
					type="text"
					name="memberId"
					defaultValue={request.member.memberId}
					label="Member ID"
					className={`${darkModeStyles.input} transition-colors ${darkModeStyles.inputReadOnly}`}
					labelClassName={darkModeStyles.label}
					readonly
				/>
				<FormInput
					type="text"
					name="membershipStatus"
					defaultValue={request.member.isActive ? "Active" : "Inactive"}
					label="Membership Status"
					className={`${darkModeStyles.input} transition-colors ${darkModeStyles.inputReadOnly}`}
					labelClassName={darkModeStyles.label}
					readonly
				/>
				<FormInput
					type="text"
					name="fullName"
					defaultValue={request.profile.firstName + " " + request.profile.lastName}
					label="Full Name"
					className={`${darkModeStyles.input} transition-colors ${darkModeStyles.inputReadOnly}`}
					labelClassName={darkModeStyles.label}
					readonly
				/>
				<FormInput
					type="text"
					name="tier"
					defaultValue={request.tier.tierName || 'noTier' || ''}
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
						onChange={(option) => setSelectedCitizen(option)}
						placeholder="Select your citizenship"
						className="w-full dark:bg-zinc-800 dark:border-zinc-700"
						defaultValue={citizenshipOptions.find(option => option.value === request.member.citizen)}
						styles={darkModeStyles.select}
						required
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
						onChange={(date) => setBirthDate(date)}
						maxDate={new Date()}
						showYearDropdown
						scrollableYearDropdown
						yearDropdownItemNumber={100}
						dateFormat="yyyy-MM-dd"
						placeholderText="SeleNct your birth date"
						className={`w-full px-4 py-2 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:placeholder-gray-400`}
						required
					/>
				</div>
				<FormInput
					type="tel"
					name="address"
					label="Address"
					defaultValue={request.member.address || ''}
					className={`${darkModeStyles.input} transition-colors`}
					labelClassName={darkModeStyles.label}
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
                        defaultValue={request.member.gender || ''}
						required>
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
					defaultValue={request.profile.email || ''}
					className={`${darkModeStyles.input} transition-colors`}
					labelClassName={darkModeStyles.label}
				/>
                <FormInput
					type="text"
					name="phone"
					label="Phone Number"
					defaultValue={request.member.phone || ''}
					className={`${darkModeStyles.input} transition-colors`}
					labelClassName={darkModeStyles.label}
				/>
				<FormInput
					type="text"
					name="bankName"
					label="Bank Name"
					defaultValue={request.member.bankName || ''}
					className={`${darkModeStyles.input} transition-colors`}
					labelClassName={darkModeStyles.label}
				/>
				<FormInput
					type="text"
					name="bankAccNum"
					label="Bank Account Number"
					defaultValue={request.member.bankAccNum || ''}
					className={`${darkModeStyles.input} transition-colors`}
					labelClassName={darkModeStyles.label}
				/>
				<FormInput
					type="text"
					name="bankAccName"
					label="Bank Account Name"
					defaultValue={request.member.bankAccName || ''}
					className={`${darkModeStyles.input} transition-colors`}
					labelClassName={darkModeStyles.label}
				/>
			</div>
			<SubmitButton
				text="Apply Changes"
				className="mt-8 w-full bg-[#C4A777] hover:bg-[#B39665] text-white py-3 rounded-lg transition-colors"
			/>
        </div>
      </div>
    )
}