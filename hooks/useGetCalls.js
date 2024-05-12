import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const useGetCalls = () => {
    const [calls, setCalls] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const client = useStreamVideoClient();

    const { data: session, status } = useSession();

    useEffect(() => {
        const loadCalls = async () => {
            if (!client || !session?.user?.id) return;

            setIsLoading(true);
            try {
                const { calls } = await client.queryCalls({
                    sort: [{ field: "starts_at", direction: -1 }],
                    filter_conditions: {
                        starts_at: { $exists: true },
                        $or: [
                            {
                                created_by_user_id: session.user.id,
                            },
                            {
                                members: { $in: [session.user.id] },
                            },
                        ],
                    },
                });
                setCalls(calls);
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadCalls();
    }, [client, session.user?.id]);

    const now = new Date();

    const endedCalls = calls.filter(({ state: { startsAt, endedAt } }) => {
        return (startsAt && new Date(startsAt) < now) || !!endedAt;
    });
    const upcomingCalls = calls.filter(({ state: { startsAt } }) => {
        return startsAt && new Date(startsAt) > now;
    });
    return {
        endedCalls,
        upcomingCalls,
        callRecordings: calls,
        isLoading,
    };
};
