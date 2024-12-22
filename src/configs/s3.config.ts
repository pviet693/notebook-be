import aws from "aws-sdk";

import { envConfig } from "@/configs/env.config";

// setting up s3 bucket
export const s3 = new aws.S3({
    region: envConfig!.AWS_REGION,
    accessKeyId: envConfig!.AWS_ACCESS_KEY_ID,
    secretAccessKey: envConfig!.AWS_SECRET_ACCESS_KEY
});
