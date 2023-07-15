import create from "zustand";
import axios from "axios";
import produce from "immer";
import { INTERNAL_SERVER_ERROR } from "../../constants/strings";

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
    }

};


const useNFTStore = create((set) => ({
    nftState: INITIAL_NFT_STATE,
    getNFTState: async (seed) => {
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
            const body = {
                seed: seed,
                uri: "example.com",
                transferFee: "8",
                flags: "8",
                method: "get"
            };

            const { data } = await axios.post(`${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/create_nft`, body)

            if (data?.type === 'response') {
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
                                    data: data,
                                },
                            },
                        },
                    }))
                );
            }
            console.log('Response:', data);
            ;
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    postNFTState: async (seed, uri, transferFee, flags) => {
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
                seed: seed,
                uri: uri,
                transferFee: transferFee,
                flags: flags,
                method: "create"
            };

            const { data } = await axios.post(`${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/create_nft`, body)

            if (data?.type === 'response') {
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
            }
            console.log('Response:', data);
            ;
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

    createSellOffer: async (seed, tokenID, amount, flags, code) => {
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
                seed: seed,
                tokenID: tokenID,
                amount: amount,
                flags: flags,
                code: code,
            };

            const { data } = await axios.post(`${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/transfer_nft`, body)

            if (data?.type === 'response') {
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
            console.log('Response:', data);

        }
        catch (e) {
            console.error(e);
            throw e;
        }
    }
}));

export default useNFTStore;