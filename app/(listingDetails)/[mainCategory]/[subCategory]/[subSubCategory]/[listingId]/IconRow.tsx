import React from 'react';
import { Heart, Share2, MoreHorizontal } from "lucide-react";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const IconRow = () => {
  return (
    <div className="flex items-center md:space-x-2">
        <Bars3Icon className="h-6 w-6 cursor-pointer" />
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
              <Heart className="h-5 w-5 text-gray-800 cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>34</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <Button variant="outline" size="icon" className="bg-white border-gray-300">
        <Share2 className="h-4 w-4" />
      </Button>
      
      <Button variant="outline" size="icon" className="bg-white border-gray-300">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default IconRow;