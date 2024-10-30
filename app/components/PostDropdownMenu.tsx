"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const components = [
  {
    title: "Newsletter",
    href: "#",
    description: "Subscribe to our newsletter",
  },
  {
    title: "Purchases",
    href: "#",
    description: "View your purchase history",
  },
  {
    title: "Downloads",
    href: "#",
    description: "Access your downloads",
  },
]

export function PostDropdownMenu() {
  const router = useRouter();

  
  const handleCategoryClick = (url: string) => {
    router.push(url);
  };


  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <button
            type="submit"
            onClick={() =>
              handleCategoryClick(`/publishListing`)
            }
            className="bg-black text-white px-5 sm:px-10 py-2 sm:py-3 rounded text-xs font-semibold"
          >
            PostAd
          </button>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

 
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
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
