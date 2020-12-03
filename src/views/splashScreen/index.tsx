import React from 'react';
import { StatusBar, View } from 'react-native';
import { iptcColors } from 'styles/index';
import LogoWhiteSvg from './LogoWhiteSvg';

function SplashScreen() {
    return (
        <>
            <StatusBar backgroundColor="rgba(0, 0, 0, 0)" translucent />
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: iptcColors.blueRibbon,
                    // height: '100%',
                }}
            >
                <LogoWhiteSvg />
            </View>
        </>
    );
}

export default SplashScreen;
