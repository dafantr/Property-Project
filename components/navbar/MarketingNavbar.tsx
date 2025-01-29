"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

export default function MarketingNavbar() {
	const pathname = usePathname();
	const marketingPaths = [
		"/marketing/dashboard",
		"/marketing/profile",
		"/marketing/referrals",
	];

	const isMarketingPage = marketingPaths.some(path => pathname?.startsWith(path));

	return (
		isMarketingPage && (
			<nav className="px-8 py-4 flex items-center justify-center bg-white dark:bg-black shadow-sm sticky top-0 z-50 transition-colors duration-300">
				<div className="flex items-center space-x-8 overflow-x-auto max-w-[calc(100vw-200px)] no-scrollbar">
					<Link
						href="/marketing/dashboard"
						className={`hover:text-[#B39665] dark:hover:text-[#C4A777] transition-colors whitespace-nowrap text-sm
								${
									pathname === "/marketing/dashboard"
										? "text-[#B39665] dark:text-[#C4A777] font-semibold"
										: "text-gray-600 dark:text-white"
								}`}>
						Dashboard
					</Link>
					<Link
						href="/marketing/profile"
						className={`hover:text-[#B39665] dark:hover:text-[#C4A777] transition-colors whitespace-nowrap text-sm
							${
								pathname?.includes("/marketing/profile")
									? "text-[#B39665] dark:text-[#C4A777] font-semibold"
									: "text-gray-600 dark:text-white"
							}`}>
						Member Profile
					</Link>
					<Link
						href="/marketing/referrals"
						className={`hover:text-[#B39665] dark:hover:text-[#C4A777] transition-colors whitespace-nowrap text-sm
							${
								pathname?.includes("/marketing/referrals")
									? "text-[#B39665] dark:text-[#C4A777] font-semibold"
									: "text-gray-600 dark:text-white"
							}`}>
						Referrals & Commissions
					</Link>
				</div>
			</nav>
		)
	);
}