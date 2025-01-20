"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

export default function AdminNavbar() {
	const pathname = usePathname();
	const adminPaths = [
		"/admin",
		"/admin/dashboard",
		"/admin/memberOverview",
		// "/member/referrals",
		// "/member/rewards",
		// "/member/downline",
		// "/member/contact"
	];

	const isMemberPage = adminPaths.some((path) => pathname?.startsWith(path));

	return (
		isMemberPage && (
			<nav className="px-8 py-4 flex items-center justify-center bg-white dark:bg-black shadow-sm sticky top-0 z-50 transition-colors duration-300">
				<div className="flex items-center space-x-8 overflow-x-auto max-w-[calc(100vw-200px)] no-scrollbar">
					<Link
						href="/admin/dashboard"
						className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap text-sm
								${
									pathname === "/member/dashboard"
										? "text-blue-600 dark:text-blue-400 font-semibold"
										: "text-gray-600 dark:text-white"
								}`}>
						Dashboard
					</Link>
					<Link
						href="/admin/memberOverview"
						className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap text-sm
							${
								pathname?.includes("/admin/memberOverview")
									? "text-blue-600 dark:text-blue-400 font-semibold"
									: "text-gray-600 dark:text-white"
							}`}>
						Member
					</Link>
					<Link
						href="/member/referrals"
						className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap text-sm
							${
								pathname?.includes("/member/referrals")
									? "text-blue-600 dark:text-blue-400 font-semibold"
									: "text-gray-600 dark:text-white"
							}`}>
						Referrals & Commissions
					</Link>
					<Link
						href="/member/rewards"
						className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap text-sm
							${
								pathname?.includes("/member/rewards")
									? "text-blue-600 dark:text-blue-400 font-semibold"
									: "text-gray-600 dark:text-white"
							}`}>
						Loyalty Points & Rewards
					</Link>
					<Link
						href="/member/downline"
						className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap text-sm
							${
								pathname?.includes("/member/downline")
									? "text-blue-600 dark:text-blue-400 font-semibold"
									: "text-gray-600 dark:text-white"
							}`}>
						Downline Tree
					</Link>
					<Link
						href="/member/contact"
						className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap text-sm
							${
								pathname?.includes("/member/contact")
									? "text-blue-600 dark:text-blue-400 font-semibold"
									: "text-gray-600 dark:text-white"
							}`}>
						Contact
					</Link>
				</div>
			</nav>
		)
	);
}
