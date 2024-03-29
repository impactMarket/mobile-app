import { ContractKit } from '@celo/contractkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import countriesJSON from 'assets/countries.json';
import i18n from 'assets/i18n';
import languagesJSON from 'assets/languages.json';
import axios, { AxiosResponse } from 'axios';
import BigNumber from 'bignumber.js';
import * as Linking from 'expo-linking';
import { IUserBaseAuth } from 'helpers/types/endpoints';
import parsePhoneNumber from 'libphonenumber-js';
import moment from 'moment';
import { PixelRatio } from 'react-native';
import { batch } from 'react-redux';
import { Dispatch } from 'redux';
import Api from 'services/api';

import config from '../../config';
import CommunityContractABI from '../contracts/CommunityABI.json';
import { SetAppFromWelcomeScreen } from './redux/actions/app';
import {
    setCommunityContract,
    setCommunityMetadata,
    setUserExchangeRate,
    setUserBeneficiary,
    setUserManager,
    setUserMetadata,
    setUserWallet,
    setUserIsBlocked,
    setUserIsSuspect,
    resetUserApp,
} from './redux/actions/user';
import {
    AppMediaContent,
    CommunityAttributes,
    UserAttributes,
} from './types/models';

const countries: {
    [key: string]: {
        name: string;
        native: string;
        currency: string;
        languages: string[];
        emoji: string;
    };
} = countriesJSON;

const languages: {
    [key: string]: {
        name: string;
        nativeName: string;
    };
} = languagesJSON;

/**
 * Generate URL based on user language.
 * @param path URL path. Should start with /
 * @param language User language
 * @returns Full URL
 */
export function docsURL(
    path: string,
    language?: string /** supportedLanguagesType */
) {
    let version = '';
    switch (language) {
        case 'pt':
            version = '/v/brazil';
            break;
        case 'es':
            version = '/v/espanol';
            break;
        case 'fr':
            version = '/v/francais';
            break;
    }
    return `https://docs.impactmarket.com${version}${path}`;
}

/**
 * @deprecated -> use utils lib
 */
export async function translate(
    text: string,
    target: string
): Promise<{ detectedSourceLanguage?: string; translatedText: string }> {
    try {
        const q = encodeURIComponent(text);
        const query = `https://translation.googleapis.com/language/translate/v2?key=${config.googleApiKey}&format=text&target=${target}&q=${q}`;
        const response = await axios.get<
            never,
            AxiosResponse<{
                data: {
                    translations: [
                        {
                            translatedText: string;
                            detectedSourceLanguage: string;
                        }
                    ];
                };
            }>
        >(query);
        const result = response.data?.data?.translations;
        return result &&
            result.length > 0 &&
            result[0].translatedText.length > 0
            ? {
                  translatedText: result[0].translatedText,
                  detectedSourceLanguage:
                      languages[result[0].detectedSourceLanguage.toLowerCase()]
                          .name,
              }
            : { translatedText: text };
    } catch (_) {
        return { translatedText: text };
    }
}

export async function logout(dispatch: Dispatch<any>) {
    await AsyncStorage.clear();
    batch(() => {
        dispatch(setUserBeneficiary(null));
        dispatch(setUserManager(null));
        dispatch(resetUserApp());
    });
}

export function makeDeeplinkUrl() {
    return Linking.makeUrl('/');
}

/**
 * @deprecated Migrated to external lib
 */
export function chooseMediaThumbnail(
    media: AppMediaContent,
    size: { heigth: number; width: number }
) {
    if (media && media.thumbnails && media.thumbnails.length > 0) {
        const thumbnails = media.thumbnails.filter(
            (t) => t.height === size.heigth && t.width === size.width
        );
        if (thumbnails.length > 0) {
            const thumbnail = thumbnails.find(
                (t) => t.pixelRatio === PixelRatio.get()
            );
            if (thumbnail) {
                return thumbnail.url;
            }
            return thumbnails[0].url;
        }
    }
    return media.url;
}

export async function isOutOfTime() {
    let tries = 3;
    let totalDiff = 0;
    while (--tries >= 0) {
        const preTime = new Date();
        const serverTime = await Api.system.getServerTime();
        const postTime = new Date();
        const requestDiff = moment(preTime).diff(postTime);
        totalDiff +=
            new Date(postTime.getTime() - requestDiff / 2).getTime() -
            serverTime;
    }
    const timeDiff = totalDiff / 3;
    return (
        timeDiff < -config.outOfTimeThreshold ||
        timeDiff > config.outOfTimeThreshold
    );
}

