import generator from "@/app/(auth)/api/Helper/createOTP";
import sendVerificationEmail from "@/app/(auth)/api/Helper/send2FAEmail";
import { dbConnect } from "@/app/lib/dbConnect";
import VerificationOTP from "@/models/emailVerification";
import UserSchema from "@/models/user";

const handler = async (req) => {
    try {
        await dbConnect();
        const users = await UserSchema.find({}, { password: 0 });
        return Response.json({ success: true, users });
    } catch (err) {
        console.log(err);
        return Response.json({ success: false, error: err });
    }
};

export { handler as GET, handler as POST };
