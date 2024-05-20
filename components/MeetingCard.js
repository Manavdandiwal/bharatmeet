"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { avatarImages } from "@/constants";
import { useToast } from "./ui/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";

const MeetingCard = ({
    icon,
    title,
    date,
    isPreviousMeeting,
    buttonIcon1,
    handleClick,
    link,
    buttonText,
    participants,
}) => {
    const { toast } = useToast();
    const [showParticipants, setShowParticipants] = useState(false);
    console.log(participants);
    return (
        <section className="flex min-h-[258px] w-full flex-col justify-between rounded-[14px] bg-dark-1 px-5 py-8 xl:max-w-[568px]">
            <article className="flex flex-col gap-5">
                <Image src={icon} alt="upcoming" width={28} height={28} />
                <div className="flex justify-between">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold">{title}</h1>
                        <p className="text-base font-normal">{date}</p>
                    </div>
                </div>
            </article>
            <article className={cn("flex justify-center relative", {})}>
                <div className="relative flex w-full max-sm:hidden">
                    <Button
                        onClick={() => {
                            setShowParticipants(true);
                        }}
                    >
                        Show Participants
                    </Button>
                </div>
                {!isPreviousMeeting && (
                    <div className="flex gap-2">
                        <Button
                            onClick={handleClick}
                            className="rounded bg-blue-1 px-6"
                        >
                            {buttonIcon1 && (
                                <Image
                                    src={buttonIcon1}
                                    alt="feature"
                                    width={20}
                                    height={20}
                                />
                            )}
                            &nbsp; {buttonText}
                        </Button>
                        <Button
                            onClick={() => {
                                navigator.clipboard.writeText(link);
                                toast({
                                    title: "Meeting code Copied",
                                });
                            }}
                            className="bg-dark-4 px-6"
                        >
                            <Image
                                src="/icons/copy.svg"
                                alt="feature"
                                width={20}
                                height={20}
                            />
                            &nbsp; Copy Code
                        </Button>
                    </div>
                )}
            </article>
            <Dialog
                open={showParticipants}
                onOpenChange={() => {
                    setShowParticipants(false);
                }}
            >
                <DialogContent className="flex w-full max-w-[520px] h-full overflow-auto max-h-[550px] flex-col gap-6 border-none bg-dark-1 px=6 py-9 text-white">
                    <div className="flex flex-col gap-6">
                        <h1 className={cn("text-3xl font-bold leading-[42px]")}>
                            Participants
                        </h1>
                        <div>
                            {participants.map((element, index) => (
                                <h1 key={index}>{element.user.name}</h1>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
};

export default MeetingCard;
