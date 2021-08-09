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
}
export enum formAction {
    SET_NAME = 'form/setName',
    SET_COVER_IMAGE = 'form/setCoverImage',
    SET_DESCRIPTION = 'form/setDescription',
    SET_CITY = 'form/setCity',
    SET_COUNTRY = 'form/setCountry',
    SET_GPS = 'form/setGPS',
    SET_EMAIL = 'form/setEmail',
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

type FormActionTypes =
    | communityNameAction
    | communityCoverImageAction
    | communityDescriptionAction
    | communityCityAction
    | communityCountryAction
    | communityGPSAction
    | communityEmailAction;

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
        default:
            return state;
    }
}

export const StateContext = React.createContext(formInitialState);
export const DispatchContext = React.createContext<
    React.Dispatch<FormActionTypes> | undefined
>(undefined);
