import { useNavigation } from '@react-navigation/native';
import { Screens } from 'helpers/constants';
import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { scale } from 'react-native-size-matters';
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
                    width: scale(98),
                    height: 167,
                    borderRadius: 8,
                    marginHorizontal: 4,
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
                        justifyContent: 'center',
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
                    maxWidth: 100,
                    minWidth: 90,
                }}
            >
                {props.communityName?.length > 18
                    ? props.communityName.substr(0, 17) + '...'
                    : props.communityName}
            </Text>
        </View>
    );
}
