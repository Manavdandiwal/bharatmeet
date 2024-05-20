"use client";

import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Loader from "@/components/Loader";

function SignIn() {
    const router = useRouter();
    const searchParam = useSearchParams();
    const { data: session, status } = useSession();
    const { toast } = useToast();
    const [sendingOTP, setSendingOTP] = useState(false);
    const [verifyingOTP, setVerifyingOTP] = useState(false);

    useEffect(() => {
        if (status !== "unauthenticated") {
            if (session.user.role === "admin") router.push("/admin");
            else router.push("/");
        }
    }, [router, session?.user?.role, status]);
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
            toast({
                title: "Logged In successfully, redirecting",
            });
            const URL = searchParam.get("callbackUrl") || "/";
            router.push(URL);
        } else {
            toast({
                title: "Incorrect Password",
            });
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
                            {!emailVerified &&
                                (!sendingOTP ? (
                                    <button
                                        type="button"
                                        className="absolute bg-dark-2 p-3 rounded-xl hover:underline text-white text-lg"
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            setSendingOTP(true);
                                            axios
                                                .post("/api/auth/sendOTP", {
                                                    email,
                                                })
                                                .then(({ data }) => {
                                                    console.log(data);
                                                    if (optSent) {
                                                        toast({
                                                            title: "OPT has been sent again",
                                                        });
                                                    }
                                                    if (data.success) {
                                                        setOTPSent(true);
                                                    }
                                                })
                                                .catch((err) => {
                                                    console.log(err);
                                                    toast({
                                                        title: "Couldn't resend OTP, try again",
                                                    });
                                                })
                                                .finally(() => {
                                                    setSendingOTP(false);
                                                });
                                        }}
                                    >
                                        {!optSent ? "Send OTP" : "Resend OTP"}
                                    </button>
                                ) : (
                                    <span className="absolute bg-dark-2 p-3 rounded-xl text-white text-lg">
                                        Sending
                                    </span>
                                ))}

                            {optSent && !emailVerified && !sendingOTP && (
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
                                    className="text-white bg-dark-3 p-3 w-[100%] rounded-lg outline-none disabled:cursor-not-allowed"
                                    onChange={(e) => {
                                        setOTP(e.target.value);
                                    }}
                                    disabled={verifyingOTP}
                                />
                                {!verifyingOTP ? (
                                    <button
                                        type="button"
                                        className="absolute bg-dark-2 p-3 rounded-xl hover:underline text-white text-lg"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setVerifyingOTP(true);
                                            axios
                                                .post("/api/auth/verifyUser", {
                                                    email,
                                                    OTP: otp,
                                                })
                                                .then((res) => {
                                                    console.log(res);
                                                    if (res.data.success) {
                                                        setEmailVerified(true);
                                                    } else {
                                                        throw new Error(
                                                            "Wrong OTP"
                                                        );
                                                    }
                                                })
                                                .catch((err) => {
                                                    console.log(err);
                                                    toast({
                                                        title: "Wrong OTP",
                                                    });
                                                })
                                                .finally(() => {
                                                    setVerifyingOTP(false);
                                                });
                                        }}
                                    >
                                        Verify
                                    </button>
                                ) : (
                                    <span className="bg-dark-2 absolute p-3 rounded-xl text-white text-lg">
                                        Verifying
                                    </span>
                                )}
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
