import { useFocusEffect, useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import Button from 'components/core/Button';
import renderHeader from 'components/core/HeaderBottomSheetTitle';
import Input from 'components/core/Input';
import CloseStorySvg from 'components/svg/CloseStorySvg';
import BackSvg from 'components/svg/header/BackSvg';
import * as ImagePicker from 'expo-image-picker';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import { ICommunityStory } from 'helpers/types/endpoints';
import { IRootState } from 'helpers/types/state';
import SubmitStory from 'navigator/header/SubmitStory';
import React, { useLayoutEffect, useState, useRef, useCallback } from 'react';
import { Trans } from 'react-i18next';
import {
    View,
    Text,
    ImageBackground,
    Alert,
    StyleSheet,
    ScrollView,
    Dimensions,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
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
    const [, setLoadRefs] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const [openHelpCenter, setOpenHelpCenter] = useState(false);
    const [submitedResult, setSubmitedResult] = useState<
        ICommunityStory | undefined
    >();
    const [submittedWithSuccess, setSubmittedWithSuccess] = useState(false);
    const modalizeStoryRef = useRef<Modalize>(null);
    const userCommunity = useSelector(
        (state: IRootState) => state.user.community.metadata
    );
    const userCommunityStatus = useSelector(
        (state: IRootState) => state.user.community.metadata?.status
    );

    useLayoutEffect(() => {
        const submitNewStory = async () => {
            setSubmitting(true);
            try {
                if (storyMedia.length > 0 || storyText.length > 0) {
                    const r = await Api.story.add(
                        storyMedia.length > 0 ? storyMedia : undefined,
                        {
                            communityId: userCommunity.id,
                            message:
                                storyText.length > 0 ? storyText : undefined,
                            mediaId: 0,
                        }
                    );

                    setSubmitedResult(r);
                    Alert.alert(
                        i18n.t('generic.success'),
                        i18n.t('stories.storyCongrat'),
                        [{ text: 'OK' }],
                        { cancelable: false }
                    );
                    setSubmittedWithSuccess(true);
                } else {
                    Alert.alert(
                        i18n.t('generic.failure'),
                        i18n.t('stories.emptyStoryFailure'),
                        [{ text: 'OK' }],
                        { cancelable: false }
                    );
                }
            } catch (e) {
                Alert.alert(
                    i18n.t('generic.failure'),
                    i18n.t('stories.storyFailure'),
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
            } finally {
                setSubmitting(false);
            }
        };
        if (userCommunity?.id !== undefined) {
            navigation.setOptions({
                headerShown: !submittedWithSuccess,
                headerRight: () => (
                    <SubmitStory
                        submit={submitNewStory}
                        submitting={submitting}
                        disabled={isDisabled}
                    />
                ),
            });
            // TODO: this next line should change though.
        }
    }, [
        navigation,
        storyText,
        storyMedia,
        submitting,
        userCommunity,
        submittedWithSuccess,
        isDisabled,
    ]);

    useFocusEffect(
        useCallback(() => {
            renderAuthModalize();
        }, [])
    );

    const renderHelpCenter = () => {
        if (openHelpCenter) {
            return (
                <WebView
                    originWhitelist={['*']}
                    source={{ uri: 'https://docs.impactmarket.com/' }}
                    style={{
                        height: Dimensions.get('screen').height * 0.85,
                    }}
                />
            );
        }
    };

    const renderAuthModalize = () => {
        if (modalizeStoryRef.current === null) {
            setTimeout(() => {
                setLoadRefs(true);
            }, 100);
        } else {
            modalizeStoryRef.current.open();
        }
    };

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert(i18n.t('permissions.cameraMessage'));
            return;
        }

        const result = (await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            // allowsEditing: true,
            // aspect: [1, 1],
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

    const renderStoryRules = () => (
        <ScrollView style={{ maxHeight: 600 }}>
            <View style={{ width: '100%', paddingHorizontal: 22 }}>
                <Text style={styles.description}>
                    <Trans
                        i18nKey="storyRulesFirstParagraph"
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
                        setOpenHelpCenter(true);
                    }}
                >
                    {i18n.t('generic.knowMoreHelpCenter')}
                </Button>
            </View>
        </ScrollView>
    );

    return (
        <>
            {openHelpCenter ? (
                renderHelpCenter()
            ) : (
                <View style={{ marginHorizontal: 18, marginTop: 14 }}>
                    <Input
                        label="Story Post Text · Optional"
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
            )}

            <Modalize
                ref={modalizeStoryRef}
                modalTopOffset={100}
                onOpen={() => setIsDisabled(true)}
                onClose={() => setIsDisabled(false)}
                HeaderComponent={renderHeader(
                    i18n.t('stories.storyRules'),
                    modalizeStoryRef,
                    () => modalizeStoryRef.current?.close()
                )}
            >
                {renderStoryRules()}
            </Modalize>
        </>
    );
}

NewStoryScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
        headerTitle: i18n.t('stories.newStory'),
        headerTitleContainerStyle: {
            left: 58,
        },
    };
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
