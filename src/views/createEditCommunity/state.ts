import { validateEmail } from 'helpers/index';
import React from 'react';

interface INITIAL_FORM_STATE {
    name: string;
    coverImage: string;
    profileImage: string;
    description: string;
    city: string;
    country: string;
    gps: {
        latitude: number;
        longitude: number;
    };
    email: string;
    currency: string;
    claimAmount: string;
    baseInterval: string;
    maxClaim: string;
    incrementInterval: string;
    incrementIntervalUnit: number;
    visibility: string;
    validation: {
        name: boolean;
        description: boolean;
        descriptionTooShort: boolean;
        city: boolean;
        country: boolean;
        email: boolean;
        emailFormat: boolean;
        gps: boolean;
        cover: boolean;
        profile: boolean;
        claimAmount: boolean;
        baseInterval: boolean;
        maxClaim: boolean;
        incrementInterval: boolean;
        incrementIntervalUnit: boolean;
    };
}
export enum formAction {
    SET_NAME = 'form/setName',
    SET_COVER_IMAGE = 'form/setCoverImage',
    SET_PROFILE_IMAGE = 'form/setProfileImage',
    SET_DESCRIPTION = 'form/setDescription',
    SET_CITY = 'form/setCity',
    SET_COUNTRY = 'form/setCountry',
    SET_GPS = 'form/setGPS',
    SET_EMAIL = 'form/setEmail',
    SET_CURRENCY = 'form/setCurrency',
    SET_CLAIM_AMOUNT = 'form/setClaimAmount',
    SET_BASE_INTERVAL = 'form/setBaseInterval',
    SET_MAX_CLAIM = 'form/setMaxClaim',
    SET_INCREMENT_INTERVAL = 'form/setIncrementInterval',
    SET_INCREMENT_INTERVAL_UNIT = 'form/setIncrementIntervalUnit',
    SET_VISIBILITY = 'form/setVisibility',
    SET_NAME_VALID = 'form/setNameValid',
    SET_DESCRIPTION_VALID = 'form/setDescriptionValid',
    SET_DESCRIPTION_TOO_SHORT_VALID = 'form/setDescriptionTooShortValid',
    SET_CITY_VALID = 'form/setCityValid',
    SET_COUNTRY_VALID = 'form/setCountryValid',
    SET_EMAIL_VALID = 'form/setEmailValid',
    SET_EMAIL_FORMAT_VALID = 'form/setEmailFormatValid',
    SET_GPS_VALID = 'form/setGPSValid',
    SET_COVER_VALID = 'form/setCoverValid',
    SET_PROFILE_VALID = 'form/setProfileValid',
    SET_CLAIM_AMOUNT_VALID = 'form/setClaimAmountValid',
    SET_BASE_INTERVAL_VALID = 'form/setBaseIntervalValid',
    SET_MAX_CLAIM_VALID = 'form/setMaxClaimValid',
    SET_INCREMENT_INTERVAL_VALID = 'form/setIncrementIntervalValid',
    SET_INCREMENT_INTERVAL_UNIT_VALID = 'form/setIncrementIntervalUnitValid',
}

interface communityNameAction {
    type: formAction.SET_NAME;
    payload: string;
}

interface communityCoverImageAction {
    type: formAction.SET_COVER_IMAGE;
    payload: string;
}

interface communityProfileImageAction {
    type: formAction.SET_PROFILE_IMAGE;
    payload: string;
}

interface communityDescriptionAction {
    type: formAction.SET_DESCRIPTION;
    payload: string;
}

interface communityCityAction {
    type: formAction.SET_CITY;
    payload: string;
}

interface communityCountryAction {
    type: formAction.SET_COUNTRY;
    payload: string;
}

interface communityGPSAction {
    type: formAction.SET_GPS;
    payload: {
        latitude: number;
        longitude: number;
    };
}

interface communityEmailAction {
    type: formAction.SET_EMAIL;
    payload: string;
}

interface communityCurrencyAction {
    type: formAction.SET_CURRENCY;
    payload: string;
}

interface communityClaimAmountAction {
    type: formAction.SET_CLAIM_AMOUNT;
    payload: string;
}

interface communityBaseIntervalAction {
    type: formAction.SET_BASE_INTERVAL;
    payload: string;
}

