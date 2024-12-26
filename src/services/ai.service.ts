import { StatusCodes } from "http-status-codes";

import openai from "@/configs/openai.config";
import { AppError } from "@/types/AppError";

class AIService {
    public static async generate({ prompt, option, command }: { prompt: string; option: string; command?: string }) {
        let messages: { role: "system" | "user"; content: string }[] = [];

        switch (option) {
            case "continue":
                messages = [
                    {
                        role: "system",
                        content:
                            "You are an AI writing assistant that continues existing text based on context from prior text. " +
                            "Give more weight/priority to the later characters than the beginning ones. " +
                            "Limit your response to no more than 200 characters, but make sure to construct complete sentences." +
                            "Use Markdown formatting when appropriate."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ];
                break;
            case "improve":
                messages = [
                    {
                        role: "system",
                        content:
                            "You are an AI writing assistant that improves existing text. " +
                            "Limit your response to no more than 200 characters, but make sure to construct complete sentences." +
                            "Use Markdown formatting when appropriate."
                    },
                    {
                        role: "user",
                        content: `The existing text is: ${prompt}`
                    }
                ];
                break;
            case "shorter":
                messages = [
                    {
                        role: "system",
                        content:
                            "You are an AI writing assistant that shortens existing text. " +
                            "Use Markdown formatting when appropriate."
                    },
                    {
                        role: "user",
                        content: `The existing text is: ${prompt}`
                    }
                ];
                break;
            case "longer":
                messages = [
                    {
                        role: "system",
                        content:
                            "You are an AI writing assistant that lengthens existing text. " +
                            "Use Markdown formatting when appropriate."
                    },
                    {
                        role: "user",
                        content: `The existing text is: ${prompt}`
                    }
                ];
                break;
            case "fix":
                messages = [
                    {
                        role: "system",
                        content:
                            "You are an AI writing assistant that fixes grammar and spelling errors in existing text. " +
                            "Limit your response to no more than 200 characters, but make sure to construct complete sentences." +
                            "Use Markdown formatting when appropriate."
                    },
                    {
                        role: "user",
                        content: `The existing text is: ${prompt}`
                    }
                ];
                break;
            case "zap":
                messages = [
                    {
                        role: "system",
                        content:
                            "You are an AI writing assistant that generates text based on a prompt. " +
                            "You take an input from the user and a command for manipulating the text" +
                            "Use Markdown formatting when appropriate."
                    },
                    {
                        role: "user",
                        content: `For this text: ${prompt}. You have to respect the command: ${command}`
                    }
                ];
                break;

            default:
                throw new AppError(`Invalid option: ${option}`, StatusCodes.BAD_REQUEST);
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            stream: true,
            messages,
            temperature: 0.7,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            n: 1
        });

        return response;
    }
}

export default AIService;
