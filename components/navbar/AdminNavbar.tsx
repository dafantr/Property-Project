"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

export default function AdminNavbar() {
	const pathname = usePathname();
	const adminPaths = [
		"/admin/dashboard",
		"/admin/memberOverview",
		"/admin/referralCommissions",
		"/admin/memberLoyaltyOverview",
		"/admin/downline",
	];

	const isAdminPage = adminPaths.some((path) => pathname?.startsWith(path));

	return (
		isAdminPage && (
			<nav className="px-8 py-4 flex items-center justify-center bg-white dark:bg-black shadow-sm sticky top-0 z-50 transition-colors duration-300">
				<div className="flex items-center space-x-8 overflow-x-auto max-w-[calc(100vw-200px)] no-scrollbar">
					<Link
						href="/admin/dashboard"
						className={`hover:text-[#B39665] dark:hover:text-[#C4A777] transition-colors whitespace-nowrap text-sm
								${
									pathname === "/admin/dashboard"
										? "text-[#B39665] dark:text-[#C4A777] font-semibold"
										: "text-gray-600 dark:text-white"
								}`}>
						Dashboard
					</Link>
					<Link
						href="/admin/memberOverview"
						className={`hover:text-[#B39665] dark:hover:text-[#C4A777] transition-colors whitespace-nowrap text-sm
							${
								pathname?.includes("/admin/memberOverview")
									? "text-[#B39665] dark:text-[#C4A777] font-semibold"
									: "text-gray-600 dark:text-white"
							}`}>
						Member Overview
					</Link>
					<Link
						href="/admin/referralCommissions"
						className={`hover:text-[#B39665] dark:hover:text-[#C4A777] transition-colors whitespace-nowrap text-sm
							${
								pathname?.includes("/admin/referralCommissions")
									? "text-[#B39665] dark:text-[#C4A777] font-semibold"
									: "text-gray-600 dark:text-white"
							}`}>
						Referral & Commissions
					</Link>
					<Link
						href="/admin/memberLoyaltyOverview"
						className={`hover:text-[#B39665] dark:hover:text-[#C4A777] transition-colors whitespace-nowrap text-sm
							${
								pathname?.includes("/admin/memberLoyaltyOverview")
									? "text-[#B39665] dark:text-[#C4A777] font-semibold"
									: "text-gray-600 dark:text-white"
							}`}>
						Loyalty Points & Rewards
					</Link>
					<Link
						href="/admin/downline"
						className={`hover:text-[#B39665] dark:hover:text-[#C4A777] transition-colors whitespace-nowrap text-sm
							${
								pathname?.includes("/admin/downline")
									? "text-[#B39665] dark:text-[#C4A777] font-semibold"
									: "text-gray-600 dark:text-white"
							}`}>
						Downline Tree
					</Link>
				</div>
			</nav>
		)
	);
}
