import connecToDb from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User";

export async function POST(request:Request) {
    await connecToDb();

    const session = await getServerSession(authOptions);
    const user = session?.user;
    if(!session || !user){
        return Response.json({
            success: false,
            message: "User is not logged in"
        },{
            status: 401
        });
    }

    const userId = user._id;
    const {isAcceptingMessages} = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            isAcceptingMessages,
            {
                new: true
            }
        );
        if(!updatedUser){
            return Response.json({
                success: false,
                message: "Error while updating the user information",
            },{
                status: 400
            });
        }

        return Response.json({
            success: true,
            message: "User has been updated successfully",
        },{
            status: 200
        });
    } catch (error) {
        console.log("Error while changing the status user for accepting messages", error);
        return Response.json({
            success: false,
            message: "Error while changing the status user for accepting messages"
        },{
            status: 500
        });
    }
}

export async function GET(request:Request) {
    await connecToDb();

    const session = await getServerSession(authOptions);
    const user = session?.user;
    if(!session || !user){
        return Response.json({
            success: false,
            message: "User is not logged in"
        },{
            status: 401
        });
    }

    const userId = user._id;
    
    try {
        const existingUser = await UserModel.findById(userId);
        if(!existingUser){
            return Response.json({
                success: false,
                message: "Error while fetching the user information",
            },{
                status: 400
            });
        }

        return Response.json({
            success: true,
            message: "User information has been fetched successfully",
            isAcceptingMessages: existingUser.isAcceptingMessages
        },{
            status: 200
        });
    } catch (error) {
        console.log("Error while fetching the status user for accepting messages", error);
        return Response.json({
            success: false,
            message: "Error while fetching the status user for accepting messages"
        },{
            status: 500
        });
    }
}