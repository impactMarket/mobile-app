import { NavigationProp, useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import { BigNumber } from 'bignumber.js';
import Modal from 'components/Modal';
import Button from 'components/core/Button';
import SuccessSvg from 'components/svg/SuccessSvg';
import WarningRedTriangle from 'components/svg/WarningRedTriangle';
import BackSvg from 'components/svg/header/BackSvg';
import { celoNetwork } from 'helpers/constants';
import { formatInputAmountToTransfer } from 'helpers/currency';
import { updateCommunityInfo } from 'helpers/index';
import {
    setCommunityMetadata,
    setUserIsCommunityManager,
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
} from 'react-native';
import { Portal } from 'react-native-portalize';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { batch, useDispatch, useSelector } from 'react-redux';
import Api from 'services/api';
import { celoWalletRequest } from 'services/celoWallet';
import { ipctColors } from 'styles/index';

import config from '../../../config';
import CommunityContractABI from '../../contracts/CommunityABI.json';
import CommunityBytecode from '../../contracts/CommunityBytecode.json';
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
    const [isUploadingContent, setIsUploadingContent] = useState(false);
    const [contractParams, setContractParams] = useState({});
    const [privateParams, setPrivateParams] = useState(undefined);
    const [submitting, setSubmitting] = useState(false);
    const [canceled, setCanceled] = useState(false);
    const [requestCancel, setRequestCancel] = useState(false);
    const [submittingSuccess, setSubmittingSuccess] = useState(false);
    const [submittingCover, setSubmittingCover] = useState(false);
    const [submittingCommunity, setSubmittingCommunity] = useState(false);
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [isAnyFieldMissedModal, setIsAnyFieldMissedModal] = useState(false);
    const [invalidInputAmounts, setInvalidInputAmounts] = useState<
        string | undefined
    >(undefined);
    const [coverUploadDetails, setCoverUploadDetails] = useState<
        AppMediaContent | undefined
    >(undefined);
    const [communityUploadDetails, setCommunityUploadDetails] = useState<
        CommunityAttributes | undefined
    >(undefined);
    const [state, dispatch] = useReducer(reducer, formInitialState);

    const userAddress = useSelector(
        (state: IRootState) => state.user.wallet.address
    );
    const userLanguage = useSelector(
        (state: IRootState) => state.user.metadata.language
    );
    const kit = useSelector((state: IRootState) => state.app.kit);

    useEffect(() => {
        let cancelablePromise: {
            promise: Promise<unknown>;
            cancel(): void;
        };
        if (!canceled) {
            if (coverUploadDetails !== undefined) {
                cancelablePromise = makeCancelable(submitCommunity());
                cancelablePromise.promise.catch().finally(() => {
                    setSubmitting(false);
                    setSubmittingCover(false);
                    setSubmittingCommunity(false);
                });
            } else if (isUploadingContent) {
                cancelablePromise = makeCancelable(uploadImages());
                cancelablePromise.promise
                    .then((details) => {
                        setCoverUploadDetails(details[0].media);
                        setSubmittingCover(false);
                    })
                    .catch();
            }
        }
        return () => {
            if (cancelablePromise !== undefined) {
                return cancelablePromise.cancel();
            }
        };
    }, [canceled, coverUploadDetails, isUploadingContent]);

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
            language: userLanguage,
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

    const uploadImages = () => {
        const profileUpload = () => {
            // if (profileImage.length > 0 && profileImage !== avatar) {
            //     try {
            //         const res = await Api.user.updateProfilePicture(
            //             profileImage
            //         );
            //         const cachedUser = (await CacheStore.getUser())!;
            //         await CacheStore.cacheUser({
            //             ...cachedUser,
            //             avatar: res.url,
            //         });
            //         dispatch(
            //             setUserMetadata({
            //                 ...user,
            //                 avatar: res.url,
            //             })
            //         );
            //     } catch (e) {
            //         // TODO: block community creation if this fails, for now, lets ignore
            //     }
            // }
        };
        const coverUpload = async () => {
            if (coverUploadDetails !== undefined) {
                return {
                    uploadURL: '',
                    media: coverUploadDetails,
                };
            }
            const details = await Api.community.uploadCover(state.coverImage);
            return details;
        };
        return Promise.all([coverUpload(), profileUpload()]);
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
        const _description = validate.description();
        const _city = validate.city();
        const _country = validate.country();
        const _email = validate.email();
        const _gps = validate.gps();
        const _claimAmount = validate.claimAmount();
        const _maxClaim = validate.maxClaim();
        const _incrementInterval = validate.incrementInterval();
        const isAllValid =
            _name &&
            _cover &&
            _description &&
            _city &&
            _country &&
            _email &&
            _gps &&
            _claimAmount &&
            _maxClaim &&
            _incrementInterval;

        if (!isAllValid) {
            setIsAnyFieldMissedModal(true);
            return;
        }

        if (new BigNumber(state.maxClaim).lte(state.claimAmount)) {
            setInvalidInputAmounts(i18n.t('claimBiggerThanMax'));
            return;
        }
        if (new BigNumber(state.claimAmount).eq(0)) {
            setInvalidInputAmounts(i18n.t('claimNotZero'));
            return;
        }
        if (new BigNumber(state.maxClaim).eq(0)) {
            setInvalidInputAmounts(i18n.t('maxNotZero'));
            return;
        }

        setSubmitting(true);
        setSubmittingCommunity(true);
        if (coverUploadDetails === undefined) {
            setSubmittingCover(true);
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

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <SubmitCommunity
                    submit={submitNewCommunity}
                    submitting={submitting}
                />
            ),
        });
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
                description={i18n.t('changeCoverImage')}
                submission={submittingCover}
                uploadDetails={coverUploadDetails}
            />
            <SubmissionActivity
                description={i18n.t('communityDetails')}
                submission={submittingCommunity}
                uploadDetails={undefined} // doesn't matter, once it's approved, jumps to another modal
            />
        </View>
    );

    const SubmissionFailed = () => (
        <>
            <View style={styles.failedModalContainer}>
                <WarningRedTriangle style={styles.errorModalWarningSvg} />
                <Text style={styles.failedModalMessageText}>
                    {i18n.t('communityRequestError')}
                </Text>
            </View>
            <SubmissionProgressDetails />
            <Button
                modeType="gray"
                style={{ width: '100%' }}
                onPress={submitNewCommunity}
            >
                {i18n.t('tryAgain')}
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
                    {i18n.t('communityRequestSuccess')}
                </Text>
                <Button
                    modeType="gray"
                    style={{ width: '100%' }}
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    {i18n.t('continue')}
                </Button>
            </View>
        </>
    );

    const SubmissionInProgress = () => (
        <>
            <Text style={styles.submissionModalMessageText}>
                {i18n.t('communityRequestSending')}
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
                {i18n.t('communityRequestCancel')}
            </Text>
            <View style={styles.requestCancelContainerButtons}>
                <Button
                    modeType="gray"
                    style={{ width: '35%' }}
                    onPress={() => {
                        setCanceled(true);
                        setRequestCancel(false);
                        if (communityUploadDetails !== undefined) {
                            // TODO: request API delete
                        }
                    }}
                >
                    {i18n.t('yes')}
                </Button>
                <Button
                    modeType="default"
                    style={{ width: '35%' }}
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
                    {i18n.t('no')}
                </Button>
            </View>
        </>
    );

    const SubmissionCanceled = () => (
        <>
            <Text style={styles.submissionModalMessageText}>
                {i18n.t('communityRequestCancel')}
            </Text>
            <Button
                modeType="gray"
                style={{ width: '100%' }}
                onPress={() => {
                    navigation.goBack();
                }}
            >
                {i18n.t('leave')}
            </Button>
        </>
    );

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
                    title={i18n.t('modalErrorTitle')}
                    onDismiss={() => {
                        setSubmitting(false);
                        setIsAnyFieldMissedModal(false);
                        setInvalidInputAmounts(undefined);
                    }}
                    buttons={
                        <Button
                            modeType="gray"
                            style={{ width: '100%' }}
                            onPress={() => {
                                setSubmitting(false);
                                setIsAnyFieldMissedModal(false);
                                setInvalidInputAmounts(undefined);
                            }}
                        >
                            {i18n.t('close')}
                        </Button>
                    }
                >
                    <View style={styles.errorModalContainer}>
                        <WarningRedTriangle
                            style={styles.errorModalWarningSvg}
                        />
                        <Text style={styles.errorModalText}>
                            {invalidInputAmounts
                                ? invalidInputAmounts
                                : i18n.t('missingFieldError')}
                        </Text>
                    </View>
                </Modal>
                <Modal
                    visible={showSubmissionModal}
                    title={i18n.t('submitting')}
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
            </Portal>
        </>
    );
}

CreateCommunityScreen.navigationOptions = ({
    navigation,
}: {
    navigation: NavigationProp<any, any>;
}) => {
    const handlePressGoBack = () => {
        navigation.goBack();
    };

    return {
        headerLeft: () => <BackSvg onPress={handlePressGoBack} />,
        headerTitle: i18n.t('applyCommunity'),
        headerTitleStyle: {
            fontFamily: 'Manrope-Bold',
            fontSize: 22,
            lineHeight: 28,
            color: '#333239',
        },
        headerTitleContainerStyle: {
            left: 58,
        },
    };
};

const styles = StyleSheet.create({
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
    requestCancelContainerButtons: {
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
        width: '100%',
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
