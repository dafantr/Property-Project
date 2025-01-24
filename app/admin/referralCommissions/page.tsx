'use client'

import { fetchMemberAll, fetchMemberRequests } from "@/utils/actions";
import { MemberList } from "@/app/admin/dashboard/components/MemberList";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { MemberRequests } from "@/app/admin/dashboard/components/MemberRequests";
import { CommissionHistory } from "@/app/admin/dashboard/components/CommissionHistory";
import { WithdrawalRequests } from "@/app/admin/dashboard/components/WithdrawalRequests";
import { PointDistribution } from "@/app/admin/dashboard/components/PointDistribution";
import { RedemptionHistory } from "@/app/admin/dashboard/components/RedemptionHistory";

export default function referralCommissions() {
	const [selectedTab, setSelectedTab] = useState('memberList');
	const [members, setMembers] = useState<any[]>([]);
	const [memberRequests, setMemberRequests] = useState<any[]>([]);

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
					<SelectContent>
						<SelectItem value="all">All Time</SelectItem>
						<SelectItem value="today">Today</SelectItem>
						<SelectItem value="week">This Week</SelectItem>
						<SelectItem value="month">This Month</SelectItem>
					</SelectContent>
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
					<p className="text-3xl font-bold mt-2">0</p>
				</div>
				<div className="bg-white rounded-lg shadow p-6">
					<h3 className="text-gray-600 font-medium">
						Loyalty Points Overview
					</h3>
					<p className="text-3xl font-bold mt-2">0</p>
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
