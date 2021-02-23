import Button from 'components/core/Button';
import Input from 'components/core/Input';
import BackSvg from 'components/svg/header/BackSvg';
import React, { useLayoutEffect, useState } from 'react';
import { View, Text, Image, ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CloseStorySvg from 'components/svg/CloseStorySvg';
import { useNavigation } from '@react-navigation/native';
import SubmitStory from 'navigator/header/SubmitStory';
import Api from 'services/api';
import { useSelector } from 'react-redux';
import { IRootState } from 'helpers/types/state';

function NewStoryScreen() {
    const navigation = useNavigation();
    const [storyText, setStoryText] = useState('');
    const [storyMedia, setStoryMedia] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const userAddress = useSelector(
        (state: IRootState) => state.user.wallet.address
    );
    const userCommunityId = useSelector(
        (state: IRootState) => state.user.community.metadata?.id
    );
    const userCommunityStatus = useSelector(
        (state: IRootState) => state.user.community.metadata?.status
    );

    useLayoutEffect(() => {
        if (userCommunityId !== undefined) {
            navigation.setOptions({
                headerRight: () => (
                    <SubmitStory
                        submit={submitNewStory}
                        submitting={submitting}
                    />
                ),
            });
            // TODO: this next line should change though.
        }
    }, [navigation, storyText, storyMedia, submitting, userCommunityId]);

    const submitNewStory = () => {
        setSubmitting(true);
        Api.story
            .add(storyMedia, userCommunityId, storyText, userAddress)
            .then((r) => {
                navigation.goBack();
                console.log(r);
                // show success message
            })
            .catch((e) => {
                console.log(e);
                // error submitting
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    const pickImage = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert('Permission to access camera roll is required!');
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

    if (userCommunityId === undefined || userCommunityStatus !== 'valid') {
        return <Text>Not in a community!</Text>;
    }

    return (
        <View style={{ marginHorizontal: 18 }}>
            <Input
                label="Story Post Text · Optional"
                multiline={true}
                numberOfLines={4}
                value={storyText}
                maxLength={256}
                onChangeText={(value) => setStoryText(value)}
            />
            <Button
                modeType="default"
                bold
                onPress={() => pickImage()}
                style={{ width: '100%', marginVertical: 24 }}
            >
                Attach
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
                        onPress={(e) => setStoryMedia('')}
                    />
                </ImageBackground>
            )}
        </View>
    );
}

NewStoryScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
        headerTitle: 'New Story',
    };
};

export default NewStoryScreen;
