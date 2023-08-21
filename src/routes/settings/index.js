import { useEffect, useContext, useState } from "react";
import {
  Box,
  Heading,
  ButtonGroup,
  Text,
  Button,
  Container,
  useToast,
  Code,
  Divider,
  Input,
  FormControl,
  InputLeftElement,
  InputGroup,
  FormHelperText,
  Alert,
  AlertIcon,
  SimpleGrid,
  FormErrorMessage,
  Spinner,
  SkeletonText,
  HStack,
  FormLabel,
} from "@chakra-ui/react";
import Blur from "../../components/blur";

import useScriptsStore from "../../store/scripts";
import { ShopContext } from "../../context";
import { INTERNAL_SERVER_ERROR } from "../../constants/strings";
import NavBar from "../../components/navbar";
import { useFormik } from "formik";
import * as Yup from "yup";
import useWalletStore from "../../store/wallet";
import WAValidator from "multicoin-address-validator";
import StellarSdk from "stellar-sdk";

const SettingsRoute = () => {
  let blockChain;
  const retrievedObject = localStorage.getItem("blockchain");
  const blockChainObj = JSON.parse(retrievedObject);
  blockChain = blockChainObj?.blockChain;

  const shop = useContext(ShopContext);
  const scripts = useScriptsStore((state) => state.scripts);
  const postScripts = useScriptsStore((state) => state.postScripts);
  const getScripts = useScriptsStore((state) => state.getScripts);
  const destroyScripts = useScriptsStore((state) => state.destroyScripts);
  const toast = useToast();

  const verifyWalletSate = useWalletStore((state) => state.verifyWalletSate);

  const walletAddress = useWalletStore((state) => state.walletState);
  const getWalletAddress = useWalletStore((state) => state.getWalletAddress);
  const postWalletAddress = useWalletStore((state) => state.postWalletAddress);

  const verifyWalletAddress = useWalletStore(
    (state) => state.verifyWalletAddress
  );
  console.log("Wallet address", walletAddress?.get?.success?.data);

  const onSubmitHandler = async (data) => {
    // ----------------- Hedera ----------------- //
    if (blockChain === "hedera") {
      console.log(data);
      const { walletAddress, walletToken } = data;
      await verifyWalletAddress(walletAddress);
      console.log(verifyWalletSate.get.success.ok);
      if (verifyWalletSate.get.success.ok === true) {
        try {
          await postWalletAddress({ shop, walletAddress, walletToken });
          toast({
            title: "Wallet address added successfully!",
            status: "success",
            duration: 3000,
          });
        } catch (e) {
          toast({
            title: e.message || "Something went wrong.",
            status: "error",
            duration: 3000,
          });
        }
      } else {
        toast({
          title: "Something went wrong.",
          status: "error",
          duration: 3000,
        });
      }
    }
    // ----------------- Ripple ----------------- //
    else if (blockChain === "ripple") {
      const walletAddress = data;

      const valid = WAValidator.validate(walletAddress, "ripple");
      if (valid === true) {
        try {
          await postWalletAddress({ shop, walletAddress });
          toast({
            title: "Wallet address added successfully!",
            status: "success",
            duration: 3000,
          });
        } catch (e) {
          toast({
            title: e.message || "Something went wrong.",
            status: "error",
            duration: 3000,
          });
        }
      } else {
        toast({
          title: "Wallet Address is Invalid",
          status: "error",
        });
      }
    }

    // ----------------- Near ----------------- //
    else if (blockChain === 'near') {
      const walletAddress = data;

      const valid = true;
      if (valid === true) {
        try {
          await postWalletAddress({ shop, walletAddress });
          toast({
            title: "Wallet address added successfully!",
            status: "success",
            duration: 3000,
          });
        } catch (e) {
          toast({
            title: e.message || "Something went wrong.",
            status: "error",
            duration: 3000,
          });
        }
      } else {
        toast({
          title: "Wallet Address is Invalid",
          status: "error",
        });
      }
    }
    // ----------------- Stellar ----------------- //
    else if (blockChain === 'stellar') {
      const { walletAddress } = data;
      const isValidKey = StellarSdk.StrKey.isValidEd25519PublicKey(walletAddress);
      if (isValidKey) {
        try {
          await postWalletAddress({ shop, walletAddress });
          toast({
            title: "Wallet address added successfully!",
            status: "success",
            duration: 3000,
          });
        } catch (e) {
          toast({
            title: e.message || "Something went wrong.",
            status: "error",
            duration: 3000,
          });
        }
      } else {
        toast({
          title: "Your XLM Wallet public address is invalid",
          status: "error",
          duration: 3000,
        });
      }
    }
  }


  // ------------------------------------------------------------------------------//

  const connectWallet = () => {
    window.open(
      process.env.REACT_APP_SERVER_URL + "/connect-wallet",
      "_blank",
      "noopener,noreferrer"
    );
  };

  let walletSchema;

  if (blockChain === "hedera") {
    walletSchema = Yup.object().shape({
      walletAddress: Yup.string().required("Wallet Address Is required"),
      walletToken: Yup.string().required("Wallet USDCH Token to recieve HBAR"),
    });
  } else if (blockChain === "ripple" || blockChain === "near" || blockChain === "stellar") {
    walletSchema = Yup.object().shape({
      walletAddress: Yup.string().required("Wallet Address Is required"),
    });
  }

  const formik = useFormik({
    initialValues: { walletAddress: "", walletToken: "" },
    validationSchema: walletSchema,
    onSubmit: (values) => {
      if (values && blockChain === "hedera") {
        onSubmitHandler(values);
      } else if (values && blockChain === "ripple") {
        onSubmitHandler(values.walletAddress);
      }
      else if (values && blockChain === "near") {
        onSubmitHandler(values.walletAddress);
      }
      else if (values && blockChain === "stellar") {
        onSubmitHandler(values);
      }
    },
  });

  useEffect(() => {
    getWalletAddress(shop);
    getScripts(shop);
  }, []);

  useEffect(() => {
    if (blockChain === "hedera") {
      formik.setFieldValue(
        "walletAddress",
        walletAddress?.get?.success?.data?.walletAddress || ""
      );
      formik.setFieldValue(
        "walletToken",
        walletAddress?.get?.success?.data?.walletToken || ""
      );
    }
    else if (blockChain === "ripple") {
      formik.setFieldValue(
        "walletAddress",
        walletAddress?.get?.success?.data?.walletAddress || ""
      );
    }
    else if (blockChain === "near") {
      formik.setFieldValue(
        "walletAddress",
        walletAddress?.get?.success?.data?.walletAddress || ""
      );
    }

  }, [walletAddress?.get?.success?.data?.walletAddress]);

  // --------------------------------------------------------------------------------//

  const enableWidget = async () => {
    try {
      await postScripts(shop);
      toast({
        title: `Widget added successfully! Please visit your online store after 30 seconds to check the widget.`,
        status: "success",
      });
      getScripts(shop);
    } catch (e) {
      toast({
        title: e.message || INTERNAL_SERVER_ERROR,
        status: "error",
      });
    }
  };

  // ------------------------------------------------------------------------------------//
  const AddressInput = () => {
    if (walletAddress.get.loading) {
      return (
        <Box width={"100%"} alignItems="center">
          <SkeletonText mt="4" noOfLines={4} spacing="4" />
        </Box>
      );
    } else if (walletAddress.get.success.ok || !walletAddress.get.success.ok) {
      return (
        <Box>
          {blockChain === "hedera" ? (
            <>
              <Text size="xl" fontWeight="bold" pb="5px">
                HBAR wallet address and Token ID where to receive HBAR from
                customer
              </Text>
              <FormControl
                onSubmit={formik.handleSubmit}
                isInvalid={
                  formik.touched.walletAddress && formik.errors.walletAddress
                }
              >
                <FormLabel>HBAR Wallet ID</FormLabel>
                <Input
                  id="walletAddress"
                  name="walletAddress"
                  type="text"
                  placeholder="HBAR Wallet Address"
                  onChange={formik.handleChange}
                  value={formik.values.walletAddress}
                />

                <FormHelperText size="sm" color={"red"}>
                  {formik.touched.walletAddress &&
                    formik.errors.walletAddress ? (
                    formik.errors.walletAddress
                  ) : (
                    <FormErrorMessage>
                      Please check HBAR wallet address where to receive HBAR
                      from customer
                    </FormErrorMessage>
                  )}
                </FormHelperText>
              </FormControl>

              <FormControl
                onSubmit={formik.handleSubmit}
                isInvalid={
                  formik.touched.walletToken && formik.errors.walletToken
                }
              >
                <FormLabel>USDC Token ID</FormLabel>
                <Input
                  id="walletToken"
                  name="walletToken"
                  type="text"
                  placeholder="USDC Token ID"
                  onChange={formik.handleChange}
                  value={formik.values.walletToken}
                />

                <FormHelperText size="sm" color={"red"}>
                  {formik.touched.walletToken && formik.errors.walletToken ? (
                    formik.errors.walletToken
                  ) : (
                    <FormErrorMessage>
                      Please check HBAR wallet address or Token ID where to
                      receive HBAR from customer
                    </FormErrorMessage>
                  )}
                </FormHelperText>
              </FormControl>

              <HStack>
                <Button
                  onClick={formik.handleSubmit}
                  isLoading={walletAddress.post.loading}
                  type="submit"
                  size="sm"
                  bgGradient="linear(to-bl, #594bab,#4d2c58)"
                  color="white"
                  _hover={{ bgGradient: "linear(to-bl, #ada1ed,#8e55a1)" }}
                >
                  Save Address
                </Button>
                <Button
                  size="sm"
                  onClick={() => connectWallet()}
                  bgGradient="linear(to-bl, #594bab,#4d2c58)"
                  _hover={{ bgGradient: "linear(to-bl, #ada1ed,#8e55a1)" }}
                  color="white"
                >
                  Connect to HBAR Wallet
                </Button>
              </HStack>
            </>
          ) : (
            ""
          )}

          {blockChain === "ripple" ? (
            <>
              <Text size="xl" fontWeight="bold" pb="5px">
                XRP wallet public address where you would receive XRP from
                customers
              </Text>
              <FormControl
                onSubmit={formik.handleSubmit}
                isInvalid={
                  formik.touched.walletAddress && formik.errors.walletAddress
                }
              >
                <Input
                  id="walletAddress"
                  name="walletAddress"
                  type="text"
                  placeholder="XRP Wallet Address"
                  onChange={formik.handleChange}
                  value={formik?.values?.walletAddress}
                />

                <FormHelperText size="sm" color={"red"}>
                  {formik.touched.walletAddress &&
                    formik.errors.walletAddress ? (
                    formik.errors.walletAddress
                  ) : (
                    <FormErrorMessage>
                      Please check XRP wallet address where to receive XRP from
                      customers
                    </FormErrorMessage>
                  )}
                </FormHelperText>
              </FormControl>

              <Button
                mt={4}
                onClick={formik.handleSubmit}
                isLoading={walletAddress.post.loading}
                type="submit"
                size="sm"
                colorScheme={"messenger"}
              >
                Submit
              </Button>
            </>
          ) : (
            ""
          )}

          {blockChain === "near" ? (
            <>
              <Text size="xl" fontWeight="bold" pb="5px">
                NEAR wallet public address where you would receive NEAR from
                customers
              </Text>
              <FormControl
                onSubmit={formik.handleSubmit}
                isInvalid={
                  formik.touched.walletAddress && formik.errors.walletAddress
                }
              >
                <Input
                  id="walletAddress"
                  name="walletAddress"
                  type="text"
                  placeholder="NEAR Wallet Address"
                  onChange={formik.handleChange}
                  value={formik.values.walletAddress}
                />

                <FormHelperText size="sm" color={"red"}>
                  {formik.touched.walletAddress &&
                    formik.errors.walletAddress ? (
                    formik.errors.walletAddress
                  ) : (
                    <FormErrorMessage>
                      Please check NEAR wallet address where to receive NEAR from
                      customers
                    </FormErrorMessage>
                  )}
                </FormHelperText>
              </FormControl>

              <Button
                mt={4}
                onClick={formik.handleSubmit}
                isLoading={walletAddress.post.loading}
                type="submit"
                size="sm"
                colorScheme={"messenger"}
              >
                Submit
              </Button>
            </>
          ) : (
            ""
          )}
        </Box>
      );
    }
  };

  const disableWidget = async () => {
    try {
      await destroyScripts(shop);
      toast({
        title: `Widget removed successfully!`,
        status: "success",
      });
      getScripts(shop);
    } catch (e) {
      toast({
        title: e.message || INTERNAL_SERVER_ERROR,
        status: "error",
      });
    }
  };

  const renderButton = () => {
    if (scripts.get.loading) {
      return (
        <Button colorScheme="gray" isLoading isDisabled>
          Loading ...
        </Button>
      );
    } else if (scripts.get.success.data.length) {
      return (
        <Button
          isLoading={scripts.destroy.loading || scripts.get.loading}
          fontWeight="bold"
          size="sm"
          colorScheme="red"
          onClick={disableWidget}
        >
          Remove Widget From Your Store
        </Button>
      );
    } else {
      return (
        <Button
          isLoading={scripts.post.loading || scripts.get.loading}
          fontWeight="bold"
          size="sm"
          bgGradient="linear(to-bl, #594bab,#4d2c58)"
          color="white"
          onClick={enableWidget}
        >
          Add Widget To Your Store
        </Button>
      );
    }
  };

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
        <Box as="section" maxW="3xl" mx="auto">
          <SimpleGrid spacing={4}>
            <Box bg="white" borderRadius={10} p={5} boxShadow="md">
              {AddressInput()}
            </Box>
            <Box bg="white" borderRadius={10} p={5} boxShadow="md">
              <Text size="xl" fontWeight="bold">
                Widget Embed Settings
              </Text>
              <Text mt="4" fontSize="sm">
                Enable or disable the Crypto Shop widget on your store. The
                widget gets appended to the bottom of your store page above the
                footer on the home page.
              </Text>
              <ButtonGroup mt="4" spacing="6">
                {renderButton()}
              </ButtonGroup>
              <Alert mt={4} status="info">
                <AlertIcon />
                <SimpleGrid>
                  <Box>
                    <Text fontSize="sm">
                      NOTE: If you want the widget only on certain pages or only
                      in certain positions please add the following html tag to
                      custom liquid or custom html section.
                    </Text>
                  </Box>
                  <Box>
                    <Code children={`<div id="crypto-shop-app"> </div>`}></Code>
                  </Box>
                </SimpleGrid>
              </Alert>
            </Box>
          </SimpleGrid>
        </Box>
      </Container>
      {/* <Blur
        position={"absolute"}
        top={30}
        left={-10}
        style={{ filter: "blur(70px)" }}
      /> */}
    </>
  );
};

export default SettingsRoute;
