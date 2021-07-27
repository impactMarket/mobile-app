import CacheImage from 'components/CacheImage';
import { chooseMediaThumbnail } from 'helpers/index';
import { AppMediaContent } from 'helpers/types/models';
import React, { useState } from 'react';
import { useWindowDimensions, View, Image } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { ipctColors } from 'styles/index';

export default function CarouselSlide({
    media,
}: {
    media: AppMediaContent | null;
}) {
    const dimensions = useWindowDimensions();
    const [isLoading, setIsLoading] = useState(true);

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
                            uri: chooseMediaThumbnail(media, {
                                heigth: 148,
                                width: 94,
                            }),
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
                    {isLoading && (
                        <ActivityIndicator
                            color={ipctColors.blueRibbon}
                            style={{
                                zIndex: 6,
                                width: dimensions.width,
                                alignContent: 'center',
                            }}
                        />
                    )}
                    <Image
                        source={{
                            uri: media.url,
                        }}
                        style={{
                            width: dimensions.width,
                            resizeMode: 'contain',
                            zIndex: 5,
                        }}
                        onLoadEnd={() => setIsLoading(false)}
                    />
                </View>
            )}
        </View>
    );
}
