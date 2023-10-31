import create from "zustand";
import axios from "axios";
import produce from "immer";

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
      const { data } = await axios.get(`${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/get_shop?shop=${shop}&blockchain=${blockChain}`);
      const walletAddress = data.walletAddress;

      let response;


      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/islm_Transactions?walletAddress=${walletAddress}`);
        response = data;
      } catch (e) {
        console.log(e, 'Got fetch error')
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
