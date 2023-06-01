import create from "zustand";
import axios from "axios";
import produce from "immer";
import Parse from "parse";
import { INTERNAL_SERVER_ERROR } from "../../constants/strings";

const INITIAL_WEBHOOKS_STATE = {
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

const useWebhooksStore = create((set, get) => ({
  webhooks: INITIAL_WEBHOOKS_STATE,
  getWebhooks: async (shop = window.lookbook.shop) => {
    set(
      produce((state) => ({
        ...state,
        webhooks: {
          ...state.webhooks,
          get: {
            ...INITIAL_WEBHOOKS_STATE.get,
            loading: true,
          },
        },
      }))
    );

    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/get_webhooks?shop=${shop}`
      );
      set(
        produce((state) => ({
          ...state,
          webhooks: {
            ...state.webhooks,
            get: {
              ...INITIAL_WEBHOOKS_STATE.get,
              success: {
                ok: true,
                data,
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
          webhooks: {
            ...state.webhooks,
            get: {
              ...INITIAL_WEBHOOKS_STATE.get,
              failure: {
                error: true,
                message: e.message || INTERNAL_SERVER_ERROR,
              },
            },
          },
        }))
      );
      throw e;
    }
  },
  postWebhooks: async (shop = window.lookbook.shop, webhook) => {
    set(
      produce((state) => ({
        ...state,
        webhooks: {
          ...state.webhooks,
          post: {
            ...INITIAL_WEBHOOKS_STATE.post,
            loading: true,
          },
        },
      }))
    );

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/post_webhooks`,
        { shop, webhook }
      );
      set(
        produce((state) => ({
          ...state,
          webhooks: {
            ...state.webhooks,
            post: {
              ...INITIAL_WEBHOOKS_STATE.post,
              success: {
                ok: true,
                data,
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
          webhooks: {
            ...state.webhooks,
            post: {
              ...INITIAL_WEBHOOKS_STATE.post,
              failure: {
                error: true,
                message: e.message || INTERNAL_SERVER_ERROR,
              },
            },
          },
        }))
      );
      throw e;
    }
  },
  destroyScripts: async (shop = window.lookbook.shop) => {
    set(
      produce((state) => ({
        ...state,
        webhooks: {
          ...state.webhooks,
          destroy: {
            ...INITIAL_WEBHOOKS_STATE.destroy,
            loading: true,
          },
        },
      }))
    );

    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/destroy_webhooks?shop=${shop}`
      );

      set(
        produce((state) => ({
          ...state,
          webhooks: {
            ...state.webhooks,
            destroy: {
              ...INITIAL_WEBHOOKS_STATE.destroy,
              success: {
                ok: true,
                data,
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
          webhooks: {
            ...state.webhooks,
            destroy: {
              ...INITIAL_WEBHOOKS_STATE.destroy,
              failure: {
                error: true,
                message: e.message || INTERNAL_SERVER_ERROR,
              },
            },
          },
        }))
      );
      throw e;
    }
  },
}));

export default useWebhooksStore;
