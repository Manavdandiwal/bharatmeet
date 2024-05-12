"use server";

import { authOptions } from "@/app/lib/auth";
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
  const session = await getServerSession(authOptions);

  if (!session) throw new Error("User not logged in");
  if (!apiKey) throw new Error("No Api key");
  if (!apiSecret) throw new Error("No Api Secret");

  const streamClient = new StreamClient(apiKey, apiSecret);

  const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;
  const issued = Math.floor(Date.now() / 1000) - 60;

  const token = streamClient.createToken(session.user.id, exp, issued);

  return token;
};
