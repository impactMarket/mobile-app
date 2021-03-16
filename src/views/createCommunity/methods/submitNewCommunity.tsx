import { Alert } from 'react-native';
import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import { formatInputAmountToTransfer } from 'helpers/currency';

import Api from 'services/api';
import { ISubmitNewCommunity } from 'helpers/types/state';
import config from '../../../../config';
import { validateEmail, updateCommunityInfo } from 'helpers/index';
import { setUserIsCommunityManager } from 'helpers/redux/actions/user';
import { CommunityCreationAttributes } from 'helpers/types/endpoints';
import { deployPrivateCommunity } from 'helpers/methods/deployPrivateCommunity';

export const submitNewCommunity = async ({
    dispatch,
    setIsCoverImageValid,
    setIsNameValid,
    setIsDescriptionValid,
    setIsCityValid,
    setIsCountryValid,
    setIsEmailValid,
    setIsEnabledGPS,
    setIsClaimAmountValid,
    setIsIncrementalIntervalValid,
    setIsMaxClaimValid,
    setSending,
    userLanguage,
    currency,
    comunityDetails,
}: ISubmitNewCommunity) => {
    const {
        userAddress,
        baseInterval,
        visibility,
        coverImage,
        name,
        description,
        city,
        country,
        email,
        gpsLocation,
        claimAmount,
        incrementInterval,
        maxClaim,
    } = comunityDetails;

    console.log({comunityDetails})


    const _isCoverImageValid = coverImage.length > 0;
    if (!_isCoverImageValid) {
        setIsCoverImageValid(false);
    }
    const _isNameValid = name.length > 0;
    if (!_isNameValid) {
        setIsNameValid(false);
    }
    const _isDescriptionValid = description.length > 0;
    if (!_isDescriptionValid) {
        setIsDescriptionValid(false);
    }
    const _isCityValid = city.length > 0;
    if (!_isCityValid) {
        setIsCityValid(false);
    }
    const _isCountryValid = country.length > 0;
    if (!_isCountryValid) {
        setIsCountryValid(false);
    }
    const _isEmailValid = validateEmail(email);
    if (!_isEmailValid) {
        setIsEmailValid(false);
    }
    const _isEnabledGPS = gpsLocation !== undefined;
    if (!_isEnabledGPS) {
        setIsEnabledGPS(false);
    }
    const _isClaimAmountValid =
        claimAmount.length > 0 && /^\d*[\.\,]?\d*$/.test(claimAmount);
    if (!_isClaimAmountValid) {
        setIsClaimAmountValid(false);
    }
    const _isIncrementalIntervalValid = incrementInterval.length > 0;
    if (!_isIncrementalIntervalValid) {
        setIsIncrementalIntervalValid(false);
    }
    const _isMaxClaimValid =
        maxClaim.length > 0 && /^\d*[\.\,]?\d*$/.test(maxClaim);
    if (!_isMaxClaimValid) {
        setIsMaxClaimValid(false);
    }

    const isSubmitAvailable =
        _isNameValid &&
        _isDescriptionValid &&
        _isCityValid &&
        _isCountryValid &&
        _isEmailValid &&
        _isClaimAmountValid &&
        _isIncrementalIntervalValid &&
        _isMaxClaimValid &&
        _isCoverImageValid;

        console.log({isSubmitAvailable})

    if (!isSubmitAvailable) {
        return;
    }
    if (new BigNumber(maxClaim).lte(claimAmount)) {
        Alert.alert(
            i18n.t('failure'),
            i18n.t('claimBiggerThanMax'),
            [{ text: 'OK' }],
            { cancelable: false }
        );
        return;
    }
    if (new BigNumber(claimAmount).eq(0)) {
        Alert.alert(
            i18n.t('failure'),
            i18n.t('claimNotZero'),
            [{ text: 'OK' }],
            { cancelable: false }
        );
        return;
    }
    if (new BigNumber(maxClaim).eq(0)) {
        Alert.alert(i18n.t('failure'), i18n.t('maxNotZero'), [{ text: 'OK' }], {
            cancelable: false,
        });
        return;
    }

    //
    setSending(true);
    const decimals = new BigNumber(10).pow(config.cUSDDecimals);
    let txReceipt = null;
    let communityAddress = null;

    try {
        const contractParams = {
            claimAmount: new BigNumber(formatInputAmountToTransfer(claimAmount))
                .multipliedBy(decimals)
                .toString(),
            maxClaim: new BigNumber(formatInputAmountToTransfer(maxClaim))
                .multipliedBy(decimals)
                .toString(),
            baseInterval: parseInt(baseInterval),
            incrementInterval: parseInt(incrementInterval, 10) * 60,
        };
        console.log({contractParams})
        let privateParamsIfAvailable = {};
        let privateCommunity = {
            userAddress,
            claimAmount,
            maxClaim,
            baseInterval,
            incrementInterval,
        };
        console.log({visibility})

        if (visibility === 'private' && privateCommunity) {
            txReceipt = await deployPrivateCommunity(privateCommunity);
            if (txReceipt === undefined) {
                return;
            }
            communityAddress = txReceipt.contractAddress;
            privateParamsIfAvailable = {
                contractAddress: communityAddress,
                txReceipt,
            };
        }
        const communityDetails: CommunityCreationAttributes = {
            requestByAddress: userAddress,
            name,
            description,
            language: userLanguage,
            currency,
            city,
            country,
            gps: {
                latitude:
                    gpsLocation!.coords.latitude + config.locationErrorMargin,
                longitude:
                    gpsLocation!.coords.longitude + config.locationErrorMargin,
            },
            email,
            // coverImage: uploadImagePath,
            contractParams,
            ...privateParamsIfAvailable,
        };

        console.log({communityDetails})

        const apiRequestResult = await Api.community.create(communityDetails);

        console.log({apiRequestResult})


        if (apiRequestResult) {
            await Api.upload.uploadCommunityCoverImage(
                apiRequestResult.publicId,
                coverImage
            );
            await updateCommunityInfo(apiRequestResult.publicId, dispatch);
            dispatch(setUserIsCommunityManager(true));
        } else {
            Alert.alert(
                i18n.t('failure'),
                i18n.t('errorCreatingCommunity'),
                [{ text: 'OK' }],
                { cancelable: false }
            );
            setSending(false);
        }
    } catch (e) {
        Alert.alert(
            i18n.t('failure'),
            i18n.t('errorCreatingCommunity'),
            [{ text: 'OK' }],
            { cancelable: false }
        );
        setSending(false);
        Api.system.uploadError(userAddress, 'create_community', e);
    }
};
