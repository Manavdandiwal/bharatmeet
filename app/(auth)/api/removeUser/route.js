import { dbConnect } from "@/app/lib/dbConnect";
import generator from "@/app/(auth)/api/Helper/passwordGenerator";
import UserSchema from "@/models/user";

const handler = async (req) => {
    const body = await req.json();
    console.log(body);
    try {
        const { user } = body;
        await dbConnect();
        const exists = await UserSchema.findOne({
            email: user.email,
            name: user.name,
        });
        if (!exists) {
            return Response.json({
                success: false,
                error: "User does not exist",
            });
        }
        const res = await UserSchema.deleteOne({
            email: user.email,
            name: user.name,
        });
        console.log(res);
        return Response.json({ success: true });
    } catch (err) {
        console.log(err);
        return Response.json({ success: false, error: err });
    }
};

export { handler as GET, handler as POST };
