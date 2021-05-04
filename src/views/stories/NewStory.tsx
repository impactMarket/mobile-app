import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import Button from 'components/core/Button';
import Input from 'components/core/Input';
import CloseStorySvg from 'components/svg/CloseStorySvg';
import BackSvg from 'components/svg/header/BackSvg';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import { Screens } from 'helpers/constants';
import { AppMediaContent } from 'helpers/types/models';
import { IRootState } from 'helpers/types/state';
import { StoryContent } from 'helpers/types/story/storyContent';
import SubmitStory from 'navigator/header/SubmitStory';
import React, { useLayoutEffect, useState } from 'react';
import {
    View,
    Text,
    ImageBackground,
    Alert,
    useWindowDimensions,
    StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Api from 'services/api';

import Container from './Container';

function NewStoryScreen() {
    const dimensions = useWindowDimensions();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [storyText, setStoryText] = useState('');
    const [storyMedia, setStoryMedia] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitedResult, setSubmitedResult] = useState<
        StoryContent | undefined
    >();
    const [submittedWithSuccess, setSubmittedWithSuccess] = useState(false);
    const userAddress = useSelector(
        (state: IRootState) => state.user.wallet.address
    );
    const userCommunity = useSelector(
        (state: IRootState) => state.user.community.metadata
    );
    const userCommunityStatus = useSelector(
        (state: IRootState) => state.user.community.metadata?.status
    );

    useLayoutEffect(() => {
        if (userCommunity?.id !== undefined) {
            navigation.setOptions({
                headerShown: !submittedWithSuccess,
                headerRight: () => (
                    <SubmitStory
                        submit={submitNewStory}
                        submitting={submitting}
                        disabled={false}
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
    ]);

    const submitNewStory = async () => {
        setSubmitting(true);
        try {
            let media: AppMediaContent | undefined;
            if (storyMedia.length > 0) {
                media = await Api.story.addPicture(storyMedia);
            }
            const r = await Api.story.add({
                communityId: userCommunity.id,
                message: storyText.length > 0 ? storyText : undefined,
                mediaId: media?.id,
            });
            setSubmitedResult(r);
            Alert.alert(
                i18n.t('success'),
                i18n.t('storyCongrat'),
                [{ text: 'OK' }],
                { cancelable: false }
            );
            setSubmittedWithSuccess(true);
        } catch (e) {
            Alert.alert(
                i18n.t('failure'),
                i18n.t('storyFailure'),
                [{ text: 'OK' }],
                { cancelable: false }
            );
        } finally {
            setSubmitting(false);
        }
    };

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert(i18n.t('storyPermissionCamera'));
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            // allowsEditing: true,
            // aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled) {
            setStoryMedia(result.uri);
        }
    };

    if (userCommunity?.id === undefined || userCommunityStatus !== 'valid') {
        return <Text>{i18n.t('notInComunity')}</Text>;
    }
    // TODO: most of the code above is repeated from Carousel
    // make it reusable!
    if (submittedWithSuccess && submitedResult) {
        return (
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <StatusBar hidden />
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        width: dimensions.width,
                        justifyContent: 'space-between',
                        paddingTop: 20,
                    }}
                >
                    {/* <Container
                        media={submitedResult.media!} // can be null, not undefined
                        story={userCommunity}
                    /> */}
                    <View style={{ width: '100%' }}>
                        <Text
                            style={{
                                fontFamily: 'Gelion-Regular',
                                fontSize: 20,
                                lineHeight: 24,
                                color: 'white',
                                textAlign: 'left',
                                marginHorizontal: 22,
                            }}
                        >
                            {storyText}
                        </Text>
                        <View
                            style={{
                                marginVertical: 27,
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                            }}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.donateLabel}>-- Loves</Text>
                            </View>
                            <Button
                                modeType="green"
                                bold
                                style={styles.donate}
                                labelStyle={styles.donateLabel}
                                onPress={() =>
                                    navigation.navigate(
                                        Screens.CommunityDetails,
                                        {
                                            communityId: userCommunity.publicId,
                                            openDonate: true,
                                        }
                                    )
                                }
                            >
                                {i18n.t('donate')}
                            </Button>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={{ marginHorizontal: 18, marginTop: 14 }}>
            <Input
                label="Story Post Text · Optional"
                multiline
                numberOfLines={4}
                value={storyText}
                maxLength={256}
                onChangeText={(value) => setStoryText(value)}
                isBig
            />
            <Button
                modeType="default"
                bold
                onPress={() => pickImage()}
                style={{ width: '100%', marginVertical: 24 }}
            >
                {i18n.t('attach')}
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
    );
}

const styles = StyleSheet.create({
    donate: {
        borderRadius: 5,
        width: 158,
        height: 39,
    },
    donateLabel: {
        fontFamily: 'Gelion-Regular',
        fontSize: 16,
        lineHeight: 19,
        color: 'white',
        letterSpacing: 0.3,
    },
});

NewStoryScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
        headerTitle: i18n.t('newStory'),
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

export default NewStoryScreen;
