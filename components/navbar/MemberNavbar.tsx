"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

export default function MemberNavbar() {
	const pathname = usePathname();
	const memberPaths = [
		"/member/dashboard",
		"/member/profile",
		"/member/referrals",
		"/member/rewards",
		"/member/downline"
	];

	const isMemberPage = memberPaths.some(path => pathname?.startsWith(path));

	return (
		isMemberPage && (
			<nav className="px-8 py-4 flex items-center justify-center bg-white dark:bg-black shadow-sm sticky top-0 z-50 transition-colors duration-300">
				<div className="flex items-center space-x-8 overflow-x-auto max-w-[calc(100vw-200px)] no-scrollbar">
					<Link
						href="/member/dashboard"
						className={`hover:text-[#B39665] dark:hover:text-[#C4A777] transition-colors whitespace-nowrap text-sm
								${
									pathname === "/member/dashboard"
										? "text-[#B39665] dark:text-[#C4A777] font-semibold"
										: "text-gray-600 dark:text-white"
								}`}>
						Dashboard
					</Link>
					<Link
						href="/member/profile"
						className={`hover:text-[#B39665] dark:hover:text-[#C4A777] transition-colors whitespace-nowrap text-sm
							${
								pathname?.includes("/member/profile")
									? "text-[#B39665] dark:text-[#C4A777] font-semibold"
									: "text-gray-600 dark:text-white"
							}`}>
						Member Profile
					</Link>
					<Link
						href="/member/referrals"
						className={`hover:text-[#B39665] dark:hover:text-[#C4A777] transition-colors whitespace-nowrap text-sm
							${
								pathname?.includes("/member/referrals")
									? "text-[#B39665] dark:text-[#C4A777] font-semibold"
									: "text-gray-600 dark:text-white"
							}`}>
						Referrals & Commissions
					</Link>
					<Link
						href="/member/rewards"
						className={`hover:text-[#B39665] dark:hover:text-[#C4A777] transition-colors whitespace-nowrap text-sm
							${
								pathname?.includes("/member/rewards")
									? "text-[#B39665] dark:text-[#C4A777] font-semibold"
									: "text-gray-600 dark:text-white"
							}`}>
						Loyalty Points & Rewards
					</Link>
					<Link
						href="/member/downline"
						className={`hover:text-[#B39665] dark:hover:text-[#C4A777] transition-colors whitespace-nowrap text-sm
							${
								pathname?.includes("/member/downline")
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
