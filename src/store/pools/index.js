import create from "zustand";
import axios from "axios";
import produce from "immer";
import Parse from "parse";
import { INTERNAL_SERVER_ERROR } from "../../constants/strings";

const INITIAL_POOLS_STATE = {
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

const usePoolsStore = create((set, get) => ({
  poolsState: INITIAL_POOLS_STATE,
  getPoolsAction: async () => {
    set(
      produce((state) => ({
        ...state,
        poolsState: {
          ...state.poolsState,
          get: {
            ...INITIAL_POOLS_STATE.get,
            loading: true,
          },
        },
      }))
    );

    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/get_pools`
      );
      set(
        produce((state) => ({
          ...state,
          poolsState: {
            ...state.poolsState,
            get: {
              ...INITIAL_POOLS_STATE.get,
              loading: false,
              success: {
                ok: true,
                data: data,
              },
            },
          },
        }))
      );
      return data;
    } catch (e) {
      console.error(e);
      set(
        produce((state) => ({
          ...state,
          poolsState: {
            ...state.poolsState,
            get: {
              ...INITIAL_POOLS_STATE.get,
              failure: {
                error: true,
                message: e.message || INTERNAL_SERVER_ERROR,
              },
            },
          },
        }))
      );
    }
  },
}));

export default usePoolsStore;
