interface INITIAL_FORM_STATE {
    coverImage: string;
    name: string;
}
export enum formAction {
    SET_NAME = 'form/setName',
    SET_COVER_IMAGE = 'form/setCoverImage',
}

interface communityNameAction {
    type: formAction.SET_NAME;
    payload: string;
}

interface communityCoverImageAction {
    type: formAction.SET_COVER_IMAGE;
    payload: string;
}

type FormActionTypes = communityNameAction | communityCoverImageAction;

export const formInitialState: INITIAL_FORM_STATE = {
    coverImage: '',
    name: '',
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
        default:
            return state;
    }
}
