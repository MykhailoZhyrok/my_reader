"use client"

import * as React from "react"

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {NavbarItem} from "@/lib/nav_configs/main_config";
import {usePathname} from "next/navigation";

export function Navbar({ components }: { components: NavbarItem[] }) {
    const pathname  = usePathname()
    return (
        <div className={`absolute bottom-3`}>


        <NavigationMenu viewport={false}>
            <NavigationMenuList>
                {components.map((item: NavbarItem, index: number) => (
                    <NavigationMenuItem key={index}>
                        <NavigationMenuLink href={item.href} active={pathname === item.href}>{item.title}</NavigationMenuLink>
                    </NavigationMenuItem>
                ))}

            </NavigationMenuList>
        </NavigationMenu>

        </div>
    )
}
