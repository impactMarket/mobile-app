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

    const submitCommunity = async (details?: {
        uploadURL: string;
        media: AppMediaContent;
    }) => {
        const { name, description, currency } = state;
        // eslint-disable-next-line prefer-const
        let communityDetails: CommunityEditionAttributes = {
            name,
            description,
            currency,
            coverMediaId: cover.id, // default
        };
        if (details !== undefined) {
            communityDetails.coverMediaId = details.media.id;
        }
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
            const details = await Api.community.preSignedUrl(_cover);
            const success = await Api.community.uploadImage(details, _cover);
            setCoverUploadDetails(success ? details.media : undefined);
            setSubmittingCover(false);
            return { details, success };
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
            let d;
            if (state.coverImage !== cover.url) {
                d = await uploadImages(state.coverImage);
                if (d[0].success === true) {
                    await submitCommunity(d[0].details);
                }
            } else if (state.coverImage === cover.url) {
                await submitCommunity();
            } else {
                setSubmittingSuccess(false);
            }
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
        // TODO: this needs refactoring. This methods are used within and outside the effect
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submitting, state]);

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
                    description={i18n.t('createCommunity.changeCoverImage')}
                    submission={submittingCover}
                    uploadDetails={coverUploadDetails}
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
                style={{
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
            <SuccessSvg style={{ alignSelf: 'center' }} />
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
                }}
            >
                {i18n.t('createCommunity.communityRequestSending')}
            </Text>
            <SubmissionProgressDetails />
            <Button
                modeType="gray"
                style={{ width: '100%' }}
                onPress={() => {
                    setSubmitting(false);
                    setShowSubmissionModal(false);
                    // TODO: [IPCT1-480] cancel edit request
                }}
            >
                {i18n.t('generic.cancel')}
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
                    title={i18n.t('generic.submitting')}
                    onDismiss={
                        !submitting && !submittingSuccess
                            ? () => {
                                  setShowSubmissionModal(false);
                              }
                            : undefined
                    }
                >
                    {submitting ? (
                        <SubmissionInProgress />
                    ) : submittingSuccess ? (
                        <SubmissionSucess />
                    ) : (
                        <SubmissionFailed />
                    )}
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
    };
};

export default EditCommunityScreen;
