import { EmailUser } from "@interep/db"
import { NextApiRequest, NextApiResponse } from "next"
import { EmailDomain } from "src/core/email"
import { appendLeaf, deleteLeaf } from "src/core/groups/mts"
import { logger } from "src/utils/backend"
import { connectDatabase } from "src/utils/backend/database"
import { sha256 } from "src/utils/common/crypto"

export default async function handleEmailMemberController(req: NextApiRequest, res: NextApiResponse) {
    const name = req.query?.name as EmailDomain
    const member = req.query?.member as string
    const { emailUserId, emailUserToken } = JSON.parse(req.body)

    if (!emailUserId || !emailUserToken) {
        res.status(400).end()
        return
    }

    try {
        await connectDatabase()

        const hashId = sha256(emailUserId + name)
        const emailUser = await EmailUser.findByHashId(hashId)

        if (!emailUser) {
            res.status(404).send("The email account does not exist")
            return
        }

        // Check if the user has the right token.
        if (emailUser.verificationToken !== emailUserToken) {
            res.status(401).end()
            return
        }

        if (req.method === "POST") {
            if (emailUser.hasJoined) {
                throw new Error(`Email user already joined this group`)
            }

            await appendLeaf("email", name, member)

            emailUser.hasJoined = true
        } else {
            if (!emailUser.hasJoined) {
                throw new Error(`Email user has not joined this group yet`)
            }

            await deleteLeaf("email", name, member)

            emailUser.hasJoined = false
        }

        await emailUser.save()

        res.status(201).send({ data: true })
    } catch (error) {
        res.status(500).end()

        logger.error(error)
    }
}
