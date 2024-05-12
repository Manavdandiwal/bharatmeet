import generator from "@/app/(auth)/api/Helper/createOTP";
import sendVerificationEmail from "@/app/(auth)/api/Helper/send2FAEmail";
import { dbConnect } from "@/app/lib/dbConnect";
import VerificationOTP from "@/models/emailVerification";
import UserSchema from "@/models/user";

const handler = async (req) => {
  const body = await req.json();
  try {
    await dbConnect();
    const { email } = body;
    const user = await UserSchema.findOne({ email: email });
    if (!user) {
      return Response.json({ success: false, message: "User does not exists" });
    }
    const OTP = generator();

    const entry = await VerificationOTP.findOne({ email: email });
    console.log(entry);
    if (entry) {
      entry.OTP = OTP; 
      await entry.save();
      console.log("Document updated successfully");
    } else {
      const entry = new VerificationOTP({ email: email, OTP: OTP });
      entry.save();
    }
    const response = await sendVerificationEmail(email, OTP);
    console.log(response);

    if (response.success) {
      return Response.json({ success: true });
    } else {
      return Response.json(response);
    }
  } catch (err) {
    console.log(err);
    return Response.json({ success: false, error: err });
  }
};

export { handler as GET, handler as POST };
