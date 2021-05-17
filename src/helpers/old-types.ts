// TODO: same as IUser. Rmove one.
export interface IUserInfo {
    name: string;
    currency: string;
    exchangeRate: number;
    avatar: string;
    language: string;
}

export interface IUserCommunityInfo {
    isBeneficiary: boolean;
    isManager: boolean;
}

export interface ITransaction {
    tx: string;
    from: string;
    contractAddress: string;
    event: string;
    values: any;
}

export interface ITabBarIconProps {
    focused: boolean;
    color: string;
    size: number;
}

// **API and app**

export interface IAddressAndName {
    address: string;
    name: string;
}

/**
 * @deprecated
 */
export interface IUserTxAPI {
    picture: string;
    counterParty: IAddressAndName;
    value: string;
    timestamp: number;
    fromUser: boolean;
}

/**
 * @deprecated
 */
export interface IRecentTxAPI {
    picture: string;
    from: IAddressAndName;
    value: string;
    timestamp: number;
}

/**
 * @deprecated
 */
export interface IPaymentsTxAPI {
    picture: string;
    to: IAddressAndName;
    value: string;
    timestamp: number;
}
