import connecToDb from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/models/User";
import { Message } from "@/models/Message";

export async function POST(request:Request) {
    await connecToDb();

    const {username, message} = await request.json();

    try {
        const user = await UserModel.findOne({username});
        if(!user){
            return Response.json({
                success: false,
                message: "User not found",
            },{
                status: 404
            });
        }
        
        if(!user.isAcceptingMessages){
            return Response.json({
                success: false,
                message: "User is not accepting any messages",
            },{
                status: 400
            });
        }

        const newMessage = {
            content: message,
            createdAt: new Date(),
        }
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json({
            success: true,
            message: "User messages has been added successfully",
        },{
            status: 201
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