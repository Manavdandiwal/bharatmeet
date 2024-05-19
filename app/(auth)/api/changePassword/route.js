import { dbConnect } from "@/app/lib/dbConnect";
import UserSchema from "@/models/user";

const handler = async (req) => {
    const body = await req.json();
    console.log(body);
    try {
        const { user, oldPassword, newPassword } = body;
        await dbConnect();
        const exists = await UserSchema.findOne({
            email: user.email,
            // name: user.name,
            password: oldPassword,
        });
        if (!exists) {
            return Response.json({
                success: false,
                error: "Password does not match",
            });
        }
        const res = await UserSchema.findOneAndUpdate(
            { email: user.email },
            { password: newPassword }
        );
        console.log(res);
        return Response.json({ success: true });
    } catch (err) {
        console.log(err);
        return Response.json({ success: false, error: err });
    }
};

export { handler as GET, handler as POST };
