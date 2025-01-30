"use client";

import { useRouter, usePathname } from "next/navigation"; // Import necessary hooks
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import React from "react";

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

function NavMenu() {
    return (
        <NavigationMenu className="relative z-[100]">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Overview</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[300px] md:grid-cols-1 lg:w-[400px]">
                            {components.map((component) => (
                                <ListItem
                                    key={component.title}
                                    title={component.title}
                                    href={component.href}
                                >
                                    {component.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, href, children, ...props }, ref) => {
    const router = useRouter();
    const pathname = usePathname(); // Get the current path

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();

        if (pathname !== "/") {
            // Redirect to the home page with the hash
            await router.push(`/${href}`);
        }

        // Use a timeout to ensure the scroll happens after the page is rendered
        setTimeout(() => {
            const target = document.querySelector(href || "");
            if (target) {
                const windowHeight = window.innerHeight;
                const elementHeight = target.getBoundingClientRect().height;
                const elementPosition = target.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - (windowHeight / 2) + (elementHeight / 2);

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                });
            }
        }, pathname !== "/" ? 500 : 0); // Add delay if navigating to another page
    };

    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    onClick={handleClick}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});

ListItem.displayName = "ListItem";

export default NavMenu;