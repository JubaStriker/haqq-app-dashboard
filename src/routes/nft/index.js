import React, { useEffect, useState, useRef } from 'react';
import NavBar from "../../components/navbar";
import useNFTStore from "../../store/nft";
import { Alert, AlertDescription, AlertIcon, Box, Button, Center, Container, Flex, Grid, GridItem, Heading, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, SkeletonText, Spinner, Stack, StackDivider, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Textarea } from '@chakra-ui/react'
import SendNftModal from '../../components/sendNftModal';
import Loading from '../../components/loader';
import axios from 'axios';
import useWalletStore from '../../store/wallet';



const NFTRoute = () => {

    let shop;
    const retrievedObject = localStorage.getItem('shop');
    const shopObj = JSON.parse(retrievedObject);
    shop = shopObj?.shop;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [image, setImage] = useState(null);
    const inputRef = useRef(null);
    const [allOrders, setAllOrders] = useState([])
    const [allNfts, setAllNfts] = useState(undefined)
    const [nftId, setNftId] = useState('')
    // const shop = window.lookbook.shop;
    const nftState = useNFTStore((state) => state.nftState);
    const postNFTState = useNFTStore((state) => state.postNFTState);
    const getNFTState = useNFTStore((state) => state.getNFTState);
    const postNFTBadge = useNFTStore((state) => state.postNFTBadge);
    const storeNft = useNFTStore((state) => state.storeNft);
    const selectNft = useNFTStore((state) => state.selectNft);
    const getWalletAddress = useWalletStore((state) => state.getWalletAddress);

    useEffect(() => {
        fetch(`https://jubairhossain.pagekite.me/api/get_orders?shop=${shop}`)
            .then(res => res.json())
            .then(data => setAllOrders(data));
    }, [shop])


    // console.log(allOrders)

    useEffect(() => {
        const getNfts = async () => {
            const { data } = await axios.get(`${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/get_nfts?shop=${shop}`);
            setAllNfts(data)
        }
        getNfts()
    }, [nftState.storeNft.loading, shop, nftState.send.loading])



    let orders = allOrders.filter(order => order.discount_codes.length >= 0)

    const toast = useToast();
    const imageHostKey = process.env.REACT_APP_IMAGE_BB_KEY;

    const handleImageClick = () => {
        inputRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file)
    }


    const handleCreateBadge = (event) => {
        event.preventDefault();
        const form = event.target;
        const title = form.title.value;
        const description = form.description.value;
        const formData = new FormData();
        formData.append('image', image);
        const url = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;

        fetch(url, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(imgData => {
                postNFTBadge(title, description, imgData.data.url)
            })

        form.reset();

    }

    const renderNftStatus = () => {
        if (nftState.post.loading) {
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
        else if (nftState.post.success.ok) {
            return (
                <Grid gap={6}>
                    <GridItem alignContent={"center"}>
                        <Center width={"100%"}>
                            <Image
                                border={"2px"}
                                src={nftState.post.success?.data?.qr}
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




    const handleCreateNFT = async () => {
        onOpen();
        const uri = `${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/badge_nft?id=${nftState.badge.success.data.objectId}`;
        const accountDetails = await getWalletAddress(shop)
        const account = accountDetails.walletAddress;
        const result = await postNFTState(account, uri);

        const client = new WebSocket(result.status);
        client.onopen = () => {
            console.log("Connected.....");
        };
        client.onmessage = async (e) => {
            const newObj = await JSON.parse(e.data);

            const txid = await newObj.txid;
            console.log(newObj)
            if (txid !== undefined) {
                getNFTState(txid);
                onClose();
                toast({
                    title:
                        "NFT created successfully ",
                    status: "success",
                });
            }
        };
    }


    useEffect(() => {
        setNftId(nftState.get.success.data?.nftoken_id)
    }, [nftState.get.success.data])



    const saveNft = async () => {
        const title = nftState?.badge?.success?.data?.name;
        const image = nftState?.badge?.success?.data?.image;
        const description = nftState?.badge?.success?.data?.description;
        const token = nftState.get.success.data?.nftoken_id;

        if (token) {
            const data = await storeNft(title, description, image, token);
            if (data) {
                toast({
                    title:
                        "NFT saved successfully",
                    status: "success",
                });
            }

        }
    }


    const handleSelectNft = (nft) => {
        selectNft(nft);
        console.log(nftState?.select?.success?.data)
    }






    return (
        <>
            <NavBar></NavBar>
            <Container maxW={"9xl"} p={[12, 6]} bg="#f6f6f7" textAlign={"left"}>

                <Box as="section" maxW="5xl" mx="auto">
                    <Text fontSize={"24px"} fontWeight={"semibold"}>Create <Text as="span" color='blue.600' fontWeight={"bold"}>NFTs</Text> to gift your customers</Text>
                </Box>

                <Tabs maxW="5xl" mx="auto" mt={"24px"}>
                    <TabList>
                        <Tab>Create</Tab>
                        <Tab >Select</Tab>
                        <Tab>Transfer</Tab>


                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            <Box bg="white" maxW="5xl" mx="auto" borderRadius={10} p={5} mt={'24px'} boxShadow="md">
                                <Text mb='8px' align={"center"} fontSize={"2xl"} mt={'8px'} fontWeight="bold" textColor={'black'} >Create Discount                  <Text as={'span'} textColor={'orange.500'}>Badges/NFT</Text> and send them to your customers for <Text as={'span'} textColor={'orange.500'}>bonus</Text> </Text>

                                <Text my='14px'>
                                    Just follow four simple steps...
                                </Text>

                                {nftState.badge.success.ok ? <Text my='10px' fontWeight='semibold' fontSize={'xl'} textColor={'blue.600'}>
                                    Step 2 -  Create an NFT associated with your badge clicking Create NFT with your badge button.
                                </Text> : <Text my='10px' fontWeight='semibold' fontSize={'xl'} textColor={'blue.600'}>
                                    Step 1 -  Create a good looking badge with suitable title, description and image.
                                </Text>}

                                {nftState.post.success.ok ? <Text my='10px' fontWeight='semibold' fontSize={'xl'} textColor={'blue.600'}>

                                    Step 3 - Save your NFT badge.
                                </Text> :
                                    ""}

                                {nftState.storeNft.success.ok ?
                                    <Text my='10px' fontWeight='semibold' fontSize={'xl'} textColor={'blue.600'}>
                                        Step 4 - Go to the select tab from top and send the NFT badge to send to your customer.
                                    </Text> : ""}

                                <form onSubmit={handleCreateBadge}>

                                    <Flex justifyContent={"center"} alignItems={"center"} mt='24px' gap={'10'}>
                                        {nftState.badge.success.ok || nftState.post.success.ok ? "" :
                                            <Box width={'50%'}>
                                                <Text mb='4px' mt={'8px'} size="xl" fontWeight="bold" >Title of your NFT badge</Text>
                                                <Input
                                                    name='title'
                                                    placeholder='Title of your NFT badge'
                                                    size='sm'
                                                    required={true}
                                                />
                                                <Text mb='4px' mt={'8px'} size="xl" fontWeight="bold" >Description</Text>
                                                <Textarea name="description" placeholder='Description of your NFT badge' />

                                            </Box>}
                                        <Box>
                                            {nftState.badge.success.ok || nftState.post.success.ok ?

                                                <Box>

                                                    <Heading fontSize={'large'} textAlign={'center'} my='16px'>

                                                        {nftState.get.success.ok ?
                                                            "Save your NFT badge" : "Your Created Badge"}
                                                    </Heading>
                                                    <Center >
                                                        <Image
                                                            borderRadius='xl'
                                                            boxSize='200px'
                                                            src={nftState.badge.success.data.image}
                                                            alt='Badge Image'
                                                        />
                                                    </Center>
                                                    <Center >
                                                        <Text>{nftState.badge.success.data.name}</Text>
                                                    </Center>
                                                    <Center>

                                                        {nftState.get.success.ok ?
                                                            <Button isLoading={nftState.storeNft.loading} colorScheme={"messenger"} variant='solid' mt={'10px'}
                                                                onClick={saveNft}
                                                                isDisabled={nftState.storeNft.success.ok}>
                                                                Save NFT Badge
                                                            </Button> :
                                                            <Button isLoading={nftState.post.loading} colorScheme={"messenger"} variant='solid' mt={'10px'} isDisabled={nftState.get.success.ok}
                                                                onClick={handleCreateNFT}>
                                                                Create NFT with your badge
                                                            </Button>}

                                                        <Modal isOpen={isOpen} onClose={onClose} size="xl">
                                                            <ModalOverlay />
                                                            <ModalContent>
                                                                <ModalHeader colorScheme="blue.500">
                                                                    <Center>
                                                                        <Text>
                                                                            Open
                                                                        </Text>
                                                                        <Image src={"https://www.drupal.org/files/project-images/Screen%20Shot%202020-04-13%20at%2018.52.18.png"} width="90px" />
                                                                        <Text>
                                                                            App
                                                                        </Text>
                                                                    </Center>

                                                                </ModalHeader>
                                                                <ModalCloseButton />
                                                                <ModalBody>{renderNftStatus()}</ModalBody>
                                                            </ModalContent>
                                                        </Modal>
                                                    </Center>
                                                </Box>

                                                : <>
                                                    <Text mb='4px' mt={'8px'} size="xl" fontWeight="bold" >Upload Badge Image</Text>

                                                    <div onClick={handleImageClick} style={{ cursor: 'pointer' }}>

                                                        {image ? (<Image
                                                            borderRadius='xl'
                                                            boxSize='200px'
                                                            src={URL.createObjectURL(image)} alt='' />) :
                                                            (<Image
                                                                borderRadius='xl'
                                                                boxSize='200px'
                                                                src="https://png.pngtree.com/png-vector/20191129/ourmid/pngtree-image-upload-icon-photo-upload-icon-png-image_2047546.jpg" alt='nft badge' />)}
                                                        <Input
                                                            type='file'
                                                            px='4'
                                                            name='image'
                                                            size='sm'
                                                            required={true}
                                                            ref={inputRef}
                                                            onChange={handleImageChange}
                                                            style={{ display: 'none' }}
                                                        />
                                                    </div>
                                                    <Text mb='4px' ml='4' size="xl" textColor={'gray.400'} >Choose an eye catchy image to make your customer feel special</Text>

                                                    <Button isLoading={nftState.badge.loading} type='submit' colorScheme={"messenger"} variant='solid' mt={'10px'}
                                                        disabled={nftState.badge.success.ok}>
                                                        {nftState.badge.loading ? "Loading" : "Create Badge"}
                                                    </Button>
                                                </>}
                                        </Box>
                                    </Flex>
                                </form>
                            </Box>


                            {nftState.get.success.ok ?
                                <Alert
                                    status={'success'}
                                    variant="subtle"
                                    flexDirection="column"
                                    alignItems="center"
                                    justifyContent="center"
                                    textAlign="center"
                                    height="300px"
                                    rounded="md"
                                    boxShadow="2xl"
                                    mt={'3'}
                                >
                                    <Heading size='xs' mb={'20px'} textAlign={'center'} fontSize={'2xl'}>
                                        NFT created <Text as={'span'} color={'green.400'}>Successfully</Text>
                                    </Heading>
                                    <AlertIcon boxSize="40px" mr={0} />
                                    <AlertDescription maxWidth="sm" mt={2}>
                                        <Text fontStyle={"italic"} as='u' cursor={'pointer'} mt={'2'}>
                                            <a href={`https://test.bithomp.com/nft/${nftId}`} target='_blank' rel="noreferrer">View your NFT on bithomp </a>
                                        </Text>
                                    </AlertDescription>
                                </Alert>

                                : ""}
                        </TabPanel>

                        <TabPanel>
                            <Center>
                                <Heading fontSize={'2xl'}>
                                    Select an <Text as={'span'} textColor={'blue.500'}>NFTs</Text> to reward your customer
                                </Heading>
                            </Center>
                            {nftState.select.success?.ok ?
                                <>
                                    <Heading fontSize={'large'} textAlign={'center'} my='16px'>Your Selected Badge</Heading>
                                    <Center >
                                        <Image
                                            borderRadius='lg'
                                            boxSize='150px'
                                            src={nftState.select.success?.data?.image}
                                            alt='Badge Image'
                                        />
                                    </Center>
                                    <Text mt={'3'} fontWeight={'bold'} align={'center'}>{nftState.select.success?.data?.name}</Text>

                                </> :
                                ""}
                            {allNfts ? <Center mt={'8'}>
                                <Grid templateColumns='repeat(3, 1fr)' gap={'16'}>
                                    {allNfts.map((nft, i) =>
                                        <Center key={i} py={12}
                                            onClick={() => handleSelectNft(nft)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <Box
                                                role={'group'}
                                                p={6}
                                                maxW={'330px'}
                                                w={'full'}
                                                bg={'white'}
                                                boxShadow={'2xl'}
                                                rounded={'lg'}
                                                pos={'relative'}
                                                zIndex={1}>
                                                <Box
                                                    rounded={'lg'}
                                                    mt={-12}
                                                    pos={'relative'}
                                                    height={'200px'}
                                                    _after={{
                                                        transition: 'all .3s ease',
                                                        content: '""',
                                                        w: 'full',
                                                        h: 'full',
                                                        pos: 'absolute',
                                                        top: 5,
                                                        left: 0,
                                                        backgroundImage: `url(${nft.image})`,
                                                        filter: 'blur(15px)',
                                                        zIndex: -1,
                                                    }}
                                                    _groupHover={{
                                                        _after: {
                                                            filter: 'blur(20px)',
                                                        },
                                                    }}>
                                                    <Image
                                                        rounded={'lg'}
                                                        height={230}
                                                        width={282}
                                                        objectFit={'cover'}
                                                        src={nft.image}
                                                        alt="#"
                                                    />
                                                </Box>
                                                <Stack pt={10} align={'center'}>
                                                    <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
                                                        Badge
                                                    </Text>
                                                    <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
                                                        {nft.name}
                                                    </Heading>
                                                    <Stack direction={'row'} align={'center'}>
                                                        <Text fontWeight={100} fontSize={'sm'}>
                                                            {nft.description}
                                                        </Text>
                                                    </Stack>
                                                </Stack>
                                            </Box>
                                        </Center>
                                    )}

                                </Grid>
                            </Center> :
                                <Loading />
                            }
                        </TabPanel>

                        <TabPanel>
                            <Box bg="white" maxW="5xl" mx="auto" borderRadius={10} p={5} mt={'24px'} boxShadow="md">

                                {nftState.offer.success.ok ?
                                    "" : <Box width={"100%"}>

                                        <Text mb='8px' align={"center"} fontSize={"2xl"} mt={'8px'} fontWeight="bold" textColor={'orange.400'} >Send your created NFT badge to your desired customer </Text>

                                        {nftState.select.success?.ok ?
                                            <>
                                                <Heading fontSize={'large'} textAlign={'center'} my='16px'>Your Selected Badge</Heading>
                                                <Center >
                                                    <Image
                                                        borderRadius='lg'
                                                        boxSize='150px'
                                                        src={nftState.select.success?.data?.image}
                                                        alt='Badge Image'
                                                    />
                                                </Center>
                                            </> :
                                            ""}
                                        <Center >
                                            <Text fontWeight={'semibold'}>{nftState.select.success?.data?.name}</Text>
                                        </Center>
                                        <Center >
                                            <Text mt={'6px'}>{nftState.badge.select?.data?.description}</Text>
                                        </Center>

                                    </Box>}


                                {nftState.offer.loading ? <>
                                    <Loading></Loading>
                                </> : ""}
                                {nftState.send.success.ok ? <Alert
                                    status={'success'}
                                    variant="subtle"
                                    flexDirection="column"
                                    alignItems="center"
                                    justifyContent="center"
                                    textAlign="center"
                                    height="200px"
                                    rounded="md"
                                    boxShadow="lg"
                                    mt={'3'}
                                    mb={4}
                                >
                                    <AlertIcon boxSize="40px" mb={2} />
                                    <Heading size='xs' mb={'20px'} textAlign={'center'} fontSize={'2xl'}>
                                        NFT sent <Text as={'span'} color={'green.400'}>Successfully</Text>
                                    </Heading>

                                </Alert> : ""}

                                {nftState.send.loading ? <Alert
                                    status={'info'}
                                    variant="subtle"
                                    flexDirection="column"
                                    alignItems="center"
                                    justifyContent="center"
                                    textAlign="center"
                                    height="200px"
                                    rounded="md"
                                    boxShadow="lg"
                                    mt={'3'}
                                    mb={4}
                                >

                                    <AlertDescription maxWidth='sm' mb={'6'}>
                                        Please wait while your transaction is in progress...
                                    </AlertDescription>
                                    <Spinner
                                        thickness="4px"
                                        speed="0.65s"
                                        emptyColor="gray.200"
                                        color="blue.500"
                                        size="xl"
                                    />
                                </Alert> : ""}


                                <Text mb='4px' align={"center"} mt={'8px'} size="xl" fontWeight="bold" >All of your orders that were paid through XRP</Text>



                                <TableContainer p="5">
                                    <Table variant={"simple"}>
                                        <Thead>
                                            <Tr>
                                                <Th>#</Th>
                                                <Th>Customer Name</Th>
                                                {/* <Th isNumeric>Amount</Th> */}
                                                <Th>Email</Th>
                                                <Th>Address</Th>
                                                <Th>Transfer NFT</Th>
                                            </Tr>
                                        </Thead>
                                        {orders.length === 0 ?
                                            <Tbody>
                                                <Td><SkeletonText mt="4" noOfLines={5} spacing="4" /></Td>
                                                <Td><SkeletonText mt="4" noOfLines={5} spacing="4" /></Td>
                                                <Td><SkeletonText mt="4" noOfLines={5} spacing="4" /></Td>
                                                <Td><SkeletonText mt="4" noOfLines={5} spacing="4" /></Td>
                                                <Td><SkeletonText mt="4" noOfLines={5} spacing="4" /></Td>
                                            </Tbody>
                                            :
                                            <Tbody>
                                                {orders.map(
                                                    (order, i) => (
                                                        <Tr key={i}>
                                                            <Td>{i + 1}</Td>
                                                            <Td>{order.billing_address?.first_name}</Td>
                                                            <Td >
                                                                {order.contact_email}
                                                            </Td>
                                                            <Td >{order.shipping_address?.address1}</Td>
                                                            <Td>
                                                                <SendNftModal code={order.discount_codes[0]?.code}
                                                                    badge={nftState?.select?.success?.data?.image}
                                                                    name={order.billing_address?.first_name}
                                                                    email={order.contact_email}
                                                                    tokenID={nftState?.select?.success?.data?.token} />
                                                            </Td>
                                                        </Tr>
                                                    )
                                                )}
                                            </Tbody>
                                        }
                                    </Table>
                                </TableContainer>
                            </Box>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Container >
        </>
    );
};

export default NFTRoute;