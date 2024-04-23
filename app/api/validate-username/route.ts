import UserModel from "@/models/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import connecToDb from "@/utils/db";
import { z } from "zod";

const UsernameValidationSchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await connecToDb();

    try {
        const {searchParams} = new URL(request.url);
        const params = {
            username: searchParams.get("username")
        }

        const result = UsernameValidationSchema.safeParse(params);
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: usernameErrors.length > 0 ? usernameErrors.join(", ") : "Invalid username"
            },{
                status: 400
            });
        }

        const {username} = result.data;
        const userExists = await UserModel.findOne({
            username,
            isVerified: true
        });
        if(userExists){
            return Response.json({
                success: false,
                message: "Username has been already taken",
            },{
                status: 400
            });
        }

        return Response.json({
            success: true,
            message: "Username is available",
        },{
            status: 400
        });

    } catch (error) {
        console.log("Error while checking username: ", error);
        return Response.json({
            success: false,
            message: "Error while checking username"
        },{
            status: 500
        });
    }
}