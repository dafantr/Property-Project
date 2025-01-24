// components/CreateMemberForm.tsx
"use client";

import FormInput from "@/components/form/FormInput";
import { SubmitButton } from "@/components/form/Buttons";
import FormContainer from "@/components/form/FormContainer";
import Select from "react-select";
import { updateMemberAction } from "@/utils/actions";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTheme } from "next-themes";
import { parse } from "date-fns";
import { CitizenshipOption, UpdateMemberFormProps } from "@/utils/types";
import { redirect } from "next/navigation";
import ErrorModal from "@/components/ui/ErrorModal";
import SuccessModal from "@/components/ui/SuccessModal";

export default function UpdateMemberForm({
	profile,
	member,
	citizenshipOptions,
	tier,
}: UpdateMemberFormProps) {
	const { theme } = useTheme();
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [showErrorModal, setShowErrorModal] = useState(false);
	const [birthDate, setBirthDate] = useState<Date | null>(
		member.dob ? parse(member.dob, 'yyyy-MM-dd', new Date()) : null
    );
	const [citizen, setSelectedCitizen] = useState<CitizenshipOption | null>(
		citizenshipOptions.find(option => option.value === member.citizen) || null
	);

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
		<section className="max-w-3xl mx-auto p-4">
			<div className="border dark:border-zinc-700 p-8 rounded-lg shadow-lg bg-white dark:bg-zinc-800">
			<h1 className="text-3xl font-bold mb-8 dark:text-white">
				Member Profile
			</h1>
				<FormContainer
					action={async (prevState: any, formData: FormData) => {
						formData.append("citizen", citizen?.value || "");
						formData.append(
							"birthDate",
							birthDate ? birthDate.toLocaleDateString('en-CA') : ""
						);
						// Pass the updated formData to the action
						const result = await updateMemberAction(prevState, formData);
						if(result.status === 'success') {
							setShowSuccessModal(true);
							setTimeout(() => {
								setShowSuccessModal(false);
								
							}, 2000);
							redirect("/member/dashboard");
						} else if (result.status === 'error') {
							setShowErrorModal(true);
							setTimeout(() => {
								setShowErrorModal(false);
							}, 2000);
						}
						return { message: result.message, status: result.status };
					}}>
					<div className="grid md:grid-cols-2 gap-4 mt-4">
						<FormInput
							type="text"
							name="memberId"
							defaultValue={member.memberId}
							label="Member ID"
							className={`${darkModeStyles.input} transition-colors ${darkModeStyles.inputReadOnly}`}
							labelClassName={darkModeStyles.label}
							readonly
						/>
						<FormInput
							type="text"
							name="membershipStatus"
							defaultValue={member.isActive ? "Active" : "Inactive"}
							label="Membership Status"
							className={`${darkModeStyles.input} transition-colors ${darkModeStyles.inputReadOnly}`}
							labelClassName={darkModeStyles.label}
							readonly
						/>
						<FormInput
							type="text"
							name="fullName"
							defaultValue={profile.firstName + " " + profile.lastName}
							label="Full Name"
							className={`${darkModeStyles.input} transition-colors ${darkModeStyles.inputReadOnly}`}
							labelClassName={darkModeStyles.label}
							readonly
						/>

						<FormInput
							type="text"
							name="tier"
							defaultValue={tier.tierName || 'noTier'}
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
								defaultValue={citizenshipOptions.find(option => option.value === member.citizen)}
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
							defaultValue={member.address || ''}
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
                                defaultValue={member.gender || ''}
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
							defaultValue={profile.email || ''}
							className={`${darkModeStyles.input} transition-colors`}
							labelClassName={darkModeStyles.label}
						/>
                        <FormInput
							type="text"
							name="phone"
							label="Phone Number"
							defaultValue={member.phone || ''}
							className={`${darkModeStyles.input} transition-colors`}
							labelClassName={darkModeStyles.label}
						/>
						<FormInput
							type="text"
							name="bankName"
							label="Bank Name"
							defaultValue={member.bankName || ''}
							className={`${darkModeStyles.input} transition-colors`}
							labelClassName={darkModeStyles.label}
						/>
						<FormInput
							type="text"
							name="bankAccNum"
							label="Bank Account Number"
							defaultValue={member.bankAccNum || ''}
							className={`${darkModeStyles.input} transition-colors`}
							labelClassName={darkModeStyles.label}
						/>
						<FormInput
							type="text"
							name="bankAccName"
							label="Bank Account Name"
							defaultValue={member.bankAccName || ''}
							className={`${darkModeStyles.input} transition-colors`}
							labelClassName={darkModeStyles.label}
						/>
					</div>
					<SubmitButton
						text="Apply Changes"
						className="mt-8 w-full bg-[#C4A777] hover:bg-[#B39665] text-white py-3 rounded-lg transition-colors"
					/>
				</FormContainer>
			</div>
			{showSuccessModal && (
                <SuccessModal message="Profile updated successfully" />
            )}

            {showErrorModal && (
                <ErrorModal message="Failed to update member profile" />
            )}
		</section>
	);
}

