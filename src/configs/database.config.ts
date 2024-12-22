import { Sequelize } from "sequelize";

import { envConfig } from "@/configs/env.config";

const MAX_RETRIES = 5;
const RETRY_DELAY = 10000;

const sequelize = new Sequelize({
    dialect: "postgres",
    host: envConfig!.POSTGRES_HOST,
    port: 5432,
    username: envConfig!.POSTGRES_USER,
    password: envConfig!.POSTGRES_PASSWORD,
    database: envConfig!.POSTGRES_DB,
    retry: {
        max: 5,
        match: [/SequelizeConnectionError/, /SequelizeTimeoutError/],
        backoffBase: 3000,
        backoffExponent: 1.5
    }
});

const connectWithRetry = async (retries: number = MAX_RETRIES): Promise<Sequelize> => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
        return sequelize;
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        if (retries === 0) {
            console.error("Max retries reached. Exiting...");
            throw new Error("Unable to connect to the database after multiple attempts");
        }

        console.log(`Retrying connection... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);

        // Wait for the specified delay before retrying the connection
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));

        // Retry the connection with the remaining number of retries
        return connectWithRetry(retries - 1);
    }
};

// Connect to the database and handle any errors
connectWithRetry().catch((err) => {
    console.error("Failed to connect to database:", err);
});

export default sequelize;
