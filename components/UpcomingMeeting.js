"use client";

import { useGetCalls } from "@/hooks/useGetCalls";
import Loader from "./Loader";
import { useEffect } from "react";
import axios from "axios";

const UpcomingMeeting = () => {
    const { upcomingCalls, isLoading } = useGetCalls();

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
