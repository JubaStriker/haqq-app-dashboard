import create from 'zustand';
import produce from 'immer';

let blockChain;
const retrievedObject = localStorage.getItem('blockchain');
const blockChainObj = JSON.parse(retrievedObject);
blockChain = blockChainObj?.blockChain;

const INITIAL_CURRENCY_EXCHANGE_STATE = {
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
    currencyExchangeState: INITIAL_CURRENCY_EXCHANGE_STATE,
    getCurrencyExchangeState: async () => {
        set(
            produce((state) => ({
                ...state,
                currencyExchangeState: {
                    ...state.currencyExchangeState,
                    get: {
                        ...INITIAL_CURRENCY_EXCHANGE_STATE.get,
                        loading: true,
                    }
                }
            }))
        )

        try {
            let response;
            const data = 1530.24
            set(
                produce((state) => ({
                    ...state,
                    currencyExchangeState: {
                        ...state.currencyExchangeState,
                        get: {
                            ...INITIAL_CURRENCY_EXCHANGE_SATAE.get,
                            success: {
                                ok: true,
                                data: data,
                            }
                        }
                    }
                }))
            )
            return response;
        } catch (e) {
            console.log(e);
        }
    }
}))

export default useCurrencyExchangeStore