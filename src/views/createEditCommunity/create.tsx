import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import { BigNumber } from 'bignumber.js';
import Modal from 'components/Modal';
import Button from 'components/core/Button';
import SuccessSvg from 'components/svg/SuccessSvg';
import WarningTriangle from 'components/svg/WarningTriangle';
import BackSvg from 'components/svg/header/BackSvg';
import { celoNetwork } from 'helpers/constants';
import { formatInputAmountToTransfer } from 'helpers/currency';
import { updateCommunityInfo } from 'helpers/index';
import {
    setCommunityMetadata,
    setUserIsCommunityManager,
    setUserMetadata,
} from 'helpers/redux/actions/user';
import { CommunityCreationAttributes } from 'helpers/types/endpoints';
import { AppMediaContent, CommunityAttributes } from 'helpers/types/models';
import { IRootState } from 'helpers/types/state';
import SubmitCommunity from 'navigator/header/SubmitCommunity';
import React, { useEffect, useLayoutEffect, useReducer, useState } from 'react';
import {
    ScrollView,
    View,
    Text,
    Image,
    StyleSheet,
    Keyboard,
    Pressable,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Portal } from 'react-native-portalize';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { batch, useDispatch, useSelector } from 'react-redux';
import Api from 'services/api';
import CacheStore from 'services/cacheStore';
import { celoWalletRequest } from 'services/celoWallet';
import { ipctColors, ipctFontSize, ipctLineHeight } from 'styles/index';

import config from '../../../config';
import CommunityContractABI from '../../contracts/CommunityABI.json';
import CommunityBytecode from '../../contracts/CommunityBytecode.json';
import InfoIcon from './InfoIcon';
import Contract from './contract';
import Metadata from './metadata';
import {
    DispatchContext,
    formAction,
    formInitialState,
    reducer,
    StateContext,
    validateField,
} from './state';

function makeCancelable<T>(promise: Promise<T>) {
    let hasCanceled_ = false;

    const wrappedPromise = new Promise<T>((resolve, reject) => {
        promise.then(
            (val) =>
                hasCanceled_ ? reject(Error('isCanceled')) : resolve(val),
            (error) =>
                hasCanceled_ ? reject(Error('isCanceled')) : reject(error)
        );
    });

    return {
        promise: wrappedPromise,
        cancel() {
            hasCanceled_ = true;
        },
    };
}

