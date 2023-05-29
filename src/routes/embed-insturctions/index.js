import React from 'react';
import NavBar from "../../components/navbar";
import { Container, Center, Flex, Heading, Text, Box } from '@chakra-ui/react';

const EmbedInstructions = () => {
    return (
        <>
            <NavBar></NavBar>
            <Container
                position={"relative"}
                maxW={"7xl"}
                p={[12, 6]}
                bg="#f6f6f7"
                textAlign={"left"}
            >
                <Center>
                    <Flex maxW='32rem' flexDirection='row'>
                        <Heading mb={4} color='blue.600'>Embed</Heading>
                        <Heading mb={4} ml='8px'> Payment Buttons </Heading>

                    </Flex>
                </Center>
                <Center>
                    <Text color={'gray.700'} fontSize='20px' fontWeight='medium'>In order to work your payment buttons in your app , you need to embed them.</Text>
                </Center>

                <Box maxWidth="6xl">
                    <Text color={'gray.700'} fontSize='18px' mt='20px' fontWeight='medium'>Just follow these simple steps below:-
                    </Text>

                    <Box mt='16px'>
                        <Text>1. Install the npm package <Text as={'span'} color='blue.500' fontWeight='medium'>hedera-shop-react</Text></Text>
                        <Text mt='8px'>2. Import HederaShop from <Text as={'span'} >hedera-shop-react</Text></Text>
                        <Text mt='8px'>3. Then embed your button component as follows:  <Text as={'span'} >{'<HederaShop shop="" />'}</Text></Text>
                    </Box>
                </Box>




            </Container>
        </>
    );
};

export default EmbedInstructions;