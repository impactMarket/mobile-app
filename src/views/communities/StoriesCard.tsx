import { useNavigation } from '@react-navigation/native';
import { Screens } from 'helpers/constants';
import React from 'react';
import { View, Text, Pressable, Image, Dimensions } from 'react-native';
import { ipctColors } from 'styles/index';

export default function StoriesCard(props: {
    imageURI: string;
    communityName: string;
    communityId: number;
}) {
    const navigation = useNavigation();

    const { height } = Dimensions.get('window');

    const isSmallScreen = height < 600;

    return (
        <View style={{ flexDirection: 'column' }}>
            <Pressable
                style={{
                    backgroundColor: ipctColors.blueRibbon,
                    minWidth: isSmallScreen ? 91.6 : 112,
                    height: 167,
                    borderRadius: 8,
                    marginHorizontal: 6,
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
