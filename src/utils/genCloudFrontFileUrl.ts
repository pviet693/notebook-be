import { envConfig } from "@/configs/env.config";

export const genCloudFrontFileUrl = (filename: string) => {
    return `${envConfig!.AWS_CLOUDFRONT_URL}/${filename}`;
};
