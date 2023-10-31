import {
  Box,
  Container,
  Table,
  TableContainer,
  Th,
  Thead,
  Tr,
  Tbody,
  Td,
  VStack,
  Text,
  Divider,
  Link,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import NavBar from "../../components/navbar";
import { ShopContext } from "../../context";
import useTransactionStore from "../../store/transaction";

const TransactionRoute = () => {
  let blockChain;
  const retrievedObject = localStorage.getItem("blockchain");
  const blockChainObj = JSON.parse(retrievedObject);
  blockChain = blockChainObj?.blockChain;

  const shop = useContext(ShopContext);


  const transactionState = useTransactionStore(
    (state) => state.transactionState);
  const getTransactionState = useTransactionStore(
    (state) => state.getTransactionState
  );
  console.log(transactionState.get)

  useEffect(async () => {
    getTransactionState(shop, stellarHorizonAPI);
  }, []);

  if (transactionState.get.loading) {
    return (
      <>
        <NavBar />
        <Container
          maxW={"7xl"}
          p={[12, 6]}
          minH={"100vh"}
          bg="#f6f6f7"
          textAlign={"left"}
        >
          <Box padding="6" boxShadow="lg" bg="white">
            <SkeletonCircle size="10" />
            <SkeletonText mt="4" noOfLines={4} spacing="4" />
          </Box>
        </Container>
      </>
    );
  } else {
    return (
      <>
        <NavBar />
        <Container
          maxW={"7xl"}
          p={[12, 6]}
          minH={"100vh"}
          bg="#f6f6f7"
          textAlign={"left"}
        >
          <Box bg="white" width={"5xl"} m="auto" p={5} borderRadius="10px">
            <VStack spacing={2} align="stretch">
              <Box>
                <Text size="xl" fontWeight="bold">
                  ISLM Transaction Details
                </Text>
                <Divider borderColor="gray.200" />
              </Box>
            </VStack>

            <TableContainer p="5">
              <Table variant={"simple"}>
                <Thead>

                  <Tr>
                    <Th>Account</Th>
                    <Th isNumeric>Amount</Th>
                    <Th>Fee</Th>
                    <Th>Result</Th>
                    <Th>Transaction Ref</Th>
                  </Tr>
                </Thead>


                <Tbody>
                  {transactionState.get.success.data.length === 0 ?
                    <Tr>
                      <Td><SkeletonText mt="4" noOfLines={5} spacing="4" /></Td>
                      <Td><SkeletonText mt="4" noOfLines={5} spacing="4" /></Td>
                      <Td><SkeletonText mt="4" noOfLines={5} spacing="4" /></Td>
                      <Td><SkeletonText mt="4" noOfLines={5} spacing="4" /></Td>
                      <Td><SkeletonText mt="4" noOfLines={5} spacing="4" /></Td>
                    </Tr> : ""}
                  {transactionState.get.success.data?.map(
                    (details) => (
                      // <Text>{details.tx.Account}</Text>
                      <Tr>
                        <Td>{details.from.hash}</Td>
                        <Td>{details.value / 1e18}</Td>
                        <Td>{details.fee.value / 1e18}</Td>
                        <Td>{details.result}</Td>
                        <Td>
                          <Link
                            color="teal"
                            target="_blank"
                            href={`${process.env.REACT_APP_ISLM_TRANSACTION_REFFERENCE}/${details.hash}`}
                          >
                            {details.hash}
                          </Link>
                        </Td>
                      </Tr>
                    )
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </Container>
      </>
    );
  }
};

export default TransactionRoute;
