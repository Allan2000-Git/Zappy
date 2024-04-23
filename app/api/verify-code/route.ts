import UserModel from "@/models/User";
import connecToDb from "@/utils/db";
import { z } from "zod";

export async function POST(request: Request) {
    await connecToDb();

    try {
        const {username, verifyCode} = await request.json();

        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({
            username: decodedUsername,
            isVerified: false
        });
        if(!user) {
            return Response.json({
                success: false,
                message: "User not found"
            },{
                status: 400
            });
        }

        const isCodeCorrect = user.verifyCode === verifyCode;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
        if(isCodeCorrect && isCodeNotExpired){
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "User has been verified successfully"
            },{
                status: 200
            });
        } else if(!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification code has expired. Please sign up again to verify"
            },{
                status: 400
            });
        } else {
            return Response.json({
                success: false,
                message: "Please enter a valid code"
            },{
                status: 400
            });
        }
    } catch (error) {
        console.log("Error while verifying user ", error);
        return Response.json({
            success: false,
            message: "Error while verifying user"
        },{
            status: 500
        });
    }
}