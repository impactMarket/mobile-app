import CacheImage from 'components/CacheImage';
import React from 'react';
import { useWindowDimensions, View } from 'react-native';

export default function CarouselSlide({ media }: { media: string | null }) {
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
            {media && (
                <View style={{ flexDirection: 'row' }}>
                    <CacheImage
                        source={{
                            uri: media,
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
                            uri: media,
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
