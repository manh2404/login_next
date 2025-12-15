/**
 * Lấy danh sách sinh viên
 * @param p từ khóa tìm kiếm (name | studentId | emailStudent)
 */
import student from "@/models/student";

export const getALLStudents = async (p? : string) =>{
    const filter = p?{
        $or: [
            { name: { $regex: p, $options: "i" } },
            { studentId: { $regex: p, $options: "i" } },
            { emailStudent: { $regex: p, $options: "i" } },
        ],
    }: {};
    return await student.find(filter).sort({creatAt: -1}).exec();
};
/**
 * Tạo sinh viên mới
 */

export const createStudent = async (data: {
    name: string;
    birth: string | Date;
    studentId: string;
    gender?: string;
    emailStudent?: string;
    phoneNumber?: string;
}) => {
    const studnet = new student({
        name: data.name,
        birth: data.birth,
        studentId: data.studentId,
        gender: data.gender,
        emailStudent: data.emailStudent,
        phoneNumber: data.phoneNumber,
    });



    await studnet.save();
    return studnet;
}
// lib/services/student.service.ts
import Student from "@/models/student";

export const updateStudent = async (
    id: string,
    updatedData: Partial<{
        name: string;
        birth: string | Date;
        studentId: string;
        gender: string;
        emailStudent: string;
        phone: string;
    }>
) => {
    // { new: true } => trả về bản ghi sau khi update
    // runValidators: true => vẫn validate theo schema khi update
    return await Student.findByIdAndUpdate(id, updatedData, {
        new: true,
        runValidators: true,
    }).exec();
};

export const deleteStudent = async (id: string) => {
    return await Student.findByIdAndDelete(id).exec();
};


