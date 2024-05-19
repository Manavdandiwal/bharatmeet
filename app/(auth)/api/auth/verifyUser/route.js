import { dbConnect } from "@/app/lib/dbConnect";
import VerificationOTP from "@/models/emailVerification"
import UserSchema from "@/models/user"

const handler = async (req) => {
    const body  = await req.json();
    try {
        await dbConnect();
        const { email, OTP } = body

        console.log(email)
        console.log(OTP)

        const user = await UserSchema.findOne({ email: email })
        if (!user) {
            return Response.json({ success: false, message: "User does not exists" })
        }

        const entry = await VerificationOTP.findOne({ email: email, OTP: OTP })
        console.log(entry)
        if (entry) {
            await VerificationOTP.deleteOne({ email: email, OTP: OTP })
            return Response.json({ success: true })
        }
        else {
            return Response.json({ success: false })
        }
    } catch (err) {
        console.log(err)
        return Response.json({ success: false, error: err })
    }
}

export { handler as GET, handler as POST };