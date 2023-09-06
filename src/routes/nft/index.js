import React, { useEffect, useState, useRef } from 'react';
import NavBar from "../../components/navbar";
import useNFTStore from "../../store/nft";
import { Box, Button, Center, Container, Flex, Grid, GridItem, Heading, Image, Input, SkeletonText, Stack, StackDivider, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useToast } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Textarea } from '@chakra-ui/react'
import SendNftModal from '../../components/sendNftModal';
import Loading from '../../components/loader';
import axios from 'axios';



const NFTRoute = () => {

    const [image, setImage] = useState(null);
    const inputRef = useRef(null);

    const [allOrders, setAllOrders] = useState([])
    const [allNfts, setAllNfts] = useState(undefined)
    const shop = window.lookbook.shop
    const nftState = useNFTStore((state) => state.nftState);
    const postNFTState = useNFTStore((state) => state.postNFTState);
    const postNFTBadge = useNFTStore((state) => state.postNFTBadge);
    const storeNft = useNFTStore((state) => state.storeNft);
    const selectNft = useNFTStore((state) => state.selectNft);

    // useEffect(() => {
    //     fetch(`${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/get_orders?shop=${shop}`)
    //         .then(res => res.json())
    //         .then(data => setAllOrders(data));
    // }, [shop])

    console.log(allOrders)

    useEffect(() => {
        const getNfts = async () => {
            const { data } = await axios.get(`${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/get_nfts?shop=${shop}`);
            setAllNfts(data)
        }
        getNfts()
    }, [nftState.storeNft.loading, shop])



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

    const handleCreateNFT = () => {

        const seed = process.env.REACT_APP_XRP_NFT_ACCOUNT_SEED;
        const uri = `${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/badge_nft?id=${nftState.badge.success.data.objectId}`;
        const transferFee = 1;
        const flags = 8;
        postNFTState(seed, uri, transferFee, flags);
    }


    if (nftState.post.success.ok && !nftState.storeNft.success.ok) {
        toast({
            title: "NFT created successfully",
            status: "success",
        });
    }


    let length = 0;
    let token = ""
    length = nftState?.post?.success?.data?.result?.account_nfts.length;


    if (nftState?.post?.success?.data?.result?.account_nfts.length) {
        token = nftState?.post?.success?.data?.result?.account_nfts[length - 1]
    }


    const saveNft = () => {
        const title = nftState?.badge?.success?.data?.name;
        const image = nftState?.badge?.success?.data?.image;
        const description = nftState?.badge?.success?.data?.description;
        const token = nftState?.post?.success?.data?.result?.account_nfts[length - 1].NFTokenID;

        if (token) {
            storeNft(title, description, image, token)
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
                                        Step 4 - Go to the transfer tab from top and send the NFT badge to your customer.

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

                                                        {nftState.post.success.ok ?
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

                                                        {nftState.post.success.ok ?
                                                            <Button isLoading={nftState.storeNft.loading} colorScheme={"messenger"} variant='solid' mt={'10px'}
                                                                onClick={saveNft}
                                                                isDisabled={nftState.storeNft.success.ok}>
                                                                Save NFT Badge
                                                            </Button> :
                                                            <Button isLoading={nftState.post.loading} colorScheme={"messenger"} variant='solid' mt={'10px'} isDisabled={nftState.post.success.ok}
                                                                onClick={handleCreateNFT}>
                                                                Create NFT with your badge
                                                            </Button>}


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
                                                                src="https://s3.amazonaws.com/ionic-marketplace/image-upload/icon.png" alt='nft badge' />)}
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


                                        {/* {nftState.badge.success.ok || nftState.post.success.ok ?
                                        <Box width={"50%"}>

                                            <Heading fontSize={'large'} textAlign={'center'} my='16px'>

                                                {nftState.post.success.ok ?
                                                    "Save your NFT badge" : "Your Created Badge"}
                                            </Heading>
                                            <Center >
                                                <Image
                                                    borderRadius='3xl'
                                                    boxSize='150px'
                                                    src={nftState.badge.success.data.image}
                                                    alt='Badge Image'
                                                />
                                            </Center>
                                            <Center >
                                                <Text>{nftState.badge.success.data.name}</Text>
                                            </Center>
                                            <Center>

                                                {nftState.post.success.ok ?
                                                    <Button isLoading={nftState.storeNft.loading} colorScheme={"messenger"} variant='solid' mt={'10px'}
                                                        onClick={saveNft}
                                                        isDisabled={nftState.storeNft.success.ok}>
                                                        Save NFT Badge
                                                    </Button> :
                                                    <Button isLoading={nftState.post.loading} colorScheme={"messenger"} variant='solid' mt={'10px'} isDisabled={nftState.post.success.ok}
                                                        onClick={handleCreateNFT}>
                                                        Create NFT with your badge
                                                    </Button>}


                                            </Center>
                                        </Box> : ""} */}

                                    </Flex>
                                </form>
                            </Box>


                            {nftState.post.success.ok ? <Box bg="white" maxW="5xl" mx="auto" borderRadius={10} p={5} mt={'24px'} boxShadow="md">
                                <Heading size='xs' mb={'20px'}>
                                    Created tokens for account : {nftState.post.success.data?.result?.account}
                                </Heading>
                                <Stack divider={<StackDivider />} spacing='4'>

                                    <Box key={token.NFTokenID}>
                                        <Text pt='2' fontSize='sm'>
                                            Serial :  {token.nft_serial}
                                        </Text>
                                        <Text pt='2' fontSize='sm'>
                                            Issuer :  {token.Issuer}
                                        </Text>
                                        <Text pt='2' fontSize='sm'>
                                            NFToken ID:  {token.NFTokenID}
                                        </Text>
                                        <Text pt='2' fontSize='sm'>
                                            Flags :  {token.Flags}
                                        </Text>
                                        <Text pt='2' fontSize='sm'>
                                            Transfer Fee :  {token.TransferFee}
                                        </Text>
                                        <Text pt='2' fontSize='sm'>
                                            Token URI :  {token.URI}
                                        </Text>
                                    </Box>

                                </Stack>
                            </Box> : ""}



                            {nftState.get.success.ok ? <Box bg="white" maxW="5xl" mx="auto" borderRadius={10} p={5} mt={'24px'} boxShadow="md">
                                <Heading size='xs' mb={'20px'}>
                                    Tokens for account : {nftState.get.success.data?.result?.account}
                                </Heading>
                                <Stack divider={<StackDivider />} spacing='4'>
                                    {nftState.get.success.data?.result?.account_nfts?.map(nfts =>
                                        <Box key={nfts.NFTokenID}>
                                            <Text pt='2' fontSize='sm'>
                                                Serial :  {nfts.nft_serial}
                                            </Text>
                                            <Text pt='2' fontSize='sm'>
                                                Issuer :  {nfts.Issuer}
                                            </Text>
                                            <Text pt='2' fontSize='sm'>
                                                NFToken ID:  {nfts.NFTokenID}
                                            </Text>
                                            <Text pt='2' fontSize='sm'>
                                                Flags :  {nfts.Flags}
                                            </Text>
                                            <Text pt='2' fontSize='sm'>
                                                Transfer Fee :  {nfts.TransferFee}
                                            </Text>
                                            <Text pt='2' fontSize='sm'>
                                                Token URI :  {nfts.URI}
                                            </Text>
                                        </Box>)}

                                </Stack>
                            </Box> : ""}
                        </TabPanel>

                        <TabPanel>
                            <Center>
                                <Heading fontSize={'2xl'}>
                                    Select an <Text as={'span'} textColor={'blue.500'}>NFTs</Text> to reward your customer
                                </Heading>
                            </Center>
                            {nftState.select.success?.data?.image ?
                                <>
                                    <Heading fontSize={'large'} textAlign={'center'} my='16px'>Your Selected Badge</Heading>
                                    <Center >
                                        <Image
                                            borderRadius='3xl'
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
                                        <GridItem key={i} w='100%' bg={'white'} p={'2'} rounded={'2xl'}
                                            _hover="{ bg: 'blue.500' }">
                                            <Image
                                                borderRadius='3xl'
                                                boxSize='150px'
                                                src={nft.image}
                                                alt='Badge Image'
                                            />
                                            <Text align={'center'} mt={'1.5'} fontWeight={'semibold'}>
                                                {nft.name}
                                            </Text>
                                            <Center>
                                                <Button colorScheme={"messenger"} variant='solid' mt={'10px'} onClick={() => handleSelectNft(nft)}>
                                                    Select
                                                </Button>
                                            </Center>
                                        </GridItem>
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

                                        <Heading fontSize={'large'} textAlign={'center'} my='16px'>Your Selected Badge</Heading>
                                        <Center >
                                            <Image
                                                borderRadius='3xl'
                                                boxSize='150px'
                                                src={nftState.select.success?.data?.image}
                                                alt='Badge Image'
                                            />
                                        </Center>
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

                                {nftState.offer.success.ok ? <Box bg="white" maxW="5xl" mx="auto" borderRadius={10} p={5} mt={'24px'} boxShadow="md">
                                    <Heading size='xs' mb={'20px'} fontWeight={"semibold"}>
                                        Created offers for NFToken ID : {nftState.offer.success.data?.result?.nft_id}
                                    </Heading>
                                    <Stack divider={<StackDivider />} spacing='4'>
                                        {nftState.offer.success.data?.result?.offers?.map(offer =>
                                            <Box key={offer.NFTokenID}>
                                                <Text>Your NFT Badge has been sent to XRP wallet address <Text as={'span'} fontWeight={'bold'}>{offer.destination}</Text>
                                                </Text>

                                            </Box>)}
                                        <Text fontStyle={"italic"} as='u' cursor={'pointer'}>
                                            <a href={nftState.offer.success.data?.payload?.next?.always} target='_blank' rel="noreferrer">Offer Accept QR </a>
                                        </Text>
                                    </Stack>
                                </Box> : ""}


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
                                            <Box width={"100%"} alignItems="center">
                                                <SkeletonText mt="4" noOfLines={4} spacing="4" />
                                            </Box> :

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