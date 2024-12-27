import { envConfig } from "@/configs/env.config";
import { ses } from "@/configs/ses.config";
import { generateOTP } from "@/utils";

class EmailService {
    public static async sendOTP(email: string) {
        const otp = generateOTP();

        const params: AWS.SES.SendEmailRequest = {
            Destination: {
                ToAddresses: [email]
            },
            Message: {
                Body: {
                    Text: {
                        Charset: "UTF-8",
                        Data: `Your OTP is ${otp}`
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: "OTP"
                }
            },
            Source: envConfig!.AWS_SES_SOURCE_EMAIL
        };

        await ses.sendEmail(params).promise();

        return otp;
    }
}

export default EmailService;
