"use client"
import Image from "next/image"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../@/components/ui/dialog"
import CoverOption from "../_Shared/CoverOption"

import { useState } from "react"
import { Button } from "../../components/ui/button"

function CoverPicker({ children, value, onChange }) {
  const [selectedCover, setSelectedCover] = useState(value || "");

  const handleUpdate = () => {
    if (onChange) {
      onChange(selectedCover); // send selected cover back to parent
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full ">
          {children}
        </div>
      </DialogTrigger>
      <DialogContent className="w-[50vw] h-[50vh] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl">
        <DialogHeader>
          <DialogTitle>Update Cover</DialogTitle>
          <DialogDescription >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-3">
              {CoverOption.map((cover, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedCover(cover.imageUrl)}
                  className={`relative group cursor-pointer ${
                    selectedCover === cover.imageUrl ? "border-2 border-blue-500" : ""
                  } p-1 rounded-md`}
                >
                  <Image
                    src={cover.imageUrl}
                    width={200}
                    height={140}
                    alt="coverimg"
                    className="h-[70px] w-full rounded-md object-cover cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out"
                  />
                </div>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={handleUpdate}>
              Update
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default CoverPicker
