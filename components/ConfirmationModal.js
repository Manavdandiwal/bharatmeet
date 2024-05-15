import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const ConfirmationModal = ({
    isOpen,
    onClose,
    title,
    className,
    handleYes,
    handleNo,
    children,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="flex w-full max-w-[520px] flex-col gap-6 border-none bg-dark-1 px=6 py-9 text-white">
                <div className="flex flex-col gap-6 justify-center">
                    <h1
                        className={cn(
                            "text-3xl font-bold leading-[42px] mx-auto",
                            className
                        )}
                    >
                        {title}
                    </h1>
                    {children}
                    <div className="flex flex-row gap-10 justify-center">
                        <Button
                            className="bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                            onClick={handleYes}
                        >
                            Yes
                        </Button>
                        <Button
                            className="bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                            onClick={handleNo}
                        >
                            No
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmationModal;
