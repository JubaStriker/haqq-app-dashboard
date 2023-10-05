import create from "zustand";
import axios from "axios";
import produce from "immer";
import { INTERNAL_SERVER_ERROR } from "../../constants/strings";
const xrpl = require("xrpl");

const INITIAL_NFT_STATE = {
    get: {
        loading: false,
        success: {
            ok: false,
            data: {},
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
            data: {},
        },
        failure: {
            error: false,
            message: "",
        },
    },
    offer: {
        loading: false,
        success: {
            ok: false,
            data: {},
        },
        failure: {
            error: false,
            message: "",
        },
    },
    badge: {
        loading: false,
        success: {
            ok: false,
            data: {},
        },
        failure: {
            error: false,
            message: "",
        },
    },
    storeNft: {
        loading: false,
        success: {
            ok: false,
            data: {},
        },
        failure: {
            error: false,
            message: "",
        },
    },
    select: {
        loading: false,
        success: {
            ok: false,
            data: {},
        },
        failure: {
            error: false,
            message: "",
        },
    },
    send: {
        loading: false,
        success: {
            ok: false,
            data: {},
        },
        failure: {
            error: false,
            message: "",
        },
    }

};


const useNFTStore = create((set) => ({
    nftState: INITIAL_NFT_STATE,
    getNFTState: async (txid) => {
        set(
            produce((state) => ({
                ...state,
                nftState: {
                    ...state.nftState,
                    get: {
                        ...INITIAL_NFT_STATE.get,
                        loading: true,
                    },
                },
            }))
        );

        try {

            const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
            await client.connect();

            const response = await client.request({
                "id": 1,
                "command": "tx",
                "transaction": String(txid),
                "binary": false
            })
            console.log(response.result.meta)

            if (response) {
                set(
                    produce((state) => ({
                        ...state,
                        nftState: {
                            ...state.nftState,
                            get: {
                                ...INITIAL_NFT_STATE.get,
                                loading: false,
                                success: {
                                    ok: true,
                                    data: response.result.meta,
                                },
                            },
                        },
                    }))
                );
            };
            return response.result.meta;
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    postNFTState: async (account, uri) => {
        set(
            produce((state) => ({
                ...state,
                nftState: {
                    ...state.nftState,
                    post: {
                        ...INITIAL_NFT_STATE.get,
                        loading: true,
                    }
                },
            }))
        );

        try {
            const body = {
                account: account,
                uri: uri,
                method: "create"
            };
            const { data } = await axios.post(
                `http://localhost:8000/api/create_nft`, body
            );

            set(
                produce((state) => ({
                    ...state,
                    nftState: {
                        ...state.nftState,
                        post: {
                            ...INITIAL_NFT_STATE.post,
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
            throw e;
        }
    },
    postNFTBadge: async (title, description, image) => {
        set(
            produce((state) => ({
                ...state,
                nftState: {
                    ...state.nftState,
                    badge: {
                        ...INITIAL_NFT_STATE.badge,
                        loading: true,
                    },
                },
            }))
        );

        try {
            const body = {
                title: title,
                description: description,
                image: image
            };

            const { data } = await axios.post(`${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/badge_nft`, body)

            if (data?.objectId) {
                set(
                    produce((state) => ({
                        ...state,
                        nftState: {
                            ...state.nftState,
                            badge: {
                                ...INITIAL_NFT_STATE.badge,
                                loading: false,
                                success: {
                                    ok: true,
                                    data: data,
                                },
                            },
                        },
                    }))
                );
            }

            ;
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    storeNft: async (title, description, image, token) => {
        set(
            produce((state) => ({
                ...state,
                nftState: {
                    ...state.nftState,
                    storeNft: {
                        ...INITIAL_NFT_STATE.storeNft,
                        loading: true,
                    },
                },
            }))
        );

        try {
            const body = {
                title: title,
                description: description,
                image: image,
                token: token,
                shop: window.lookbook.shop,
            };

            console.log(body);

            const { data } = await axios.post(`${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/nft_store`, body)

            if (data?.objectId) {
                set(
                    produce((state) => ({
                        ...state,
                        nftState: {
                            ...state.nftState,
                            storeNft: {
                                ...INITIAL_NFT_STATE.storeNft,
                                loading: false,
                                success: {
                                    ok: true,
                                    data: data,
                                },
                            },
                        },
                    }))

                );
            }

            return data;
        }
        catch (e) { }
    },

    selectNft: (nft) => {

        const data = nft;

        try {
            if (data.name) {
                set(
                    produce((state) => ({
                        ...state,
                        nftState: {
                            ...state.nftState,
                            select: {
                                ...INITIAL_NFT_STATE.select,
                                loading: false,
                                success: {
                                    ok: true,
                                    data: data,
                                },
                            }
                        },
                    }))
                );
            }
        }
        catch (e) {
            console.error(e);
        }

    },
    createSellOffer: async (account, code, tokenID) => {
        set(
            produce((state) => ({
                ...state,
                nftState: {
                    ...state.nftState,
                    offer: {
                        ...INITIAL_NFT_STATE.offer,
                        loading: true,
                    },
                    post: {
                        ...INITIAL_NFT_STATE.post,
                        loading: false,
                        success: {
                            ok: false,
                            data: {},
                        },
                    }
                },
            }))
        );
        try {
            const body = {
                account: account,
                code: code,
                tokenID: tokenID
            };
            const { data } = await axios.post(`${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/transfer_nft`, body)

            if (data) {
                set(
                    produce((state) => ({
                        ...state,
                        nftState: {
                            ...state.nftState,
                            offer: {
                                ...INITIAL_NFT_STATE.offer,
                                loading: false,
                                success: {
                                    ok: true,
                                    data: data,
                                },
                            },
                        },
                    }))
                );
            }
            return data;

        }
        catch (e) {
            console.error(e);
            throw e;
        }
    },
    sendNFT: async ({ code, name, email, txid }) => {
        set(
            produce((state) => ({
                ...state,
                nftState: {
                    ...state.nftState,
                    send: {
                        ...INITIAL_NFT_STATE.send,
                        loading: true,
                    },
                },
            }))
        );
        try {
            const body = {
                code: code,
                name: name,
                email: email,
                txid: txid
            };

            const { data } = await axios.post(`${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/send_mail`, body)

            if (data) {
                set(
                    produce((state) => ({
                        ...state,
                        nftState: {
                            ...state.nftState,
                            send: {
                                ...INITIAL_NFT_STATE.send,
                                loading: false,
                                success: {
                                    ok: true,
                                    data: data,
                                },
                            },
                            select: {
                                ...INITIAL_NFT_STATE.select,
                                loading: false,
                                success: {
                                    ok: false,
                                    data: "",
                                },
                            }
                        },
                    }))
                );
            }
            return data;

        } catch (e) {
            console.error(e);
        }
    }

}));

export default useNFTStore;