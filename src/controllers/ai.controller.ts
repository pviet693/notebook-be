import { NextFunction, Request, Response } from "express";

import { AIService } from "@/services";

class AIController {
    public static async generate(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await AIService.generate(req.body);

            res.setHeader("Content-Type", "text/plain");

            for await (const chunk of response) {
                const { choices } = chunk;
                const { delta, finish_reason } = choices[0];
                const { content } = delta;

                if (finish_reason === null) {
                    res.write(content);
                } else {
                    res.end();
                    return;
                }
            }
        } catch (error) {
            next(error);
        }
    }
}

export default AIController;
