import create from "zustand";
import axios from "axios";
import produce from "immer";
import { HashConnect } from "hashconnect";
import { PublicKey, TokenCreateTransaction } from "@hashgraph/sdk";


let blockchain;
const retrievedObject = localStorage.getItem('blockchain');
const blockChainObj = JSON.parse(retrievedObject);
blockchain = blockChainObj?.blockChain;


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

let hashconnect = new HashConnect();

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
      const fetchAccount = await fetch(
        `${process.env.REACT_APP_HEDERA_ACCOUNT_VERIFY}api/v1/accounts?account.id=${data}`
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
        `${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/get_shop?shop=${shop}&blockchain=${blockchain}`
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
  postWalletAddress: async ({ shop, walletAddress, walletToken }) => {
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
          walletToken,
          blockchain
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
  getHABRWalletConnect: async () => {
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
      let walletAccountID = "";
      const appMetaData = {
        name: "Hbar Shopify App",
        description: "Hedera Token Creation",
        icon: "https://cdn-icons-png.flaticon.com/512/5987/5987861.png",
      };

      const initData = await hashconnect.init(appMetaData, "testnet", false);

      hashconnect.foundExtensionEvent.once((walletMetadata) => {
        hashconnect.connectToLocalWallet(
          initData.pairingString,
          walletMetadata
        );
      });

      hashconnect.pairingEvent.once((pairingData) => {
        console.log(pairingData);
        pairingData.accountIds.forEach((id) => {
          walletAccountID = id;
        });


        console.log("wallet ID: 1", walletAccountID);

        set(
          produce((state) => ({
            ...state,
            walletState: {
              ...state.walletState,
              get: {
                ...INITIAL_WALLET_STATE.get,
                loading: false,
                success: {
                  data: {
                    topic: pairingData.topic,
                    accountId: walletAccountID,
                    network: pairingData.network,
                  },
                  ok: true,
                },
              },
            },
          }))
        );

      });

      return initData;

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
                ok: false,
              },
              failure: {
                error: false,
                message: "Please check your Hashpack Wallet",
              },
            },
          },
        }))
      );
    }
  },
  createUSDHToken: async ({ accountId, network, topic }) => {
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
      console.log(accountId, network, topic);
      const provider = hashconnect.getProvider(network, topic, accountId);
      const signer = hashconnect.getSigner(provider);

      let accountInfo = await fetch(
        "https://testnet.mirrornode.hedera.com/api/v1/accounts/" + accountId,
        { method: "GET" }
      );
      let account = await accountInfo.json();

      let key = PublicKey.fromString(account.key.key);
      console.log(key);

      const createTokenTx = await new TokenCreateTransaction()
        .setTokenName("USDC Hedera")
        .setTokenSymbol("USDCH")
        .setDecimals(0)
        .setInitialSupply(100)
        .setTreasuryAccountId(accountId)
        .setAdminKey(key)
        .setSupplyKey(key)
        .setWipeKey(key)
        .setAutoRenewAccountId(accountId)
        .freezeWithSigner(signer);

      const createReceipt = await createTokenTx.executeWithSigner(signer);
      console.log("Created Receipt: ", createReceipt);

      let txId = createReceipt.transactionId;
      let respId = txId.replace(/[^\d+]/g, "-");
      let respid = respId.replace("-", ".");
      let transId = respid.replace("-", ".");

      console.log("Transaction Id: ", transId);

      set(
        produce((state) => ({
          ...state,
          walletState: {
            ...state.walletState,
            get: {
              ...INITIAL_WALLET_STATE.get,
              success: {
                ok: true,
                data: {
                  network,
                  accountId,
                  topic,
                  transId,
                },
              },
            },
          },
        }))
      );
    } catch (error) {
      set(
        produce((state) => ({
          ...state,
          walletState: {
            ...state.walletState,
            get: {
              ...INITIAL_WALLET_STATE.get,
              failure: {
                error: true,
                message: error.message,
              },
            },
          },
        }))
      );
    }
  },
  getHbarTokenId: async ({
    accountId,
    transId,
    shop = "jithu-demo.myshopify.com",
  }) => {
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
      console.log(accountId, transId);
      const transactionResponse = await fetch(
        "https://testnet.mirrornode.hedera.com/api/v1/transactions/" + transId
      );

      const resp = await transactionResponse.json();
      console.log("Transaction Response: ", resp);
      const generatedId = resp.transactions[0].entity_id;
      console.log("Token ID: ", generatedId);

      const { data } = await axios.post(
        `${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/put_shop`,
        {
          shop,
          walletAddress: accountId,
          walletToken: generatedId,
        }
      );

      set(
        produce((state) => ({
          ...state,
          walletState: {
            ...state.INITIAL_WALLET_STATE,
            get: {
              ok: true,
              data: {
                data,
                accountId,
                generatedId,
              }
            }
          }
        }))
      )

    } catch (error) {
      set(
        produce((state) => ({
          ...state,
          walletState: {
            ...state.walletState,
            get: {
              ...INITIAL_WALLET_STATE.get,
              failure: {
                error: true,
                message: error.message,
              },
            },
          },
        }))
      );
    }
  },
}));

export default useWalletStore;
