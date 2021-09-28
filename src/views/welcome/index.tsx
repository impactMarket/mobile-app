import { RouteProp } from '@react-navigation/native';
import i18n from 'assets/i18n';
import Button from 'components/core/Button';
import DiversitySvg from 'components/svg/welcome/DiversitySvg';
import LogoBlueSvg from 'components/svg/welcome/LogoBlueSvg';
import { Screens } from 'helpers/constants';
import {
    SetAppFromWelcomeScreen,
    setOpenAuthModal,
} from 'helpers/redux/actions/app';
import React, { useState } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { ipctColors } from 'styles/index';

function Welcome() {
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();
    const [redirecting, setRedirecting] = useState(false);
    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-between',
                paddingTop: insets.top,
            }}
        >
            <ScrollView>
                <View
                    style={{
                        alignItems: 'center',
                    }}
                >
                    <LogoBlueSvg style={{ height: 74, marginTop: 25 }} />
                </View>
                <DiversitySvg
                    width={Dimensions.get('screen').width}
                    style={{
                        maxHeight: 136,
                        minHeight: 116,
                        marginTop: 16,
                    }}
                />
                <Text
                    style={{
                        paddingHorizontal: 33,
                        marginTop: 37,
                        fontFamily: 'Gelion-Regular',
                        fontSize: 17,
                        lineHeight: 24,
                        textAlign: 'center',
                        color: ipctColors.nileBlue,
                    }}
                >
                    {i18n.t('generic.oneTimeWelcomeMessage1')}
                </Text>
            </ScrollView>
            <View
                testID="welcomeBtnContainer"
                style={{
                    paddingHorizontal: 30,
                    width: '100%',
                }}
            >
                <Button
                    modeType="green"
                    bold
                    style={{
                        width: '100%',
                    }}
                    labelStyle={{
                        fontSize: 20,
                        lineHeight: 20,
                    }}
                    disabled={redirecting}
                    onPress={() => {
                        setRedirecting(true);
                        dispatch(SetAppFromWelcomeScreen(Screens.Communities));
                        dispatch(setOpenAuthModal(true));
                    }}
                >
                    {i18n.t('auth.connectWithValora')}
                </Button>
                <Button
                    modeType="gray"
                    bold
                    style={{
                        marginTop: 16,
                        marginBottom: 41,
                        width: '100%',
                    }}
                    labelStyle={{
                        fontSize: 18,
                        lineHeight: 18,
                        letterSpacing: 0.3,
                    }}
                    disabled={redirecting}
                    onPress={() => {
                        setRedirecting(true);
                        dispatch(SetAppFromWelcomeScreen(Screens.Communities));
                    }}
                >
                    {i18n.t('generic.exploreCommunities')}
                </Button>
            </View>
        </View>
    );
}

Welcome.navigationOptions = ({ route }: { route: RouteProp<any, any> }) => {
    return {
        headerShown: false,
    };
};

export default Welcome;
