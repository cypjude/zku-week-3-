import { ethers } from "ethers"
import { NextApiRequest, NextApiResponse } from "next"
import { appendLeaf, deleteLeaf } from "src/core/groups/mts"
import { getPoapEventsByAddress, PoapEvent } from "src/core/poap"
import { logger } from "src/utils/backend"
import { connectDatabase } from "src/utils/backend/database"

export default async function handlePoapMemberController(req: NextApiRequest, res: NextApiResponse) {
    const name = req.query?.name as PoapEvent
    const member = req.query?.member as string
    const { userSignature, userAddress } = JSON.parse(req.body)

    if (!userSignature || !userAddress) {
        res.status(400).end()
        return
    }

    if (ethers.utils.verifyMessage(member, userSignature) !== userAddress) {
        res.status(403).send("The signature is not valid")
        return
    }

    try {
        const userPoapGroupNames = await getPoapEventsByAddress(userAddress)

        if (!userPoapGroupNames.includes(name as PoapEvent)) {
            throw new Error(`The address does not hold the group POAP token`)
        }

        await connectDatabase()

        if (req.method === "POST") {
            await appendLeaf("poap", name, member)
        } else {
            await deleteLeaf("poap", name, member)
        }

        res.status(201).send({ data: true })
    } catch (error) {
        res.status(500).end()

        logger.error(error)
    }
}
