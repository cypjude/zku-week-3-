/* istanbul ignore file */
import { connect, disconnect, drop, getState } from "@interep/db"
import config from "src/config"
import { logger } from "src/utils/backend"

export async function connectDatabase() {
    if (getState() !== 0) {
        return
    }

    const { MONGO_URL } = config

    if (!MONGO_URL) {
        throw new Error("Please define the MONGO_URL environment variable inside .env")
    }

    await connect(MONGO_URL, (error) => {
        logger.error("Database connection error:", error)
    }).catch((error) => logger.error(error))

    logger.info("Mongo db has been connected")
}

export async function disconnectDatabase() {
    if (getState() !== 1) {
        return
    }

    await disconnect()

    logger.info("Mongo db has been disconnected")
}

export async function dropDatabase() {
    if (getState() !== 1) {
        return
    }

    await drop()

    logger.info("Mongo db has been cleared")
}
