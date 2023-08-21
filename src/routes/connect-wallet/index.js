import { Flex, Box, VStack, Button } from "@chakra-ui/react";
import { useContext } from "react";
import { ShopContext } from "../../context";

import useWalletStore from "../../store/wallet";

const ConnectWallet = () => {
  const shop = useContext(ShopContext);
  const walletState = useWalletStore((state) => state.walletState);
  const getHABRWalletConnect = useWalletStore(
    (state) => state.getHABRWalletConnect
  );

  const createUSDHToken = useWalletStore((state) => state.createUSDHToken);

  const getHbarTokenId = useWalletStore((state) => state.getHbarTokenId);

  console.log(walletState.get);
  // useEffect(() => {
  //   getHABRWalletConnect();
  // }, []);

  const connectWalletHandler = () => {
    getHABRWalletConnect();
  };

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
      "https://jithu-demo.myshopify.com/admin/apps/dev-hedera",
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
                Get Generated Token
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
