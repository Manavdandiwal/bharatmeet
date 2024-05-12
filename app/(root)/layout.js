import React, { Children } from "react";
import StreamVideoProvider from "@/providers/streamClientProvider";

const RootLayout = ({ children }) => {
  return (
    <main>
      <StreamVideoProvider>{children}</StreamVideoProvider>
    </main>
  );
};

export default RootLayout;
