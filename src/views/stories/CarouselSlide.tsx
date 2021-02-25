import CacheImage from 'components/CacheImage';
import { ICommunityStory } from 'helpers/types/endpoints';
import React from 'react';
import { useWindowDimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function CarouselSlide({ data }: { data: ICommunityStory }) {
    const dimensions = useWindowDimensions();

    return (
        <View
            style={{
                height: dimensions.height,
                width: dimensions.width,
                flexDirection: 'row',
                zIndex: -1,
                position: 'absolute',
            }}
        >
            {data.media && (
                <View style={{ flexDirection: 'row' }}>
                    <CacheImage
                        source={{
                            uri: data.media,
                        }}
                        style={{
                            width: dimensions.width,
                            height: dimensions.height,
                            resizeMode: 'cover',
                            zIndex: 4,
                            position: 'absolute',
                        }}
                        blurRadius={8}
                    />
                    <CacheImage
                        source={{
                            uri: data.media,
                        }}
                        style={{
                            width: dimensions.width,
                            resizeMode: 'contain',
                            zIndex: 5,
                        }}
                    />
                </View>
            )}
        </View>
    );
}
