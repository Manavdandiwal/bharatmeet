"use client";

import {
    StreamCall,
    StreamTheme,
    useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import MeetingSetup from "@/components/MeetingSetup";
import MeetingRoom from "@/components/MeetingRoom";
import Loader from "@/components/Loader";
import { useGetCallByID } from "@/hooks/useGetCallByID";

const Meeting = (props) => {
    const { data: session, status } = useSession();
    const { id } = props.params;
    console.log("PROPS: ");
    console.log(id);
    const [isSetupComplete, setIsSetupComplete] = useState(false);

    const { call, isCallLoading } = useGetCallByID(id);
    const { useParticipants } = useCallStateHooks();

    useEffect(() => {
        return () => {
            call?.camera.disable();
            call?.microphone.disable();
        };
    });

    const participants = useParticipants;

    if (status === "loading" || isCallLoading) return <Loader />;

    return (
        <main className="h-screen w-full">
            <StreamCall call={call}>
                <StreamTheme>
                    {!isSetupComplete ? (
                        <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
                    ) : (
                        <MeetingRoom />
                    )}
                </StreamTheme>
            </StreamCall>
        </main>
    );
};

export default Meeting;
