import {
    Box,
    Container,
    Heading,
    HStack,
    Icon,
    IconButton,
    Spinner,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    Tooltip,
    useBoolean,
    useColorMode,
    VStack
} from "@chakra-ui/react"
import { signOut, useSession } from "next-auth/client"
import { useRouter } from "next/router"
import React, { useContext } from "react"
import { FaInfoCircle } from "react-icons/fa"
import { IoMdArrowRoundBack } from "react-icons/io"
import EmailGroups from "src/components/EmailGroups"
import OAuthGroups from "src/components/OAuthGroups"
import PoapGroups from "src/components/PoapGroups"
import TelegramGroups from "src/components/TelegramGroups"
import EthereumWalletContext from "src/context/EthereumWalletContext"
import { capitalize } from "src/utils/common"

export default function Groups(): JSX.Element {
    const router = useRouter()
    const [session] = useSession()
    const { colorMode } = useColorMode()
    const { _account } = useContext(EthereumWalletContext)
    const [_loading, setLoading] = useBoolean()
    const parameters = router.query.provider as string[]

    function isTelegramMagicLink(parameters: string[]): boolean {
        return Array.isArray(parameters) && parameters.length === 3 && parameters[0] === "telegram"
    }

    function isEmailMagicLink(parameters: string[]): boolean {
        return Array.isArray(parameters) && parameters.length === 4 && parameters[0] === "email"
    }

    function isPoapLink(parameters: string[]): boolean {
        return Array.isArray(parameters) && parameters.length === 1 && parameters[0] === "poap"
    }

    async function back() {
        setLoading.on()

        if (session) {
            await signOut({ redirect: false })
        }

        await router.push("/")
    }

    return (
        <Container flex="1" mb="80px" mt="180px" px="80px" maxW="container.md">
            <VStack align="left">
                <HStack flex="1" pb="4" borderBottomWidth="2px" spacing="4">
                    <IconButton onClick={() => back()} aria-label="Back" icon={<IoMdArrowRoundBack />} />
                    <Heading as="h2" size="xl">
                        Interep Groups
                        <Tooltip
                            label="Interep groups will allow you to access services and DApps using Interep."
                            placement="right-start"
                        >
                            <span>
                                <Icon
                                    boxSize="20px"
                                    ml="10px"
                                    mb="5px"
                                    color={colorMode === "light" ? "gray.500" : "background.200"}
                                    as={FaInfoCircle}
                                />
                            </span>
                        </Tooltip>
                    </Heading>
                </HStack>

                <HStack flex="1" align="start">
                    <Box flex="1">
                        {_loading ? (
                            <VStack h="300px" align="center" justify="center">
                                <Spinner thickness="4px" speed="0.65s" size="xl" />
                            </VStack>
                        ) : !_account ? (
                            <VStack h="300px" align="center" justify="center">
                                <Text fontSize="lg">Please, connect your wallet correctly!</Text>
                            </VStack>
                        ) : !session &&
                          !isTelegramMagicLink(parameters) &&
                          !isEmailMagicLink(parameters) &&
                          !isPoapLink(parameters) ? (
                            <VStack h="300px" align="center" justify="center">
                                <Text fontSize="lg">Please, sign in with one of our supported providers!</Text>
                            </VStack>
                        ) : (
                            <Tabs mt="20px" variant="solid-rounded">
                                <TabList>
                                    {isTelegramMagicLink(parameters) && <Tab mr="10px">Telegram</Tab>}
                                    {isEmailMagicLink(parameters) && <Tab mr="10px">Email</Tab>}
                                    {isPoapLink(parameters) && <Tab mr="10px">POAP</Tab>}
                                    {session && <Tab mr="10px">{capitalize(session.provider)}</Tab>}
                                </TabList>
                                <TabPanels>
                                    {isTelegramMagicLink(parameters) && (
                                        <TabPanel>
                                            <TelegramGroups userId={parameters[1]} groupId={parameters[2]} />
                                        </TabPanel>
                                    )}
                                    {isEmailMagicLink(parameters) && (
                                        <TabPanel>
                                            <EmailGroups
                                                userToken={parameters[1]}
                                                userId={parameters[2]}
                                                groupId={parameters[3]}
                                            />
                                        </TabPanel>
                                    )}
                                    {isPoapLink(parameters) && (
                                        <TabPanel>
                                            <PoapGroups />
                                        </TabPanel>
                                    )}
                                    {session && (
                                        <TabPanel>
                                            <OAuthGroups />
                                        </TabPanel>
                                    )}
                                </TabPanels>
                            </Tabs>
                        )}
                    </Box>
                </HStack>
            </VStack>
        </Container>
    )
}