function CreateCommunityScreen() {
    const navigation = useNavigation();
    const dispatchRedux = useDispatch();
    const [hasPendingForm, setHasPendingForm] = useState(false);
    const [loadingForm, setLoadingForm] = useState(false);
    const [isAlertVisible, setIsAlertVisible] = useState(true);
    const [toggleLeaveFormModal, setToggleLeaveFormModal] = useState(false);
    const [isUploadingContent, setIsUploadingContent] = useState(false);
    const [contractParams, setContractParams] = useState<{
        claimAmount: string;
        maxClaim: string;
        baseInterval: number;
        incrementInterval: number;
    }>({
        claimAmount: '',
        maxClaim: '',
        baseInterval: 0,
        incrementInterval: 0,
    });
    const [privateParams, setPrivateParams] = useState(undefined);
    const [submitting, setSubmitting] = useState(false);
    const [submittingSuccess, setSubmittingSuccess] = useState(false);
    const [submittingCover, setSubmittingCover] = useState(false);
    const [submittingProfile, setSubmittingProfile] = useState(false);
    const [submittingCommunity, setSubmittingCommunity] = useState(false);
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [isAnyFieldMissedModal, setIsAnyFieldMissedModal] = useState(false);
    const [submittedCommunityData, setSubmittedCommunityData] = useState<
        CommunityAttributes | undefined
    >();
    const [invalidInputAmounts, setInvalidInputAmounts] = useState<
        string | undefined
    >(undefined);
    const [coverUploadDetails, setCoverUploadDetails] = useState<
        AppMediaContent | undefined
    >(undefined);
    const [profileUploadDetails, setProfileUploadDetails] = useState<
        AppMediaContent | undefined
    >(undefined);
    const [communityUploadDetails, setCommunityUploadDetails] = useState<
        CommunityAttributes | undefined
    >(undefined);
    const [state, dispatch] = useReducer(reducer, formInitialState);

    const userAddress = useSelector(
        (state: IRootState) => state.user.wallet.address
    );
    const userMetadata = useSelector(
        (state: IRootState) => state.user.metadata
    );
    const kit = useSelector((state: IRootState) => state.app.kit);

    useEffect(() => {
        CacheStore.getCreateCommunityForm().then((r) => {
            if (r !== null) {
                const isValid =
                    r.name.length > 0 ||
                    r.coverUri.length > 0 ||
                    r.description.length > 0 ||
                    r.city.length > 0 ||
                    r.gps.latitude !== 0 ||
                    r.gps.longitude !== 0 ||
                    r.email.length > 0 ||
                    r.contractParams.maxClaim.length > 0 ||
                    r.contractParams.claimAmount.length > 0 ||
                    r.contractParams.baseInterval > 0 ||
                    r.contractParams.incrementInterval > 0 ||
                    r.incrementIntervalUnit > 0;

                if (isValid) {
                    setHasPendingForm(true);
                }
            }
        });
    }, []);

    useEffect(() => {
        const isValid =
            state.name.length > 0 ||
            state.coverImage.length > 0 ||
            state.description.length > 0 ||
            state.city.length > 0 ||
            state.gps.latitude !== 0 ||
            state.gps.longitude !== 0 ||
            state.email.length > 0 ||
            state.maxClaim.length > 0 ||
            state.claimAmount.length > 0 ||
            state.baseInterval.length > 0 ||
            state.incrementInterval.length > 0 ||
            state.incrementIntervalUnit > 0;
        if (loadingForm && isValid) {
            setHasPendingForm(false);
            setLoadingForm(false);
        }
    }, [loadingForm, state]);

    const submitCommunity = async () => {
        const { name, description, currency, city, country, gps, email } =
            state;
        const communityDetails: CommunityCreationAttributes = {
            requestByAddress: userAddress,
            name,
            description,
            language: userMetadata.language,
            currency,
            city,
            country,
            gps: {
                latitude: gps.latitude + config.locationErrorMargin,
                longitude: gps.longitude + config.locationErrorMargin,
            },
            email,
            coverMediaId: coverUploadDetails.id,
            contractParams,
            ...privateParams,
        };
        const { data, error } = await Api.community.create(communityDetails);
        if (error === undefined) {
            setCommunityUploadDetails(data);
        }
        if (submitting) {
            await updateUIAfterSubmission(data, error);
        }
    };

    const uploadImages = () => {
        const profileUpload = async (): Promise<{
            media?: AppMediaContent;
            success: boolean;
        }> => {
            if (state.profileImage.length > 0) {
                if (profileUploadDetails !== undefined) {
                    return {
                        media: profileUploadDetails,
                        success: true,
                    };
                }
                try {
                    const r = await Api.user.preSignedUrl(state.profileImage);
                    const res = await Api.user.uploadPicture(
                        r,
                        state.profileImage
                    );
                    const cachedUser = (await CacheStore.getUser())!;
                    await CacheStore.cacheUser({
                        ...cachedUser,
                        avatar: res.url,
                    });
                    dispatchRedux(
                        setUserMetadata({
                            ...userMetadata,
                            avatar: res.url,
                        })
                    );
                    return { media: r.media, success: true };
                } catch (e) {
                    setSubmitting(false);
                    setSubmittingProfile(false);
                    setSubmittingSuccess(false);
                    return { success: false };
                }
            }
            return { success: true };
        };
        const coverUpload = async (): Promise<{
            media?: AppMediaContent;
            success: boolean;
        }> => {
            if (coverUploadDetails !== undefined) {
                return {
                    media: coverUploadDetails,
                    success: true,
                };
            }
            try {
                const r = await Api.community.preSignedUrl(state.coverImage);
                const success = await Api.community.uploadImage(
                    r,
                    state.coverImage
                );
                return { media: r.media, success };
            } catch {
                setSubmitting(false);
                setSubmittingCover(false);
                setSubmittingSuccess(false);
                return { success: false };
            }
        };
        return Promise.all([coverUpload(), profileUpload()]);
    };

    useEffect(() => {
        let cancelablePromiseImages;
        let cancelablePromiseCommunity;
        if (submitting) {
            // if community cover picture and user profile picture were uploded successfully, move on to upload community
            // ignore user profile picture if the user has already has it
            if (
                coverUploadDetails !== undefined &&
                ((state.profileImage.length > 0 &&
                    profileUploadDetails !== undefined) ||
                    (userMetadata.avatar !== null &&
                        userMetadata.avatar.length > 0))
            ) {
                cancelablePromiseCommunity = makeCancelable(submitCommunity());
            } else if (isUploadingContent) {
                const localPromise = makeCancelable(uploadImages());
                cancelablePromiseImages = localPromise;
                localPromise.promise
                    .then((result) => {
                        if (!result[0].success || !result[1].success) {
                            setSubmittingSuccess(false);
                            setSubmittingCommunity(false);
                            setSubmitting(false);
                        } else if (result[0].success) {
                            setCoverUploadDetails(result[0].media);
                        } else if (state.profileImage.length > 0) {
                            if (result[1].success) {
                                setProfileUploadDetails(result[1].media);
                            }
                        }
                        setSubmittingCover(false);
                        setSubmittingProfile(false);
                    })
                    .catch();
            }
        }
        return () => {
            if (cancelablePromiseCommunity !== undefined) {
                return cancelablePromiseCommunity.cancel();
            }
            if (cancelablePromiseImages !== undefined) {
                return cancelablePromiseImages.cancel();
            }
        };
    }, [
        submitting,
        coverUploadDetails,
        profileUploadDetails,
        isUploadingContent,
    ]);

    const updateUIAfterSubmission = async (
        data: CommunityAttributes,
        error: any
    ) => {
        if (error === undefined) {
            await updateCommunityInfo(data.id, dispatchRedux);
            const community = await Api.community.findById(data.id);
            setSubmittedCommunityData(community);
            setSubmitting(false);
            setSubmittingSuccess(true);
        } else {
            // Sentry.Native.captureException(e);
            setSubmitting(false);
            setSubmittingCommunity(false);
            setSubmittingSuccess(false);
        }
    };

    const deployPrivateCommunity = async () => {
        const decimals = new BigNumber(10).pow(config.cUSDDecimals),
            CommunityContract = new kit.web3.eth.Contract(
                CommunityContractABI as any
            ),
            txObject = await CommunityContract.deploy({
                data: CommunityBytecode.bytecode,
                arguments: [
                    userAddress,
                    new BigNumber(
                        formatInputAmountToTransfer(state.claimAmount)
                    )
                        .multipliedBy(decimals)
                        .toString(),
                    new BigNumber(formatInputAmountToTransfer(state.maxClaim))
                        .multipliedBy(decimals)
                        .toString(),
                    state.baseInterval,
                    (
                        parseInt(state.incrementInterval, 10) *
                        state.incrementIntervalUnit
                    ).toString(),
                    celoNetwork.noAddress,
                    config.cUSDContract,
                    userAddress,
                ],
            }),
            // exception is handled outside
            // receipt as undefined is handled outside
            receipt = await celoWalletRequest(
                userAddress,
                celoNetwork.noAddress,
                txObject,
                'createcommunity',
                kit
            );
        return receipt;
    };

    const submitNewCommunity = async () => {
        const validate = validateField(state, dispatch);
        const _name = validate.name();
        const _cover = validate.cover();
        const _profile = validate.profile(userMetadata.avatar);
        const _description = validate.description();
        const _city = validate.city();
        const _country = validate.country();
        const _email = validate.email();
        const _gps = validate.gps();
        const _claimAmount = validate.claimAmount();
        const _maxClaim = validate.maxClaim();
        const _incrementInterval = validate.incrementInterval();
        const _incrementIntervalUnit = validate.incrementIntervalUnit();
        const _baseInterval = validate.baseInterval();
        const isAllValid =
            _name &&
            _cover &&
            _profile &&
            _description &&
            _city &&
            _country &&
            _email &&
            _gps &&
            _claimAmount &&
            _maxClaim &&
            _incrementInterval &&
            _incrementIntervalUnit &&
            _baseInterval;

        if (!isAllValid) {
            setIsAnyFieldMissedModal(true);
            return;
        }

        if (new BigNumber(state.maxClaim).lte(state.claimAmount)) {
            setInvalidInputAmounts(
                i18n.t('createCommunity.claimBiggerThanMax')
            );
            return;
        }
        if (new BigNumber(state.claimAmount).eq(0)) {
            setInvalidInputAmounts(i18n.t('createCommunity.claimNotZero'));
            return;
        }
        if (new BigNumber(state.maxClaim).eq(0)) {
            setInvalidInputAmounts(i18n.t('createCommunity.maxNotZero'));
            return;
        }

        setSubmitting(true);
        setSubmittingCommunity(true);
        if (coverUploadDetails === undefined) {
            setSubmittingCover(true);
        }
        if (
            state.profileImage.length > 0 &&
            profileUploadDetails === undefined
        ) {
            setSubmittingProfile(true);
        }
        if (!showSubmissionModal) {
            setShowSubmissionModal(true);
        }

        const decimals = new BigNumber(10).pow(config.cUSDDecimals);
        setContractParams({
            claimAmount: new BigNumber(
                formatInputAmountToTransfer(state.claimAmount)
            )
                .multipliedBy(decimals)
                .toString(),
            maxClaim: new BigNumber(formatInputAmountToTransfer(state.maxClaim))
                .multipliedBy(decimals)
                .toString(),
            baseInterval: parseInt(state.baseInterval, 10),
            incrementInterval:
                parseInt(state.incrementInterval, 10) *
                state.incrementIntervalUnit,
        });

        try {
            if (state.visibility === 'private') {
                const txReceipt = await deployPrivateCommunity();
                if (txReceipt === undefined) {
                    throw new Error('invalid tx');
                }
                setPrivateParams({
                    contractAddress: txReceipt.contractAddress,
                    txReceipt,
                });
            }

            setIsUploadingContent(true);
        } catch (e) {
            // Sentry.Native.captureException(e);
        }
    };

    const handlePressGoBack = () => {
        const validate = validateField(state, dispatch);
        const _name = validate.name(false);
        const _cover = validate.cover(false);
        const _profile = validate.profile(userMetadata.avatar, false);
        const _description = validate.description(false);
        const _city = validate.city(false);
        const _country = validate.country(false);
        const _email = validate.email(false);
        const _gps = validate.gps(false);
        const _claimAmount = validate.claimAmount(false);
        const _maxClaim = validate.maxClaim(false);
        const _incrementInterval = validate.incrementInterval(false);
        const _incrementIntervalUnit = validate.incrementIntervalUnit(false);
        const _baseInterval = validate.baseInterval(false);
        const isAnyValid =
            _name ||
            _cover ||
            (userMetadata.avatar !== null &&
                userMetadata.avatar.length === 0 &&
                _profile) ||
            _description ||
            _city ||
            _country ||
            _email ||
            _gps ||
            _claimAmount ||
            _maxClaim ||
            _incrementInterval ||
            _incrementIntervalUnit ||
            _baseInterval;

        if (isAnyValid) {
            Keyboard.dismiss();
            setToggleLeaveFormModal(true);
        } else {
            navigation.goBack();
        }
    };

    const handleRecoverPreviousForm = async () => {
        setLoadingForm(true);
        CacheStore.getCreateCommunityForm().then((previous) => {
            dispatch({
                type: formAction.SET_NAME,
                payload: previous.name,
            });
            dispatch({
                type: formAction.SET_COVER_IMAGE,
                payload: previous.coverUri,
            });
            dispatch({
                type: formAction.SET_DESCRIPTION,
                payload: previous.description,
            });
            dispatch({
                type: formAction.SET_CITY,
                payload: previous.city,
            });
            dispatch({
                type: formAction.SET_COUNTRY,
                payload: previous.country,
            });
            dispatch({
                type: formAction.SET_GPS,
                payload: previous.gps,
            });
            dispatch({
                type: formAction.SET_EMAIL,
                payload: previous.email,
            });
            dispatch({
                type: formAction.SET_CURRENCY,
                payload: previous.currency,
            });
            dispatch({
                type: formAction.SET_MAX_CLAIM,
                payload: previous.contractParams.maxClaim,
            });
            dispatch({
                type: formAction.SET_BASE_INTERVAL,
                payload:
                    previous.contractParams.baseInterval === 0
                        ? ''
                        : previous.contractParams.baseInterval.toString(),
            });
            dispatch({
                type: formAction.SET_CLAIM_AMOUNT,
                payload: previous.contractParams.claimAmount,
            });
            dispatch({
                type: formAction.SET_INCREMENT_INTERVAL,
                payload:
                    previous.contractParams.incrementInterval === 0
                        ? ''
                        : previous.contractParams.incrementInterval.toString(),
            });
            dispatch({
                type: formAction.SET_INCREMENT_INTERVAL_UNIT,
                payload: previous.incrementIntervalUnit,
            });
        });
    };

    const handleClearPreviousForm = () => {
        CacheStore.clearCreateCommunityForm();
        setHasPendingForm(false);
    };

    const handleSaveForm = async () => {
        setToggleLeaveFormModal(false);
        const {
            name,
            description,
            currency,
            city,
            country,
            gps,
            email,
            coverImage,
            incrementIntervalUnit,
            baseInterval,
            claimAmount,
            maxClaim,
            incrementInterval,
        } = state;
        const communityDetails: CommunityCreationAttributes & {
            coverUri: string;
            incrementIntervalUnit: number;
        } = {
            requestByAddress: userAddress,
            name,
            description,
            language: userMetadata.language,
            currency,
            city,
            country,
            gps: {
                latitude: gps.latitude,
                longitude: gps.longitude,
            },
            email,
            coverMediaId: coverUploadDetails ? coverUploadDetails.id : 0,
            contractParams: {
                baseInterval:
                    baseInterval.length === 0 ? 0 : parseInt(baseInterval, 10),
                claimAmount,
                maxClaim,
                incrementInterval:
                    incrementInterval.length === 0
                        ? 0
                        : parseInt(incrementInterval, 10),
            },
            coverUri: coverImage,
            incrementIntervalUnit,
        };
        await CacheStore.cacheCreateCommunityForm(communityDetails);
        navigation.goBack();
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <SubmitCommunity
                    submit={submitNewCommunity}
                    submitting={submitting}
                />
            ),
            headerLeft: () => <BackSvg onPress={handlePressGoBack} />,
        });
        // TODO: this needs refactoring. This methods are used within and outside the effect
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation, submitting, state]);

    const SubmissionActivity = (props: {
        description: string;
        submission: boolean;
        uploadDetails: any;
    }) => (
        <>
            <View style={styles.submissionActivityContainer}>
                <Text style={styles.submissionActivityText}>
                    {props.description}
                </Text>
                {props.submission === true ? (
                    <Image
                        style={{
                            height: 22,
                            width: 22,
                        }}
                        source={require('../../assets/images/waitingTx.gif')}
                    />
                ) : (
                    <Icon
                        name={
                            props.uploadDetails !== undefined
                                ? 'check'
                                : 'close'
                        }
                        color={
                            props.uploadDetails
                                ? ipctColors.greenishTeal
                                : '#EB5757'
                        }
                        size={22}
                    />
                )}
            </View>
        </>
    );

    const SubmissionProgressDetails = () => (
        <View
            style={{
                flexDirection: 'column',
            }}
        >
            <SubmissionActivity
                description={i18n.t('createCommunity.changeCoverImage')}
                submission={submittingCover}
                uploadDetails={coverUploadDetails}
            />
            {state.profileImage.length > 0 &&
                profileUploadDetails === undefined && (
                    <SubmissionActivity
                        description={i18n.t(
                            'createCommunity.changeProfileImage'
                        )}
                        submission={submittingProfile}
                        uploadDetails={profileUploadDetails}
                    />
                )}
            <SubmissionActivity
                description={i18n.t('createCommunity.communityDetails')}
                submission={submittingCommunity}
                uploadDetails={undefined} // doesn't matter, once it's approved, jumps to another modal
            />
        </View>
    );

    const SubmissionFailed = () => (
        <>
            <View
                testID="community-request-failed"
                style={styles.failedModalContainer}
            >
                <WarningTriangle style={styles.errorModalWarningSvg} />
                <Text style={styles.failedModalMessageText}>
                    {i18n.t('createCommunity.communityRequestError')}
                </Text>
            </View>
            <SubmissionProgressDetails />
            <Button
                modeType="gray"
                style={{ width: '100%' }}
                onPress={submitNewCommunity}
            >
                {i18n.t('generic.tryAgain')}
            </Button>
        </>
    );

    const SubmissionSucess = () => (
        <>
            <View style={styles.successModalContainer}>
                <SuccessSvg />
                <Text
                    style={[
                        styles.submissionModalMessageText,
                        {
                            textAlign: 'center',
                        },
                    ]}
                >
                    {i18n.t('createCommunity.communityRequestSuccess')}
                </Text>
                <Button
                    modeType="gray"
                    style={{ width: '100%' }}
                    onPress={() => {
                        navigation.goBack();
                        if (submittedCommunityData !== undefined) {
                            batch(() => {
                                dispatchRedux(
                                    setCommunityMetadata(submittedCommunityData)
                                );
                                dispatchRedux(setUserIsCommunityManager(true));
                            });
                        }
                    }}
                >
                    {i18n.t('generic.continue')}
                </Button>
            </View>
        </>
    );

    const SubmissionInProgress = () => (
        <>
            <Text style={styles.submissionModalMessageText}>
                {i18n.t('createCommunity.communityRequestSending')}
            </Text>
            <SubmissionProgressDetails />
            <Button
                modeType="gray"
                onPress={() => {
                    setSubmitting(false);
                    setShowSubmissionModal(false);
                    if (communityUploadDetails !== undefined) {
                        // TODO: [IPCT1-460] request API delete community
                        // TODO: [IPCT1-460] request API delete profile picture
                    }
                }}
            >
                {i18n.t('generic.cancel')}
            </Button>
        </>
    );

    const CommunityCreationProcessDisclaimer = () => {
        if (!isAlertVisible) {
            return null;
        }
        return (
            <View style={styles.createCommunityAlert}>
                <InfoIcon style={{ marginLeft: 26 }} />

                <Text
                    style={[
                        styles.createCommunityAlertDescription,
                        { flexWrap: 'wrap', marginHorizontal: 42 },
                    ]}
                >
                    {i18n.t('createCommunity.alert')}
                </Text>
                <Pressable
                    hitSlop={15}
                    onPress={() => setIsAlertVisible(!isAlertVisible)}
                >
                    <Icon
                        name="close"
                        size={18}
                        color={ipctColors.almostBlack}
                        style={{ marginRight: 26 }}
                    />
                </Pressable>
            </View>
        );
    };

    return (
        <>
            <KeyboardAwareScrollView extraScrollHeight={35}>
                <ScrollView style={{ paddingHorizontal: 20 }}>
                    <DispatchContext.Provider value={dispatch}>
                        <StateContext.Provider value={state}>
                            <CommunityCreationProcessDisclaimer />
                            <Metadata />
                            <Contract />
                        </StateContext.Provider>
                    </DispatchContext.Provider>
                </ScrollView>
            </KeyboardAwareScrollView>
            <Portal>
                <Modal
                    visible={
                        isAnyFieldMissedModal ||
                        invalidInputAmounts !== undefined
                    }
                    title={i18n.t('errors.modals.title')}
                    onDismiss={() => {
                        setSubmitting(false);
                        setIsAnyFieldMissedModal(false);
                        setInvalidInputAmounts(undefined);
                    }}
                    buttons={
                        <Button
                            modeType="gray"
                            onPress={() => {
                                setSubmitting(false);
                                setIsAnyFieldMissedModal(false);
                                setInvalidInputAmounts(undefined);
                            }}
                        >
                            {i18n.t('generic.close')}
                        </Button>
                    }
                >
                    <View style={styles.errorModalContainer}>
                        <WarningTriangle style={styles.errorModalWarningSvg} />
                        <Text style={styles.errorModalText}>
                            {invalidInputAmounts
                                ? invalidInputAmounts
                                : i18n.t('createCommunity.missingFieldError')}
                        </Text>
                    </View>
                </Modal>
                <Modal
                    visible={showSubmissionModal}
                    title={i18n.t('generic.submitting')}
                    onDismiss={
                        !submitting && !submittingSuccess
                            ? () => {
                                  setShowSubmissionModal(false);
                              }
                            : undefined
                    }
                >
                    <View style={styles.modalSubmissionContainer}>
                        {submitting ? (
                            <SubmissionInProgress />
                        ) : submittingSuccess ? (
                            <SubmissionSucess />
                        ) : (
                            <SubmissionFailed />
                        )}
                    </View>
                </Modal>
                <Modal
                    visible={toggleLeaveFormModal}
                    title={i18n.t('createCommunity.leave.title')}
                >
                    <Text style={styles.submissionModalMessageText}>
                        {i18n.t('createCommunity.leave.message')}
                    </Text>
                    <View style={styles.modalBoxTwoButtons}>
                        <Button
                            modeType="gray"
                            style={{ width: '45%' }}
                            onPress={() => {
                                setToggleLeaveFormModal(false);
                            }}
                        >
                            {i18n.t('generic.cancel')}
                        </Button>
                        <Button
                            modeType="default"
                            style={{ width: '45%' }}
                            onPress={handleSaveForm}
                        >
                            {i18n.t('generic.ok')}
                        </Button>
                    </View>
                </Modal>
                <Modal
                    visible={hasPendingForm}
                    title={i18n.t('createCommunity.recoverForm.title')}
                >
                    <Text style={styles.submissionModalMessageText}>
                        {i18n.t('createCommunity.recoverForm.message')}
                    </Text>
                    <View style={styles.modalBoxTwoButtons}>
                        <Button
                            modeType="gray"
                            style={{ width: '45%' }}
                            onPress={handleClearPreviousForm}
                            disabled={loadingForm}
                        >
                            {i18n.t('generic.no')}
                        </Button>
                        <Button
                            modeType="default"
                            style={{ width: '45%' }}
                            onPress={handleRecoverPreviousForm}
                            loading={loadingForm}
                            disabled={loadingForm}
                        >
                            {i18n.t('generic.yes')}
                        </Button>
                    </View>
                </Modal>
            </Portal>
        </>
    );
}

