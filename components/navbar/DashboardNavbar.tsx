"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function MembershipNavbar() {
	const pathname = usePathname();
	const isDashboard = pathname?.startsWith("/dashboard");
	const { theme, setTheme } = useTheme();

	return (
		isDashboard && (
			<nav className="px-8 py-4 flex items-center justify-between bg-white dark:bg-black shadow-sm sticky top-0 z-50 transition-colors duration-300">
				<div className="flex items-center space-x-8 overflow-x-auto max-w-[calc(100vw-200px)] no-scrollbar">
					<Link
						href="/dashboard"
						className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap text-sm
								${
									pathname === "/dashboard"
										? "text-blue-600 dark:text-blue-400 font-semibold"
										: "text-gray-600 dark:text-white"
								}`}>
						Dashboard
					</Link>
					<Link
						href="/dashboard/profile"
						className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap text-sm
							${
								pathname?.includes("/profile")
									? "text-blue-600 dark:text-blue-400 font-semibold"
									: "text-gray-600 dark:text-white"
							}`}>
						Profile
					</Link>
					<Link
						href="/dashboard/referrals"
						className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap text-sm
							${
								pathname?.includes("/referrals")
									? "text-blue-600 dark:text-blue-400 font-semibold"
									: "text-gray-600 dark:text-white"
							}`}>
						Referrals & Commissions
					</Link>
					<Link
						href="/dashboard/rewards"
							className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap text-sm
							${
								pathname?.includes("/rewards")
									? "text-blue-600 dark:text-blue-400 font-semibold"
									: "text-gray-600 dark:text-white"
							}`}>
						Loyalty Points & Rewards
					</Link>
					<Link
						href="/dashboard/downline"
							className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap text-sm
							${
								pathname?.includes("/downline")
									? "text-blue-600 dark:text-blue-400 font-semibold"
									: "text-gray-600 dark:text-white"
							}`}>
						Downline Tree
					</Link>
					<Link
						href="/dashboard/contact"
							className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap text-sm
							${
								pathname?.includes("/contact")
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
