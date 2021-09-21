import ShimmerPlaceholder from 'components/ShimmerPlaceholder';
import React from 'react';
import { View } from 'react-native';

export default function ShimmerText(props: {
    isShort: boolean;
    width: number;
}) {
    const { isShort, width } = props;
    return (
        <View>
            {Array(isShort === true ? 3 : 7)
                .fill(0)
                .map((_, i) => (
                    <ShimmerPlaceholder
                        key={i}
                        delay={0}
                        duration={1000}
                        isInteraction
                        width={width}
                        height={16}
                        shimmerStyle={{ borderRadius: 12 }}
                        containerProps={{ marginVertical: 4 }}
                    />
                ))}
            <ShimmerPlaceholder
                delay={0}
                duration={1000}
                isInteraction
                width={width / 2}
                height={16}
                shimmerStyle={{ borderRadius: 12 }}
                containerProps={{ marginVertical: 4 }}
            />
        </View>
    );
}
