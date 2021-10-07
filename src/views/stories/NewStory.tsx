import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import Modal from 'components/Modal';
import Button from 'components/core/Button';
import renderHeader from 'components/core/HeaderBottomSheetTitle';
import Input from 'components/core/Input';
import CloseStorySvg from 'components/svg/CloseStorySvg';
import BackSvg from 'components/svg/header/BackSvg';
import * as ImagePicker from 'expo-image-picker';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import { docsURL } from 'helpers/index';
import { ICommunityStory } from 'helpers/types/endpoints';
import { AppMediaContent } from 'helpers/types/models';
import { IRootState } from 'helpers/types/state';
import SubmitStory from 'navigator/header/SubmitStory';
import React, { useLayoutEffect, useState, useRef, useEffect } from 'react';
import { Trans } from 'react-i18next';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { WebView } from 'react-native-webview';
import { useSelector } from 'react-redux';
import Api from 'services/api';
import { ipctColors } from 'styles/index';

import Carousel from './Carousel';

function NewStoryScreen() {
    const navigation = useNavigation();

    const [storyText, setStoryText] = useState('');
    const [storyMedia, setStoryMedia] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showWebview, setShowWebview] = useState(false);
    const [showModalType, setShowModalType] = useState(-1);
    const [submitedResult, setSubmitedResult] = useState<
        ICommunityStory | undefined
    >();
    const [submittedWithSuccess, setSubmittedWithSuccess] = useState(false);
    const modalizeStoryRef = useRef<Modalize>(null);
    const userCommunity = useSelector(
        (state: IRootState) => state.user.community.metadata
    );
    const { language } = useSelector(
        (state: IRootState) => state.user.metadata
    );
    const userCommunityStatus = useSelector(
        (state: IRootState) => state.user.community.metadata?.status
    );

    useLayoutEffect(() => {
        const submitNewStory = async () => {
            setSubmitting(true);
            try {
                if (storyMedia.length > 0 || storyText.length > 0) {
                    let media: AppMediaContent | undefined;
                    if (storyMedia.length > 0) {
                        const d = await Api.story.preSignedUrl(storyMedia);
                        await Api.story.uploadImage(d, storyMedia);
                        media = d.media;
                    }
                    const r = await Api.story.add({
                        communityId: userCommunity.id,
                        message: storyText.length > 0 ? storyText : undefined,
                        mediaId: media ? media.id : 0,
                    });
                    if (r.error !== undefined) {
                        throw new Error(r.error.name);
                    }

                    setSubmitedResult(r.data);
                    setShowModalType(1);
                    setSubmittedWithSuccess(true);
                } else {
                    setShowModalType(3);
                }
            } catch (e) {
                setShowModalType(2);
            } finally {
                setSubmitting(false);
            }
        };
        if (showWebview) {
            navigation.setOptions({
                headerTitle: null,
                headerLeft: null,
                headerRight: () => (
                    <CloseStorySvg
                        style={{ marginRight: 26 }}
                        onPress={() => {
                            setShowWebview(false);
                        }}
                    />
                ),
            });
        } else if (userCommunity?.id !== undefined) {
            navigation.setOptions({
                headerShown: !submittedWithSuccess,
                headerLeft: () => <BackSvg />,
                headerTitle: i18n.t('stories.newStory'),
                headerRight: () => (
                    <SubmitStory
                        submit={submitNewStory}
                        submitting={submitting}
                        disabled={false}
                    />
                ),
            });
        }
    }, [
        storyText,
        storyMedia,
        submitting,
        userCommunity,
        submittedWithSuccess,
        showWebview,
    ]);

    useEffect(() => {
        if (modalizeStoryRef.current !== null) {
            modalizeStoryRef.current.open();
        } else {
            const intervalToOpenModal = setInterval(() => {
                if (modalizeStoryRef.current !== null) {
                    modalizeStoryRef.current.open();
                    clearInterval(intervalToOpenModal);
                }
            }, 100);
        }
    }, []);

    const HelpWebview = () => {
        if (!showWebview) {
            return null;
        }
        return (
            <View
                style={{
                    zIndex: 5,
                    height: '100%',
                }}
            >
                <WebView
                    originWhitelist={['*']}
                    source={{
                        uri: docsURL('/general/stories-posts-rules', language),
                    }}
                    javaScriptEnabled
                    domStorageEnabled
                />
            </View>
        );
    };

    const pickImage = async () => {
        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert(i18n.t('permissions.cameraMessage'));
            return;
        }

        const result = (await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        })) as {
            cancelled: false;
        } & ImageInfo;

        if (!result.cancelled) {
            setStoryMedia(result.uri);
        }
    };

    if (userCommunity?.id === undefined || userCommunityStatus !== 'valid') {
        return <Text>{i18n.t('generic.notInComunity')}</Text>;
    }

    if (submittedWithSuccess && submitedResult) {
        return (
            <Carousel
                communityId={userCommunity?.id}
                goToOtherCommunity={() => {}}
            />
        );
    }

    const modalTitle =
        showModalType === 1
            ? i18n.t('generic.success')
            : i18n.t('generic.failure');
    const modalText =
        showModalType === 1
            ? i18n.t('stories.storyCongrat')
            : showModalType === 2
            ? i18n.t('stories.storyFailure')
            : i18n.t('stories.emptyStoryFailure');

    return (
        <>
            <HelpWebview />
            <View style={{ marginHorizontal: 18, marginTop: 14 }}>
                <Input
                    label={i18n.t('stories.description')}
                    multiline
                    numberOfLines={12}
                    value={storyText}
                    maxLength={256}
                    onChangeText={(value) => setStoryText(value)}
                    isBig
                />
                <Button
                    modeType="default"
                    bold
                    icon="image"
                    onPress={() => pickImage()}
                    style={{ width: '100%', marginVertical: 24 }}
                >
                    {i18n.t('donate.attach')}
                </Button>
                {storyMedia.length > 0 && (
                    <ImageBackground
                        source={{ uri: storyMedia }}
                        imageStyle={{
                            borderRadius: 4,
                        }}
                        style={{
                            width: 148,
                            height: 100,
                        }}
                    >
                        <CloseStorySvg
                            style={{
                                alignSelf: 'flex-end',
                                marginTop: 14,
                                marginRight: 10,
                            }}
                            onPress={() => setStoryMedia('')}
                        />
                    </ImageBackground>
                )}
            </View>
            <Portal>
                <Modal
                    title={modalTitle}
                    visible={showModalType !== -1}
                    onDismiss={() => setShowModalType(-1)}
                >
                    <Text
                        style={{
                            fontFamily: 'Inter-Regular',
                        }}
                    >
                        {modalText}
                    </Text>
                </Modal>
                <Modalize
                    ref={modalizeStoryRef}
                    HeaderComponent={renderHeader(
                        i18n.t('stories.storyRules'),
                        modalizeStoryRef,
                        () => modalizeStoryRef.current?.close()
                    )}
                    adjustToContentHeight
                >
                    <View style={{ width: '100%', paddingHorizontal: 22 }}>
                        <Text style={styles.description}>
                            <Trans
                                i18nKey="stories.storyRulesFirstParagraph"
                                components={{
                                    bold: (
                                        <Text
                                            style={{
                                                fontFamily: 'Inter-Bold',
                                            }}
                                        />
                                    ),
                                }}
                            />
                        </Text>
                        <Text style={styles.storySubTitle}>
                            {i18n.t('stories.storySubTitle')}
                        </Text>
                        <Text style={styles.description}>
                            {i18n.t('stories.storyRulesSecondParagraph')}
                        </Text>
                        <Button
                            modeType="gray"
                            style={{
                                marginTop: 16,
                                marginBottom: 16,
                            }}
                            labelStyle={{
                                fontSize: 15,
                                lineHeight: 28,
                            }}
                            onPress={() => {
                                modalizeStoryRef.current?.close();
                                setShowWebview(true);
                            }}
                        >
                            {i18n.t('generic.knowMoreHelpCenter')}
                        </Button>
                    </View>
                </Modalize>
            </Portal>
        </>
    );
}

NewStoryScreen.navigationOptions = () => {
    return {};
};

export default NewStoryScreen;

const styles = StyleSheet.create({
    description: {
        fontFamily: 'Inter-Regular',
        fontSize: 15,
        fontWeight: '400',
        lineHeight: 24,
        textAlign: 'left',
        color: ipctColors.darBlue,
        marginTop: 8,
    },
    storySubTitle: {
        fontFamily: 'Inter-Bold',
        fontSize: 15,
        fontWeight: '700',
        lineHeight: 24,
        textAlign: 'left',
        color: ipctColors.darBlue,
        marginTop: 22,
        marginBottom: 10,
    },
});
