import { Flex, Box, VStack, Button, useToast } from "@chakra-ui/react";
import { useEffect } from "react";


import useWalletStore from "../../store/wallet";

const ConnectWallet = () => {

  let shop;
  const retrievedObject = localStorage.getItem('shop');
  const shopObj = JSON.parse(retrievedObject);
  shop = shopObj?.shop;

  const toast = useToast();
  const walletState = useWalletStore((state) => state.walletState);
  const getHABRWalletConnect = useWalletStore(
    (state) => state.getHABRWalletConnect
  );

  const createUSDHToken = useWalletStore((state) => state.createUSDHToken);

  const getHbarTokenId = useWalletStore((state) => state.getHbarTokenId);


  // useEffect(() => {
  //   getHABRWalletConnect();
  // }, []);

  const connectWalletHandler = async () => {
    const data = await getHABRWalletConnect();
  };

  useEffect(() => {
    if (walletState.get?.success?.ok) {
      console.log(walletState.get);
      toast({
        title: "Success",
        status: "success",
      });
    }
  }, [walletState.get]);



  // if (walletState.get.success.ok) {
  //   walletId = walletState.get.success.data.accountId;
  //   console.log("wallet id: " + walletId);
  //   // postWalletAddress({ shop, walletAddress: walletId, });

  // }

  const createTokenHandler = () => {
    const { accountId, network, topic } = walletState.get.success.data;
    createUSDHToken({ accountId, network, topic });
  }

  const getGeneratedTokenHandler = () => {
    const { accountId, transId } = walletState.get.success.data;
    getHbarTokenId({ accountId, transId });
  }

  const backToAdmin = () => {
    window.open(
      `https://${shop}/admin/apps/dev-hbar-shop`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <>
      <Flex minH="100Vh" bg="#f8f7fc" w={"100%"} dir="row" alignItems="center">
        <Box
          display={"flex"}
          alignItems="center"
          width={"md"}
          m="auto"
          height="90vh"
          bg="white"
          boxShadow={"md"}
          borderRadius="lg"
        >
          <Box m="auto">
            <VStack spacing={4} align="stretch">
              <Button
                onClick={() => connectWalletHandler()}
                bgGradient="linear(to-bl, #594bab,#4d2c58)"
                _hover={{ bgGradient: "linear(to-bl, #ada1ed,#8e55a1)" }}
                color="white"
              >
                Connect To Wallet
              </Button>

              <Button
                onClick={() => createTokenHandler()}
                bgGradient="linear(to-bl, #594bab,#4d2c58)"
                _hover={{ bgGradient: "linear(to-bl, #ada1ed,#8e55a1)" }}
                color="white"
              >
                Create Token
              </Button>

              <Button
                onClick={() => getGeneratedTokenHandler()}
                bgGradient="linear(to-bl, #594bab,#4d2c58)"
                _hover={{ bgGradient: "linear(to-bl, #ada1ed,#8e55a1)" }}
                color="white"
              >
                Save Generated Token
              </Button>

              <Button
                onClick={() => backToAdmin()}
                bgGradient="linear(to-bl, #594bab,#4d2c58)"
                _hover={{ bgGradient: "linear(to-bl, #ada1ed,#8e55a1)" }}
                color="white"
              >
                Back To Shop Admin
              </Button>
            </VStack>
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default ConnectWallet;
