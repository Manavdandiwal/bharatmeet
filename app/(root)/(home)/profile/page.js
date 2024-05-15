"use client";

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useState } from "react";
import AddUserModal from "@/components/AddUser";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";

const Profile = () => {
    const { data: session, status } = useSession();
    const [changePassword, setChangePassword] = useState(false);
    const [password, setPassword] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    if (status === "loading") return <Loader />;

    return (
        <section className="flex size-full flex-col gap-10 text-white">
            <div className="h-[300px] w-full rounded-[20px]">
                <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-extrabold lg:text-7xl">
                            {session.user.name}
                        </h1>
                        <p className="text-lg p-4 font-medium text-sky-1 lg:text-2xl">
                            {session.user.email}
                        </p>
                        <div className="p-4">
                            <Button
                                className="text-2xl text-sky-1 bg-dark-3"
                                onClick={() => {
                                    setChangePassword(true);
                                }}
                            >
                                Change Password
                            </Button>
                            <AddUserModal
                                isOpen={changePassword}
                                onClose={() => {
                                    setChangePassword(false);
                                }}
                                buttonText="Change Password"
                                title="Change Password"
                                className=""
                                handleClick={async () => {
                                    if (
                                        password.newPassword !==
                                        password.confirmPassword
                                    ) {
                                        toast({
                                            title: "New password and confirm password are not the same",
                                        });
                                        return;
                                    }
                                    if (
                                        password.newPassword ===
                                        password.oldPassword
                                    ) {
                                        toast({
                                            title: "New password should not be same as old password",
                                        });
                                        return;
                                    }
                                    const res = await axios.post(
                                        "/api/changePassword",
                                        {
                                            user: session.user,
                                            oldPassword: password.oldPassword,
                                            newPassword: password.newPassword,
                                        }
                                    );
                                    console.log(res);
                                    const { data } = res;
                                    if (data.sucess) {
                                        toast({
                                            title: "Password changed successfully",
                                        });
                                    } else {
                                        toast({
                                            title:
                                                data.message ||
                                                "Password does not match",
                                        });
                                    }
                                }}
                            >
                                <div className="flex flex-col gap-2.5">
                                    <label className="text-base text-normal leading-[22px] text-sky-2">
                                        Old Password
                                    </label>
                                    <Input
                                        type="password"
                                        className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                                        onChange={(e) => {
                                            setPassword({
                                                ...password,
                                                oldPassword: e.target.value,
                                            });
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col gap-2.5">
                                    <label className="text-base text-normal leading-[22px] text-sky-2">
                                        New Password
                                    </label>
                                    <Input
                                        className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                                        type="password"
                                        onChange={(e) => {
                                            setPassword({
                                                ...password,
                                                newPassword: e.target.value,
                                            });
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col gap-2.5">
                                    <label className="text-base text-normal leading-[22px] text-sky-2">
                                        Confirm New Password
                                    </label>
                                    <Input
                                        className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                                        type="password"
                                        onChange={(e) => {
                                            setPassword({
                                                ...password,
                                                confirmPassword: e.target.value,
                                            });
                                        }}
                                    />
                                </div>
                            </AddUserModal>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Profile;
