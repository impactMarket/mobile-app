import { NavigationProp, useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import { BigNumber } from 'bignumber.js';
import Modal from 'components/Modal';
import Button from 'components/core/Button';
import SuccessSvg from 'components/svg/SuccessSvg';
import WarningRedTriangle from 'components/svg/WarningRedTriangle';
import BackSvg from 'components/svg/header/BackSvg';
import { formatInputAmountToTransfer } from 'helpers/currency';
import { updateCommunityInfo } from 'helpers/index';
import {
    setCommunityMetadata,
    setUserIsCommunityManager,
} from 'helpers/redux/actions/user';
import { CommunityCreationAttributes } from 'helpers/types/endpoints';
import { AppMediaContent } from 'helpers/types/models';
import { IRootState } from 'helpers/types/state';
import SubmitCommunity from 'navigator/header/SubmitCommunity';
import React, { useLayoutEffect, useReducer, useState } from 'react';
import {
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    View,
    Text,
    Image,
} from 'react-native';
import { Portal } from 'react-native-portalize';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { batch, useDispatch, useSelector } from 'react-redux';
import Api from 'services/api';
import { ipctColors } from 'styles/index';

import config from '../../../config';
import Contract from './contract';
import Metadata from './metadata';
import {
    DispatchContext,
    formInitialState,
    reducer,
    StateContext,
    validateField,
} from './state';

function CreateCommunityScreen() {
    const navigation = useNavigation();
    const dispatchRedux = useDispatch();
    const [submitting, setSubmitting] = useState(false);
    const [submittingSuccess, setSubmittingSuccess] = useState(false);
    const [submittingCover, setSubmittingCover] = useState(false);
    const [submittingCommunity, setSubmittingCommunity] = useState(false);
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [isAnyFieldMissedModal, setIsAnyFieldMissedModal] = useState(false);
    const [state, dispatch] = useReducer(reducer, formInitialState);
    const [coverUploadDetails, setCoverUploadDetails] = useState<
        AppMediaContent | undefined
    >(undefined);

    const userAddress = useSelector(
        (state: IRootState) => state.user.wallet.address
    );
    const userLanguage = useSelector(
        (state: IRootState) => state.user.metadata.language
    );

    const submitCommunity = async (
        contractParams: {
            claimAmount: string;
            maxClaim: string;
            baseInterval: number;
            incrementInterval: number;
        },
        privateParamsIfAvailable: any,
        details: [
            {
                uploadURL: string;
                media: AppMediaContent;
            },
            void
        ]
    ) => {
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
            coverMediaId: details[0].media.id,
            contractParams,
            ...privateParamsIfAvailable,
        };
        const communityApiRequestResult = await Api.community.create(
            communityDetails
        );
        if (communityApiRequestResult.error === undefined) {
            await updateCommunityInfo(
                communityApiRequestResult.data.id,
                dispatchRedux
            );
            const community = await Api.community.findById(
                communityApiRequestResult.data.id
            );
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

    const uploadImages = (_cover: string, _profile: string) => {
        const profile = () => {
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
        const cover = async () => {
            if (coverUploadDetails !== undefined) {
                return {
                    uploadURL: '',
                    media: coverUploadDetails,
                };
            }
            const details = await Api.community.uploadCover(_cover);
            setCoverUploadDetails(details.media);
            setSubmittingCover(false);
            return details;
        };
        return Promise.all([cover(), profile()]);
    };

    const deployPrivateCommunity = async () => {
        //
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
            // Alert.alert(
            //     i18n.t('failure'),
            //     i18n.t('claimBiggerThanMax'),
            //     [{ text: 'OK' }],
            //     { cancelable: false }
            // );
            // return;
        }
        if (new BigNumber(state.claimAmount).eq(0)) {
            // Alert.alert(
            //     i18n.t('failure'),
            //     i18n.t('claimNotZero'),
            //     [{ text: 'OK' }],
            //     { cancelable: false }
            // );
            // return;
        }
        if (new BigNumber(state.maxClaim).eq(0)) {
            // Alert.alert(
            //     i18n.t('failure'),
            //     i18n.t('maxNotZero'),
            //     [{ text: 'OK' }],
            //     { cancelable: false }
            // );
            // return;
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
        let txReceipt = null,
            communityAddress = null;
        try {
            const contractParams = {
                claimAmount: new BigNumber(
                    formatInputAmountToTransfer(state.claimAmount)
                )
                    .multipliedBy(decimals)
                    .toString(),
                maxClaim: new BigNumber(
                    formatInputAmountToTransfer(state.maxClaim)
                )
                    .multipliedBy(decimals)
                    .toString(),
                baseInterval: parseInt(state.baseInterval, 10),
                incrementInterval:
                    parseInt(state.incrementInterval, 10) *
                    state.incrementIntervalUnit,
            };
            let privateParamsIfAvailable = {};
            if (state.visibility === 'private') {
                txReceipt = await deployPrivateCommunity();
                if (txReceipt === undefined) {
                    // TODO: throw an error
                    return;
                }
                communityAddress = txReceipt.contractAddress;
                privateParamsIfAvailable = {
                    contractAddress: communityAddress,
                    txReceipt,
                };
            }

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

            const details = await uploadImages(state.coverImage, '');
            await submitCommunity(
                contractParams,
                privateParamsIfAvailable,
                details
            );
        } catch (e) {
            // Sentry.Native.captureException(e);
        } finally {
            setSubmitting(false);
            setSubmittingCover(false);
            setSubmittingCommunity(false);
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
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    justifyContent: 'space-between',
                    paddingVertical: 16,
                }}
            >
                <Text
                    style={{
                        fontSize: 15,
                        lineHeight: 24,
                        fontFamily: 'Inter-Regular',
                    }}
                >
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
                                : 'red'
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
                description="Cover"
                submission={submittingCover}
                uploadDetails={coverUploadDetails}
            />
            <SubmissionActivity
                description="Community"
                submission={submittingCommunity}
                uploadDetails={undefined} // doesn't matter, once it's approved, jumps to another modal
            />
        </View>
    );

    const SubmissionFailed = () => (
        <>
            <View
                style={{
                    marginVertical: 16,
                    paddingVertical: 16,
                    paddingHorizontal: 22,
                    borderStyle: 'solid',
                    borderColor: '#EB5757',
                    borderWidth: 2,
                    borderRadius: 8,
                    width: '100%',
                    flexDirection: 'row',
                }}
            >
                <WarningRedTriangle
                    style={{
                        alignSelf: 'flex-start',
                        marginRight: 16,
                        marginTop: 8,
                    }}
                />
                <Text
                    style={{
                        fontFamily: 'Inter-Regular',
                        fontSize: 14,
                        lineHeight: 24,
                        color: ipctColors.almostBlack,
                        textAlign: 'left',
                        marginRight: 36,
                    }}
                >
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
            <View
                style={{
                    paddingVertical: 14,
                    display: 'flex',
                    // height: sending || sendingSuccess ? 234 : 400,
                    width: '88%',
                    alignItems: 'center',
                    alignSelf: 'center',
                }}
            >
                <SuccessSvg />
                <Text
                    style={{
                        fontFamily: 'Inter-Regular',
                        fontSize: 14,
                        lineHeight: 24,
                        color: ipctColors.almostBlack,
                        width: '100%',
                        marginVertical: 12,
                        textAlign: 'center',
                    }}
                >
                    {i18n.t('communityRequestSuccess')}
                </Text>
                <Button
                    modeType="gray"
                    style={{ width: '100%' }}
                    // onPress={() => {
                    //     setSending(false);
                    //     setToggleInformativeModal(false);
                    //     navigation.goBack();
                    //     navigation.navigate(Screens.CommunityManager);
                    // }}
                >
                    {i18n.t('continue')}
                </Button>
            </View>
        </>
    );

    const SubmissionInProgress = () => (
        <>
            <Text
                style={{
                    fontFamily: 'Inter-Regular',
                    fontSize: 14,
                    lineHeight: 24,
                    color: ipctColors.almostBlack,
                    width: '100%',
                    marginVertical: 12,
                    // textAlign:
                    //     sendingSuccess || sending
                    //         ? 'center'
                    //         : 'left',
                }}
            >
                {i18n.t('communityRequestSending')}
            </Text>
            <SubmissionProgressDetails />
            <Button
                modeType="gray"
                style={{ width: '100%' }}
                onPress={() => {
                    // setSending(false);
                    // setToggleInformativeModal(false);
                    // navigation.goBack();
                    // navigation.navigate(
                    //     Screens.CommunityManager
                    // );
                }}
            >
                {i18n.t('cancelSending')}
            </Button>
        </>
    );

    return (
        <>
            <KeyboardAvoidingView
                style={{
                    flex: 1,
                    // flexDirection: 'column',
                    // justifyContent: 'center',
                }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                // enabled
                keyboardVerticalOffset={140}
            >
                <ScrollView
                    style={{
                        paddingHorizontal: 20,
                        // marginBottom: 20,
                        // marginTop: 16,
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
                    visible={isAnyFieldMissedModal}
                    title={i18n.t('modalErrorTitle')}
                    onDismiss={() => {
                        setSubmitting(false);
                        setIsAnyFieldMissedModal(false);
                    }}
                    buttons={
                        <Button
                            modeType="gray"
                            style={{ width: '100%' }}
                            onPress={() => {
                                setSubmitting(false);
                                setIsAnyFieldMissedModal(false);
                            }}
                        >
                            {i18n.t('close')}
                        </Button>
                    }
                >
                    <View
                        style={{
                            paddingVertical: 16,
                            paddingHorizontal: 22,
                            borderStyle: 'solid',
                            borderColor: '#EB5757',
                            borderWidth: 2,
                            borderRadius: 8,
                            width: '100%',
                            flexDirection: 'row',
                            marginBottom: 16,
                        }}
                    >
                        <WarningRedTriangle
                            style={{
                                alignSelf: 'flex-start',
                                marginRight: 16,
                                marginTop: 8,
                            }}
                        />
                        <Text
                            style={{
                                fontFamily: 'Inter-Regular',
                                fontSize: 14,
                                lineHeight: 24,
                                color: ipctColors.almostBlack,
                                // textAlign: 'justify',
                                marginRight: 12,
                            }}
                        >
                            {i18n.t('missingFieldError')}
                        </Text>
                    </View>
                </Modal>
                <Modal visible={showSubmissionModal} title="Submitting">
                    <View
                        style={{
                            paddingBottom: 14,
                            display: 'flex',
                            // height: sending || sendingSuccess ? 234 : 400,
                            width: '88%',
                            alignItems: 'center',
                            alignSelf: 'center',
                        }}
                    >
                        {submitting ? (
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

export default CreateCommunityScreen;
