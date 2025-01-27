'use client'

import { fetchMemberAll, fetchMemberRequests, fetchTierAll } from "@/utils/actions";
import { MemberList } from "./components/MemberList";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { MemberRequests } from "./components/MemberRequests";

export default function CMSPage() {
	const [selectedTab, setSelectedTab] = useState('memberList');
	const [members, setMembers] = useState<any[]>([]);
	const [tierList, setTierList] = useState<any[]>([]);
	const [selectedPeriod, setSelectedPeriod] = useState('all');

	useEffect(() => {
		const getMembers = async () => {
			let startDate = null;
			let endDate = new Date();

			if (selectedPeriod === 'today') {
				startDate = new Date();
				startDate.setHours(0, 0, 0, 0);
			} else if (selectedPeriod === 'week') {
				startDate = new Date();
				startDate.setDate(startDate.getDate() - 7);
			} else if (selectedPeriod === 'month') {
				startDate = new Date();
				startDate.setMonth(startDate.getMonth() - 1);
			}

			const data = await fetchMemberAll(startDate, endDate);
			setMembers(data);
		};

		getMembers();
	}, [selectedPeriod]);

	useEffect(() => {
		const getTierList = async () => {
			const data = await fetchTierAll();
			setTierList(data);
		};

		getTierList();
	}, []);

	// Calculate member statistics
	const activeMembers = members.filter(
		(member) => member.isActive === 1
	).length;
	const inactiveMembers = members.filter(
		(member) => member.isActive === 0
	).length;

	return (
		<div className="p-6 dark:bg-black">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4">
				<h1 className="text-2xl font-bold dark:text-white">Member Overview</h1>
				<Select
					defaultValue="all"
					value={selectedPeriod}
					onValueChange={setSelectedPeriod}
				>
					<SelectTrigger className="w-full sm:w-48 p-2 border rounded-md dark:bg-black dark:text-white dark:border-gray-700">
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
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
				<div className="p-4 bg-white dark:bg-black rounded-lg shadow dark:shadow-gray-800">
					<h3 className="text-gray-600 dark:text-gray-300">Total Active Member</h3>
					<p className="text-2xl font-bold dark:text-white">{activeMembers}</p>
				</div>
				<div className="p-4 bg-white dark:bg-black rounded-lg shadow dark:shadow-gray-800">
					<h3 className="text-gray-600 dark:text-gray-300">Total Inactive Member</h3>
					<p className="text-2xl font-bold dark:text-white">{inactiveMembers}</p>
				</div>
			</div>

			{/* Tabs */}
			<div className="border-b border-gray-200 dark:border-gray-700 mb-4">
				<div className="flex flex-col sm:flex-row w-full sm:w-auto">
					<button
						onClick={() => setSelectedTab('memberList')}
						className={`py-2 px-4 whitespace-nowrap w-full sm:w-auto text-center ${
							selectedTab === 'memberList'
								? 'border-b-2 border-[#B5A17C] text-[#B5A17C]'
								: 'text-gray-500 dark:text-gray-400 hover:text-[#B5A17C]'
						}`}
					>
						Member List
					</button>
					<button
						onClick={() => setSelectedTab('requests')}
						className={`py-2 px-4 whitespace-nowrap w-full sm:w-auto text-center ${
							selectedTab === 'requests'
								? 'border-b-2 border-[#B5A17C] text-[#B5A17C]'
								: 'text-gray-500 dark:text-gray-400 hover:text-[#B5A17C]'
						}`}
					>
						New Member Requests
					</button>
				</div>
			</div>

			{/* Conditional Content */}
			<div className="w-full">
				{selectedTab === 'memberList' ? (
					<MemberList initialMembers={members} tierList={tierList} />
				) : (
					<MemberRequests/>
				)}
			</div>
		</div>
	);
}
