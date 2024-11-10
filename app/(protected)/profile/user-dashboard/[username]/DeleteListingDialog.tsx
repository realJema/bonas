"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Trash2, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteListing } from "@/actions/deleteListing";
import { Button } from "@/components/ui/button";

interface DeleteListingDialogProps {
  listingId: string;
  username: string;
  onDeleteSuccess?: () => void;
}

export default function DeleteListingDialog({
  listingId,
  username,
  onDeleteSuccess,
}: DeleteListingDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteListing(listingId, username);

      if (result.success) {
        toast.success("Listing deleted successfully");
        onDeleteSuccess?.();
        setIsOpen(false); // Only close after successful deletion
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error in handleDelete:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isDeleting) {
      setIsOpen(newOpen);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={isDeleting}
          className="h-7 w-7 bg-white hover:bg-gray-100 p-1.5 rounded-full shadow-sm absolute -top-4 left-8"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Listing</AlertDialogTitle>
          <AlertDialogDescription className="text-black">
            Are you sure you want to delete this listing? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isDeleting}
            className="text-black hover:bg-black hover:text-white transition-colors duration-200 border-2"
          >
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white"
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Deleting...</span>
              </div>
            ) : (
              "Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
