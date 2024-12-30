import { StatusCodes } from "http-status-codes";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import { envConfig } from "@/configs/env.config";
import { s3 } from "@/configs/s3.config";
import { AppError } from "@/types/AppError";
import { genCloudFrontFileUrl } from "@/utils";

class UploadService {
    public static async upload(file: Express.Multer.File) {
        if (!file) {
            throw new AppError("No file provided", StatusCodes.BAD_REQUEST, true);
        }

        const date = new Date();
        const extension = path.extname(file.originalname).toLowerCase() || "";
        const fileName = `${uuidv4()}-${date.getTime()}${extension}`;
        const fileContentType = `image/${extension === ".jpg" || extension === ".jpeg" ? "jpeg" : extension.slice(1)}`;

        // Set up S3 upload parameters
        const params = {
            Bucket: envConfig!.AWS_S3_BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: fileContentType
        };

        // Upload to S3
        await s3.upload(params).promise();

        // Cloudfront url of file
        const cloudfrontUrl = genCloudFrontFileUrl(fileName);

        return {
            fileUrl: cloudfrontUrl
        };
    }
}

export default UploadService;
