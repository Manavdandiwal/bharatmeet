"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useState } from "react";
import ConfirmationModal from "@/components/ConfirmationModal";

const UserCard = ({ user, handleClick }) => {
    const [remove, setRemove] = useState(false);
    const { toast } = useToast();

    return (
        <section className="flex min-h-[258px] w-full flex-col justify-between rounded-[14px] bg-dark-1 px-5 py-8 xl:max-w-[568px]">
            <article className="flex flex-col gap-5">
                <div className="flex flex-row justify-center gap-8">
                    <Image
                        src={user.profileImage || "/icons/defaultUserImage.png"}
                        alt="upcoming"
                        width={70}
                        height={70}
                        className="rounded-full w-fit h-fit"
                    />
                    <div className="flex justify-between w-full self-center">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl font-bold">{user.name}</h1>
                            <p className="text-base font-normal">
                                {user.email}
                            </p>
                        </div>
                    </div>
                </div>
            </article>
            <article className={cn("flex justify-center relative", {})}>
                <Button
                    onClick={() => {
                        setRemove(true);
                    }}
                    className="rounded bg-blue-1 px-6"
                >
                    Remove User
                </Button>
            </article>
            <ConfirmationModal
                isOpen={remove}
                onClose={() => setRemove(false)}
                title="Remove User?"
                className=""
                handleYes={async () => {
                    const res = await handleClick();
                    if (res) setRemove(false);
                }}
                handleNo={() => setRemove(false)}
            >
                <h2
                    className={cn("text-xl font-normal leading-[42px] mx-auto")}
                >
                    Do you want to remove user:{" "}
                    <span className="font-bold italic">{user.name}</span>
                </h2>
            </ConfirmationModal>
        </section>
    );
};

export default UserCard;
