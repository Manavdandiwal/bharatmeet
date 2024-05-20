"use client";

import { useState, useEffect } from "react";
import HomeCard from "@/components/HomeCard";
import MeetingModal from "@/components/MeetingModal";
import { useSession } from "next-auth/react";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Loader from "@/components/Loader";
import ReactDatePicker from "react-datepicker";
import InviteModal from "@/components/InvitedModal";
import axios from "axios";

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
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [callDetails, setCallDetails] = useState();
    const { toast } = useToast();
    const [invitedUsers, setInvitedUsers] = useState([]);
    const [inviteModal, setInviteModal] = useState(false);

    useEffect(() => {
        const getUsers = async () => {
            const {
                data: { users, success },
            } = await axios.get("/api/getUsers");
            if (!success) {
                toast({
                    title: data.err || "Something went wrong",
                });
                return;
            }
            setUsers(users);
            setLoading(false);
        };
        getUsers();
    }, []);

    if (loading) return <Loader />;

    const createMeeting = async () => {
        if (!value.dateTime) {
            toast({
                title: "Please select a date and time",
            });
        }
        if (!client || !user) return;

        try {
            const callID = crypto.randomUUID();
            console.log(invitedUsers);
            const invites = invitedUsers.map((user) => user._id);

            const call = client.call("default", callID);
            if (!call) throw new Error("Call could not be generated");

            const members = invites
                .map((id) => ({
                    user_id: String(id),
                    role: "call_member",
                }))
                .concat({ user_id: session.user.id, role: "call_member" })
                .filter(
                    (v, i, a) =>
                        a.findIndex((v2) => v2.user_id === v.user_id) === i
                );

            const startAt =
                value.dateTime.toISOString() ||
                new Date(Date.now()).toISOString();

            const description = value.description || "Instant Meeting";

            await call.getOrCreate({
                data: {
                    starts_at: startAt,
                    members: members,
                    custom: {
                        description: description,
                    },
                },
            });
            setCallDetails(call);

            if (!value.description) {
                router.push(`/meeting/${callID}`);
            }
            toast({
                title: "Meeting Created",
            });
        } catch (err) {
            console.log(err);
            toast({
                title: "Failed to create meeting",
            });
        }
    };

    const meetingLink = `${callDetails?.id}`;

    return (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
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
                img="/icons/recordings.svg"
                title="Recordings"
                description="View all recordings"
                handleClick={() => {
                    alert("Clicked");
                    router.push("/recordings");
                }}
                className="bg-yellow-1"
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

            {!callDetails ? (
                <MeetingModal
                    isOpen={meetingState === "isScheduleMeeting"}
                    onClose={() => {
                        setMeetingState(undefined);
                    }}
                    title="Create Meeting"
                    handleClick={() => {
                        if (!value.description) {
                            toast({
                                title: "Description cannot be empty",
                            });
                            return;
                        }
                        setInviteModal(true);
                        // createMeeting();
                    }}
                >
                    <div className="flex flex-col gap-2.5">
                        <label className="text-base text-normal leading-[22px] text-sky-2">
                            Add a description
                        </label>
                        <Textarea
                            className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                            onChange={(e) => {
                                setValues({
                                    ...value,
                                    description: e.target.value,
                                });
                            }}
                        />
                    </div>
                    <div className="flex w-full flex-col gap-2.5">
                        <label className="text-base text-normal leading-[22px] text-sky-2">
                            Select date and time
                        </label>
                        <ReactDatePicker
                            selected={value.dateTime}
                            onChange={(date) =>
                                setValues({ ...value, dateTime: date })
                            }
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            timeCaption="time"
                            dateFormat="MMMM d, yyyy h:mm aa"
                            className="w-full rounded bg-dark-3 p-2 focus:outline-none"
                        />
                    </div>
                </MeetingModal>
            ) : (
                <MeetingModal
                    isOpen={meetingState === "isScheduleMeeting"}
                    onClose={() => {
                        setCallDetails(undefined);
                        setMeetingState(undefined);
                    }}
                    title="Meeting Created"
                    className="text-center"
                    handleClick={() => {
                        navigator.clipboard.writeText(meetingLink);
                        toast({
                            title: "meeting link copied",
                        });
                    }}
                    image="/icons/checked.svg"
                    buttonIcon="/icons/copy.svg"
                    buttonText="Copy Meeting Text"
                />
            )}

            <MeetingModal
                isOpen={meetingState === "isInstantMeeting"}
                onClose={() => {
                    setMeetingState(undefined);
                }}
                title="Start an Instant Meeting"
                className="text-center"
                buttonText="Start Meeting"
                handleClick={() => {
                    setInviteModal(true);
                }}
            />

            <MeetingModal
                isOpen={meetingState === "isJoiningMeeting"}
                onClose={() => {
                    setMeetingState(undefined);
                }}
                title="Type the link here"
                className="text-center"
                buttonText="Join Meeting"
                handleClick={() => router.push(`/meeting/${value.link}`)}
            >
                <Input
                    placeholder="Meeting link"
                    className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                    onChange={(e) =>
                        setValues({ ...value, link: e.target.value })
                    }
                />
            </MeetingModal>

            <InviteModal
                isOpen={inviteModal}
                onClose={() => setInviteModal(false)}
                userList={users}
                currUser={user}
                invitedUsers={invitedUsers}
                updateInvitedUsers={setInvitedUsers}
                title="Invite Users"
                handleClick={() => {
                    setInviteModal(false);
                    createMeeting();
                }}
                buttonText="Confirm"
            />
        </section>
    );
};

export default MeetingTypeList;
