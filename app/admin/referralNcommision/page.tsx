'use client'

import { useState } from 'react'
import CommissionHistory from './components/CommissionHistory'
import WithdrawalRequest from './components/WithdrawalRequest'

export default function ReferralCommissionPage() {
  const [selectedTab, setSelectedTab] = useState('history')

  const stats = [
    {
      title: 'Overall Member Commission',
      value: 'Rp 25,000,000'
    },
    {
      title: 'Total Payable Commission',
      value: 'Rp 5,000,000'
    },
    {
      title: 'Total Withdrawal Requests',
      value: '21'
    },
    {
      title: 'Successful Referral Transactions',
      value: '21'
    }
  ]

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Referral Commission Overview</h1>
        <select className="border p-2 rounded">
          <option>Filter by Date Period</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-600 mb-2">{stat.title}</h3>
            <p className="text-xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <button className="bg-[#B69C6C] text-white px-4 py-2 rounded mb-6">
        Manage Commission
      </button>

      <div className="mb-6">
        <div className="border-b">
          <button
            className={`px-4 py-2 ${selectedTab === 'history' ? 'border-b-2 border-[#B69C6C]' : ''}`}
            onClick={() => setSelectedTab('history')}
          >
            Commission History
          </button>
          <button
            className={`px-4 py-2 ${selectedTab === 'withdrawal' ? 'border-b-2 border-[#B69C6C]' : ''}`}
            onClick={() => setSelectedTab('withdrawal')}
          >
            Withdrawal Request
          </button>
        </div>
      </div>

      {selectedTab === 'history' ? (
        <CommissionHistory />
      ) : (
        <WithdrawalRequest />
      )}
    </div>
  )
}
