import React from 'react';
import { Text } from 'react-native';
import { ipctColors } from 'styles/index';

export default function Dot() {
    return (
        <Text
            style={{
                marginHorizontal: 4,
                fontFamily: 'Inter-Regular',
                fontSize: 12,
                lineHeight: 20,
                color: ipctColors.blueGray,
            }}
        >
            ·
        </Text>
    );
}
