"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const InviteCard = ({ user, handleClick, added }) => {
    return (
        <section className="flex min-h-[180px] w-full flex-col justify-between rounded-[14px] bg-dark-2 px-5 py-8 xl:max-w-[568px]">
            <article className="flex flex-col">
                <div className="flex flex-row justify-center gap-3 flex-shrink">
                    <Image
                        src={
                            user?.profileImage || "/icons/defaultUserImage.png"
                        }
                        alt="upcoming"
                        width={40}
                        height={40}
                        className="rounded-full w-fit h-fit self-center"
                    />
                    <div className="flex justify-between w-full self-center">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-xl font-bold">{user.name}</h1>
                            <p className="text-base font-normal overflow-ellipsis">
                                {user.email}
                            </p>
                        </div>
                    </div>
                </div>
            </article>
            <article className={cn("flex justify-center relative", {})}>
                <Button
                    onClick={handleClick}
                    className="rounded bg-blue-1 px-6"
                >
                    {!added ? "Invite" : "Remove"}
                </Button>
            </article>
        </section>
    );
};

export default InviteCard;
