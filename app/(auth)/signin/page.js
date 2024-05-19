"use client";

import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

function SignIn() {
    const router = useRouter();
    const searchParam = useSearchParams();
    const { status } = useSession();
    const { toast } = useToast();

    useEffect(() => {
        if (status !== "unauthenticated") router.push("/");
    }, []);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailVerified, setEmailVerified] = useState(false);
    const [otp, setOTP] = useState("");
    const [optSent, setOTPSent] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        if (!emailVerified) {
            toast({
                title: "Verify you email",
            });
            return;
        }

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (!result.error) {
            console.log(searchParam);
            const URL = searchParam.get("callbackUrl") || "/";
            console.log(URL);
            router.push(URL);
        } else {
            toast({
                title: "Incorrect Credentials",
            });
            setEmail("");
            setPassword("");
            console.error("Sign-in failed:", result.error);
        }
    }

    return (
        <div className="h-[100vh] flex bg-dark-1">
            <div className="mx-auto p-10 py-15">
                <div className="bg-dark-2 px-10 py-15 rounded-3xl">
                    <h1 className="text-8xl m-auto my-5 bg-gradient-to-r from-pink-200 to-rose-200 inline-block text-transparent bg-clip-text">
                        BHARATMEET
                    </h1>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col align-center p-10 rounded-lg"
                    >
                        <div className="mx-auto p-2 w-[80%]">
                            <label htmlFor="email" className="hidden">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="john@gmail.com"
                                className="text-white bg-dark-3 p-3 w-[100%] disabled:cursor-not-allowed rounded-lg outline-none disabled:border-0 disabled:bg-blue-gray-50"
                                value={email}
                                disabled={emailVerified}
                                onChange={(e) => {
                                    setOTPSent(false);
                                    setEmail(e.target.value);
                                }}
                                required
                            />
                            {!emailVerified && (
                                <button
                                    type="button"
                                    className="absolute bg-dark-2 p-3 rounded-xl hover:underline text-white text-lg"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        axios
                                            .post("/api/auth/sendOTP", {
                                                email,
                                            })
                                            .then(({ data }) => {
                                                console.log(data);
                                                if (data.success) {
                                                    setOTPSent(true);
                                                }
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                                toast({
                                                    title: err.response.data
                                                        .message,
                                                });
                                            });
                                    }}
                                >
                                    {!optSent ? "Send OTP" : "Resend OTP"}
                                </button>
                            )}

                            {optSent && !emailVerified && (
                                <p className="text-slate-300 px-2">
                                    OTP has been sent to your email
                                </p>
                            )}
                            {/* <button type="button">Resend OTP</button> */}
                        </div>

                        {optSent && !emailVerified && (
                            <div className="mx-auto p-2 w-[80%]">
                                <label htmlFor="otp" className="hidden">
                                    OTP
                                </label>
                                <input
                                    type="text"
                                    placeholder="otp"
                                    value={otp}
                                    className="text-white bg-dark-3 p-3 w-[100%] rounded-lg outline-none"
                                    onChange={(e) => {
                                        setOTP(e.target.value);
                                    }}
                                />
                                <button
                                    type="button"
                                    className="absolute bg-dark-2 p-3 rounded-xl hover:underline text-white text-lg"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        axios
                                            .post("/api/auth/verifyUser", {
                                                email,
                                                OTP: otp,
                                            })
                                            .then((res) => {
                                                console.log(res);
                                                if (res.data.success) {
                                                    setEmailVerified(true);
                                                }
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                                toast({
                                                    title: err.response.data
                                                        .message,
                                                });
                                            });
                                    }}
                                >
                                    Verify
                                </button>
                            </div>
                        )}

                        <div className="mx-auto p-2 w-[80%]">
                            <label htmlFor="password" className="hidden">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Password"
                                name="password"
                                value={password}
                                className="text-white bg-dark-3 p-3 w-[100%] rounded-lg outline-none disabled:cursor-not-allowed disabled:border-0 disabled:bg-blue-gray-50"
                                disabled={!emailVerified}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-dark-2 text-white p-3 rounded-xl hover:underline text-2xl"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
