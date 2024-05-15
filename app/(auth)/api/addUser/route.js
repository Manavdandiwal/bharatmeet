import { dbConnect } from "@/app/lib/dbConnect";
import generator from "@/app/(auth)/api/Helper/passwordGenerator";
import UserSchema from "@/models/user";

const handler = async (req) => {
    const body = await req.json();
    console.log(body);
    try {
        const { user } = body;
        await dbConnect();
        const exists = await UserSchema.findOne({ email: user.email });
        if (exists) {
            return Response.json({
                success: false,
                error: "User already exists",
            });
        }
        const newUser = new UserSchema({
            name: user.name,
            email: user.email,
            password: generator(),
            role: user.role,
        });
        await newUser.save();
        if (!newUser) {
            return Response.json({
                success: false,
                error: "Something went wrong",
            });
        }
        return Response.json({ success: true, user: newUser });
    } catch (err) {
        console.log(err);
        return Response.json({ success: false, error: err });
    }
};

export { handler as GET, handler as POST };
