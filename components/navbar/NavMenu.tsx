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

const components: { title: string; href: string }[] = [
    { title: "About MDV", href: "#about" },
    { title: "Gallery", href: "#gallery" },
    { title: "Villas", href: "#villas" },
    { title: "Exclusive Highlights", href: "#highlights" },
    { title: "Testimony", href: "#testimony" },
    { title: "Contact", href: "#contact" },
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
                                />
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
    ({ className, title, href, ...props }, ref) => {
        const router = useRouter();
        const pathname = usePathname(); // Get the current path

        const handleClick = async (e: React.MouseEvent) => {
            e.preventDefault();
        
            if (!href) return; // ✅ Ensure href is defined before proceeding
        
            const offset = 100; // Scroll offset
        
            // If already on the home page, scroll to the section directly
            if (pathname === "/") {
                const target = href ? document.querySelector(href) : null;
                if (target) {
                    const elementPosition = target.getBoundingClientRect().top + window.scrollY;
                    const offsetPosition = elementPosition - offset;
        
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth",
                    });
                }
            } else {
                // If on another page, navigate to the page with the hash (smooth scroll after redirect)
                if (href) {
                    await router.push(`/${href}`);
                    setTimeout(() => {
                        const target = document.querySelector(href);
                        if (target) {
                            const elementPosition = target.getBoundingClientRect().top + window.scrollY;
                            const offsetPosition = elementPosition - offset;
        
                            window.scrollTo({
                                top: offsetPosition,
                                behavior: "smooth",
                            });
                        }
                    }, 500);
                }
            }
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
                    </a>
                </NavigationMenuLink>
            </li>
        );
    }
);

ListItem.displayName = "ListItem";

export default function MobileNavMenu() {
    return (
        <div className="sm:hidden"> {/* Hide on larger screens */}
            <NavMenu />
        </div>
    );
}
