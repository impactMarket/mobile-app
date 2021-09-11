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
    KeyboardAvoidingView,
    Platform,
    View,
    Text,
    Image,
    StyleSheet,
    Keyboard,
    Pressable,
} from 'react-native';
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
    formInitialState,
    reducer,
    StateContext,
    validateField,
} from './state';

const makeCancelable = (promise: Promise<any>) => {
    let hasCanceled_ = false;

    const wrappedPromise = new Promise((resolve, reject) => {
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
};

function CreateCommunityScreen() {
    const navigation = useNavigation();
    const dispatchRedux = useDispatch();
    const [isAlertVisible, setIsAlertVisible] = useState(true);
    const [toggleLeaveFormModal, setToggleLeaveFormModal] = useState(false);
    const [isUploadingContent, setIsUploadingContent] = useState(false);
    const [contractParams, setContractParams] = useState({});
    const [privateParams, setPrivateParams] = useState(undefined);
    const [submitting, setSubmitting] = useState(false);
    const [canceled, setCanceled] = useState(false);
    const [requestCancel, setRequestCancel] = useState(false);
    const [submittingSuccess, setSubmittingSuccess] = useState(false);
    const [submittingCover, setSubmittingCover] = useState(false);
    const [submittingProfile, setSubmittingProfile] = useState(false);
    const [submittingCommunity, setSubmittingCommunity] = useState(false);
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [isAnyFieldMissedModal, setIsAnyFieldMissedModal] = useState(false);
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const submitCommunity = async () => {
        const {
            name,
            description,
            currency,
            city,
            country,
            gps,
            email,
        } = state;
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
        if (!requestCancel) {
            await updateUIAfterSubmission(data, error);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const uploadImages = () => {
        const profileUpload = async () => {
            if (state.profileImage.length > 0) {
                if (profileUploadDetails !== undefined) {
                    return {
                        uploadURL: '',
                        media: profileUploadDetails,
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
                    return r;
                } catch (e) {
                    setSubmitting(false);
                    setSubmittingProfile(false);
                    setSubmittingSuccess(false);
                    return undefined;
                }
            }
        };
        const coverUpload = async () => {
            if (coverUploadDetails !== undefined) {
                return {
                    uploadURL: '',
                    media: coverUploadDetails,
                };
            }
            try {
                const r = await Api.community.preSignedUrl(state.coverImage);
                await Api.community.uploadImage(r, state.coverImage);
                return r;
            } catch {
                setSubmitting(false);
                setSubmittingCover(false);
                setSubmittingSuccess(false);
                return undefined;
            }
        };
        return Promise.all([coverUpload(), profileUpload()]);
    };

    useEffect(() => {
        let cancelablePromiseImages: {
            promise: Promise<unknown>;
            cancel(): void;
        };
        let cancelablePromiseCommunity: {
            promise: Promise<unknown>;
            cancel(): void;
        };
        if (!canceled) {
            // if community cover picture and user profile picture were uploded successfully, move on to upload community
            // ignore user profile picture if the user has already has it
            if (
                coverUploadDetails !== undefined &&
                ((state.profileImage.length > 0 &&
                    profileUploadDetails !== undefined) ||
                    userMetadata.avatar.length > 0)
            ) {
                cancelablePromiseCommunity = makeCancelable(submitCommunity());
            } else if (isUploadingContent) {
                cancelablePromiseImages = makeCancelable(uploadImages());
                cancelablePromiseImages.promise
                    .then((details) => {
                        setCoverUploadDetails(details[0].media);
                        if (state.profileImage.length > 0) {
                            setProfileUploadDetails(details[1].media);
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
        canceled,
        coverUploadDetails,
        profileUploadDetails,
        isUploadingContent,
        state.profileImage,
        userMetadata.avatar,
        submitCommunity,
        uploadImages,
    ]);

    const updateUIAfterSubmission = async (
        data: CommunityAttributes,
        error: any
    ) => {
        if (error === undefined) {
            await updateCommunityInfo(data.id, dispatchRedux);
            const community = await Api.community.findById(data.id);
            if (community !== undefined) {
                batch(() => {
                    dispatchRedux(setCommunityMetadata(community));
                    dispatchRedux(setUserIsCommunityManager(true));
                });
            }
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
        const isAnyValid =
            _name ||
            _cover ||
            _profile ||
            _description ||
            _city ||
            _country ||
            _email ||
            _gps ||
            _claimAmount ||
            _maxClaim ||
            _incrementInterval;

        if (isAnyValid) {
            Keyboard.dismiss();
            setToggleLeaveFormModal(true);
        } else {
            navigation.goBack();
        }
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
                width: '100%',
            }}
        >
            <SubmissionActivity
                description={i18n.t('createCommunity.changeCoverImage')}
                submission={submittingCover}
                uploadDetails={coverUploadDetails}
            />
            <SubmissionActivity
                description={i18n.t('createCommunity.changeProfileImage')}
                submission={submittingProfile}
                uploadDetails={profileUploadDetails}
            />
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
                style={{ width: '100%' }}
                onPress={() => {
                    setRequestCancel(true);
                }}
            >
                {i18n.t('cancelSending')}
            </Button>
        </>
    );

    const SubmissionRequestCancel = () => (
        <>
            <Text style={styles.submissionModalMessageText}>
                {i18n.t('createCommunity.communityRequestCancel')}
            </Text>
            <View style={styles.modalBoxTwoButtons}>
                <Button
                    modeType="gray"
                    style={{ width: '45%' }}
                    onPress={() => {
                        setCanceled(true);
                        setRequestCancel(false);
                        if (communityUploadDetails !== undefined) {
                            // TODO: request API delete
                        }
                    }}
                >
                    {i18n.t('generic.yes')}
                </Button>
                <Button
                    modeType="default"
                    style={{ width: '45%' }}
                    onPress={() => {
                        setRequestCancel(false);
                        if (communityUploadDetails !== undefined) {
                            updateUIAfterSubmission(
                                communityUploadDetails,
                                undefined
                            );
                        }
                    }}
                >
                    {i18n.t('generic.no')}
                </Button>
            </View>
        </>
    );

    const SubmissionCanceled = () => (
        <>
            <Text style={styles.submissionModalMessageText}>
                {i18n.t('createCommunity.communityRequestCancel')}
            </Text>
            <Button
                modeType="gray"
                style={{ width: '100%' }}
                onPress={() => {
                    navigation.goBack();
                }}
            >
                {i18n.t('generic.leave')}
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
            <KeyboardAvoidingView
                style={{
                    flex: 1,
                }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                // enabled
                keyboardVerticalOffset={140}
            >
                <ScrollView
                    style={{
                        paddingHorizontal: 20,
                    }}
                >
                    <DispatchContext.Provider value={dispatch}>
                        <StateContext.Provider value={state}>
                            <CommunityCreationProcessDisclaimer />
                            <Metadata />
                            <Contract />
                        </StateContext.Provider>
                    </DispatchContext.Provider>
                </ScrollView>
            </KeyboardAvoidingView>
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
                        {canceled ? (
                            <SubmissionCanceled />
                        ) : requestCancel ? (
                            <SubmissionRequestCancel />
                        ) : submitting ? (
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
                    title={i18n.t('modalLeaveTitle')}
                    onDismiss={() => setToggleLeaveFormModal(false)}
                >
                    <Text style={styles.submissionModalMessageText}>
                        {i18n.t('modalLeaveDescription')}
                    </Text>
                    <View style={styles.modalBoxTwoButtons}>
                        <Button
                            modeType="gray"
                            style={{ width: '45%' }}
                            onPress={() => {
                                setToggleLeaveFormModal(false);
                                navigation.goBack();
                            }}
                        >
                            {i18n.t('generic.leave')}
                        </Button>
                        <Button
                            modeType="default"
                            style={{ width: '45%' }}
                            onPress={() => {
                                setToggleLeaveFormModal(false);
                            }}
                        >
                            {i18n.t('stay')}
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
        alignItems: 'center',
        width: '100%',
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
        width: '100%',
        marginVertical: 12,
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
        paddingBottom: 14,
        display: 'flex',
        width: '88%',
        alignItems: 'center',
        alignSelf: 'center',
    },
});

export default CreateCommunityScreen;