CreateCommunityScreen.navigationOptions = () => {
    return {
        headerTitle: i18n.t('createCommunity.applyCommunity'),
        headerTitleStyle: {
            fontFamily: 'Manrope-Bold',
            fontSize: ipctFontSize.lowMedium,
            lineHeight: ipctLineHeight.large,
            color: ipctColors.darBlue,
        },
        headerTitleContainerStyle: {
            left: 58,
        },
    };
};

const styles = StyleSheet.create({
    createCommunityAlertDescription: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 20,
    },
    createCommunityAlert: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        borderColor: ipctColors.blueRibbon,
        borderRadius: 8,
        borderWidth: 2,
        borderStyle: 'solid',
        paddingVertical: 12,
        marginBottom: 16,
    },
    submissionActivityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 16,
    },
    submissionActivityText: {
        fontSize: 15,
        lineHeight: 24,
        fontFamily: 'Inter-Regular',
    },
    failedModalMessageText: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 24,
        color: ipctColors.almostBlack,
        textAlign: 'left',
        marginRight: 36,
    },
    failedModalContainer: {
        marginVertical: 16,
        paddingVertical: 16,
        paddingHorizontal: 22,
        borderStyle: 'solid',
        borderColor: '#EB5757',
        borderWidth: 2,
        borderRadius: 8,
        width: '100%',
        flexDirection: 'row',
    },
    successModalContainer: {
        paddingVertical: 14,
        display: 'flex',
        width: '88%',
        alignItems: 'center',
        alignSelf: 'center',
    },
    modalBoxTwoButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    submissionModalMessageText: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 24,
        color: ipctColors.almostBlack,
        marginBottom: 12,
    },
    errorModalContainer: {
        paddingVertical: 16,
        paddingHorizontal: 22,
        borderStyle: 'solid',
        borderColor: '#EB5757',
        borderWidth: 2,
        borderRadius: 8,
        flexDirection: 'row',
        marginBottom: 16,
    },
    errorModalWarningSvg: {
        alignSelf: 'flex-start',
        marginRight: 16,
        marginTop: 8,
    },
    errorModalText: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 24,
        color: ipctColors.almostBlack,
        marginRight: 12,
    },
    modalSubmissionContainer: {
        paddingBottom: 6,
        display: 'flex',
    },
});

export default CreateCommunityScreen;
