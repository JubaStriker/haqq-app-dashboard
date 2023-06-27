import create from "zustand";
import axios from "axios";
import produce from "immer";
import { INTERNAL_SERVER_ERROR } from "../../constants/strings";

let blockChain;
const retrievedObject = localStorage.getItem('blockchain');
const blockChainObj = JSON.parse(retrievedObject);
blockChain = blockChainObj?.blockChain;

const INITIAL_TRANSACTION_STATE = {
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

const useTransactionStore = create((set) => ({
  transactionState: INITIAL_TRANSACTION_STATE,
  getTransactionState: async (shop) => {
    set(
      produce((state) => ({
        ...state,
        walletState: {
          ...state.transactionState,
          get: {
            ...INITIAL_TRANSACTION_STATE.get,
            loading: true,
          },
        },
      }))
    );

    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/get_shop?shop=${shop}`);
      const walletAddress = data.walletAddress;

      let response;

      // ----------------------- Hedera --------------------- //
      if (blockChain === 'hedera') {
        const url = `${process.env.REACT_APP_HEDERA_ACCOUNT_VERIFY}api/v1/transactions?account.id=${walletAddress}`
        const result = await fetch(url)
        response = await result.json();
      }
      // ----------------------- Ripple --------------------- //
      else if (blockChain === 'ripple') {
        const client = new window.xrpl.Client(
          `${process.env.REACT_APP_XRP_TRANSACTION_FETCH_UTL}`
        );
        await client.connect();
        response = await client.request({
          command: "account_tx",
          account: walletAddress,
        });
      }


      set(
        produce((state) => ({
          ...state,
          transactionState: {
            ...state.transactionState,
            get: {
              ...INITIAL_TRANSACTION_STATE.get,
              success: {
                ok: true,
                data: response,
              },
            },
          },
        }))
      );
      return response;
    } catch (e) {
      throw e;
    }
  },
}));

export default useTransactionStore;
