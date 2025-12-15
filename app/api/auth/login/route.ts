import connectDB from "@/lib/db";
import {NextResponse} from "next/server";
import User from "@/models/User";

export async function POST(req: Request){
    try {
        await connectDB();

        const body = await req.json()
        const email = (body?.email || "").trim().toLowerCase();
        const password = body?.password || "";

        if (!email || !password) {
            return NextResponse.json(
                {messega: "vui lòng nhập mật khẩu"},
                {status: 400},
            )
        }
        const user = await User.findOne({ email: email });
        if (!user){
            return NextResponse.json(
                {message: "email hoặc password không đúng"},
                {status: 400},
            )
        }

        return NextResponse.json(
            {message: "đăng nhập thành công",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }},
            {status: 200}
        )
    }
    catch (error: any) {
        return NextResponse.json(
            {message: "lỗi sever khi đăng nhập",error: error?.message},
            {status: 500},
        )
    }
}