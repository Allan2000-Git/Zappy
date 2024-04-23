import UserModel from "@/models/User";
import connecToDb from "@/utils/db";
import generateVerificationCode from "@/utils/generateVerificationCode";
import { sendEmailVerification } from "@/utils/sendEmailVerification";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await connecToDb();

    try {
        const {username, email, password} = await request.json();

        const userExistsByUsername = await UserModel.findOne({
            username,
            isVerified: true
        });
        if(userExistsByUsername) {
            return Response.json({
                success: false,
                message: "User already exists"
            },{
                status: 400
            });
        }

        const userExistsByEmail = await UserModel.findOne({email});

        // get the verification code
        const verifyCode = generateVerificationCode();

        if(userExistsByEmail) {
            if(userExistsByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exists with the provided email"
                },{
                    status: 400
                });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                userExistsByEmail.password = hashedPassword;
                userExistsByEmail.verifyCode = verifyCode;
                userExistsByEmail.verifyCodeExpiry = new Date(Date.now() + 3600 * 1000);
                await userExistsByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);

            // set the expiry time for the verification code
            const expiryTime = new Date();
            expiryTime.setHours(expiryTime.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryTime,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
                createdAt: Date.now(),
            });

            await newUser.save();
        }

        // send verification email
        const emailResponse = await sendEmailVerification(username, email, verifyCode);
        if(!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            },{
                status: 500
            });
        }

        return Response.json({
            success: true,
            message: "User has been registered successfully. Please check your email for verification code."
        },{
            status: 201
        });

    } catch (error) {
        console.log("Error while signing up to Zappy: ", error);
        return Response.json({
            success: false,
            message: "Error while signing up to Zappy"
        },{
            status: 500
        });
    }
}