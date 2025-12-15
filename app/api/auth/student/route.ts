// GET /api/students -> lấy danh sách student
import connectDB from "@/lib/db";
import student from "@/models/student";
import {NextResponse} from "next/server";

export async function GET(req: Request) {
    try {
        await connectDB();

        const {searchParams} = new URL(req.url);
        const  p = searchParams.get("p")?.trim();

        // tìm theo name / studentId / email (tuỳ bạn)
        const filter = p?{
            $or: [
                { name: { $regex: p, $options: "i" } },
                { studentId: { $regex: p, $options: "i" } },
                { emailStudent: { $regex: p, $options: "i" } },
            ],
        }:{};

        const students = await student.find(filter).sort({createdAt: -1}).exec();

        return NextResponse.json({students: students},{status: 200});
    }catch (error: any) {
        return NextResponse.json({message:" lỗi lấy danh sách sinh viên", error: error?.message},{status: 500});
    }
}

// POST /api/students -> tạo student mới
export async function POST(req: Request) {
    try {
        await connectDB();

        const body =await req.json();

        // Validate tối thiểu
        if (!body?.name || !body?.studentId || !body?.birth) {
            return NextResponse.json(
                {message: " thiếu dữ liệu bắt buộc"},
                {status: 400}
            );
        }else {
            const created = await student.create({
                name: body?.name,
                emailStudent: body?.emailStudent,
                birth: body?.birth,
                studentId: body?.studentId,
                gender: body?.gender,
                phoneNumber: body?.phone,
            });

            return NextResponse.json({student: created},{status: 201});
        }
    }catch (error: any) {
        // trúng unique
        if (error?.code === 11000) {
            const field = Object.keys(error?.keyValue ?? {})[0] || "field";
            return NextResponse.json(
                {message: `trường ${field} đã tồn tại ( bị trùng) `, keyValue: error.keyValue},
                {status: 409}
            );

            // Lỗi validate schema
            if (error?.name == "ValidationError") {
                return NextResponse.json(
                    { message: "Dữ liệu không hợp lệ", error: error?.message },
                    { status: 400 }
                )
            }

            return NextResponse.json(
                { message: "Lỗi khi tạo student", error: error?.message },
                { status: 500 }
            )

        }

    }
}