interface communityMaxClaimAction {
    type: formAction.SET_MAX_CLAIM;
    payload: string;
}

interface communityIncrementIntervalAction {
    type: formAction.SET_INCREMENT_INTERVAL;
    payload: string;
}

interface communityVisibilityAction {
    type: formAction.SET_VISIBILITY;
    payload: string;
}

interface communityIncrementIntervalUnitAction {
    type: formAction.SET_INCREMENT_INTERVAL_UNIT;
    payload: number;
}

//

interface communityNameValidAction {
    type: formAction.SET_NAME_VALID;
    payload: boolean;
}

interface communityDescriptionValidAction {
    type: formAction.SET_DESCRIPTION_VALID;
    payload: boolean;
}

interface communityDescriptionTooShortValidAction {
    type: formAction.SET_DESCRIPTION_TOO_SHORT_VALID;
    payload: boolean;
}

interface communityCityValidAction {
    type: formAction.SET_CITY_VALID;
    payload: boolean;
}

interface communityCountryValidAction {
    type: formAction.SET_COUNTRY_VALID;
    payload: boolean;
}

interface communityEmailValidAction {
    type: formAction.SET_EMAIL_VALID;
    payload: boolean;
}

interface communityEmailFormatValidAction {
    type: formAction.SET_EMAIL_FORMAT_VALID;
    payload: boolean;
}

interface communityGPSValidAction {
    type: formAction.SET_GPS_VALID;
    payload: boolean;
}

interface communityCoverValidAction {
    type: formAction.SET_COVER_VALID;
    payload: boolean;
}

interface communityProfileValidAction {
    type: formAction.SET_PROFILE_VALID;
    payload: boolean;
}

interface communityClaimAmountValidAction {
    type: formAction.SET_CLAIM_AMOUNT_VALID;
    payload: boolean;
}

interface communityBaseIntervalValidAction {
    type: formAction.SET_BASE_INTERVAL_VALID;
    payload: boolean;
}

interface communityMaxClaimValidAction {
    type: formAction.SET_MAX_CLAIM_VALID;
    payload: boolean;
}

interface communityIncrementIntervalValidAction {
    type: formAction.SET_INCREMENT_INTERVAL_VALID;
    payload: boolean;
}

interface communityIncrementIntervalUnitValidAction {
    type: formAction.SET_INCREMENT_INTERVAL_UNIT_VALID;
    payload: boolean;
}

type FormActionTypes =
    | communityNameAction
    | communityCoverImageAction
    | communityProfileImageAction
    | communityDescriptionAction
    | communityCityAction
    | communityCountryAction
    | communityGPSAction
    | communityEmailAction
    | communityCurrencyAction
    | communityClaimAmountAction
    | communityBaseIntervalAction
    | communityMaxClaimAction
    | communityIncrementIntervalAction
    | communityIncrementIntervalUnitAction
    | communityVisibilityAction
    | communityNameValidAction
    | communityDescriptionValidAction
    | communityDescriptionTooShortValidAction
    | communityCityValidAction
    | communityCountryValidAction
    | communityEmailValidAction
    | communityEmailFormatValidAction
    | communityGPSValidAction
    | communityCoverValidAction
    | communityProfileValidAction
    | communityClaimAmountValidAction
    | communityBaseIntervalValidAction
    | communityMaxClaimValidAction
    | communityIncrementIntervalValidAction
    | communityIncrementIntervalUnitValidAction;

export const formInitialState: INITIAL_FORM_STATE = {
    name: '',
    coverImage: '',
    profileImage: '',
    description: '',
    city: '',
    country: '',
    gps: {
        latitude: 0,
        longitude: 0,
    },
    email: '',
    currency: '',
    claimAmount: '',
    baseInterval: '',
    maxClaim: '',
    incrementInterval: '',
    incrementIntervalUnit: 0,
    visibility: 'public',
    validation: {
        name: true,
        description: true,
        descriptionTooShort: false,
        city: true,
        country: true,
        email: true,
        emailFormat: true,
        gps: true,
        cover: true,
        profile: true,
        claimAmount: true,
        baseInterval: true,
        maxClaim: true,
        incrementInterval: true,
        incrementIntervalUnit: true,
    },
};

