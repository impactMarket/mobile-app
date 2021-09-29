import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { Pressable } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

function BackSvg(props: { onPress?: () => void }) {
    const navigation = useNavigation();
    return (
        <Pressable
            testID="back-button"
            onPress={props.onPress ? props.onPress : () => navigation.goBack()}
            hitSlop={15}
        >
            <Svg
                style={{ marginLeft: 16 }}
                width={34}
                height={34}
                viewBox="0 0 34 34"
                fill="none"
            >
                <Circle cx={16.8} cy={16.8} r={16.8} fill="#EAEDF0" />
                <Path
                    d="M13.696 17.04l7.005-6.761a.963.963 0 000-1.398l-.614-.592A1.035 1.035 0 0019.363 8c-.274 0-.532.103-.724.289l-8.34 8.05a.963.963 0 00-.299.7c0 .266.105.515.299.702l8.332 8.042c.193.186.45.288.724.288.275 0 .532-.102.725-.288l.613-.593a.966.966 0 000-1.398l-6.997-6.753z"
                    fill="#172B4D"
                />
            </Svg>
        </Pressable>
    );
}

export default BackSvg;
