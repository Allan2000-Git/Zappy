export default function generateVerificationCode(): string {
    let code: string = '';

    for (let i = 0; i < 6; i++) {
        code += Math.floor(Math.random() * 10).toString();
    }

    return code;
}
