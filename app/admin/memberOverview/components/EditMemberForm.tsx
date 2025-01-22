"use client";

import FormContainer from "@/components/form/FormContainer";
import FormInput from "@/components/form/FormInput";
import { updateMemberAdminAction } from "@/utils/actions";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { member, profile, tier } from "@/utils/types";

interface EditMemberFormProps {
	member: string;
	citizenshipOptions: { value: string; label: string }[];
}

export default function EditMemberForm({
	member,
	citizenshipOptions,
}: EditMemberFormProps) {
	const memberData = JSON.parse(member);

	const [citizen, setCitizen] = useState(() => {
		if (memberData.citizen) {
			return citizenshipOptions.find(
				(option) => option.value === memberData.citizen
			);
		}
		return null;
	});

	const [birthDate, setBirthDate] = useState(() => {
		if (memberData.dob) {
			return new Date(memberData.dob);
		}
		return null;
	});

	return (
		<Card className="max-w-4xl mx-auto p-6">
			<h2 className="text-2xl font-bold mb-6">Member Profile</h2>
			<FormContainer
				action={async (prevState: any, formData: FormData) => {
					formData.append("citizen", citizen?.value || "");
					formData.append(
						"birthDate",
						birthDate ? birthDate.toLocaleDateString("en-CA") : ""
					);
					return updateMemberAdminAction(prevState, formData);
				}}>
				<div className="grid md:grid-cols-2 gap-6">
					<FormInput
						type="text"
						name="memberId"
						label="Member ID"
						defaultValue={memberData.id}
					/>

					<FormInput
						type="text"
						name="membershipStatus"
						label="Membership Status"
						defaultValue={memberData.isActive == 1 ? "Active" : "Inactive"}
					/>

					<FormInput
						type="text"
						name="fullName"
						label="Full Name"
						defaultValue={
							memberData.profile?.firstName && memberData.profile?.lastName
								? `${memberData.profile.firstName} ${memberData.profile.lastName}`
								: ""
						}
					/>

					<div>
						<label className="block text-sm font-medium mb-2">Citizen</label>
						<Select
							value={citizen}
							onChange={setCitizen}
							options={citizenshipOptions}
							className="w-full"
							classNamePrefix="select"
							placeholder="Select citizenship"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2">
							Date of Birth
						</label>
						<DatePicker
							selected={birthDate}
							onChange={setBirthDate}
							className="w-full p-2 border rounded-md"
							dateFormat="yyyy-MM-dd"
							placeholderText="Select date"
						/>
					</div>

					<FormInput
						type="text"
						name="address"
						label="Address"
						defaultValue={memberData.address || ""}
					/>

					<FormInput
						type="text"
						name="gender"
						label="Gender"
						defaultValue={memberData.gender || ""}
					/>

					<FormInput
						type="email"
						name="email"
						label="Email Address"
						defaultValue={memberData.profile?.email || ""}
					/>

					<FormInput
						type="text"
						name="phone"
						label="Phone Number"
						defaultValue={memberData.phone || ""}
					/>

					<FormInput
						type="text"
						name="bankName"
						label="Bank Name"
						defaultValue={memberData.bankName || ""}
					/>

					<FormInput
						type="text"
						name="bankAccNum"
						label="Bank Account Number"
						defaultValue={memberData.bankAccNum || ""}
					/>

					<FormInput
						type="text"
						name="bankAccName"
						label="Bank Account Name"
						defaultValue={memberData.bankAccName || ""}
					/>

					<FormInput
						type="text"
						name="referralCode"
						label="Referral Code"
						defaultValue={memberData.memberId || ""}
					/>

					<FormInput
						type="text"
						name="memberJoinDate"
						label="Member Join Date"
						defaultValue={memberData.createdAt || ""}
					/>

					<FormInput
						type="text"
						name="memberLevel"
						label="Member Level"
						defaultValue={memberData.tier?.tierName || ""}
					/>

					<FormInput
						type="text"
						name="totalCommission"
						label="Total Commission"
						defaultValue={memberData.commission}
					/>

					<FormInput
						type="text"
						name="totalPoints"
						label="Total Points"
						defaultValue={memberData.point}
					/>

					<FormInput
						type="text"
						name="uplineId"
						label="Upline ID"
						defaultValue={memberData.parentId || "N/A"}
					/>

					{/* <FormInput
						type="text"
						name="totalDownline"
						label="Total Downline"
						defaultValue={member.totalDownline?.toString() || "N/A" || ""}
					/> */}

					<div className="col-span-2 flex gap-4 justify-end">
						<button
							type="button"
							className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
							Discard
						</button>
						<button
							type="submit"
							className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
							Apply changes
						</button>
					</div>
				</div>
			</FormContainer>
		</Card>
	);
}
