import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const AddUserModal = ({
    isOpen,
    onClose,
    title,
    className,
    handleClick,
    buttonText,
    children,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="flex w-full max-w-[520px] flex-col gap-6 border-none bg-dark-1 px=6 py-9 text-white">
                <div className="flex flex-col gap-6">
                    <h1
                        className={cn(
                            "text-3xl font-bold leading-[42px]",
                            className
                        )}
                    >
                        {title}
                    </h1>
                    {children}
                    <Button
                        className="bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                        onClick={handleClick}
                    >
                        {buttonText}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddUserModal;
