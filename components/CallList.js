"use client";

import { useGetCalls } from "@/hooks/useGetCalls";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MeetingCard from "./MeetingCard";
import Loader from "./Loader";
import { useToast } from "./ui/use-toast";

const CallList = ({ type }) => {
    const { endedCalls, upcomingCalls, callRecordings, isLoading } =
        useGetCalls();
    const { toast } = useToast();

    const [recordings, setRecordings] = useState([]);

    const router = useRouter();
    const getCalls = () => {
        switch (type) {
            case "ended":
                return endedCalls;
            case "upcoming":
                return upcomingCalls;
            case "recordings":
                return recordings;
            default:
                return [];
        }
    };

    const getNoCallsMessage = () => {
        switch (type) {
            case "ended":
                return "No Previous Calls";
            case "upcoming":
                return "No Upcoming Calls";
            case "recordings":
                return "No Recordings";
            default:
                return "";
        }
    };

    useEffect(() => {
        const fetchRecordings = async () => {
            try {
                const callData = await Promise.all(
                    callRecordings.map((meeting) => meeting.queryRecordings())
                );
                const recordings = callData
                    .filter((call) => call.recordings.length > 0)
                    .flatMap((call) => call.recordings);
                setRecordings(recordings);
            } catch (err) {
                toast({
                    title: "Try again later",
                });
            }
        };
        if (type === "recordings") fetchRecordings();
    }, [type, callRecordings]);

    if (isLoading) return <Loader />;

    const calls = getCalls();
    const noCallsMessage = getNoCallsMessage();
    return (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {calls && calls.length > 0 ? (
                calls.map((meeting) => {
                    return (
                        <MeetingCard
                            key={meeting?.id}
                            icon={
                                type === "ended"
                                    ? "/icons/previous.svg"
                                    : type === "upcoming"
                                    ? "/icons/upcoming.svg"
                                    : "/icons/recordings.svg"
                            }
                            title={
                                meeting.state?.custom.description.substring(
                                    0,
                                    26
                                ) ||
                                meeting?.filename?.substring(0, 20) ||
                                "No Description"
                            }
                            date={
                                meeting.state?.startsAt.toLocaleString() ||
                                meeting.start_time.toLocaleString()
                            }
                            isPreviousMeeting={type === "ended"}
                            buttonIcon1={
                                type === "recordings"
                                    ? "/icons/play.svg"
                                    : undefined
                            }
                            handleClick={
                                type === "recordings"
                                    ? () => router.push(`${meeting.url}`)
                                    : () =>
                                          router.push(`/meeting/${meeting.id}`)
                            }
                            link={
                                type === "recordings"
                                    ? meeting.url
                                    : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`
                            }
                            buttonText={
                                type === "recordings" ? "Play" : "Start"
                            }
                        />
                    );
                })
            ) : (
                <h1>{noCallsMessage}</h1>
            )}
        </div>
    );
};

export default CallList;
