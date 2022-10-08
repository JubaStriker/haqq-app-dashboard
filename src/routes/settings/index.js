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
} from "@chakra-ui/react";
import Blur from "../../components/blur";

import useScriptsStore from "../../store/scripts";
import { ShopContext } from "../../context";
import { INTERNAL_SERVER_ERROR } from "../../constants/strings";
import NavBar from "../../components/navbar";
import { useFormik } from "formik";
import * as Yup from "yup";
import useWalletStore from "../../store/wallet";

const SettingsRoute = () => {
  const shop = useContext(ShopContext);
  const scripts = useScriptsStore((state) => state.scripts);
  const postScripts = useScriptsStore((state) => state.postScripts);
  const getScripts = useScriptsStore((state) => state.getScripts);
  const destroyScripts = useScriptsStore((state) => state.destroyScripts);
  const toast = useToast();

  const verifyWalletSate = useWalletStore((state) => state.verifyWalletSate);
  const hBarWalletAddress = useWalletStore((state) => state.walletState);
  const getWalletAddress = useWalletStore((state) => state.getWalletAddress);
  const postWalletAddress = useWalletStore((state) => state.postWalletAddress);
  const verifyWalletAddress = useWalletStore(
    (state) => state.verifyWalletAddress
  );

  const onSubmitHandler = async (data) => {
    const walletAddress = data;
    await verifyWalletAddress(walletAddress);
    console.log(verifyWalletSate.get.success.ok);
    if (verifyWalletSate.get.success.ok === true) {
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
        title: "Something went wrong.",
        status: "error",
        duration: 3000,
      });
    }
  };

  const connectWallet = () => {
    console.log("Hello World");
    fetchWalletAddress();
  };

  const walletSchema = Yup.object().shape({
    walletAddress: Yup.string().required("Wallet Address Is required"),
  });

  const formik = useFormik({
    initialValues: { walletAddress: "" },
    validationSchema: walletSchema,
    onSubmit: (values) => {
      if (values) {
        onSubmitHandler(values.walletAddress);
      }
    },
  });

  useEffect(() => {
    getWalletAddress(shop);
    getScripts(shop);
  }, []);

  useEffect(() => {
    formik.setFieldValue(
      "walletAddress",
      hBarWalletAddress?.get?.success?.data?.walletAddress || ""
    );
  }, [hBarWalletAddress?.get?.success?.data?.walletAddress]);

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
  const HbarAddressInput = () => {
    if (hBarWalletAddress.get.loading) {
      return (
        <Box width={"100%"} alignItems="center">
          <SkeletonText mt="4" noOfLines={4} spacing="4" />
        </Box>
      );
    } else if (hBarWalletAddress.get.success.ok) {
      return (
        <Box>
          <Text size="xl" fontWeight="bold" pb="5px">
            HBAR wallet address where to receive HBAR from customer
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
              placeholder="HBAR Wallet Address"
              onChange={formik.handleChange}
              value={formik.values.walletAddress}
            />

            <FormHelperText size="sm" color={"red"}>
              {formik.touched.walletAddress && formik.errors.walletAddress ? (
                formik.errors.walletAddress
              ) : (
                <FormErrorMessage>
                  Please check HBAR wallet address where to receive HBAR from
                  customer
                </FormErrorMessage>
              )}
            </FormHelperText>
          </FormControl>

          {/* <Button onClick={() => {connectWallet()}} >Connect to HBAR Wallet</Button> */}

          <Button
            mt={4}
            onClick={formik.handleSubmit}
            isLoading={hBarWalletAddress.post.loading}
            type="submit"
            size="sm"
            bgGradient="linear(to-bl, #594bab,#4d2c58)"
            color="white"
          >
            Save Address
          </Button>
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
              {HbarAddressInput()}
            </Box>
            <Box bg="white" borderRadius={10} p={5} boxShadow="md">
              <Text size="xl" fontWeight="bold">
                Widget Embed Settings
              </Text>
              <Text mt="4" fontSize="sm">
                Enable or disable "HBAR Coupon" widget on your store. The widget
                gets appended to the bottom of your store page above the footer
                on the home page.
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
                    <Code children={`<div id="hpay-shop-app"> </div>`}></Code>
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
