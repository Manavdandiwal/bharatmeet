import StreamVideoProvider from "@/providers/streamClientProvider";

export const metadata = {
    title: "BharatMeet",
    description: "Video Calling app",
    icons: {
        icon: "/icons/logo.svg",
    },
};

const RootLayout = ({ children }) => {
    return (
        <main>
            <StreamVideoProvider>{children}</StreamVideoProvider>
        </main>
    );
};

export default RootLayout;
