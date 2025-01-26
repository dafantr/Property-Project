'use client'

import { fetchCommissionStats, fetchDashboardStats, fetchMemberAll, fetchMemberRequests, fetchTierAll } from "@/utils/actions";
import { MemberList } from "@/app/admin/memberOverview/components/MemberList";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { MemberRequests } from "@/app/admin/memberOverview/components/MemberRequests";
import CommissionHistory from "@/app/admin/referralCommissions/components/CommissionHistory";
import WithdrawalRequests from "@/app/admin/referralCommissions/components/WithdrawalRequest";
import PointDistribution from "@/app/admin/memberLoyaltyOverview/components/PointDistributionHistory";
import RedemptionHistory from "@/app/admin/memberLoyaltyOverview/components/RedemptionRequest";

export default function AdminDashboard() {
	const [selectedTab, setSelectedTab] = useState('memberList');
	const [members, setMembers] = useState<any[]>([]);
	const [memberRequests, setMemberRequests] = useState<any[]>([]);
	const [tierList, setTierList] = useState<any[]>([]);
	const [selectedPeriod, setSelectedPeriod] = useState('all')
	const [stats, setStats] = useState({
		referralCommission: 0,
		loyaltyPoints: 0,
	  })

	useEffect(() => {
		const getMembers = async () => {
			const data = await fetchMemberAll();
			setMembers(data);
		};
		const getMemberRequests = async () => {
			const data = await fetchMemberRequests();
			setMemberRequests(data);
		};
		getMembers();
		getMemberRequests();
	}, []);

	const getTierList = async () => {
		const data = await fetchTierAll();
		setTierList(data);
	};
	getTierList();

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
			  default:
				startDate = null
				endDate = null
			}
	
			const data = await fetchDashboardStats(startDate, endDate)
			setStats(data)
		  } catch (error) {
			console.error('Error loading stats:', error)
		  }
		}
	
		loadStats()
	  }, [selectedPeriod])

	  const statsDisplay = [
		{
		  title: 'Referral Commission Payouts',
		  value: `Rp ${stats.referralCommission.toLocaleString()}`
		},
		{
		  title: 'Loyalty Points Overview',
		  value: `Rp ${stats.loyaltyPoints.toLocaleString()}`
		}
	  ]

	// Calculate member statistics
	const activeMembers = members.filter(
		(member) => member.isActive === 1
	).length;
	const inactiveMembers = members.filter(
		(member) => member.isActive === 0
	).length;
	const requestedMembers = memberRequests.length;

	return (
		<div className="space-y-6 p-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Admin Dashboard Overview</h1>
				<Select defaultValue="all">
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Filter by Date Period" />
					</SelectTrigger>
					<select
					className="w-full sm:w-auto border p-2 rounded dark:bg-black dark:border-gray-700 dark:text-white"
					value={selectedPeriod}
					onChange={(e) => setSelectedPeriod(e.target.value)}
					>
					<option value="all">All Time</option>
					<option value="today">Today</option>
					<option value="week">This Week</option>
					<option value="month">This Month</option>
					</select>
				</Select>
			</div>

			{/* Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="bg-white rounded-lg shadow p-6">
					<h3 className="text-gray-600 font-medium">Total Member</h3>
					<p className="text-3xl font-bold mt-2">{members.length}</p>
				</div>
				<div className="bg-white rounded-lg shadow p-6">
					<h3 className="text-gray-600 font-medium">Referral Commission Payouts</h3>
					<p className="text-3xl font-bold mt-2">{stats.referralCommission.toLocaleString()}</p>
				</div>
				<div className="bg-white rounded-lg shadow p-6">
					<h3 className="text-gray-600 font-medium">
						Loyalty Points Overview
					</h3>
					<p className="text-3xl font-bold mt-2">{stats.loyaltyPoints.toLocaleString()}</p>
				</div>
			</div>

			{/* Tabs */}
			<div className="flex gap-4 border-b">
				<button
					onClick={() => setSelectedTab('memberList')}
					className={`px-4 py-2 ${
						selectedTab === 'memberList'
							? 'border-b-2 border-[#B69C71] text-[#B69C71]'
							: 'text-gray-500 hover:text-[#B69C71]'
					} font-medium`}
				>
					Member List
				</button>
				<button
					onClick={() => setSelectedTab('requests')}
					className={`px-4 py-2 ${
						selectedTab === 'requests'
							? 'border-b-2 border-[#B69C71] text-[#B69C71]'
							: 'text-gray-500 hover:text-[#B69C71]'
					}`}
				>
					New Member Requests
				</button>
				<button
					onClick={() => setSelectedTab('commissionHistory')}
					className={`px-4 py-2 ${
						selectedTab === 'commissionHistory'
							? 'border-b-2 border-[#B69C71] text-[#B69C71]'
							: 'text-gray-500 hover:text-[#B69C71]'
					}`}
				>
					Commission History
				</button>
				<button
					onClick={() => setSelectedTab('withdrawalRequests')}
					className={`px-4 py-2 ${
						selectedTab === 'withdrawalRequests'
							? 'border-b-2 border-[#B69C71] text-[#B69C71]'
							: 'text-gray-500 hover:text-[#B69C71]'
					}`}
				>
					Withdrawal Requests
				</button>
				<button
					onClick={() => setSelectedTab('pointDistribution')}
					className={`px-4 py-2 ${
						selectedTab === 'pointDistribution'
							? 'border-b-2 border-[#B69C71] text-[#B69C71]'
							: 'text-gray-500 hover:text-[#B69C71]'
					}`}
				>
					Point Distribution
				</button>
				<button
					onClick={() => setSelectedTab('redemptionHistory')}
					className={`px-4 py-2 ${
						selectedTab === 'redemptionHistory'
							? 'border-b-2 border-[#B69C71] text-[#B69C71]'
							: 'text-gray-500 hover:text-[#B69C71]'
					}`}
				>
					Redemption History
				</button>
			</div>

			{/* Conditional Content */}
			{selectedTab === 'memberList' ? (
				<MemberList
					initialMembers={members.map((member) => ({
						...member,
						joinDate: member.profile.createdAt.toISOString().split("T")[0],
						parentId: member.parentId ?? '',
					}))}
					tierList={tierList}
				/>
			) : selectedTab === 'requests' ? (
				<MemberRequests memberRequests={memberRequests} />
			) : selectedTab === 'commissionHistory' ? (
				<CommissionHistory />
			) : selectedTab === 'withdrawalRequests' ? (
				<WithdrawalRequests />
			) : selectedTab === 'pointDistribution' ? (
				<PointDistribution />
			) : selectedTab === 'redemptionHistory' ? (
				<RedemptionHistory />
			) : null}
		</div>
	);
}
