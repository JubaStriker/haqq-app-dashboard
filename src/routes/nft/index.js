import React, { useEffect, useState } from 'react';
import NavBar from "../../components/navbar";
import useNFTStore from "../../store/nft";
import { Box, Button, Center, Container, Flex, Heading, Image, Input, SkeletonText, Stack, StackDivider, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useToast } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Textarea } from '@chakra-ui/react'
import SendNftModal from '../../components/sendNftModal';
import Loading from '../../components/loader';


const NFTRoute = () => {

    const [allOrders, setAllOrders] = useState([])
    const shop = window.lookbook.shop

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/get_orders?shop=${shop}`)
            .then(res => res.json())
            .then(data => setAllOrders(data));
    }, [shop])

    let orders = allOrders.filter(order => order.discount_codes.length >= 0)

    console.log(orders, "ORDERS")

    const nftState = useNFTStore((state) => state.nftState);
    const postNFTState = useNFTStore((state) => state.postNFTState);
    const postNFTBadge = useNFTStore((state) => state.postNFTBadge);
    const createSellOffer = useNFTStore((state) => state.createSellOffer);
    const toast = useToast();
    const imageHostKey = process.env.REACT_APP_IMAGE_BB_KEY


    const handleCreateBadge = (event) => {
        event.preventDefault();
        const form = event.target;
        const title = form.title.value;
        const description = form.description.value;
        const image = form.image.files[0];
        const formData = new FormData();
        formData.append('image', image);
        const url = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;

        fetch(url, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(imgData => {
                console.log("Image URL", imgData.data.url);

                postNFTBadge(title, description, imgData.data.url)
                console.log(nftState.badge, "Badge State")
            })

        form.reset();

    }

    const handleCreateNFT = () => {

        const seed = process.env.REACT_APP_XRP_NFT_ACCOUNT_SEED;
        const uri = `https://jubairhossain.pagekite.me:443/api/badge_nft?id=${nftState.badge.success.data.objectId}`;
        const transferFee = 1;
        const flags = 8;
        postNFTState(seed, uri, transferFee, flags);
    }


    if (nftState.post.success.ok) {
        toast({
            title: "NFT created successfully",
            status: "success",
        });
    }

    if (nftState.offer.success.ok) {
        toast({
            title: "NFToken offer created successfully",
            status: "success",
        });
    }


    let length = 0;
    let NFTokenID = ""
    let token = ""
    length = nftState?.post?.success?.data?.result?.account_nfts.length;


    if (nftState?.post?.success?.data?.result?.account_nfts.length) {
        NFTokenID = nftState?.post?.success?.data?.result?.account_nfts[length - 1]?.NFTokenID;
        token = nftState?.post?.success?.data?.result?.account_nfts[length - 1]
    }

    const handleCrateSellOffer = (event) => {
        event.preventDefault();
        const form = event.target;
        const seed = process.env.REACT_APP_XRP_NFT_ACCOUNT_SEED;
        const tokenID = NFTokenID;
        const flags = 1;
        const destination = form.destination.value;
        const amount = "0";

        createSellOffer(seed, tokenID, amount, flags, destination);

        form.reset();
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
                        <Tab>Transfer</Tab>

                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            <Box bg="white" maxW="5xl" mx="auto" borderRadius={10} p={5} mt={'24px'} boxShadow="md">
                                <Text mb='8px' align={"center"} fontSize={"2xl"} mt={'8px'} fontWeight="bold" textColor={'orange.400'} >Create Discount Badges/NFT and send them to your customers for bonus </Text>

                                <Text my='14px'>
                                    Just follow three simple steps...
                                </Text>

                                {nftState.badge.success.ok ? <Text my='10px' fontWeight='semibold' fontSize={'xl'} textColor={'blue.500'}>
                                    Step 2 -  Create an NFT associated with your badge clicking Create NFT with your badge button.
                                </Text> : <Text my='10px' fontWeight='semibold' fontSize={'xl'} textColor={'blue.500'}>
                                    Step 1 -  Create a good looking badge with suitable title, description and image.
                                </Text>}

                                {nftState.post.success.ok ? <Text my='10px' fontWeight='semibold' fontSize={'xl'} textColor={'blue.500'}>
                                    Step 3 - Go to the transfer tab from top and send the NFT badge to your customer.
                                </Text> : ""}



                                <Flex justifyContent={"space-between"} alignItems={"center"} mt='24px'>
                                    <Box width={"50%"}>
                                        <form onSubmit={handleCreateBadge}>

                                            <Text mb='4px' mt={'8px'} size="xl" fontWeight="bold" >Title of your NFT badge</Text>
                                            <Input
                                                name='title'
                                                placeholder='Title of your NFT badge'
                                                size='sm'
                                                required={true}
                                            />
                                            <Text mb='4px' mt={'8px'} size="xl" fontWeight="bold" >Description</Text>
                                            <Textarea name="description" placeholder='Description of your NFT badge' />
                                            <Text mb='4px' mt={'8px'} size="xl" fontWeight="bold" >Image</Text>
                                            <Input
                                                type='file'
                                                px='4'
                                                name='image'
                                                placeholder='Title of your NFT badge'
                                                size='sm'
                                                required={true}
                                            />
                                            <Text mb='4px' ml='4' size="xl" textColor={'gray.400'} >Choose an eye catchy image to make your customer feel special</Text>

                                            <Button isLoading={nftState.badge.loading} type='submit' colorScheme={"messenger"} variant='solid' mt={'10px'}
                                                disabled={nftState.badge.success.ok}>
                                                {nftState.badge.loading ? "Loading" : "Create Badge"}
                                            </Button>
                                        </form>
                                    </Box>
                                    {nftState.badge.success.ok || nftState.post.success.ok ?
                                        <Box width={"50%"}>
                                            <Heading fontSize={'large'} textAlign={'center'} my='16px'>Your Created Badge</Heading>
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
                                                <Button isLoading={nftState.post.loading} colorScheme={"messenger"} variant='solid' mt={'10px'}
                                                    onClick={handleCreateNFT}>
                                                    Create NFT with your badge
                                                </Button>
                                            </Center>
                                        </Box> : ""}

                                </Flex>
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
                            <Box bg="white" maxW="5xl" mx="auto" borderRadius={10} p={5} mt={'24px'} boxShadow="md">

                                {nftState.post.success.ok ?
                                    <Box width={"100%"}>

                                        <Text mb='8px' align={"center"} fontSize={"2xl"} mt={'8px'} fontWeight="bold" textColor={'orange.400'} >Send your created NFT badge to your desired customer </Text>

                                        <Heading fontSize={'large'} textAlign={'center'} my='16px'>Your Created Badge</Heading>
                                        <Center >
                                            <Image
                                                borderRadius='3xl'
                                                boxSize='150px'
                                                src={nftState.badge.success.data.image}
                                                alt='Badge Image'
                                            />
                                        </Center>
                                        <Center >
                                            <Text fontWeight={'semibold'}>{nftState.badge.success.data.name}</Text>
                                        </Center>
                                        <Center >
                                            <Text mt={'6px'}>{nftState.badge.success.data.description}</Text>
                                        </Center>

                                    </Box> : ""}


                                <Text mb='4px' align={"center"} mt={'8px'} size="xl" fontWeight="bold" >See all of your orders</Text>



                                <TableContainer p="5">
                                    <Table variant={"simple"}>
                                        <Thead>
                                            <Tr>
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
                                                    (order) => (
                                                        <Tr>
                                                            <Td>{order.billing_address?.first_name}</Td>
                                                            <Td >
                                                                {order.contact_email}
                                                            </Td>
                                                            <Td>{order.shipping_address?.address1}</Td>
                                                            <Td>
                                                                <SendNftModal code={order.discount_codes[0]?.code}
                                                                    badge={nftState?.badge?.success?.data?.image}
                                                                    name={order.billing_address?.first_name} tokenID={NFTokenID} />
                                                            </Td>
                                                        </Tr>
                                                    )
                                                )}
                                            </Tbody>
                                        }
                                    </Table>
                                </TableContainer>



                            </Box>

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
                                            <Text pt='2' fontSize='sm'>
                                                Offer Index :  <Text as={'span'} textColor={"green.600"} fontWeight={"bold"}>{offer.nft_offer_index}</Text>
                                            </Text>
                                            <Text pt='2' fontSize='sm'>
                                                Owner :  {offer.owner}
                                            </Text>
                                            <Text pt='2' fontSize='sm'>
                                                Amount:  {offer.amount}
                                            </Text>
                                            <Text pt='2' fontSize='sm'>
                                                Destination:  {offer.destination}
                                            </Text>
                                        </Box>)}
                                    <Text fontStyle={"italic"} as='u' cursor={'pointer'}>
                                        <a href={nftState.offer.success.data?.payload?.next?.always} target='_blank' rel="noreferrer">Offer Accept QR </a>
                                    </Text>
                                </Stack>
                            </Box> : ""}
                        </TabPanel>
                    </TabPanels>
                </Tabs>

            </Container>




        </>
    );
};

export default NFTRoute;