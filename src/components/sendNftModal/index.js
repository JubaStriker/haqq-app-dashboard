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
    Flex,
} from '@chakra-ui/react';
import React from 'react';
import useNFTStore from '../../store/nft';

const SendNftModal = (props) => {

    const nftState = useNFTStore((state) => state.nftState);
    const code = props.code;
    const badge = props.badge;
    const name = props.name;
    const tokenID = props.tokenID;

    const { isOpen, onOpen, onClose } = useDisclosure();

    const onModalClose = () => {
        onClose();
    }

    const createSellOffer = useNFTStore((state) => state.createSellOffer);

    const handleCrateSellOffer = () => {
        const seed = process.env.REACT_APP_XRP_NFT_ACCOUNT_SEED;
        const flags = 1;
        const amount = "0";
        createSellOffer(seed, tokenID, amount, flags, code)
        onClose()
    };

    return (

        <>
            <Button
                onClick={() => onOpen()}
                colorScheme={"messenger"} variant='solid'
                isDisabled={nftState.offer.success.ok}
                isLoading={nftState.offer.loading}
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
                        <Center>
                            {badge === undefined ?
                                <Text color={"red.400"}>Create a badge first</Text>
                                :
                                <Image
                                    borderRadius='3xl'
                                    boxSize='150px'
                                    src={badge}
                                    alt='Badge Image'
                                />}
                        </Center>
                        <Text fontSize={'medium'} fontWeight={"semibold"} mt={'10'}>
                            Do you really want to send this badge to {name} ?
                        </Text>

                        <Flex justifyContent={'space-around'} mt={'5'}>
                            <Button
                                onClick={handleCrateSellOffer}
                                colorScheme={"green"} variant='solid'
                            >
                                Proceed
                            </Button>
                            <Button
                                onClick={() => onClose()}
                                colorScheme={"red"} variant='solid'
                            >
                                Cancel
                            </Button>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default SendNftModal;