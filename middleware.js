import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    // async function middleware(req) {
    //     if (req.nextUrl.pathname == "/") {
    //         return;
    //     } else if (req.nextUrl.pathname.startsWith("/admin")) {
    //         if (req.nextauth.token.role != "admin") {
    //             return NextResponse.error("NOT AUTHORIZED");
    //         }
    //     } else {
    //         if (req.nextauth.token.role == "admin") {
    //             if (req.nextUrl.pathname === "/")
    //                 return NextResponse.redirect("/admin");
    //             return NextResponse.error("NOT AUTHORIZED");
    //         }
    //     }
    // },
    {
        pages: {
            signIn: "/signin",
        },
    }
);
