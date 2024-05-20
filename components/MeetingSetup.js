"use client";

import {
    DeviceSettings,
    VideoPreview,
    useCall,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";

const MeetingSetup = ({ setIsSetupComplete }) => {
    const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(false);
    const call = useCall();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (isMicCamToggledOn) {
            call?.camera.disable();
            call?.microphone.disable();
        } else {
            call?.camera.enable();
            call?.microphone.enable();
        }
    }, [isMicCamToggledOn, call?.camera, call?.microphone]);
    if (!call) {
        return (
            <div className="flex items-center justify-center gap-5 flex-col">
                <div className="max-w-lg rounded-lg bg-white p-8 shadow-md">
                    <p className="text-center">
                        Meeting does not exist
                        <span className="font-bold text-red-600">
                            {" "}
                            - BharatMeet
                        </span>
                    </p>
                </div>
                <span className="bg-dark-2 text-white p-2 rounded-xl my-3">
                    <Link href="/">Go back to Home Page</Link>
                </span>
            </div>
        );
    }

    const notALlowed =
        !session ||
        !call.state.members.find((m) => {
            console.log(m);
            return m.user_id === session?.user.id;
        });

    if (notALlowed) {
        return (
            <div className="flex items-center justify-center">
                <div className="max-w-lg rounded-lg bg-white p-8 shadow-md">
                    <p className="text-center">
                        You Are Not Allowed To Join This Meeting
                        <span className="font-bold text-red-600">
                            {" "}
                            - BharatMeet
                        </span>
                    </p>
                </div>
            </div>
        );
    }

    const notStarted = Date.now() < new Date(call.state.startsAt);
    if (notStarted) {
        return (
            <div className="flex items-center justify-center gap-5 flex-col">
                <div className="max-w-lg rounded-lg bg-white p-8 shadow-md">
                    <p className="text-center">
                        Meeting has not started yet
                        <span className="font-bold text-red-600">
                            {" "}
                            - BharatMeet
                        </span>
                    </p>
                </div>
                <span className="bg-dark-2 text-white p-2 rounded-xl my-3">
                    <Link href="/">Go back to Home Page</Link>
                </span>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
            <h1 className="text-2xl font-bold">Setup</h1>
            <VideoPreview />
            <div className="flex h-16 items-center justify-center gap-3">
                <label className="flex items-center justify-center gap-2 font-medium">
                    <input
                        type="checkbox"
                        checked={isMicCamToggledOn}
                        onChange={(e) => {
                            setIsMicCamToggledOn(e.target.checked);
                        }}
                    />
                    Join with mic and camera off
                </label>
                <DeviceSettings />
            </div>
            <Button
                className="rounded-md bg-green-500 px-4 py-2.5"
                onClick={() => {
                    call.join();
                    setIsSetupComplete(true);
                }}
            >
                Join Meeting
            </Button>
        </div>
    );
};

export default MeetingSetup;
