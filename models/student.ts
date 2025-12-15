import mongoose, {models} from "mongoose";

const studentSchema = new mongoose.Schema({
    name: {type: String, required: true},
    birth: {type: Date, required: true},
    studentId: {type: String, required: true, unique: true},
    gender: {type: String, enum:['nam', 'nữ', 'khác']},
    emailStudent: {type: String, unique: true,sparse: true},
    //   match: [/^\d{10}$/, "Số điện thoại phải đúng 10 chữ số"],
    phoneNumber: {type: String, sparse: true },
},
{
  timestamps: true,
})

export default models.Student || mongoose.model("Student", studentSchema);