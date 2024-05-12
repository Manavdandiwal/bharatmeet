import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import Provider from "@/app/lib/provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "BharatMeet",
    description: "Video Calling app",
    icons: {
        icon: "/icons/logo.svg",
    },
};

export default async function RootLayout({ children }) {
    const session = await getServerSession(authOptions);
    return (
        <html lang="en">
            <Provider session={session}>
                <body className={`${inter.className} bg-dark-2`}>
                    {children}
                    <Toaster />
                </body>
            </Provider>
        </html>
    );
}
