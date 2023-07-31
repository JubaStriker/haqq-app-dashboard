import create from 'zustand';
import produce from 'immer';
import axios from 'axios';
import { INTERNAL_SERVER_ERROR } from '../../constants/strings';

let blockChain;
const retrievedObject = localStorage.getItem('blockchain');
const blockChainObj = JSON.parse(retrievedObject);
blockChain = blockChainObj?.blockChain;

const INITIAL_CURRENCY_EXCHANGE_SATAE = {
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
    }
}

const useCurrencyExchangeStore = create((set) => ({
    currencyExchangeState: INITIAL_CURRENCY_EXCHANGE_SATAE,
    getCurrencyExchangeState: async () => {
        set(
            produce((state) => ({
                ...state,
                currencyExchangeState: {
                    ...state.currencyExchangeState,
                    get: {
                        ...INITIAL_CURRENCY_EXCHANGE_SATAE.get,
                        loading: true,
                    }
                }
            }))
        )

        try {
            let response;

            if (blockChain === 'hedera') {
                response = await axios.get('https://api.coinconvert.net/convert/usd/hbar?amount=1');
                console.log(response);
                set(
                    produce((state) => ({
                        ...state,
                        currencyExchangeState: {
                            ...state.currencyExchangeState,
                            get: {
                                ...INITIAL_CURRENCY_EXCHANGE_SATAE.get,
                                success: {
                                    ok: true,
                                    data: response.data.HBAR,
                                }
                            }
                        }
                    }))
                )
            }
            else if (blockChain === 'ripple') {
                const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=usd&vs_currencies=xrp')
                // console.log(response);
                set(
                    produce((state) => ({
                        ...state,
                        currencyExchangeState: {
                            ...state.currencyExchangeState,
                            get: {
                                ...INITIAL_CURRENCY_EXCHANGE_SATAE.get,
                                success: {
                                    ok: true,
                                    data: response.data.usd,
                                }
                            }
                        }
                    }))
                )
            }
            else if (blockChain === 'near') {
                response = await axios.get('https://api.coinconvert.net/convert/usd/near?amount=1');
                console.log(response);
                set(
                    produce((state) => ({
                        ...state,
                        currencyExchangeState: {
                            ...state.currencyExchangeState,
                            get: {
                                ...INITIAL_CURRENCY_EXCHANGE_SATAE.get,
                                success: {
                                    ok: true,
                                    data: response.data.NEAR,
                                }
                            }
                        }
                    }))
                )
            }
            return response;
        } catch (e) {
            console.log(e);
        }
    }
}))

export default useCurrencyExchangeStore