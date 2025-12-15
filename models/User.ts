import mongoose, {models, Schema} from "mongoose";

const UserSchema = new Schema(
    {
        email: {type: String, required: true, unique: true},
        name: {type: String, required: true, unique: true},
        password: {type: String, required: true},
    },
    {
        timestamps: true,
    }
    )
export default models.User || mongoose.model('User', UserSchema)