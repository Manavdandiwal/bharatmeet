import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import InviteCard from "@/components/inviteCard";
import { Button } from "./ui/button";

const InviteModal = ({
    isOpen,
    onClose,
    title,
    handleClick,
    buttonText,
    userList,
    invitedUsers,
    updateInvitedUsers,
    currUser,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="flex w-full h-[85%] max-w-[1100px] flex-col gap-6 border-none bg-dark-1 px=6 py-9 text-white">
                <div className="flex flex-col gap-6">
                    <h1
                        className={cn(
                            "text-3xl font-bold leading-[42px] mx-auto"
                        )}
                    >
                        {title}
                    </h1>
                    <div className="h-[55vh] overflow-auto">
                        <div className="grid grid-cols-3 gap-5 overflow-hidden ">
                            {invitedUsers.map((user, index) => {
                                return (
                                    <InviteCard
                                        user={user}
                                        key={index}
                                        handleClick={() => {
                                            if (invitedUsers.includes(user)) {
                                                alert("user removed");
                                                updateInvitedUsers((prev) =>
                                                    prev.filter(
                                                        (curr) => curr !== user
                                                    )
                                                );
                                            } else {
                                                alert("user added");
                                                updateInvitedUsers([
                                                    ...invitedUsers,
                                                    user,
                                                ]);
                                            }
                                        }}
                                        added={true}
                                    />
                                );
                            })}
                            {userList.map((user, index) => {
                                if (invitedUsers.includes(user)) return null;
                                if (user.email == currUser.email) return null;
                                if (user.role == "admin") return null;
                                return (
                                    <InviteCard
                                        user={user}
                                        key={index}
                                        handleClick={() => {
                                            if (invitedUsers.includes(user)) {
                                                alert("user removed");
                                                updateInvitedUsers((prev) =>
                                                    prev.filter(
                                                        (curr) => curr !== user
                                                    )
                                                );
                                            } else {
                                                updateInvitedUsers([
                                                    ...invitedUsers,
                                                    user,
                                                ]);
                                            }
                                        }}
                                        added={false}
                                    />
                                );
                            })}
                        </div>
                        {userList.length == 1 && (
                            <h1 className="text-4xl">No user</h1>
                        )}
                    </div>

                    <Button
                        className="bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0 w-[30%] mx-auto"
                        onClick={handleClick}
                    >
                        {buttonText}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InviteModal;
