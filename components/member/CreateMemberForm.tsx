// components/CreateMemberForm.tsx
'use client';

import FormInput from "@/components/form/FormInput";
import { SubmitButton } from "@/components/form/Buttons";
import FormContainer from "@/components/form/FormContainer";
import Select from "react-select";
import { createMemberAction} from "@/utils/actions";
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { customSelectStyles } from "./styles/styles";

export default function CreateMemberForm({ profile, citizenshipOptions }) {

    const [birthDate, setBirthDate] = useState<Date | null>(null);
    const [citizen, setSelectedCitizen] = useState<CitizenshipOption | null> (null);
    const [refCode, setRefCode] = useState<string>('');

    type CitizenshipOption = {
        value: string;
        label: string;
      };

    return (
        <section>
            <h1 className="text-2xl font-semibold mb-8 capitalize">
                Register for MDV Membership
            </h1>
            <div className="border p-8 rounded-md">
                <FormContainer action={async (prevState: any, formData: FormData) => {
                    formData.append('citizen', citizen?.value || '');
                    formData.append('birthDate', birthDate ? birthDate.toISOString() : '');
                    formData.set('referalCode', refCode);

                    // Pass the updated formData to the action
                    return createMemberAction(prevState, formData);
                }}>
                        <div className="grid md:grid-cols-1 gap-4 mt-4">
                            <FormInput type="text" name="firstName" defaultValue={profile.firstName} label="First Name" />
                            <FormInput type="text" name="lastName" defaultValue={profile.lastName} label="Last Name" />
                            <FormInput type="text" name="email" defaultValue={profile.email} label="Email Address" />
                            
                            <div className="form-group mb-2">
                                <label htmlFor="citizen" className="block mb-2 text-sm font-medium">
                                    Citizen
                                </label>
                                <Select
                                    id="citizen"
                                    options={citizenshipOptions}
                                    onChange={(option) => setSelectedCitizen(option)}
                                    placeholder="Select your citizenship"
                                    className="w-full"
                                    styles={customSelectStyles}
                                    required={true}
                                />
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="birthDate" className="block mb-2 text-sm font-medium">
                                    Date of Birth
                                </label>
                                <DatePicker
                                    id="birthDate"
                                    selected={birthDate}
                                    onChange={(date) => setBirthDate(date)}
                                    maxDate={new Date()} // Prevents selecting future dates
                                    showYearDropdown
                                    scrollableYearDropdown
                                    yearDropdownItemNumber={100} // Show 100 years in dropdown
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="Select your birth date"
                                    className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-full"
                                    required={true}
                                />
                            </div>

                            <FormInput type="tel" name="phone" label="Phone Number"/>
                            <FormInput type="text" name="address" label="Address"/>
                            <div className="form-group mb-2" >
                                <label htmlFor="gender" className="block mb-2 text-sm font-medium">
                                    Gender
                                </label>
                                <select
                                    id="gender"
                                    name="gender"
                                    className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    required={true}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <FormInput type="text" name="bankName" label="Bank Name"/>
                            <FormInput type="text" name="bankAccNum" label="Bank Account Number"/>
                            <FormInput type="text" name="bankAccName" label="Bank Account Name"/>
                            <div className="mb-2">
                                <input
                                    type="text"
                                    id="referalCode"
                                    name="referalCode"
                                    value={refCode}
                                    onChange={(e) => setRefCode(e.target.value)}
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 md:text-md"
                                    placeholder="Enter referal code (Optional)"
                                />
                            </div>
                        </div>
                        <SubmitButton text="Register Now" className="mt-8" />
                </FormContainer>
            </div>
        </section>
    );
}
