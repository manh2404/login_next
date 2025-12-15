"use client";

import { useEffect, useMemo, useState } from "react";

type Student = {
    _id: string;
    name: string;
    birth: string;        // ISO
    studentId: string;
    gender?: string;
    emailStudent?: string;
    phone?: string;       // nếu backend dùng phone
    phoneNumber?: string; // nếu backend dùng phoneNumber
    createdAt?: string;
};

const API_BASE = "/api/auth/student";

function toDateInputValue(isoDate?: string) {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    // yyyy-mm-dd cho input type="date"
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

export default function StudentCrudClient() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    // mode: create / edit
    const [editingId, setEditingId] = useState<string | null>(null);

    // form state
    const [name, setName] = useState("");
    const [birth, setBirth] = useState(""); // yyyy-mm-dd
    const [studentId, setStudentId] = useState("");
    const [gender, setGender] = useState("nam");
    const [emailStudent, setEmailStudent] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const isEditing = useMemo(() => Boolean(editingId), [editingId]);

    async function fetchStudents() {
        setError("");
        setLoading(true);
        try {
            const res = await fetch(API_BASE, { cache: "no-store" });
            const data = await res.json();

            if (!res.ok) throw new Error(data?.message || "Không lấy được danh sách");
            setStudents(data.students || []);
        } catch (e: any) {
            setError(e.message || "Lỗi lấy danh sách");
        } finally {
            setLoading(false);
        }
    }

    function resetForm() {
        setEditingId(null);
        setName("");
        setBirth("");
        setStudentId("");
        setGender("nam");
        setEmailStudent("");
        setPhoneNumber("");
    }

    function fillFormForEdit(s: Student) {
        setEditingId(s._id);
        setName(s.name || "");
        setBirth(toDateInputValue(s.birth));
        setStudentId(s.studentId || "");
        setGender(s.gender || "nam");
        setEmailStudent(s.emailStudent || "");

        // ưu tiên phoneNumber, nếu không có thì lấy phone
        setPhoneNumber(s.phoneNumber || s.phone || "");
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(API_BASE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    birth,
                    studentId,
                    gender,
                    emailStudent: emailStudent || undefined,

                    // gửi cả 2 để tương thích bài hiện tại (tránh lệch field)
                    phoneNumber: phoneNumber || undefined,
                    phone: phoneNumber || undefined,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || "Tạo sinh viên thất bại");
            }

            resetForm();
            await fetchStudents();
        } catch (e: any) {
            setError(e.message || "Lỗi tạo sinh viên");
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        if (!editingId) return;

        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/${editingId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    birth,
                    studentId,
                    gender,
                    emailStudent: emailStudent || undefined,
                    phoneNumber: phoneNumber || undefined,
                    phone: phoneNumber || undefined,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || "Cập nhật thất bại");
            }

            resetForm();
            await fetchStudents();
        } catch (e: any) {
            setError(e.message || "Lỗi cập nhật");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        const ok = confirm("Bạn chắc chắn muốn xóa sinh viên này?");
        if (!ok) return;

        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/${id}`, {
                method: "DELETE",
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(data?.message || "Xóa thất bại");
            }

            // nếu đang edit đúng record vừa xóa thì reset
            if (editingId === id) resetForm();

            await fetchStudents();
        } catch (e: any) {
            setError(e.message || "Lỗi xóa");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchStudents();
    }, []);

    return (
        <div className="space-y-6">
            {/* Layout: header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Quản lý sinh viên</h2>
                </div>

                <div className="flex gap-2">
                    <button
                        className="border rounded px-3 py-2"
                        onClick={fetchStudents}
                        disabled={loading}
                    >
                        Refresh
                    </button>
                    <button
                        className="border rounded px-3 py-2"
                        onClick={resetForm}
                        disabled={loading}
                    >
                        Clear form
                    </button>
                </div>
            </div>

            {/* Form create/edit */}
            <form
                onSubmit={isEditing ? handleUpdate : handleCreate}
                className="space-y-3 border rounded p-4"
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                        {isEditing ? "Sửa sinh viên" : "Thêm sinh viên"}
                    </h3>
                    {isEditing ? (
                        <span className="text-xs border rounded px-2 py-1">
              Editing: {editingId}
            </span>
                    ) : null}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm mb-1">Họ tên *</label>
                        <input
                            className="w-full border rounded px-3 py-2"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nguyen Van A"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Ngày sinh *</label>
                        <input
                            type="date"
                            className="w-full border rounded px-3 py-2"
                            value={birth}
                            onChange={(e) => setBirth(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Mã sinh viên *</label>
                        <input
                            className="w-full border rounded px-3 py-2"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            placeholder="SV001"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Giới tính</label>
                        <select
                            className="w-full border rounded px-3 py-2"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="nam">nam</option>
                            <option value="nữ">nữ</option>
                            <option value="khác">khác</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full border rounded px-3 py-2"
                            value={emailStudent}
                            onChange={(e) => setEmailStudent(e.target.value)}
                            placeholder="a@gmail.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Số điện thoại</label>
                        <input
                            className="w-full border rounded px-3 py-2"
                            value={phoneNumber}
                            onChange={(e) => {
                                const onlyDigits = e.target.value.replace(/\D/g, "");
                                setPhoneNumber(onlyDigits.slice(0, 10)); // giới hạn 10 số
                            }}
                            placeholder="0987654321"
                        />
                        <p className="text-xs opacity-60 mt-1">Tối đa 10 chữ số</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        disabled={loading}
                        className="border rounded px-4 py-2"
                        type="submit"
                    >
                        {loading
                            ? "Đang xử lý..."
                            : isEditing
                                ? "Cập nhật"
                                : "Tạo sinh viên"}
                    </button>

                    {isEditing ? (
                        <button
                            type="button"
                            className="border rounded px-4 py-2"
                            onClick={resetForm}
                            disabled={loading}
                        >
                            Hủy sửa
                        </button>
                    ) : null}
                </div>

                {error ? <p className="text-red-600 text-sm">{error}</p> : null}
            </form>

            {/* List */}
            <div className="space-y-3">
                <h3 className="text-lg font-medium">Danh sách sinh viên</h3>

                <div className="overflow-x-auto border rounded">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="border-b">
                            <th className="text-left p-2">studentId</th>
                            <th className="text-left p-2">name</th>
                            <th className="text-left p-2">birth</th>
                            <th className="text-left p-2">gender</th>
                            <th className="text-left p-2">email</th>
                            <th className="text-left p-2">phone</th>
                            <th className="text-left p-2 w-[180px]">actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {students.map((s) => (
                            <tr key={s._id} className="border-b">
                                <td className="p-2">{s.studentId}</td>
                                <td className="p-2">{s.name}</td>
                                <td className="p-2">
                                    {s.birth ? new Date(s.birth).toLocaleDateString("vi-VN") : ""}
                                </td>
                                <td className="p-2">{s.gender || ""}</td>
                                <td className="p-2">{s.emailStudent || ""}</td>
                                <td className="p-2">{s.phoneNumber || s.phone || ""}</td>
                                <td className="p-2">
                                    <div className="flex gap-2">
                                        <button
                                            className="border rounded px-3 py-1"
                                            onClick={() => fillFormForEdit(s)}
                                            disabled={loading}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className="border rounded px-3 py-1"
                                            onClick={() => handleDelete(s._id)}
                                            disabled={loading}
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {students.length === 0 && !loading ? (
                            <tr>
                                <td className="p-3" colSpan={7}>
                                    Chưa có dữ liệu.
                                </td>
                            </tr>
                        ) : null}
                        </tbody>
                    </table>
                </div>

                {loading && students.length === 0 ? <p>Loading...</p> : null}
            </div>
        </div>
    );
}
