"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import MobileNav from "./MobileNav";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const router = useRouter();
    return (
        <nav className="flex flex-between fixed z-50 w-full bg-dark-1 px-6 py-4 lg:px-10">
            <Link href="/" className="flex items-center gap-1">
                <Image
                    src="/icons/logo.svg"
                    height={32}
                    width={32}
                    alt="BharatMeet"
                    className="max-sm:size-10"
                />
                <p className="text-[26px] font-extrabold text-white max-sm:hidden">
                    BharatMeet
                </p>
            </Link>

            <div className="flex-between gap-5">
                <DropdownMenu>
                    <div className="flex items-center">
                        <DropdownMenuTrigger className="cursor-pointer rounded-2xl text-whit bg-dark-1 px-4 py-2">
                            <Image
                                src="/icons/defaultUserImage.png"
                                alt="User"
                                width={120}
                                height={120}
                                className="rounded-full"
                            />
                        </DropdownMenuTrigger>
                    </div>
                    <DropdownMenuSeparator className="border-dark-1" />
                    <DropdownMenuContent className="border-dark-1 bg-dark-1 flex text-white">
                        <div className="flex flex-col p-2 justify-center">
                            <div
                                className="w-full flex justify-center cursor-pointer"
                                onClick={(e) => {
                                    router.push("/profile");
                                }}
                            >
                                <span>Profile</span>
                            </div>
                            <Button onClick={signOut}>Logout</Button>
                        </div>
                        <DropdownMenuSeparator className="border-dark-1" />
                    </DropdownMenuContent>
                </DropdownMenu>

                <MobileNav />
            </div>
        </nav>
    );
};

export default Navbar;
