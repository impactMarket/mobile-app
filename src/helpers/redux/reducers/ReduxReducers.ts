import {
    RESET_USER_APP,
    SET_APP_FROM_WELCOME_SCREEN,
    SET_APP_SUSPECT_WRONG_DATETIME,
    SET_AUTH_TOKEN,
    SET_CELO_KIT,
    SET_COMMUNITY,
    SET_COMMUNITY_CONTRACT,
    SET_EXCHANGE_RATES,
    SET_PUSH_NOTIFICATION_TOKEN,
    SET_USER_CELO_INFO,
    SET_USER_EXCHANGE_RATE,
    SET_USER_INFO,
    SET_USER_IS_BENEFICIARY,
    SET_USER_IS_COMMUNITY_MANAGER,
    SET_USER_LANGUAGE,
    SET_USER_WALLET_BALANCE,
    SET_VIEW_MANAGER_DETAILS,
} from 'helpers/constants';
import { combineReducers } from 'redux';
import {
    AppActionTypes,
    AuthActionTypes,
    UserActionTypes,
    ViewActionTypes,
} from 'helpers/types/redux';
import {
    IAppState,
    IAuthState,
    IUserState,
    IViewState,
} from 'helpers/types/state';

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
        age: null,
        childs: null,
    },
    exchangeRate: 1,
    community: {
        isBeneficiary: false,
        isManager: false,
        metadata: undefined as any,
        contract: undefined as any,
    },
};

const INITIAL_STATE_AUTH: IAuthState = {
    pushNotificationToken: '',
    authToken: '',
};

const INITIAL_STATE_APP: IAppState = {
    kit: undefined as any,
    exchangeRates: undefined as any, // save exhangeRates on load
    suspectWrongDateTime: false,
    timeDiff: 0,
    fromWelcomeScreen: '',
};

const INITIAL_STATE_VIEW: IViewState = {
    managerDetails: undefined,
};

const userReducer = (
    state = INITIAL_STATE_USER,
    action: UserActionTypes
): IUserState => {
    const community = state.community;
    const { metadata } = state;
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
            const wallet = state.wallet;
            wallet.balance = action.payload;
            return { ...state, wallet };
        case SET_USER_LANGUAGE:
            metadata.language = action.payload;
            return { ...state, metadata };
        case SET_USER_IS_BENEFICIARY:
            community.isBeneficiary = action.payload;
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

const authReducer = (state = INITIAL_STATE_AUTH, action: AuthActionTypes) => {
    switch (action.type) {
        case SET_PUSH_NOTIFICATION_TOKEN:
            return { ...state, pushNotificationToken: action.payload };
        case SET_AUTH_TOKEN:
            return { ...state, authToken: action.payload };
        default:
            return state;
    }
};

const appReducer = (state = INITIAL_STATE_APP, action: AppActionTypes) => {
    switch (action.type) {
        case SET_CELO_KIT:
            return { ...state, kit: action.payload };
        case SET_EXCHANGE_RATES:
            return { ...state, exchangeRates: action.payload };
        case SET_APP_SUSPECT_WRONG_DATETIME:
            return {
                ...state,
                suspectWrongDateTime: action.payload.suspect,
                timeDiff: action.payload.timeDiff,
            };
        case SET_APP_FROM_WELCOME_SCREEN:
            return {
                ...state,
                fromWelcomeScreen: action.payload,
            };
        default:
            return state;
    }
};

const viewReducer = (state = INITIAL_STATE_VIEW, action: ViewActionTypes) => {
    switch (action.type) {
        case SET_VIEW_MANAGER_DETAILS:
            return { ...state, managerDetails: action.payload };
        default:
            return state;
    }
};

export default combineReducers({
    user: userReducer,
    auth: authReducer,
    view: viewReducer,
    app: appReducer,
});
