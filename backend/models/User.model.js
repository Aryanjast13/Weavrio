import bcrypt from "bcryptjs";
import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim:true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match:[/.+\@.+\..+/,"Please enter a valid email address"],
    },
    password: {
        type: String,
        required: true,
        minLength:6,
    },
    role: {
        type: String,
        enum: ["customer", "admin"],
        default:"customer",
    },
},
    {
        timestamps:true,
    }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}
const User = mongoose.model("User", userSchema);
export default User;