import { useNavigation } from '@react-navigation/native';
import { Screens } from 'helpers/constants';
import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { ipctColors } from 'styles/index';

export default function StoriesCard(props: {
    imageURI: string;
    communityName: string;
}) {
    const navigation = useNavigation();
    return (
        <View style={{ flexDirection: 'column' }}>
            <Pressable
                style={{
                    backgroundColor: 'blue',
                    width: 98.16,
                    height: 167,
                    borderRadius: 8,
                    marginRight: 11.84,
                    // flexDirection: 'row',
                    // alignItems: 'flex-end',
                }}
                onPress={(e) => navigation.navigate(Screens.StoriesCarousel)}
            >
                <Image
                    source={{ uri: props.imageURI }}
                    style={{
                        flex: 1,
                        // resizeMode: 'cover',
                        justifyContent: 'center',
                        // alignItems: 'flex-end',
                        borderRadius: 8,
                    }}
                />
            </Pressable>
            <Text
                style={{
                    fontFamily: 'Gelion-Bold',
                    fontSize: 13,
                    lineHeight: 16,
                    color: ipctColors.almostBlack,
                    marginTop: 8,
                    // marginHorizontal: 12,
                }}
            >
                {props.communityName}
            </Text>
        </View>
    );
}
