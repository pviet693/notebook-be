import OpenAI from "openai";

import { envConfig } from "@/configs/env.config";

const openai = new OpenAI({
    apiKey: envConfig?.OPENAI_API_KEY
});

export default openai;
