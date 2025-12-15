import connectDB from "@/lib/db";
import { updateStudent, deleteStudent } from "@/lib/service/serviec_student";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

function isValidObjectId(id: string) {
    return mongoose.Types.ObjectId.isValid(id);
}

type Ctx = { params: Promise<{ id: string }> };

// PATCH /api/auth/student/:id
export async function PATCH(req: Request, ctx: Ctx) {
    try {
        await connectDB();

        const { id } = await ctx.params; // ✅ BẮT BUỘC await
        const cleanId = String(id || "").trim();

        if (!cleanId || !isValidObjectId(cleanId)) {
            return NextResponse.json({ message: "ID không hợp lệ" }, { status: 400 });
        }

        const body = await req.json();

        const updated = await updateStudent(cleanId, body);

        if (!updated) {
            return NextResponse.json({ message: "Không tìm thấy sinh viên" }, { status: 404 });
        }

        return NextResponse.json({ student: updated }, { status: 200 });
    } catch (error: any) {
        if (error?.code === 11000) {
            const field = Object.keys(error?.keyValue ?? {})[0] || "field";
            return NextResponse.json(
                { message: `Trường ${field} đã tồn tại (bị trùng)`, keyValue: error.keyValue },
                { status: 409 }
            );
        }

        if (error?.name === "ValidationError") {
            return NextResponse.json(
                { message: "Dữ liệu không hợp lệ", error: error?.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Lỗi khi cập nhật sinh viên", error: error?.message },
            { status: 500 }
        );
    }
}

// DELETE /api/auth/student/:id
export async function DELETE(_req: Request, ctx: Ctx) {
    try {
        await connectDB();

        const { id } = await ctx.params; // ✅ BẮT BUỘC await
        const cleanId = String(id || "").trim();

        if (!cleanId || !isValidObjectId(cleanId)) {
            return NextResponse.json({ message: "ID không hợp lệ" }, { status: 400 });
        }

        const deleted = await deleteStudent(cleanId);

        if (!deleted) {
            return NextResponse.json({ message: "Không tìm thấy sinh viên" }, { status: 404 });
        }

        return NextResponse.json({ message: "Xóa thành công" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { message: "Lỗi khi xóa sinh viên", error: error?.message },
            { status: 500 }
        );
    }
}
