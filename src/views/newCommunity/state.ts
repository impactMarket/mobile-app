import { validateEmail } from 'helpers/index';
import React from 'react';

interface INITIAL_FORM_STATE {
    name: string;
    coverImage: string;
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
    };
}
export enum formAction {
    SET_NAME = 'form/setName',
    SET_COVER_IMAGE = 'form/setCoverImage',
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
}

interface communityNameAction {
    type: formAction.SET_NAME;
    payload: string;
}

interface communityCoverImageAction {
    type: formAction.SET_COVER_IMAGE;
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

type FormActionTypes =
    | communityNameAction
    | communityCoverImageAction
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
    | communityCoverValidAction;

export const formInitialState: INITIAL_FORM_STATE = {
    name: '',
    coverImage: '',
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
    baseInterval: '86400',
    maxClaim: '',
    incrementInterval: '',
    incrementIntervalUnit: 60,
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
    name: () => {
        dispatch({
            type: formAction.SET_NAME_VALID,
            payload: state.name.length > 0,
        });
        return state.name.length > 0;
    },
    description: () => {
        dispatch({
            type: formAction.SET_DESCRIPTION_VALID,
            payload: state.description.length !== 0,
        });
        dispatch({
            type: formAction.SET_DESCRIPTION_TOO_SHORT_VALID,
            payload: state.description.length < 240,
        });
        return (
            state.description.length !== 0 && state.description.length >= 240
        );
    },
    city: () => {
        dispatch({
            type: formAction.SET_CITY_VALID,
            payload: state.city.length > 0,
        });
        return state.city.length > 0;
    },
    country: () => {
        dispatch({
            type: formAction.SET_COUNTRY_VALID,
            payload: state.country.length > 0,
        });
        return state.country.length > 0;
    },
    email: () => {
        dispatch({
            type: formAction.SET_EMAIL_VALID,
            payload: state.email.length > 0,
        });
        dispatch({
            type: formAction.SET_EMAIL_FORMAT_VALID,
            payload: validateEmail(state.email),
        });
        return state.email.length > 0 && validateEmail(state.email);
    },
    gps: () => {
        dispatch({
            type: formAction.SET_GPS_VALID,
            payload: state.gps.latitude !== 0 || state.gps.longitude !== 0,
        });
        return state.gps.latitude !== 0 || state.gps.longitude !== 0;
    },
    cover: () => {
        dispatch({
            type: formAction.SET_COVER_VALID,
            payload: state.coverImage.length > 0,
        });
        return state.coverImage.length > 0;
    },
    // no currency validation. User's currency is used by default
});