export async function welcomeUser(
    address: string,
    phoneNumber: string,
    user: IUserBaseAuth,
    rates: { [key: string]: number },
    kit: ContractKit,
    dispatch: Dispatch<any>,
    userMetadata: UserAttributes
) {
    const balance = await getUserBalance(kit, address);
    const { language } = userMetadata;
    if (i18n.language !== language) {
        i18n.changeLanguage(language);
        moment.locale(language);
    }
    let community: CommunityAttributes | undefined;
    if (user.beneficiary !== null || user.manager !== null) {
        community = await Api.community.findById(user.communityId!);
    }
    batch(() => {
        dispatch(
            setUserWallet({
                address,
                phoneNumber,
                balance: balance.toString(),
            })
        );
        if (
            (user as any).user !== undefined && // TODO: avoid this
            (user as any).user.avatar !== null // TODO: avoid this
        ) {
            dispatch(
                setUserMetadata({
                    ...userMetadata,
                    avatar: (user as any).user.avatar
                        ? (user as any).user.avatar.url
                        : userMetadata.avatar
                        ? userMetadata.avatar
                        : null, // TODO: avoid this
                })
            );
        } else {
            dispatch(setUserMetadata(userMetadata));
        }
        // const allExchangeRates: { [key: string]: number } = {};
        // Object.assign(
        //     allExchangeRates,
        //     ...user.rates.map((y) => ({ [y.currency]: y.rate }))
        // );
        dispatch(
            setUserExchangeRate(rates[userMetadata.currency.toUpperCase()])
        );
        // dispatch(setAppExchangeRatesAction(allExchangeRates));
        if (community) {
            // const c = await Api.community.findById(user.communityId!);
            const communityContract = new kit.web3.eth.Contract(
                CommunityContractABI as any,
                community.contractAddress!
            );
            dispatch(setCommunityMetadata(community));
            dispatch(setCommunityContract(communityContract));
            dispatch(setUserBeneficiary(user.beneficiary));
            dispatch(setUserManager(user.manager));
            // Setting suspicious activity
            dispatch(setUserIsBlocked(user.blocked));
            dispatch(setUserIsSuspect(user.suspect));
            dispatch(SetAppFromWelcomeScreen(''));
        }
    });
}

export async function getUserBalance(kit: ContractKit, address: string) {
    const stableToken = await kit.contracts.getStableToken();
    const cUSDBalanceBig = await stableToken.balanceOf(address);
    return new BigNumber(cUSDBalanceBig.toString());
}

/**
 * @deprecated Migrated to external lib. Use `frequencyToText`
 */
export function claimFrequencyToText(frequency: number): string {
    if (frequency === 86400) return i18n.t('createCommunity.daily');
    if (frequency === 604800) return i18n.t('createCommunity.weekly');
    return 'errors.unknown';
}

export function calculateCommunityProgress(
    toCalculte: string /*'raised' | 'claimed'*/,
    community: CommunityAttributes
): number {
    if (community.contract === undefined || community.state === undefined) {
        return 0;
    }
    let m = new BigNumber(community.contract.maxClaim).multipliedBy(
        community.state.beneficiaries
    );
    if (community.contract.maxClaim.length > 15) {
        m = new BigNumber(community.contract.maxClaim)
            .div(10 ** 18)
            .multipliedBy(community.state.beneficiaries);
    }
    const { contributed, claimed } = community.state;
    if (claimed.length > 15) {
        m = new BigNumber(claimed).div(10 ** 18);
    }
    const result = new BigNumber(
        toCalculte === 'raised' ? contributed : claimed
    ).div(m.eq(0) ? 1 : m);
    return parseFloat(result.decimalPlaces(5, 1).toString());
}

export function getCountryFromPhoneNumber(pnumber: string) {
    const phoneNumber = parsePhoneNumber(pnumber);
    if (phoneNumber && phoneNumber.country) {
        const { emoji, name } = countries[phoneNumber.country];
        return `${emoji} ${name}`;
    }
    return 'Unknown';
}

export function getCurrencyFromPhoneNumber(pnumber: string) {
    const phoneNumber = parsePhoneNumber(pnumber);
    if (phoneNumber && phoneNumber.country) {
        return countries[phoneNumber.country].currency;
    } else {
        return 'USD';
    }
}

export async function updateCommunityInfo(
    communityId: number,
    dispatch: Dispatch<any>
) {
    const community = await Api.community.findById(communityId);
    if (community !== undefined) {
        dispatch(setCommunityMetadata(community));
    }
}

export function validateEmail(email: string) {
    const emailRegex =
        /^[-!#$%&'*+\\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    if (!email) return false;

    if (email.length === 0) return false;

    if (email.length > 254) return false;

    const valid = emailRegex.test(email);
    if (!valid) return false;

    // Further checking of some things regex can't handle
    const parts = email.split('@');
    if (parts[0].length > 64) return false;

    const domainParts = parts[1].split('.');
    if (
        domainParts.some(function (part) {
            return part.length > 63;
        })
    )
        return false;

    return true;
}
