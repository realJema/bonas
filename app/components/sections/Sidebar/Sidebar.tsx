'use client'

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Menu, ChevronRight } from "lucide-react";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <Image
                width={38}
                height={38}
                className="rounded-full ring-2 ring-white"
                src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
                alt="User Avatar"
              />
              <p className="font-medium">md_christien</p>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {["Home", "Inbox", "Dashboard", "Lists"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="block py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {item}
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
                    {[
                      "Graphics & Design",
                      "Programming & Tech",
                      "Digital Marketing",
                      "Video & Animation",
                    ].map((category, index) => (
                      <li key={index}>
                        <Link
                          href={`/category${index + 1}`}
                          className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors"
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
};

export default Sidebar;