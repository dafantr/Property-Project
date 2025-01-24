// components/CreateMemberForm.tsx
"use client";

import FormInput from "@/components/form/FormInput";
import { SubmitButton } from "@/components/form/Buttons";
import FormContainer from "@/components/form/FormContainer";
import Select from "react-select";
import { createMemberAction, validateReferalCode } from "@/utils/actions";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTheme } from "next-themes";
import { CitizenshipOption, CreateMemberFormProps, RegistrationDetails } from "@/utils/types";
import { Card, CardTitle } from "../ui/card";
import { formatCurrency } from "@/utils/format";
import { Separator } from '@/components/ui/separator';
import { calculateRegistrationFee } from "@/utils/calculateTotals";
import ErrorModal from "../ui/ErrorModal";
import { useRouter } from "next/navigation";

export default function CreateMemberForm({
	profile,
	citizenshipOptions,
}: CreateMemberFormProps) {
	const { theme } = useTheme();
	const router = useRouter();
	const [birthDate, setBirthDate] = useState<Date | null>(null);
	const [isReferralValid, setIsReferralValid] = useState(false);
	const [isCloserValid, setIsCloserValid] = useState(false);
	const [citizen, setSelectedCitizen] = useState<CitizenshipOption | null>(
		null
	);
	const [paymentMethod, setPaymentMethod] = useState('');
	const [refCode, setRefCode] = useState('');
	const [clsCode, setClsCode] = useState('');

	const [showErrorModal, setShowErrorModal] = useState(false);

	const [totals, setTotals] = useState<RegistrationDetails>({
		subTotal: 0,
		tax: 0,
		orderTotal: 0,
	  });

	  useEffect(() => {
		calculateRegistrationFee().then((totals) => {
			setTotals(totals);
		});
	  }, []);

	const darkModeStyles = {
		input: "dark:bg-black dark:border-gray-700 dark:text-white",
		label: "dark:text-white",
		select: {
			control: (base: any) => ({
				...base,
				backgroundColor: theme === "dark" ? "#000" : base.backgroundColor,
				borderColor: theme === "dark" ? "#374151" : base.borderColor,
				color: theme === "dark" ? "#fff" : base.color,
			}),
			menu: (base: any) => ({
				...base,
				backgroundColor: theme === "dark" ? "#000" : base.backgroundColor,
			}),
			option: (base: any, state: any) => ({
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

	const handleApplyReferralCode = () => {
		//validate referalCode
		validateReferalCode(refCode, "member")
		.then((isValid) => {
		  if (isValid) {
			setIsReferralValid(true);
		  } else {
			setIsReferralValid(false);
		  }
		})
		.catch((error) => {
		  console.error('Error validating referral code:', error);
		});
	};

	const handleApplyCloserCode = () => {
		//validate referalCode
		validateReferalCode(clsCode, "member")
		.then((isValid) => {
		  if (isValid) {
			setIsCloserValid(true);
		  } else {
			setIsCloserValid(false);
		  }
		})
		.catch((error) => {
		  console.error('Error validating closer code:', error);
		});
	};
	

	return (
		<section className="max-w-3xl mx-auto p-4">
			<h1 className="text-3xl font-bold mb-8 text-center dark:text-white">
				Register for MDV Membership
			</h1>
			<div className="border dark:border-gray-700 p-8 rounded-lg shadow-lg bg-white dark:bg-black">
				<FormContainer
					action={async (prevState: any, formData: FormData) => {
						const file = formData.get('paymentProof') as File;
						formData.append("citizen", citizen?.value || "");
						formData.append(
							"birthDate",
							birthDate ? birthDate.toLocaleDateString('en-CA') : ""
						);
						formData.set("referalCode", refCode);
						formData.set("closerCode", clsCode);
						formData.append('paymentProof', file);
						formData.set("totalPrice", totals.orderTotal.toString());

						// Pass the updated formData to the action
						const result = await createMemberAction(prevState, formData);

						if (result.status === 'error') {
							setShowErrorModal(true);
							setTimeout(() => {
								setShowErrorModal(false);
							}, 2000);
						}

						return { message: result.message, status: result.status };
					}}>
					<div className="grid gap-6">
						<FormInput
							type="text"
							name="firstName"
							defaultValue={profile.firstName}
							label="First Name"
							className={`${darkModeStyles.input} transition-colors`}
							labelClassName={darkModeStyles.label}
							readonly
						/>
						<FormInput
							type="text"
							name="lastName"
							defaultValue={profile.lastName}
							label="Last Name"
							className={`${darkModeStyles.input} transition-colors`}
							labelClassName={darkModeStyles.label}
							readonly
						/>
						<FormInput
							type="text"
							name="email"
							defaultValue={profile.email}
							label="Email Address"
							className={`${darkModeStyles.input} transition-colors`}
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
								name="citizen"
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
								name="birthDate"
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
							type="number"
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
							type="number"
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
							<label
								htmlFor="paymentMethod"
								className={`block mb-2 text-sm font-medium ${darkModeStyles.label}`}>
								Payment Method
							</label>
							<select
								id="paymentMethod"
								name="paymentMethod"
								value={paymentMethod}
								onChange={(e) => setPaymentMethod(e.target.value)}
								className={`w-full px-4 py-2 rounded-lg border dark:bg-black dark:border-gray-700 dark:text-white`}
								required>
								<option value="">Select Payment Method</option>
								<option value="CC">Credit Card</option>
								<option value="TRF">Bank Transfer</option>
							</select>
						</div>

						<div className="">
							<div className="flex items-center">
								<input
								type="text"
								id="closerCode"
								name="closerCode"
								value={clsCode}
								onChange={(e) => setClsCode(e.target.value)}
								className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-black dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-primary/50"
								placeholder="Enter closer code"
								/>
								<button
								type="button"
								onClick={handleApplyCloserCode}
								className="ml-2 px-2 py-1 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
								>
								Check
								</button>
							</div>
						</div>
						{isCloserValid && <label className="text-green-500">Valid</label>}

						<Card className='p-8 mb-4'>
							<CardTitle className='mb-8'>Registration Fee Summary </CardTitle>
							<FormRow label='Registration Fee' amount={totals.subTotal} />
							<FormRow label='Tax' amount={totals.tax} />
							<div className="mt-4 mb-4">
								<div className="flex items-center">
									<input
									type="text"
									id="referalCode"
									name="referalCode"
									value={refCode}
									onChange={(e) => setRefCode(e.target.value)}
									className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-black dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-primary/50"
									placeholder="Enter referal code"
									/>
									<button
									type="button"
									onClick={handleApplyReferralCode}
									className="ml-2 px-2 py-1 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
									>
									Check
									</button>
								</div>
							</div>
							{isReferralValid && <label className="text-green-500">Valid</label>}

							<Separator className='mt-4' />
							<CardTitle className='mt-8'>
								<FormRow label='Booking Total' amount={totals.orderTotal} />
							</CardTitle>
						</Card>

						{paymentMethod === "TRF" && (
							<div className="space-y-2">
								<label className="block text-sm font-medium dark:text-gray-200">
								Upload Payment Proof
								<span className="text-red-500 ml-1">*</span>
								</label>
								<input
								type="file"
								name="paymentProof"
								accept="image/*"
								required
								className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-black dark:border-gray-700 dark:text-white 
									file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
									file:text-sm file:bg-[#C4A777] file:text-white
									hover:file:bg-[#B39665]"
								/>
								<p className="text-xs text-gray-500 dark:text-gray-400">
								Accepted formats: JPG, PNG, JPEG (Max 5MB)
								</p>
						  	</div>
						)}
					</div>
					<SubmitButton
						text="Register Now"
						className="mt-8 w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg transition-colors"
					/>
				</FormContainer>
			</div>
						
            {showErrorModal && (
                <ErrorModal message="Registration failed" />
            )}
		</section>
	);
}

function FormRow({ label, amount }: { label: string; amount: number }) {
    return (
        <p className='flex justify-between text-sm mb-2'>
            <span>{label}</span>
            <span>{formatCurrency(amount)}</span>
        </p>
    );
}
