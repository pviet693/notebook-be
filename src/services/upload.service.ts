import { StatusCodes } from "http-status-codes";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import { s3 } from "@/configs/s3.config";
import { AppError } from "@/types/AppError";

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
            Bucket: "blogs-web",
            Key: fileName,
            Body: file.buffer,
            ContentType: fileContentType
        };

        // Upload to S3
        const data = await s3.upload(params).promise();

        return {
            fileUrl: data.Location
        };
    }
}

export default UploadService;
