import { TelegramUser } from "@interep/db"
import { TelegramGroup } from "@interep/telegram-bot"
import { NextApiRequest, NextApiResponse } from "next"
import { appendLeaf, deleteLeaf } from "src/core/groups/mts"
import { logger } from "src/utils/backend"
import { connectDatabase } from "src/utils/backend/database"
import { sha256 } from "src/utils/common/crypto"

export default async function handleTelegramMemberController(req: NextApiRequest, res: NextApiResponse) {
    const name = req.query?.name as TelegramGroup
    const member = req.query?.member as string
    const { telegramUserId } = JSON.parse(req.body)

    if (!telegramUserId) {
        res.status(400).end()
        return
    }

    try {
        await connectDatabase()

        const hashId = sha256(telegramUserId + name)
        const telegramUser = await TelegramUser.findByHashId(hashId)

        if (!telegramUser) {
            res.status(404).end()
            return
        }

        if (req.method === "POST") {
            if (telegramUser.hasJoined) {
                throw new Error(`Telegram user already joined this group`)
            }

            await appendLeaf("telegram", name, member)

            telegramUser.hasJoined = true
        } else {
            if (!telegramUser.hasJoined) {
                throw new Error(`Telegram user has not joined this group yet`)
            }

            await deleteLeaf("telegram", name, member)

            telegramUser.hasJoined = false
        }

        await telegramUser.save()

        res.status(201).send({ data: true })
    } catch (error) {
        res.status(500).end()

        logger.error(error)
    }
}
