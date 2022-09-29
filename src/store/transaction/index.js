import create from "zustand";
import axios from "axios";
import produce from "immer";
import { INTERNAL_SERVER_ERROR } from "../../constants/strings";

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
      const {data} = await axios.get(`${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/get_shop?shop=${shop}`);
      const walletAddress = data.walletAddress;
      const url = `${process.env.REACT_APP_HEDERA_ACCOUNT_VERIFY}api/v1/transactions?account.id=${walletAddress}`
      const result = await fetch(url)
      const response = await result.json();
      // console.log(response);

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
