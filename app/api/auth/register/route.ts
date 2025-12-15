import connectDB from "@/lib/db";
import bcrypt from "bcryptjs";
import {NextRequest, NextResponse} from "next/server";
import User from "@/models/User";

export async function POST(req : Request){
    try {
        await connectDB();

        const body =await req.json();
        const name = (body?.name || "").trim()
        const email = (body?.email || "").trim()
        const password = body?.password || "";

        if (!name || !email || !password){
            return NextResponse.json(
                {message: "thiếu thông tin "},
                {status: 400}
            );
        }

        const hased = await bcrypt.hash(password,10);

        await User.create({
            name,
            email,
            password : hased,
        });

        return NextResponse.json(
            {message: "đăng ký thành công",},
            {status: 201}
        )
    }catch (err){
        return NextResponse.json(
            {message: "tài khoản đã tồn tại",err: err},
            {status: 500},
        );
    }
}