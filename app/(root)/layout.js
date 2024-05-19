import React, { Children } from "react";

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
            {children}
        </main>
    );
};

export default RootLayout;
