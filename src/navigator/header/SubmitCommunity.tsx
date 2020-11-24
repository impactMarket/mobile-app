import React from 'react';
import { View, Text } from 'react-native';
import i18n from 'assets/i18n';
import { Button } from 'react-native-paper';

function SubmitCommunity() {
    return (
        <View style={{ flex: 1, flexDirection: 'row', marginTop: 16 }}>
            <Button
                mode="text"
                uppercase={false}
                labelStyle={{
                    fontFamily: 'Gelion-Bold',
                    fontSize: 22,
                    lineHeight: 26,
                    textAlign: 'center',
                    letterSpacing: 0.366667,
                    color: '#2643E9',
                    // marginLeft: 8.4,
                    marginRight: 16,
                }}
            >
                {i18n.t('submit')}
            </Button>
        </View>
    )
}

export default SubmitCommunity