export function reducer(
    state: INITIAL_FORM_STATE,
    action: FormActionTypes
): INITIAL_FORM_STATE {
    switch (action.type) {
        case formAction.SET_NAME:
            return { ...state, name: action.payload };
        case formAction.SET_COVER_IMAGE:
            return { ...state, coverImage: action.payload };
        case formAction.SET_PROFILE_IMAGE:
            return { ...state, profileImage: action.payload };
        case formAction.SET_DESCRIPTION:
            return { ...state, description: action.payload };
        case formAction.SET_CITY:
            return { ...state, city: action.payload };
        case formAction.SET_COUNTRY:
            return { ...state, country: action.payload };
        case formAction.SET_GPS:
            return { ...state, gps: action.payload };
        case formAction.SET_EMAIL:
            return { ...state, email: action.payload };
        case formAction.SET_CURRENCY:
            return { ...state, currency: action.payload };
        case formAction.SET_CLAIM_AMOUNT:
            return { ...state, claimAmount: action.payload };
        case formAction.SET_BASE_INTERVAL:
            return { ...state, baseInterval: action.payload };
        case formAction.SET_MAX_CLAIM:
            return { ...state, maxClaim: action.payload };
        case formAction.SET_INCREMENT_INTERVAL:
            return { ...state, incrementInterval: action.payload };
        case formAction.SET_INCREMENT_INTERVAL_UNIT:
            return { ...state, incrementIntervalUnit: action.payload };
        case formAction.SET_VISIBILITY:
            return { ...state, visibility: action.payload };
        case formAction.SET_NAME_VALID:
            return {
                ...state,
                validation: { ...state.validation, name: action.payload },
            };
        case formAction.SET_DESCRIPTION_VALID:
            return {
                ...state,
                validation: {
                    ...state.validation,
                    description: action.payload,
                },
            };
        case formAction.SET_DESCRIPTION_TOO_SHORT_VALID:
            return {
                ...state,
                validation: {
                    ...state.validation,
                    descriptionTooShort: action.payload,
                },
            };
        case formAction.SET_CITY_VALID:
            return {
                ...state,
                validation: {
                    ...state.validation,
                    city: action.payload,
                },
            };
        case formAction.SET_COUNTRY_VALID:
            return {
                ...state,
                validation: {
                    ...state.validation,
                    country: action.payload,
                },
            };
        case formAction.SET_EMAIL_VALID:
            return {
                ...state,
                validation: {
                    ...state.validation,
                    email: action.payload,
                },
            };
        case formAction.SET_EMAIL_FORMAT_VALID:
            return {
                ...state,
                validation: {
                    ...state.validation,
                    emailFormat: action.payload,
                },
            };
        case formAction.SET_GPS_VALID:
            return {
                ...state,
                validation: {
                    ...state.validation,
                    gps: action.payload,
                },
            };
        case formAction.SET_COVER_VALID:
            return {
                ...state,
                validation: {
                    ...state.validation,
                    cover: action.payload,
                },
            };
        case formAction.SET_PROFILE_VALID:
            return {
                ...state,
                validation: {
                    ...state.validation,
                    profile: action.payload,
                },
            };
        case formAction.SET_CLAIM_AMOUNT_VALID:
            return {
                ...state,
                validation: {
                    ...state.validation,
                    claimAmount: action.payload,
                },
            };
        case formAction.SET_BASE_INTERVAL_VALID:
            return {
                ...state,
                validation: {
                    ...state.validation,
                    baseInterval: action.payload,
                },
            };
        case formAction.SET_MAX_CLAIM_VALID:
            return {
                ...state,
                validation: {
                    ...state.validation,
                    maxClaim: action.payload,
                },
            };
        case formAction.SET_INCREMENT_INTERVAL_VALID:
            return {
                ...state,
                validation: {
                    ...state.validation,
                    incrementInterval: action.payload,
                },
            };
        case formAction.SET_INCREMENT_INTERVAL_UNIT_VALID:
            return {
                ...state,
                validation: {
                    ...state.validation,
                    incrementIntervalUnit: action.payload,
                },
            };
        default:
            return state;
    }
}

export const StateContext = React.createContext(formInitialState);
export const DispatchContext = React.createContext<
    React.Dispatch<FormActionTypes> | undefined
>(undefined);

