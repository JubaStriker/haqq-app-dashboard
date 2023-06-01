import React, { useContext } from "react";
import NavBar from "../../components/navbar";
import {
  Container,
  chakra,
  Center,
  Flex,
  Heading,
  Divider,
  Text,
  Box,
  UnorderedList,
  ListItem,
  Code,
  Input,
  Stack,
  Button,
  FormControl,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import useWebhooksStore from "../../store/webhooks";
import { ShopContext } from "../../context";

const EmbedInstructions = () => {
  const { postWebhooks, webhooks, getWebhooks } = useWebhooksStore(
    (state) => state
  );
  const shop = useContext(ShopContext);

  const webhookSchema = Yup.object().shape({
    webhook: Yup.string().required("URL address is required"),
  });
  const formik = useFormik({
    initialValues: { webhook: "" },
    validationSchema: webhookSchema,
    onSubmit: (values) => {
      if (values) {
        postWebhooks(shop, values.webhook);
      }
    },
  });

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
        <Heading textAlign="center" mb={4}>
          Sell anywhere with <chakra.span color="blue.500">Hedera</chakra.span>
        </Heading>
        <Center maxW="3xl" margin="0 auto" flexDirection="column">
          <Text align="center" fontSize="md">
            Now, sell your store curated products on other sites and let Hedera
            handle payments for you!
          </Text>
        </Center>

        <Center maxW="3xl" margin="0 auto" flexDirection="column">
          <br />
          <Divider />
          <br />
          <Heading fontSize="xl" textAlign="center" mb={2}>
            Developer <chakra.span color="blue.500"> SDK</chakra.span>
          </Heading>
          <Text align="left" fontSize="md">
            The first step is to ask the developers to install our SDK and
            follow the install instructions:
          </Text>
        </Center>
        <Box maxW="3xl" margin="0 auto" flexDirection="column">
          <br />
          <UnorderedList spacing={2}>
            <ListItem>
              <Code>npm install hbar-shop-react-sdk --save </Code>
            </ListItem>
            <ListItem>
              <Code>yarn add hbar-shop-react-sdk </Code>
            </ListItem>
            <ListItem>
              <Text>Import the component</Text>
              <Code>import {`{HbarShop}`} from "hbar-shop-react-sdk"; </Code>
            </ListItem>
            <ListItem>
              <Text>Render the componet</Text>
              <Code>
                {`
                <HbarShop
                    shop="jithendra-test-store.myshopify.com"
                    network="mainnet"
                />
                `}
              </Code>
            </ListItem>
          </UnorderedList>
        </Box>

        <Center maxW="3xl" margin="0 auto" flexDirection="column">
          <br />
          <Divider />
          <br />
          <Heading fontSize="xl" textAlign="center" mb={2}>
            Developer <chakra.span color="blue.500"> Webhooks</chakra.span>
          </Heading>
          <Text align="center" fontSize="md">
            With Hbar Shop, the developers who sell your products on their site
            can also listen to events confirming the transaction.
          </Text>
          <FormControl onSubmit={formik.handleSubmit}>
            <Input
              mt="3"
              id="webhook"
              name="webhook"
              type="text"
              placeholder="Add URL where developers will revceive webhook"
              onChange={formik.handleChange}
              value={formik.values.webhook}
            />
          </FormControl>

          <Button
            mt="5"
            isFullWidth
            bgGradient="linear(to-bl, #594bab,#4d2c58)"
            color="white"
            _hover={{ bgGradient: "linear(to-bl, #ada1ed,#8e55a1)" }}
            onClick={formik.handleSubmit}
          >
            Save
          </Button>
        </Center>
      </Container>
    </>
  );
};

export default EmbedInstructions;
