import {
  chakra,
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Icon,
  Stack,
  Text,
  WrapItem,
  Skeleton,
  Divider,
  VStack,
  Link,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import NavBar from "../../components/navbar";
import { InfoIcon, ExternalLinkIcon } from "@chakra-ui/icons";

import { Table, Tbody, Tr, Td, TableContainer } from "@chakra-ui/react";
import usePoolsStore from "../../store/pools";

const Earn = () => {
  const { getPoolsAction, poolsState } = usePoolsStore((state) => state);
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  useEffect(() => {
    getPoolsAction();
  }, []);

  const renderPoolsTable = () => {
    if (poolsState.get.loading) {
      return (
        <Flex direction="column" width="90%" marginLeft="5">
          <Skeleton width="100%" height="40px"></Skeleton>
          <br />
          <Skeleton width="100%" height="20px"></Skeleton>
          <br />
          <Skeleton width="100%" height="20px"></Skeleton>
          <br />
          <Skeleton width="100%" height="20px"></Skeleton>
        </Flex>
      );
    } else if (poolsState.get.failure.error) {
      return (
        <Box>
          <Flex direction="column" align="center">
            <VStack spacing="3">
              <Heading as="h1" size="md">
                {VStack.get.failure.message}
              </Heading>
            </VStack>
            <br />
            <Divider />
            <br />
            <VStack spacing="3">
              <Button onClick={() => getPoolsAction()}>Try Again</Button>
            </VStack>
          </Flex>
        </Box>
      );
    } else if (poolsState.get.success.ok) {
      const { data } = poolsState.get.success;
      return data.map((pool, index) => (
        <TableContainer key={index}>
          <Table variant="simple">
            <Tbody>
              <Tr>
                <Td maxWidth="70px">
                  <WrapItem>
                    <Avatar
                      size="xs"
                      name="HBAR Logo"
                      src="https://cryptologos.cc/logos/hedera-hbar-logo.png"
                    />{" "}
                    <Text ml="8px" fontSize="14px" fontWeight="medium">
                      USDC/HBAR
                    </Text>
                  </WrapItem>
                </Td>
                <Td maxWidth="50px">
                  <Text ml="8px" fontSize="14px" fontWeight="medium">
                    APR {pool.apy} %
                  </Text>
                </Td>
                <Td maxWidth="70px">
                  <Text ml="8px" fontSize="14px" fontWeight="medium">
                    TVL {formatter.format(pool.tvl)}
                  </Text>
                </Td>
                <Td maxWidth="30px">
                  <WrapItem>
                    <Avatar size="xs" name="Logo" src={pool.logo} />{" "}
                  </WrapItem>
                </Td>

                <Td maxWidth="100px">
                  <Link target="_blank" href={pool.poolLink}>
                    <Button
                      bgGradient="linear(to-bl, #594bab,#4d2c58)"
                      _hover={{ bgGradient: "linear(to-bl, #ada1ed,#8e55a1)" }}
                      color="white"
                      mr="4px"
                    >
                      Lend <Icon ml="2px" as={ExternalLinkIcon} />
                    </Button>
                  </Link>
                  <Link target="_blank" href={pool.poolInfo}>
                    <Button borderColor="#4d2c58" variant="outline">
                      <Icon color="#4d2c58" ml="2px" as={InfoIcon} />
                    </Button>
                  </Link>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      ));
      // <>

      //   <Center mt="10">
      //     <Button
      //       bgGradient="linear(to-bl, #594bab,#4d2c58)"
      //       _hover={{ bgGradient: "linear(to-bl, #ada1ed,#8e55a1)" }}
      //       color="white"
      //     >
      //       Lend & Earn
      //     </Button>
      //   </Center>
      // </>
    }
  };
  return (
    <>
      <NavBar />
      <Container
        position={"relative"}
        maxW={"7xl"}
        p={[12, 6]}
        textAlign={"left"}
      >
        <Heading textAlign="center" mb={4}>
          Earn with <chakra.span color="blue.500"> DeFi</chakra.span>
        </Heading>
        <Center maxW="3xl" margin="0 auto" flexDirection="column">
          <Text align="center" fontSize="md">
            Congrats! Your customers are shopping with HBar and USDC on your
            e-commerce site.
          </Text>
          <Text align="center" fontSize="md" mt="1">
            Now, earn passive income by staking or lending your HBar & USDC on
            popular DeFi applications on Hedera.
          </Text>
        </Center>

        <Center maxW="3xl" margin="0 auto" flexDirection="column">
          <br />
          <Divider />
          <br />
          <Heading fontSize="xl" textAlign="center" mb={2}>
            What is <chakra.span color="blue.500"> Lending?</chakra.span>
          </Heading>
          <Text align="center" fontSize="md">
            Lending or providing liquidity, is supplying equal value parts of
            two different tokens (HBAR and USDC in this case) in exchange for LP
            tokens. Also, the liquidity providers receive a 0.25% fee for every
            swap that is made in their pair.
          </Text>

          <Text align="center" fontSize="md" mt="1">
            Now, earn passive income by staking or lending your HBar & USDC on
            popular DeFi applications on Hedera.
          </Text>
        </Center>

        {renderPoolsTable()}

        <Center maxW="3xl" margin="0 auto" flexDirection="column">
          <br />
          <br />
          <Heading fontSize="xl" textAlign="center" mb={2}>
            What is <chakra.span color="blue.500"> Staking?</chakra.span>
          </Heading>
          <Text align="center" fontSize="md">
            Staking lets you safely lend your HBar to validator nodes for a
            maximum annual reward rate of 6.5%
          </Text>
          <Button
            bgGradient="linear(to-bl, #594bab,#4d2c58)"
            _hover={{ bgGradient: "linear(to-bl, #ada1ed,#8e55a1)" }}
            color="white"
            mt="4"
          >
            Begin Staking
          </Button>
        </Center>
      </Container>
    </>
  );
};

export default Earn;
