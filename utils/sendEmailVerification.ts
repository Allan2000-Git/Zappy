import ZappyEmailVerification from '@/components/emails/verification-email-template';
import { ApiResponse } from '@/types/apiRepsonse';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailVerification(
    username: string, 
    email: string, 
    verifyCode: string
): Promise<ApiResponse> {
    try {
        const data = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Zappy Verification Code: Your Ticket to Access! 🚀',
            react: ZappyEmailVerification({ username, verifyCode }),
        });

        return {
            success: true,
            message: "Verification email sent successfully"
        }
    } catch (error) {
        console.log("Failed to send a verification email");
        return {
            success: false,
            message: "Failed to send a verification email"
        }
    }
}
