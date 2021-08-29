import React from 'react';
import { Text } from 'react-native';

export default function Dot() {
    return (
        <Text
            style={{
                marginHorizontal: 4,
                fontFamily: 'Inter-Regular',
                fontSize: 12,
                lineHeight: 20,
                color: '#73839D',
            }}
        >
            ·
        </Text>
    );
}
