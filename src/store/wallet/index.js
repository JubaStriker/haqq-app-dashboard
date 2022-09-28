import create from "zustand";
import axios from "axios";
import produce from "immer";
import { INTERNAL_SERVER_ERROR } from "../../constants/strings";
import Parse from "parse";
import { HashConnect } from "hashconnect";
import { AwesomeQR } from "awesome-qr";

const VERIFY_WALLET_STATE = {
  get: {
    loading: false,
    success: {
      ok: false,
      data: [],
    },
    failure: {
      error: false,
      message: "",
    },
  },
};

const INITIAL_WALLET_STATE = {
  get: {
    loading: false,
    success: {
      ok: false,
      data: [],
    },
    failure: {
      error: false,
      message: "",
    },
  },
  post: {
    loading: false,
    success: {
      ok: false,
      data: null,
    },
    failure: {
      error: false,
      message: "",
    },
  },
};

const useWalletStore = create((set, address) => ({
  verifyWalletSate: VERIFY_WALLET_STATE,
  walletState: INITIAL_WALLET_STATE,
  verifyWalletAddress: async (data) => {
    set(
      produce((state) => ({
        ...state,
        verifyWalletSate: {
          ...state.verifyWalletSate,
          get: {
            ...VERIFY_WALLET_STATE.get,
            loading: true,
          },
        },
      }))
    );
    try {
      // console.log(data);
      const fetchAccount = await fetch(
        `https://testnet.mirrornode.hedera.com/api/v1/accounts?account.id=${data}`
      );
      const response = await fetchAccount.json();
      console.log(response.accounts[0].account);

      if (data === response.accounts[0].account) {
        set(
          produce((state) => ({
            ...state,
            verifyWalletSate: {
              ...state.verifyWalletSate,
              get: {
                ...VERIFY_WALLET_STATE.get,
                loading: false,
                success: {
                  ok: true,
                },
              },
            },
          }))
        );
      }
    } catch (e) {
      set(
        produce((state) => ({
          ...state,
          verifyWalletSate: {
            ...state.verifyWalletSate,
            get: {
              ...VERIFY_WALLET_STATE.get,
              loading: false,
              success: {
                ok: false,
              },
            },
          },
        }))
      );
    }
  },
  fetchWalletAddress: async () => {
    // set(
    //   produce((state) => ({
    //     ...state,
    //     walletState: {
    //       ...state.walletState,
    //       get: {
    //         ...INITIAL_WALLET_STATE.get,
    //         loading: true,
    //       },
    //     },
    //   }))
    // );
    try {
      let hashConnect = new HashConnect();
      window.hashConnect = hashConnect
      console.log("Hash Connect Data", hashConnect);
      const appMetadata = {
        name: "HBar Shop",
        description: "An example hedera dApp",
        icon: "https://absolute.url/to/icon.png",
        url: "https://9516-171-76-213-73.in.ngrok.io"
      };

      const initData = await hashConnect.init(appMetadata, "testnet", false);
      
      // console.log('asdasd')
      // let qrcode = "";
      // const ScanCode = await new AwesomeQR({
      //   text: initData.pairingString,
      //   size: 400,
      //   margin: 16,
      //   maskPattern: 110,
      //   colorLight: "#fff",
      // })
      //   .draw()
      //   .then((dataURL) => {
      //     if (dataURL) {
      //       qrcode = dataURL.toString();
      //     }
      //   });
      // console.log(qrcode);
      console.log("Here ", hashConnect)
      hashConnect.foundExtensionEvent.once((walletMetadata) => {
        console.log("WALLET METADAT ", walletMetadata)
        hashConnect.connectToLocalWallet(
          initData.pairingString,
          walletMetadata
        );
      }, (err) => console.error(err));
      let walletAddress = "";
      hashConnect.pairingEvent.once((pairingData) => {
        console.log("Paired Data: ", pairingData);
        pairingData.accountIds.forEach((id) => {
          walletAddress = id;
          console.log(walletAddress);
        });
        //   // set(
        //   //   produce((state) => ({
        //   //     ...state,
        //   //     walletState: {
        //   //       ...state.walletState,
        //   //       get: {
        //   //         ...INITIAL_WALLET_STATE.get,
        //   //         success: {
        //   //           data: walletAddress,
        //   //           ok: true,
        //   //         },
        //   //       },
        //   //     },
        //   //   }))
        //   // );
      });
    } catch (e) {
      console.error(e);
      // set(
      //   produce((state) => ({
      //     ...state,
      //     walletState: {
      //       ...state.walletState,
      //       get: {
      //         ...INITIAL_WALLET_STATE.get,
      //         loading: false,
      //         success:{
      //           data: e.message,
      //           ok: false,
      //         }
      //       },
      //     },
      //   }))
      // );
    }
  },
  getWalletAddress: async (shop) => {
    set(
      produce((state) => ({
        ...state,
        walletState: {
          ...state.walletState,
          get: {
            ...INITIAL_WALLET_STATE.get,
            loading: true,
          },
        },
      }))
    );

    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/get_shop?shop=${shop}`
      );
      // console.log(data);
      set(
        produce((state) => ({
          ...state,
          walletState: {
            ...state.walletState,
            get: {
              ...INITIAL_WALLET_STATE.get,
              success: {
                data: data,
                ok: true,
              },
            },
          },
        }))
      );
      return data;
    } catch (e) {
      set(
        produce((state) => ({
          ...state,
          walletState: {
            ...state.walletState,
            get: {
              ...INITIAL_WALLET_STATE.get,
              loading: false,
              success: {
                data: e.message,
                ok: false,
              },
            },
          },
        }))
      );
    }
  },
  postWalletAddress: async ({ shop, walletAddress }) => {
    set(
      produce((state) => ({
        ...state,
        walletState: {
          ...state.walletState,
          post: {
            ...INITIAL_WALLET_STATE.post,
            loading: true,
          },
        },
      }))
    );
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/put_shop`,
        {
          shop,
          walletAddress,
        }
      );
      set(
        produce((state) => ({
          ...state,
          walletState: {
            ...state.walletState,
            post: {
              ...INITIAL_WALLET_STATE.post,
              loading: false,
              success: {
                ok: true,
              },
            },
          },
        }))
      );
      return data;
    } catch (error) {
      console.log(error);
      set(
        produce((state) => ({
          ...state,
          walletState: {
            ...state.walletState,
            post: {
              ...INITIAL_WALLET_STATE.post,
              loading: false,
              success: {
                ok: false,
              },
              failure: {
                error: false,
                message: "Please Verify the Wallet Address",
              },
            },
          },
        }))
      );
      throw error;
    }
  },
}));

export default useWalletStore;
