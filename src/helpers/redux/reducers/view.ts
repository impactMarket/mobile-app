import { SET_VIEW_MANAGER_DETAILS } from 'helpers/constants';
import { ViewActionTypes } from 'helpers/types/redux';
import { IViewState } from 'helpers/types/state';

const INITIAL_STATE_VIEW: IViewState = {
    managerDetails: undefined,
};

export const viewReducer = (
    state = INITIAL_STATE_VIEW,
    action: ViewActionTypes
) => {
    switch (action.type) {
        case SET_VIEW_MANAGER_DETAILS:
            return { ...state, managerDetails: action.payload };
        default:
            return state;
    }
};
