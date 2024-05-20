import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect } from "react";
import { useState } from "react";

export const useGetCallByID = (id) => {
    const [call, setCall] = useState();
    const [isCallLoading, setIsCallLoading] = useState(true);

    const client = useStreamVideoClient();

    useEffect(() => {
        if (!client) return;

        const loadCall = async () => {
            const { calls } = await client.queryCalls({
                filter_conditions: {
                    id,
                },
            });
            if (calls.length > 0) setCall(calls[0]);
            console.log(calls);
            setIsCallLoading(false);
        };
        loadCall();
    }, [client, id]);

    return { call, isCallLoading };
};
