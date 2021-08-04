export enum Screens {
    CommunityDetails = 'CommunityDetails',
    FAQ = 'FAQ',
    Welcome = 'Welcome',
    CreateCommunity = 'CreateCommunity',
    WaitingTx = 'WaitingTx',
    Stories = 'Stories',
    NewStory = 'NewStory',
    StoriesCarousel = 'StoriesCarousel',
    Carousel = 'Carousel',
    //
    ClaimExplained = 'ClaimExplained',
    AnonymousReport = 'AnonymousReport',
    AddedBeneficiary = 'AddedBeneficiary',
    RemovedBeneficiary = 'RemovedBeneficiary',
    AddBeneficiary = 'AddBeneficiary',
    AddManager = 'AddManager',
    AddedManager = 'AddedManager',
    //
    Beneficiary = 'Beneficiary',
    WelcomeRulesScreen = 'WelcomeRulesScreen',
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
export const SET_USER_IS_BLOCKED = 'SET_USER_IS_BLOCKED';
export const SET_USER_IS_SUSPECT = 'SET_USER_IS_SUSPECT';
export const SET_USER_IS_COMMUNITY_MANAGER = 'SET_USER_IS_COMMUNITY_MANAGER';
export const RESET_USER_APP = 'RESET_USER_APP';
export const RESET_NETWORK_APP = 'RESET_NETWORK_APP';
export const SET_PUSH_NOTIFICATION_TOKEN = 'SET_PUSH_NOTIFICATION_TOKEN';
export const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN';
export const SET_USER_LANGUAGE = 'SET_USER_LANGUAGE';
export const SET_EXCHANGE_RATES = 'SET_EXCHANGE_RATES';
export const CONSENT_ANALYTICS = 'CONSENT_ANALYTICS';
export const SHOW_REPORT_CARD = 'SHOW_REPORT_CARD';

export const SET_USER_AUTH_REQUEST = 'SET_USER_AUTH_REQUEST';
export const SET_USER_AUTH_SUCCESS = 'SET_USER_AUTH_SUCCESS';
export const SET_USER_AUTH_FAILURE = 'SET_USER_AUTH_FAILURE';

export const SET_APP_SUSPECT_WRONG_DATETIME = 'app/suspectWrongDateTime';
export const SET_APP_FROM_WELCOME_SCREEN = 'app/fromWelcomeScreen';
export const SET_APP_BENEFICIARY_HAS_ACCEPTED_TERMS =
    'app/hasBeneficiaryAcceptedRulesAlready';
export const SET_APP_MANAGER_HAS_ACCEPTED_TERMS =
    'app/hasManagerAcceptedRulesAlready';

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

export enum apiImageTargets {
    COVER = '/community/picture',
    PROFILE = '/user/picture',
}

export enum imageTargets {
    COVER = 'COVER',
    PROFILE = 'PROFILE',
}

export enum storiesAction {
    INIT_REQUEST = 'stories/init_request',
    INIT_SUCCESS = 'stories/init_success',
    INIT_FAILURE = 'stories/init_failure',
    CONCAT = 'stories/concat',
    USER_STORIES_REQUEST = 'stories/user_request',
    USER_STORIES_SUCCESS = 'stories/user_success',
    USER_STORIES_FAILURE = 'stories/user_failure',
}

export const SET_VIEW_MANAGER_DETAILS = 'view/managerDetails';

export enum celoNetwork {
    noAddress = '0x0000000000000000000000000000000000000000',
}
