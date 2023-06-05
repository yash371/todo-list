import mongoose from "mongoose";
// import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        undefined: true,
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "Password must be at least 8 characters long"],
        select: false,
    },
    // avatar: {
    //     public_id: String,
    //     url: String,
    // },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    tasks: [{
        title: "String",
        descrpition: "String",
        completed: Boolean,
        createdAt: Date,
    }],
    // varified: {
    //     type: Boolean,
    //     default: false,
    // },
    // otp: Number,
    // otp_expiry: Date,
});

// userSchema.methods.getJWTToken = function () {
//     return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_COOKIE_EXPIRE
//     })
// }

export const User = mongoose.model('User', userSchema);