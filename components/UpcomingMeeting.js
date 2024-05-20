"use client";

import { useGetCalls } from "@/hooks/useGetCalls";
import Loader from "./Loader";
import { useSession } from "next-auth/react";

const UpcomingMeeting = () => {
    const { upcomingCalls, isLoading } = useGetCalls();
    const { data: session } = useSession();
    console.log(session.user);

    if (isLoading) return <Loader />;
    if (upcomingCalls.length == 0) return <>No Upcoming Meetings</>;

    const time = new Date(upcomingCalls[0]?.state?.startsAt).toLocaleTimeString(
        "en-US",
        {
            hour: "2-digit",
            minute: "2-digit",
        }
    );
    const date = new Intl.DateTimeFormat("en-US", {
        dateStyle: "full",
    }).format(upcomingCalls[0]?.state?.startsAt);
    console.log(time);
    return (
        <>
            Next Meeting at {date}, {time}
        </>
    );
};

export default UpcomingMeeting;
