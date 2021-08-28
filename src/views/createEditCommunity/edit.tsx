import { NavigationProp, useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import Modal from 'components/Modal';
import Button from 'components/core/Button';
import SuccessSvg from 'components/svg/SuccessSvg';
import WarningTriangle from 'components/svg/WarningTriangle';
import BackSvg from 'components/svg/header/BackSvg';
import { updateCommunityInfo } from 'helpers/index';
import { setCommunityMetadata } from 'helpers/redux/actions/user';
import { CommunityEditionAttributes } from 'helpers/types/endpoints';
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
import { useDispatch, useSelector } from 'react-redux';
import Api from 'services/api';
import { ipctColors } from 'styles/index';

import Metadata from './metadata';
import {
    DispatchContext,
    formInitialState,
    reducer,
    StateContext,
    validateField,
} from './state';

function EditCommunityScreen() {
    const navigation = useNavigation();
    const dispatchRedux = useDispatch();
    const community = useSelector(
        (state: IRootState) => state.user.community.metadata
    );
    const { name, description, currency, cover } = community;

    const [submitting, setSubmitting] = useState(false);
    const [submittingSuccess, setSubmittingSuccess] = useState(false);
    const [submittingCover, setSubmittingCover] = useState(false);
    const [submittingCommunity, setSubmittingCommunity] = useState(false);
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [isAnyFieldMissedModal, setIsAnyFieldMissedModal] = useState(false);
    const [state, dispatch] = useReducer(reducer, {
        ...formInitialState,
        coverImage: cover.url,
        name,
        description,
        currency,
    });
    const [coverUploadDetails, setCoverUploadDetails] = useState<
        AppMediaContent | undefined
    >(undefined);

    const submitCommunity = async (
        details: {
            uploadURL: string;
            media: AppMediaContent;
        }[]
    ) => {
        const { name, description, currency } = state;
        const communityDetails: CommunityEditionAttributes = {
            name,
            description,
            currency,
            coverMediaId: details[0].media.id,
        };
        const communityApiRequestResult = await Api.community.edit(
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
                dispatchRedux(setCommunityMetadata(community));
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

    const uploadImages = (_cover: string) => {
        const coverUpload = async () => {
            if (state.coverImage === cover.url) {
                return {
                    uploadURL: '',
                    media: community.cover,
                };
            }
            const details = await Api.community.uploadCover(_cover);
            setCoverUploadDetails(details.media);
            setSubmittingCover(false);
            return details;
        };
        return Promise.all([coverUpload()]);
    };

    const submitEditCommunity = async () => {
        const validate = validateField(state, dispatch);
        const _name = validate.name();
        const _cover = validate.cover();
        const _description = validate.description();
        const isAllValid = _name && _cover && _description;

        if (!isAllValid) {
            setIsAnyFieldMissedModal(true);
            return;
        }

        setSubmitting(true);
        setSubmittingCommunity(true);
        if (state.coverImage !== cover.url) {
            setSubmittingCover(true);
        }
        if (!showSubmissionModal) {
            setShowSubmissionModal(true);
        }

        try {
            const details = await uploadImages(state.coverImage);
            await submitCommunity(details);
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
                    submit={submitEditCommunity}
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
            {state.coverImage !== cover.url && (
                <SubmissionActivity
                    description="Cover"
                    submission={submittingCover}
                    uploadDetails={coverUploadDetails}
                />
            )}
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
                <WarningTriangle
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
                    {i18n.t('createCommunity.communityRequestError')}
                </Text>
            </View>
            <SubmissionProgressDetails />
            <Button
                modeType="gray"
                style={{ width: '100%' }}
                onPress={submitEditCommunity}
            >
                {i18n.t('generic.tryAgain')}
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
                {i18n.t('createCommunity.communityRequestSending')}
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
                        // paddingBottom: 20,
                        // marginTop: 16,
                    }}
                >
                    <DispatchContext.Provider value={dispatch}>
                        <StateContext.Provider value={state}>
                            <Metadata edit />
                        </StateContext.Provider>
                    </DispatchContext.Provider>
                </ScrollView>
            </KeyboardAvoidingView>
            <Portal>
                <Modal
                    visible={isAnyFieldMissedModal}
                    title={i18n.t('errors.modals.title')}
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
                            {i18n.t('generic.close')}
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
                        <WarningTriangle
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
                            {i18n.t('createCommunity.missingFieldError')}
                        </Text>
                    </View>
                </Modal>
                <Modal
                    visible={showSubmissionModal}
                    title="Submitting"
                    onDismiss={
                        !submitting && !submittingSuccess
                            ? () => {
                                  setShowSubmissionModal(false);
                              }
                            : undefined
                    }
                >
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

EditCommunityScreen.navigationOptions = ({
    navigation,
}: {
    navigation: NavigationProp<any, any>;
}) => {
    const handlePressGoBack = () => {
        navigation.goBack();
    };

    return {
        headerLeft: () => <BackSvg onPress={handlePressGoBack} />,
        headerTitle: i18n.t('createCommunity.editCommunity'),
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

export default EditCommunityScreen;
