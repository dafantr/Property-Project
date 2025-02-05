"use client";
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation"; // Import necessary hooks

const components: { title: string; href: string; description: string }[] = [
    {
        title: "About MDV",
        href: "#about",
        description:
            "Discover our vision, mission, and what makes MDV a luxury villa destination.",
    },
    {
        title: "Gallery",
        href: "#gallery",
        description:
            "Explore stunning visuals of our properties, facilities, and the breathtaking scenery surrounding MDV.",
    },
    {
        title: "Villas",
        href: "#villas",
        description:
            "Discover our exclusive villa collections, designed for comfort, elegance, and an unforgettable stay.",
    },
    {
        title: "Exclusive Highlights",
        href: "#highlights",
        description: "Uncover the unique features and premium amenities that set MDV apart from the rest.",
    },
    {
        title: "Testimony",
        href: "#testimony",
        description:
            "Hear from our valued guests about their memorable experiences at MDV.",
    },
    {
        title: "Contact",
        href: "#contact",
        description:
            "Get in touch with us for bookings, inquiries, or personalized assistance.",
    },
];

export default function GeneralNavbar() {
    const pathname = usePathname();
    const router = useRouter();
    const excludeAdminPaths = [
        "/admin/dashboard",
        "/admin/memberOverview",
        "/admin/referralCommissions",
        "/admin/memberLoyaltyOverview",
        "/admin/downline",
        "/admin/generalVariable",
        "/admin/manageCommission",
    ];

    const isExcludedPage = excludeAdminPaths.some((path) => pathname?.startsWith(path));

    const handleScroll = async (e: React.MouseEvent, href: string) => {
        e.preventDefault();

        if (pathname !== "/") {
            // If not on the homepage, navigate to the page with hash
            await router.push(`/${href}`);
        }

        // Ensure smooth scroll if on the same page or after navigating
        setTimeout(() => {
            const target = document.querySelector(href);
            if (target) {
                const windowHeight = window.innerHeight;
                const elementHeight = target.getBoundingClientRect().height;
                const elementPosition = target.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - (windowHeight / 2) + (elementHeight / 2) - 80; // Adjust offset for visibility

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                });
            }
        }, pathname !== "/" ? 500 : 0); // Add delay if navigating to another page
    };

    // Scroll to the target section after the page has loaded
    useEffect(() => {
        if (pathname && pathname !== "/") {
            const hash = window.location.hash;
            if (hash) {
                const target = document.querySelector(hash);
                if (target) {
                    const windowHeight = window.innerHeight;
                    const elementHeight = target.getBoundingClientRect().height;
                    const elementPosition = target.getBoundingClientRect().top + window.scrollY;
                    const offsetPosition = elementPosition - (windowHeight / 2) + (elementHeight / 2) - 80; // Adjust offset for visibility

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth",
                    });
                }
            }
        }
    }, [pathname]); // Re-run when the pathname changes

    return (
        !isExcludedPage && (
            <nav className="hidden sm:flex lg:block px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-center bg-white dark:bg-black shadow-sm sticky top-0 z-50 transition-colors duration-300">
                <div className="flex items-center justify-start sm:justify-center space-x-4 sm:space-x-8 overflow-x-auto w-full no-scrollbar">
                    {components.map((component) => (
                        <a
                            key={component.title}
                            href={component.href}
                            onClick={(e) => handleScroll(e, component.href)}
                            className={`hover:text-[#B39665] dark:hover:text-[#C4A777] transition-colors whitespace-nowrap text-xs sm:text-sm`}
                        >
                            {component.title}
                        </a>
                    ))}
                </div>
            </nav>
        )
    );
}
