'use client'

import { useState, useEffect } from 'react'
import { fetchCommissionStats } from '@/utils/actions'
import CommissionHistory from './components/CommissionHistory'
import WithdrawalRequest from './components/WithdrawalRequest'

export default function ReferralCommissionPage() {
  const [selectedTab, setSelectedTab] = useState('history')
  const [selectedPeriod, setSelectedPeriod] = useState('all')
  const [stats, setStats] = useState({
    overallCommission: 0,
    payableCommission: 0,
    withdrawalRequests: 0,
    successfulTransactions: 0
  })

  useEffect(() => {
    const loadStats = async () => {
      try {
        let startDate, endDate;
        const now = new Date()

        switch (selectedPeriod) {
          case 'today':
            startDate = new Date(now.setHours(0, 0, 0, 0))
            endDate = new Date(now.setHours(23, 59, 59, 999))
            break
          case 'week':
            startDate = new Date(now.setDate(now.getDate() - 7))
            endDate = new Date()
            break
          case 'month':
            startDate = new Date(now.setMonth(now.getMonth() - 1))
            endDate = new Date()
            break
          case 'year':
            startDate = new Date(now.setFullYear(now.getFullYear() - 1))
            endDate = new Date()
            break
          default:
            startDate = null
            endDate = null
        }

        const data = await fetchCommissionStats(startDate, endDate)
        setStats(data)
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    }

    loadStats()
  }, [selectedPeriod])

  const statsDisplay = [
    {
      title: 'Overall Member Commission',
      value: `Rp ${stats.overallCommission.toLocaleString()}`
    },
    {
      title: 'Total Payable Commission',
      value: `Rp ${stats.payableCommission.toLocaleString()}`
    },
    {
      title: 'Total Withdrawal Requests',
      value: stats.withdrawalRequests.toString()
    },
    {
      title: 'Successful Referral Transactions',
      value: stats.successfulTransactions.toString()
    }
  ]

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Referral Commission Overview</h1>
        <select
          className="border p-2 rounded"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {statsDisplay.map((stat, index) => (
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
