import aws from "aws-sdk";

import { envConfig } from "@/configs/env.config";

// setting up ses
export const ses = new aws.SES({
    region: envConfig!.AWS_REGION,
    accessKeyId: envConfig!.AWS_ACCESS_KEY_ID,
    secretAccessKey: envConfig!.AWS_SECRET_ACCESS_KEY
});
