import { modalDonateAction } from 'helpers/constants';
import { ModalActionTypes } from 'helpers/types/redux';
import { IModalDonateState } from 'helpers/types/state';

const INITIAL_STATE_MODAL_DONATE: IModalDonateState = {
    donationValues: {
        inputAmount: '',
        amountInDollars: 0,
        backNBeneficiaries: 0,
        backForDays: 0,
    },
    // community: undefined,
    inProgress: false,
    modalDonateOpen: false,
    modalConfirmOpen: false,
    modalErrorOpen: false,
    submitting: false,
};

export const modalDonateReducer = (
    state = INITIAL_STATE_MODAL_DONATE,
    action: ModalActionTypes
) => {
    switch (action.type) {
        case modalDonateAction.OPEN:
            return {
                ...state,
                donationValues: {
                    inputAmount: '',
                    amountInDollars: 0,
                    backNBeneficiaries: 0,
                    backForDays: 0,
                },
                community: action.payload,
                modalDonateOpen: true,
            };
        case modalDonateAction.CLOSE:
            return {
                ...state,
                modalDonateOpen: false,
                modalConfirmOpen: false,
                modalErrorOpen: false,
            };
        case modalDonateAction.GO_TO_CONFIRM_DONATE:
            return {
                ...state,
                donationValues: action.payload,
                modalDonateOpen: false,
                modalConfirmOpen: true,
            };
        case modalDonateAction.GO_TO_ERROR_DONATE:
            return {
                ...state,
                modalDonateOpen: false,
                modalErrorOpen: true,
            };
        case modalDonateAction.GO_BACK_TO_DONATE:
            return {
                ...state,
                modalDonateOpen: true,
                modalConfirmOpen: false,
                modalErrorOpen: false,
            };
        case modalDonateAction.IN_PROGRESS:
            return {
                ...state,
                inProgress: action.payload,
            };
        default:
            return state;
    }
};
