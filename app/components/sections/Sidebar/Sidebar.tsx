"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Menu, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const [open, setOpen] = React.useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Inbox", href: "/inbox" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Lists", href: "/lists" },
  ];

  const categories = [
    "Graphics & Design",
    "Programming & Tech",
    "Digital Marketing",
    "Video & Animation",
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="border-0 bg-transparent p-0"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6 cursor-pointer" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className={cn("w-64 p-0", className)}
        {...props}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="relative h-[38px] w-[38px] overflow-hidden">
                <Image
                  fill
                  src="/api/placeholder/38/38"
                  alt="User Avatar"
                  className="rounded-full ring-2 ring-primary object-cover"
                  priority
                />
              </div>
              <p className="font-medium">md_christien</p>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="flex items-center py-2 px-3 rounded-lg hover:bg-accent transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="categories">
                <AccordionTrigger className="py-2 px-3">
                  Browse categories
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="pl-4">
                    {categories.map((category, index) => (
                      <li key={category}>
                        <Link
                          href={`/category/${index + 1}`}
                          className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-accent transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          <span>{category}</span>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default Sidebar;
