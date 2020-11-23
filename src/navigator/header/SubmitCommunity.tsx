import React, { useState } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import i18n from 'assets/i18n';

function SubmitCommunity() {
    return (
        <View style={{ flex: 1, flexDirection: 'row', marginTop: 16 }}>
            <Text
                style={{
                    fontFamily: 'Gelion-Bold',
                    fontSize: 22,
                    lineHeight: 22, // TODO: design is 26
                    textAlign: 'center',
                    letterSpacing: 0.366667,
                    color: '#2643E9',
                    // marginLeft: 8.4,
                    marginRight: 16,
                }}
                // onPress={handleLogout}
                // loading={logingOut}
                // disabled={logingOut}
            >
                {i18n.t('submit')}
            </Text>
        </View>
    )
}

export default SubmitCommunity
