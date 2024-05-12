'use client'

import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { tokenProvider } from "../actions/stream.actions";
import Loader from "../components/Loader";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }) => {
  const [videoClient, setVideoClient] = useState();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated" || !session) return;
    if (!apiKey) throw new Error("Stream API Key not defined");

    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: session?.user?.id,
        name: session?.user?.username || session?.user?.id,
        image: session?.user?.image || "/icons/defaultUserImage.png",
      },
      tokenProvider: tokenProvider,
    });

    setVideoClient(client);
  }, [session, status]);

  if (!videoClient) {
    return <Loader />;
  }

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
