import { useNavigation } from '@react-navigation/native';
import { Screens } from 'helpers/constants';
import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { ipctColors } from 'styles/index';

export default function StoriesCard(props: {
    imageURI: string;
    communityName: string;
    communityId: number;
}) {
    const navigation = useNavigation();
    return (
        <View style={{ flexDirection: 'column' }}>
            <Pressable
                style={{
                    backgroundColor: ipctColors.blueRibbon,
                    width: 98.16,
                    height: 167,
                    borderRadius: 8,
                    marginRight: 11.84,
                    // alignItems: 'flex-end',
                }}
                onPress={() =>
                    navigation.navigate(Screens.StoriesCarousel, {
                        communityId: props.communityId,
                    })
                }
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
                    fontFamily: 'Inter-Regular',
                    fontSize: 12,
                    lineHeight: 20,
                    color: ipctColors.almostBlack,
                    marginTop: 8,
                    flexWrap: 'wrap',
                    width: 110,
                    // marginHorizontal: 12,
                }}
            >
                {props.communityName.length > 18
                    ? props.communityName.substr(0, 17) + '...'
                    : props.communityName}
            </Text>
        </View>
    );
}
