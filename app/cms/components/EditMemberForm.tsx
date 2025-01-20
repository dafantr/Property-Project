'use client'

import FormContainer from '@/components/form/FormContainer'
import FormInput from '@/components/form/FormInput'
import { updateMemberAction } from '@/utils/actions'
import { Card } from '@/components/ui/card'
import { useState } from 'react'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

interface EditMemberFormProps {
  member: any
  citizenshipOptions: { value: string; label: string }[]
}

export default function EditMemberForm({ member, citizenshipOptions }: EditMemberFormProps) {
  const [citizen, setCitizen] = useState(() => {
    if (member.profile.citizen) {
      return citizenshipOptions.find(option => option.value === member.profile.citizen)
    }
    return null
  })

  const [birthDate, setBirthDate] = useState(() => {
    if (member.profile.dob) {
      return new Date(member.profile.dob)
    }
    return null
  })

  return (
    <Card className="max-w-4xl mx-auto p-6">
      <FormContainer
        action={async (prevState: any, formData: FormData) => {
          formData.append("citizen", citizen?.value || "")
          formData.append(
            "birthDate",
            birthDate ? birthDate.toLocaleDateString('en-CA') : ""
          )
          formData.append("memberId", member.id)
          return updateMemberAction(prevState, formData)
        }}
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Citizenship</label>
            <Select
              value={citizen}
              onChange={setCitizen}
              options={citizenshipOptions}
              className="w-full"
              classNamePrefix="select"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Date of Birth</label>
            <DatePicker
              selected={birthDate}
              onChange={setBirthDate}
              className="w-full p-2 border rounded-md"
              dateFormat="yyyy-MM-dd"
            />
          </div>

          <FormInput
            type="text"
            name="address"
            label="Address"
            defaultValue={member.profile.address}
          />

          <FormInput
            type="text"
            name="phone"
            label="Phone"
            defaultValue={member.profile.phone}
          />

          <FormInput
            type="text"
            name="bankName"
            label="Bank Name"
            defaultValue={member.profile.bankName}
          />

          <FormInput
            type="text"
            name="bankAccNum"
            label="Bank Account Number"
            defaultValue={member.profile.bankAccNum}
          />

          <FormInput
            type="text"
            name="bankAccName"
            label="Bank Account Name"
            defaultValue={member.profile.bankAccName}
          />

          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Update Profile
            </button>
          </div>
        </div>
      </FormContainer>
    </Card>
  )
}