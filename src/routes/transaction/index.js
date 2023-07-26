import {
  Box,
  Container,
  Heading,
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
  useColorMode,
  Link,
  AlertIcon,
  SkeletonCircle,
  SkeletonText,
  Alert,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import NavBar from "../../components/navbar";
import { ShopContext } from "../../context";
import useTransactionStore from "../../store/transaction";
import { Link as ReactRouteLink } from "react-router-dom";

const TransactionRoute = () => {
  let blockChain;
  const retrievedObject = localStorage.getItem("blockchain");
  const blockChainObj = JSON.parse(retrievedObject);
  blockChain = blockChainObj?.blockChain;

  const shop = useContext(ShopContext);
  const transactionState = useTransactionStore(
    (state) => state.transactionState
  );
  const getTransactionState = useTransactionStore(
    (state) => state.getTransactionState
  );

  useEffect(async () => {
    getTransactionState(shop);
  }, []);

  if (transactionState.get.success.data.length === 0) {
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
          {/* <Alert status="info" mb="5">
            <AlertIcon />
            <Box>
              <AlertTitle>Now earn with your crypto!</AlertTitle>
              <AlertDescription>
                <ReactRouteLink to="/earn">
                  <Text decoration="underline" color="blue">
                    Lend or stake your crypto today to earn interest.
                  </Text>
                </ReactRouteLink>
              </AlertDescription>
            </Box>
          </Alert> */}

          <Box bg="white" width={"5xl"} m="auto" p={5} borderRadius="10px">
            <VStack spacing={2} align="stretch">
              <Box>
                <Text size="xl" fontWeight="bold">
                  {blockChain === "hedera" ? "HABR Transaction Details" : ""}
                  {blockChain === "ripple" ? "XRP Transaction Details" : ""}
                </Text>
                <Divider borderColor="gray.200" />
              </Box>
            </VStack>

            <TableContainer p="5">
              <Table variant={"simple"}>
                <Thead>
                  <Tr>
                    <Th>Account</Th>
                    {/* <Th isNumeric>Amount</Th> */}
                    <Th>Fee</Th>
                    <Th>Result</Th>
                    <Th>Transaction Ref</Th>
                  </Tr>
                </Thead>
                {blockChain === "hedera" ? (
                  <Tbody>
                    {transactionState?.get?.success?.data?.transactions?.map(
                      (details) => (
                        <Tr>
                          <Td>{details.transfers.slice(-1).pop().account}</Td>
                          <Td isNumeric>
                            {details.transfers.slice(-1).pop().amount}
                          </Td>
                          <Td>{details.charged_tx_fee}</Td>
                          <Td>{details.result}</Td>
                          <Td>
                            <Link
                              color="teal"
                              target="_blank"
                              href={`${process.env.REACT_APP_HBAR_TRANSACTION_REFFERENCE}transaction/${details.transaction_id}`}
                            >
                              {details.transaction_id}
                            </Link>
                          </Td>
                        </Tr>
                      )
                    )}
                  </Tbody>
                ) : (
                  ""
                )}
                {blockChain === "ripple" ? (
                  <Tbody>
                    {transactionState.get.success.data?.result?.transactions?.map(
                      (details) => (
                        // <Text>{details.tx.Account}</Text>
                        <Tr>
                          <Td>{details.tx.Account}</Td>

                          {/* ---------- There is no Amount field  in tx*/}
                          {/* <Td isNumeric>
                            {window.xrpl.dropsToXrp(details.tx.Amount)}
                          </Td> */}
                          <Td>{details.tx.inLedger}</Td>
                          <Td>{details.tx.Fee}</Td>
                          <Td>
                            <Link
                              color="teal"
                              target="_blank"
                              href={`${process.env.REACT_APP_XRP_TRANSACTION_REFFERENCE}transactions/${details.tx.hash}`}
                            >
                              {details.tx.hash}
                            </Link>
                          </Td>
                        </Tr>
                      )
                    )}
                  </Tbody>
                ) : (
                  ""
                )}
              </Table>
            </TableContainer>
          </Box>
        </Container>
      </>
    );
  }
};

export default TransactionRoute;
