import {
    Body,
    Button,
    Container,
    Head,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components";
    import * as React from "react";
    
export interface ZappyEmailVerificationProps {
    username: string;
    verifyCode: string;
}
    
const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "";

export const ZappyEmailVerification = ({
    username,
    verifyCode,
}: ZappyEmailVerificationProps) => {
    return (
    <Html>
        <Head />
        <Preview>Email Verification</Preview>
        <Body style={main}>
            <Container style={container}>
                <Img
                src={`${baseUrl}/static/dropbox-logo.png`}
                width="40"
                height="33"
                alt="Zappy"
                />
                <Section>
                    <Text style={text}>Hi {username},</Text>
                    <Text style={text}>
                        Thank you for signing up for Zappy! To complete the registration process and ensure the security of your account, 
                        please verify your email address by entering the following verification code:
                    </Text>
                    <Text style={otpContainer}>
                        <Text style={otpText}>
                            {verifyCode}
                        </Text>
                    </Text>
                    <Text style={text}>
                        Please copy and paste the verification code into the designated field on the registration page to proceed. 
                        If you didn&apos;t initiate this signup process, please disregard this email.
                    </Text>
                    <Text style={text}>Thank you for choosing Zappy!</Text>
                </Section>
            </Container>
        </Body>
    </Html>
    );
};

export default ZappyEmailVerification;

const main = {
    backgroundColor: "#f6f9fc",
    padding: "10px 0",
};

const container = {
    backgroundColor: "#ffffff",
    border: "1px solid #f0f0f0",
    padding: "45px",
};

const text = {
    fontSize: "16px",
    fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
    fontWeight: "300",
    color: "#404040",
    lineHeight: "26px",
};

const otpContainer = {
    backgroundColor: "#FFF2D7",
    borderRadius: "8px",
    color: "#fff",
    fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
    fontSize: "15px",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "210px",
    padding: "14px 7px",
};

const otpText = {
    color: "#F98866",
    fontSize: "15px",
    fontWeight: "300",
}