import connecToDb from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/models/User";

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

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const userMessages = await UserModel.aggregate([
            {
                $match: {
                    _id: userId
                }
            },
            {
                $unwind: "$messages"
            },
            {
                $sort: {
                    "messages.createdAt": -1
                }
            },
            {
                $group: {
                    _id: "$_id",
                    messages: {
                        $push: "$messages"
                    }
                }
            }
        ]);

        if(!userMessages || userMessages.length === 0){
            return Response.json({
                success: false,
                message: "Error while fetching the user messages",
            },{
                status: 400
            });
        }

        return Response.json({
            success: true,
            message: "User messages has been fetched successfully",
            messages: userMessages[0].messages
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