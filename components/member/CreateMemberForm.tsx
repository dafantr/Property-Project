// components/CreateMemberForm.tsx
"use client";

import FormInput from "@/components/form/FormInput";
import { SubmitButton } from "@/components/form/Buttons";
import FormContainer from "@/components/form/FormContainer";
import Select from "react-select";
import { createMemberAction } from "@/utils/actions";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTheme } from "next-themes";

type CitizenshipOption = {
	value: string;
	label: string;
};

interface CreateMemberFormProps {
	profile: {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
	};
	citizenshipOptions: CitizenshipOption[];
}

export default function CreateMemberForm({
	profile,
	citizenshipOptions,
}: CreateMemberFormProps) {
	const { theme } = useTheme();

	const [birthDate, setBirthDate] = useState<Date | null>(null);
	const [citizen, setSelectedCitizen] = useState<CitizenshipOption | null>(
		null
	);
	const [refCode, setRefCode] = useState<string>("");

	const darkModeStyles = {
		input: "dark:bg-black dark:border-gray-700 dark:text-white",
		label: "dark:text-white",
		select: {
			control: (base) => ({
				...base,
				backgroundColor: theme === "dark" ? "#000" : base.backgroundColor,
				borderColor: theme === "dark" ? "#374151" : base.borderColor,
				color: theme === "dark" ? "#fff" : base.color,
			}),
			menu: (base) => ({
				...base,
				backgroundColor: theme === "dark" ? "#000" : base.backgroundColor,
			}),
			option: (base, state) => ({
				...base,
				backgroundColor:
					theme === "dark"
						? state.isFocused
							? "#1a1a1a"
							: "#000"
						: state.isFocused
						? "#f3f4f6"
						: base.backgroundColor,
				color: theme === "dark" ? "#fff" : "#000",
			}),
			singleValue: (base) => ({
				...base,
				color: theme === "dark" ? "#fff" : "#000",
			}),
			input: (base) => ({
				...base,
				color: theme === "dark" ? "#fff" : "#000",
			}),
		},
	};

	return (
		<section className="max-w-3xl mx-auto p-4">
			<h1 className="text-3xl font-bold mb-8 text-center dark:text-white">
				Register for MDV Membership
			</h1>
			<div className="border dark:border-gray-700 p-8 rounded-lg shadow-lg bg-white dark:bg-black">
				<FormContainer
					action={async (prevState: any, formData: FormData) => {
						formData.append("citizen", citizen?.value || "");
						formData.append(
							"birthDate",
							birthDate ? birthDate.toISOString() : ""
						);
						console.log(birthDate?.toISOString());
						formData.set("referalCode", refCode);

						// Pass the updated formData to the action
						return createMemberAction(prevState, formData);
					}}>
					<div className="grid gap-6">
						<FormInput
							type="text"
							name="firstName"
							defaultValue={profile.firstName}
							label="First Name"
							className={`${darkModeStyles.input} transition-colors`}
							labelClassName={darkModeStyles.label}
						/>
						<FormInput
							type="text"
							name="lastName"
							defaultValue={profile.lastName}
							label="Last Name"
							className={`${darkModeStyles.input} transition-colors`}
							labelClassName={darkModeStyles.label}
						/>
						<FormInput
							type="text"
							name="email"
							defaultValue={profile.email}
							label="Email Address"
							className={`${darkModeStyles.input} transition-colors`}
							labelClassName={darkModeStyles.label}
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
								className="w-full"
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
								placeholderText="Select your birth date"
								className={`w-full px-4 py-2 rounded-lg border dark:bg-black dark:border-gray-700 dark:text-white dark:placeholder-gray-400`}
								required
							/>
						</div>

						<FormInput
							type="tel"
							name="phone"
							label="Phone Number"
							className={`${darkModeStyles.input} transition-colors`}
							labelClassName={darkModeStyles.label}
						/>
						<FormInput
							type="text"
							name="address"
							label="Address"
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
								className={`w-full px-4 py-2 rounded-lg border dark:bg-black dark:border-gray-700 dark:text-white`}
								required>
								<option value="">Select Gender</option>
								<option value="male">Male</option>
								<option value="female">Female</option>
								<option value="other">Other</option>
							</select>
						</div>
						<FormInput
							type="text"
							name="bankName"
							label="Bank Name"
							className={`${darkModeStyles.input} transition-colors`}
							labelClassName={darkModeStyles.label}
						/>
						<FormInput
							type="text"
							name="bankAccNum"
							label="Bank Account Number"
							className={`${darkModeStyles.input} transition-colors`}
							labelClassName={darkModeStyles.label}
						/>
						<FormInput
							type="text"
							name="bankAccName"
							label="Bank Account Name"
							className={`${darkModeStyles.input} transition-colors`}
							labelClassName={darkModeStyles.label}
						/>
						<div className="form-group">
							<input
								type="text"
								id="referalCode"
								name="referalCode"
								value={refCode}
								onChange={(e) => setRefCode(e.target.value)}
								className={`w-full px-4 py-2 rounded-lg ${darkModeStyles.input}`}
								placeholder="Enter referral code (Optional)"
							/>
						</div>
					</div>
					<SubmitButton
						text="Register Now"
						className="mt-8 w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg transition-colors"
					/>
				</FormContainer>
			</div>
		</section>
	);
}
