import Button from 'components/core/Button';
import Input from 'components/core/Input';
import BackSvg from 'components/svg/header/BackSvg';
import React, { useState } from 'react';
import { View, Text, Image, ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CloseStorySvg from 'components/svg/CloseStorySvg';

function NewStoryScreen() {
    const [storyText, setStoryText] = useState('');
    const [storyMedia, setStoryMedia] = useState('');

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