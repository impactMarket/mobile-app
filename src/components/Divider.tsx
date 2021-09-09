import React from 'react';
import { View } from 'react-native';
import { ipctColors } from 'styles/index';

export default function Divider() {
    return (
        <View
            style={{
                borderColor: ipctColors.softGray,
                borderWidth: 0.5,
                marginVertical: 32,
            }}
        />
    );
}
