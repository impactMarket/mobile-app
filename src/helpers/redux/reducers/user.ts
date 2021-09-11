import {
    RESET_USER_APP,
    SET_COMMUNITY,
    SET_COMMUNITY_CONTRACT,
    SET_USER_CELO_INFO,
    SET_USER_EXCHANGE_RATE,
    SET_USER_INFO,
    SET_USER_IS_BENEFICIARY,
    SET_USER_IS_BLOCKED,
    SET_USER_IS_SUSPECT,
    SET_USER_IS_COMMUNITY_MANAGER,
    SET_USER_LANGUAGE,
    SET_USER_WALLET_BALANCE,
} from 'helpers/constants';
import { UserActionTypes } from 'helpers/types/redux';
import { IUserState } from 'helpers/types/state';

const INITIAL_STATE_USER: IUserState = {
    wallet: {
        address: '',
        phoneNumber: '',
        balance: '0',
    },
    metadata: {
        address: '',
        username: null,
        currency: 'USD',
        language: 'en',
        gender: null,
        year: null,
        children: null,
        blocked: false,
        suspect: false,
        avatar: '',
        email: '',
    },
    exchangeRate: 1,
    community: {
        isBeneficiary: false,
        isManager: false,
        metadata: undefined as any,
        contract: undefined as any,
    },
};

export const userReducer = (
    state = INITIAL_STATE_USER,
    action: UserActionTypes
): IUserState => {
    const community = state.community;
    const { metadata, wallet } = state;
    switch (action.type) {
        case RESET_USER_APP:
            return INITIAL_STATE_USER;
        case SET_USER_CELO_INFO:
            return { ...state, wallet: action.payload };
        case SET_USER_INFO:
            return { ...state, metadata: action.payload };
        case SET_USER_EXCHANGE_RATE:
            return { ...state, exchangeRate: action.payload };
        case SET_USER_WALLET_BALANCE:
            wallet.balance = action.payload;
            return { ...state, wallet };
        case SET_USER_LANGUAGE:
            metadata.language = action.payload;
            return { ...state, metadata };
        case SET_USER_IS_BENEFICIARY:
            community.isBeneficiary = action.payload;
            return { ...state, community };
        case SET_USER_IS_BLOCKED:
            metadata.blocked = action.payload;
            return { ...state, community };
        case SET_USER_IS_SUSPECT:
            metadata.suspect = action.payload;
            return { ...state, community };
        case SET_USER_IS_COMMUNITY_MANAGER:
            community.isManager = action.payload;
            return { ...state, community };
        case SET_COMMUNITY:
            community.metadata = action.payload;
            return { ...state, community };
        case SET_COMMUNITY_CONTRACT:
            community.contract = action.payload;
            return { ...state, community };
        default:
            return state;
    }
};
