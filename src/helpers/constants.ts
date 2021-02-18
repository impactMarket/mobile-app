export enum Screens {
    CommunityDetails = 'CommunityDetails',
    FAQ = 'FAQ',
    Welcome = 'Welcome',
    CreateCommunity = 'CreateCommunity',
    WaitingTx = 'WaitingTx',
    Stories = 'Stories',
    StoriesCarousel = 'StoriesCarousel',
    //
    ClaimExplained = 'ClaimExplained',
    AddedBeneficiary = 'AddedBeneficiary',
    RemovedBeneficiary = 'RemovedBeneficiary',
    AddBeneficiary = 'AddBeneficiary',
    AddManager = 'AddManager',
    AddedManager = 'AddedManager',
    //
    Beneficiary = 'Beneficiary',
    CommunityManager = 'CommunityManager',
    Communities = 'Communities',
    Profile = 'Profile',
    Auth = 'Auth',
}

// async storage
export const STORAGE_USER_ADDRESS = '@wallet:address';
export const STORAGE_USER_PHONE_NUMBER = '@wallet:phonenumber';
export const STORAGE_USER_AUTH_TOKEN = '@user:authtoken';

// redux
// export const INIT_USER = 'INIT_USER';
export const SET_USER_CELO_INFO = 'SET_USER_CELO_INFO';
export const SET_USER_INFO = 'SET_USER_INFO';
export const SET_USER_EXCHANGE_RATE = 'SET_USER_EXCHANGE_RATE';
export const SET_USER_WALLET_BALANCE = 'SET_USER_WALLET_BALANCE';
export const SET_CELO_KIT = 'SET_CELO_KIT';
export const SET_COMMUNITY_CONTRACT = 'SET_COMMUNITY_CONTRACT';
export const SET_COMMUNITY = 'SET_COMMUNITY';
export const SET_USER_IS_BENEFICIARY = 'SET_USER_IS_BENEFICIARY';
export const SET_USER_IS_COMMUNITY_MANAGER = 'SET_USER_IS_COMMUNITY_MANAGER';
export const RESET_USER_APP = 'RESET_USER_APP';
export const RESET_NETWORK_APP = 'RESET_NETWORK_APP';
export const SET_PUSH_NOTIFICATION_TOKEN = 'SET_PUSH_NOTIFICATION_TOKEN';
export const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN';
export const SET_USER_LANGUAGE = 'SET_USER_LANGUAGE';
export const SET_EXCHANGE_RATES = 'SET_EXCHANGE_RATES';
export const CONSENT_ANALYTICS = 'CONSENT_ANALYTICS';

export const SET_APP_SUSPECT_WRONG_DATETIME = 'app/suspectWrongDateTime';
export const SET_APP_FROM_WELCOME_SCREEN = 'app/fromWelcomeScreen';

export enum appAction {
    SET_PUSH_NOTIFICATION_LISTENERS = 'app/setPushNotificationListeners',
}

export enum modalDonateAction {
    OPEN = 'donateModal/open',
    GO_TO_CONFIRM_DONATE = 'donateModal/goToConfirm',
    GO_TO_ERROR_DONATE = 'donateModal/goToError',
    GO_BACK_TO_DONATE = 'donateModal/goBackToDonate',
    IN_PROGRESS = 'donateModal/inProgress',
    CLOSE = 'donateModal/close',
}

export const SET_VIEW_MANAGER_DETAILS = 'view/managerDetails';

export enum celoNetwork {
    noAddress = '0x0000000000000000000000000000000000000000',
}
