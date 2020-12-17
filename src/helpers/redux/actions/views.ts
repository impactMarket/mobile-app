import { SET_VIEW_MANAGER_DETAILS } from "helpers/constants";
import { IManagersDetails } from "helpers/types/endpoints";
import { ViewActionTypes } from "helpers/types/redux";


export function setStateManagersDetails(managersDetails: IManagersDetails): ViewActionTypes {
    return {
        type: SET_VIEW_MANAGER_DETAILS,
        payload: managersDetails,
    };
}
