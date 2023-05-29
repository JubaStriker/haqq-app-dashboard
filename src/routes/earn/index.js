import { Avatar, Box, Button, Center, Container, Flex, Heading, Icon, Stack, Text, WrapItem, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import NavBar from "../../components/navbar";

import {
    Table,
    Tbody,
    Tr,
    Td,
    TableContainer,
} from '@chakra-ui/react'

const Earn = () => {
    return (
        <>
            <NavBar />
            <Container
                position={"relative"}
                maxW={"7xl"}
                p={[12, 6]}
                bg="#f6f6f7"
                textAlign={"left"}
            >

                <Center>
                    <Flex maxW='32rem' flexDirection='row'>
                        <Heading mb={4}>Earn with </Heading>
                        <Heading mb={4} ml='8px' color='blue.600'>DeFi</Heading>
                    </Flex>
                </Center>

                <Center mt='40px'>

                    <Text
                        as={'span'} color='orange.400' fontWeight='bold' fontSize='28px'
                    >
                        Congrats,
                    </Text>
                    <Text fontSize='26px'>
                        Your customers are shopping with HBar and USDC on your e-commerce site.
                    </Text>
                </Center>
                <Container maxW={'3xl'}>
                    <Stack
                        as={Box}
                        textAlign={'center'}
                        spacing={{ base: 8, md: 14 }}
                        py={{ base: 20, md: 36 }}>
                        <Heading
                            fontWeight={600}
                            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
                            lineHeight={'110%'}>
                            Earn passive income by <br />
                            <Text as={'span'} color={'green.400'} fontWeight='semibold'>
                                Lending
                            </Text>
                        </Heading>
                        <Text color={'gray.500'} fontSize='20px'>
                            Now, earn passive income by lending your <Text as={'span'} color={'green.400'} fontWeight='semibold'>
                                HBar
                            </Text> and <Text as={'span'} color={'green.400'} fontWeight='semibold'>
                                USDC
                            </Text>  on popular DeFi applications on <Text as={'span'} color={'green.400'} fontWeight='semibold'>
                                Hedera
                            </Text>
                        </Text>
                    </Stack>
                </Container>


                <TableContainer backgroundColor='white' borderRadius='16px' boxShadow='md'>
                    <Table variant='simple'>

                        <Tbody>
                            <Tr>
                                <Td maxWidth='100px'>
                                    <WrapItem>
                                        <Avatar
                                            size='xs'
                                            name='HBAR Logo'
                                            src='https://cryptologos.cc/logos/hedera-hbar-logo.png'
                                        />{' '}
                                        <Text ml='8px' fontSize='14px' fontWeight='medium'>SD/HBARX</Text>
                                    </WrapItem>

                                </Td>
                                <Td maxWidth='100px'>
                                    <Text ml='8px' fontSize='14px' fontWeight='medium'>APR  31.05 %</Text>
                                </Td>
                                <Td>
                                    <Text ml='8px' fontSize='14px' fontWeight='medium'>TVL  $66.8K</Text>
                                </Td>
                                <Td maxWidth='100px'>
                                    <WrapItem>
                                        <Avatar
                                            size='xs'
                                            name='HBAR Logo'
                                            src='https://cryptologos.cc/logos/hedera-hbar-logo.png'
                                        />{' '}
                                    </WrapItem>
                                </Td>
                            </Tr>
                            <Tr>
                                <Td maxWidth='100px'>
                                    <WrapItem>
                                        <Avatar
                                            size='xs'
                                            name='HBAR Logo'
                                            src='https://cryptologos.cc/logos/hedera-hbar-logo.png'
                                        />{' '}
                                        <Text ml='8px' fontSize='14px' fontWeight='medium'>SD/HBARX</Text>
                                    </WrapItem>

                                </Td>
                                <Td maxWidth='100px'>
                                    <Text ml='8px' fontSize='14px' fontWeight='medium'>APR  31.05 %</Text>
                                </Td>
                                <Td>
                                    <Text ml='8px' fontSize='14px' fontWeight='medium'>TVL  $66.8K</Text>
                                </Td>
                                <Td maxWidth='150px'>
                                    <WrapItem>
                                        <Avatar
                                            size='xs'
                                            name='HBAR Logo'
                                            src='https://cryptologos.cc/logos/hedera-hbar-logo.png'
                                        />{' '}
                                    </WrapItem>
                                </Td>
                            </Tr>

                        </Tbody>
                    </Table>
                </TableContainer>

                <Center mt='10'>

                    <Button

                        bgGradient="linear(to-bl, #594bab,#4d2c58)"
                        _hover={{ bgGradient: "linear(to-bl, #ada1ed,#8e55a1)" }}
                        color="white"
                    >
                        Lend & Earn
                    </Button>
                </Center>

            </Container>
        </>
    );
};

export default Earn;