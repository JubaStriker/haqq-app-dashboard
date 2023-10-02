import {
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    ModalHeader,
    ModalCloseButton,
    useDisclosure,
    Button,
    Center,
    Image,
    Text,
    Grid,
    GridItem,
    Box,
    Spinner,
    useToast,
} from '@chakra-ui/react';
import React from 'react';
import useNFTStore from '../../store/nft';
import useWalletStore from '../../store/wallet';

const SendNftModal = (props) => {

    let shop;
    const retrievedObject = localStorage.getItem('shop');
    const shopObj = JSON.parse(retrievedObject);
    shop = shopObj?.shop;

    const nftState = useNFTStore((state) => state.nftState);
    const code = props.code;
    const badge = props.badge;
    const name = props.name;
    const email = props.email;
    const tokenID = props.tokenID;
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const onModalClose = () => {
        onClose();
    }

    const createSellOffer = useNFTStore((state) => state.createSellOffer);
    const sendNFT = useNFTStore((state) => state.sendNFT);
    const getWalletAddress = useWalletStore((state) => state.getWalletAddress);

    const handleCrateSellOffer = async () => {
        const accountDetails = await getWalletAddress(shop)
        const account = accountDetails.walletAddress;
        const result = await createSellOffer(account, code, tokenID)

        onOpen();
        const client = new WebSocket(result.status);
        client.onopen = () => {
            console.log("Connected.....");
        };
        client.onmessage = async (e) => {
            const newObj = await JSON.parse(e.data);

            const txid = await newObj.txid;

            if (txid !== undefined) {
                onClose();
                const data = await sendNFT({ code, name, email, txid })
                console.log(data);
                toast({
                    title:
                        "NFT sent successfully",
                    status: "success",
                });
            }
        };
    };

    const renderNftStatus = () => {

        if (badge === undefined) {
            <Text color={"red.400"}>Create a badge first</Text>
        }


        if (nftState.offer.loading) {
            return (
                <Box minH={"400px"} width="20%" m="auto" p={5}>
                    <Spinner
                        thickness="4px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="blue.500"
                        size="xl"
                    />
                </Box>
            )
        }
        else if (nftState.offer.success.ok) {
            return (
                <Grid gap={6}>
                    <GridItem alignContent={"center"}>
                        <Center width={"100%"}>
                            <Image
                                border={"2px"}
                                src={nftState.offer.success?.data?.qr}
                                width="200px"
                            />
                        </Center>
                    </GridItem>
                    <GridItem>
                        <Center>
                            <Text>
                                Please scan the QR code with
                            </Text>
                            <Image src={"https://www.drupal.org/files/project-images/Screen%20Shot%202020-04-13%20at%2018.52.18.png"} width="90px" />
                            <Text>
                                on your smartphone.
                            </Text>
                        </Center>
                    </GridItem>
                </Grid>

            )
        }
    }

    return (

        <>
            <Button
                onClick={handleCrateSellOffer}
                colorScheme={"messenger"} variant='solid'
                isDisabled={nftState.offer.success.ok || nftState.offer.loading}
                loadingText='sending badge'
            >
                Reward badge
            </Button>
            <Modal isOpen={isOpen} onClose={onModalClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader colorScheme="blue.500">Reward Badge to your customer</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {renderNftStatus()}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default SendNftModal;