import express from "express";
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { User } from "./models/users.js";
import { config } from "dotenv";
import { connectDatabase } from "./config/database.js";
export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

config({
    path: "./config/config.env"
})

connectDatabase()

app.get('/', (req, res) => {
    res.send({ message: "connected successfully" });
})
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email })
        if (user) {
            res
                .status(400)
                .json({ success: false, message: "User already exists" });
        }
        user = await User.create({ name, email, password });
        res.status(200).json({ success: true, message: "User created successfully", user });
    } catch (error) {
        res
            .status(500)
            .json({ success: false, message: error.message });
    }
})
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const data = await User.findOne({ email: email, password: password });

        if (!data) {
            return res.status(404).json({ success: false, message: "User not found invalid email or password" });
        }
        jwt.sign({ data }, process.env.SECRET_KEY, { expiresIn: '2h' }, (err, token) => {
            res.json({
                token,
                success: true,
                message: "User login in successfully"
            })
        })
    } catch (error) {
        res
            .status(500)
            .json({ success: false, message: error.message });
    }

})

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const token = bearer[1]
        req.token = token
        next()
    } else {
        res.send({
            result: "Token is not valid"
        })
    }
}

app.post("/profile", verifyToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
        if (err) {
            res.send({ result: "invalid token" })
        } else {
            res.json({
                message: "profile exists",
                authData
            })
        }
    })
})
app.listen(process.env.PORT, () => {
    console.log("Server listening on port " + process.env.PORT)
})