/** method of methods allowed to be called from any component to run input validation */
export const validateField = (
    state: INITIAL_FORM_STATE,
    dispatch: React.Dispatch<FormActionTypes>
) => ({
    name: (updateState: boolean = true) => {
        if (updateState) {
            dispatch({
                type: formAction.SET_NAME_VALID,
                payload: state.name.length > 0,
            });
        }
        return state.name.length > 0;
    },
    description: (updateState: boolean = true) => {
        if (updateState) {
            dispatch({
                type: formAction.SET_DESCRIPTION_VALID,
                payload: state.description.length !== 0,
            });
            dispatch({
                type: formAction.SET_DESCRIPTION_TOO_SHORT_VALID,
                payload: state.description.length < 240,
            });
        }
        return (
            state.description.length !== 0 && state.description.length >= 240
        );
    },
    city: (updateState: boolean = true) => {
        if (updateState) {
            dispatch({
                type: formAction.SET_CITY_VALID,
                payload: state.city.length > 0,
            });
        }
        return state.city.length > 0;
    },
    country: (updateState: boolean = true) => {
        if (updateState) {
            dispatch({
                type: formAction.SET_COUNTRY_VALID,
                payload: state.country.length > 0,
            });
        }
        return state.country.length > 0;
    },
    email: (updateState: boolean = true) => {
        if (updateState) {
            dispatch({
                type: formAction.SET_EMAIL_VALID,
                payload: state.email.length > 0,
            });
            dispatch({
                type: formAction.SET_EMAIL_FORMAT_VALID,
                payload: validateEmail(state.email),
            });
        }
        return state.email.length > 0 && validateEmail(state.email);
    },
    gps: (updateState: boolean = true) => {
        if (updateState) {
            dispatch({
                type: formAction.SET_GPS_VALID,
                payload: state.gps.latitude !== 0 || state.gps.longitude !== 0,
            });
        }
        return state.gps.latitude !== 0 || state.gps.longitude !== 0;
    },
    cover: (updateState: boolean = true) => {
        if (updateState) {
            dispatch({
                type: formAction.SET_COVER_VALID,
                payload: state.coverImage.length > 0,
            });
        }
        return state.coverImage.length > 0;
    },
    profile: (userProfilePicture: string, updateState: boolean = true) => {
        if (updateState) {
            dispatch({
                type: formAction.SET_PROFILE_VALID,
                payload:
                    (userProfilePicture !== null &&
                        userProfilePicture.length > 0) ||
                    state.profileImage.length > 0,
            });
        }
        return (
            (userProfilePicture !== null && userProfilePicture.length > 0) ||
            state.profileImage.length > 0
        );
    },
    // no currency validation. User's currency is used by default
    claimAmount: (updateState: boolean = true) => {
        if (updateState) {
            dispatch({
                type: formAction.SET_CLAIM_AMOUNT_VALID,
                payload:
                    state.claimAmount.length > 0 &&
                    /^\d*[.,]?\d*$/.test(state.claimAmount),
            });
        }
        return (
            state.claimAmount.length > 0 &&
            /^\d*[.,]?\d*$/.test(state.claimAmount)
        );
    },
    maxClaim: (updateState: boolean = true) => {
        if (updateState) {
            dispatch({
                type: formAction.SET_MAX_CLAIM_VALID,
                payload:
                    state.maxClaim.length > 0 &&
                    /^\d*[.,]?\d*$/.test(state.maxClaim),
            });
        }
        return (
            state.maxClaim.length > 0 && /^\d*[.,]?\d*$/.test(state.maxClaim)
        );
    },
    incrementInterval: (updateState: boolean = true) => {
        if (updateState) {
            dispatch({
                type: formAction.SET_INCREMENT_INTERVAL_VALID,
                payload: state.incrementInterval.length > 0,
            });
        }
        return state.incrementInterval.length > 0;
    },
    incrementIntervalUnit: (updateState: boolean = true) => {
        if (updateState) {
            dispatch({
                type: formAction.SET_INCREMENT_INTERVAL_UNIT_VALID,
                payload: state.incrementIntervalUnit !== 0,
            });
        }
        return state.incrementIntervalUnit !== 0;
    },
    baseInterval: (updateState: boolean = true) => {
        if (updateState) {
            dispatch({
                type: formAction.SET_BASE_INTERVAL_VALID,
                payload: state.baseInterval.length > 0,
            });
        }
        return state.baseInterval.length > 0;
    },
    // no visibility validation. public by default
});
