"use client";

import React, { useState } from "react";
import HomeCard from "@/components/HomeCard";
import MeetingModal from "@/components/MeetingModal";
import { useSession } from "next-auth/react";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState();
  const { data: session, status } = useSession();
  const { user } = session;
  const client = useStreamVideoClient();
  const [value, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });

  const [callDetails, setCallDetails] = useState();

  const createMeeting = async () => {
    if (!client || !user) return;

    try {
      const callID = crypto.randomUUID();

      const call = client.call("default", callID);
      if (!call) throw new Error("Call could not be generated");

      const startAt =
        value.dateTime.toISOString() || new Date(Date.now()).toISOString();

      const description = value.description;

      await call.getOrCreate({
        data: {
          starts_at: startAt,
          custom: {
            description: description,
          },
        },
      });
      setCallDetails(call);

      if (!value.description) {
        router.push(`/meeting/${callID}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="grid grid-cols-1 gap-[5rem] md:grid-cols-2 xl:grid-cols-3">
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        handleClick={() => {
          setMeetingState("isInstantMeeting");
        }}
        className="bg-orange-1"
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        handleClick={() => {
          setMeetingState("isScheduleMeeting");
        }}
        className="bg-blue-1"
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="Via invitation link"
        handleClick={() => {
          setMeetingState("isJoiningMeeting");
        }}
        className="bg-purple-1"
      />

      <MeetingModal
        isOpen={meetingState === "isInstantMeeting"}
        onClose={() => {
          setMeetingState(undefined);
        }}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
    </section>
  );
};

export default MeetingTypeList;
