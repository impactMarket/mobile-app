import React from 'react';
import { Image, View } from 'react-native';
import { Text } from 'react-native-paper';
import i18n from 'assets/i18n';
import { iptcColors } from 'styles/index';
import Button from 'components/core/Button';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screens } from 'helpers/constants';
import LogoBlueSvg from 'components/svg/welcome/LogoBlueSvg';
import DiversitySvg from 'components/svg/welcome/DiversitySvg';

function Welcome() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-between',
                paddingTop: insets.top,
            }}
        >
            <View
                style={{
                    alignItems: 'center',
                }}
            >
                <LogoBlueSvg style={{ height: 74, marginTop: 54 }} />
                <DiversitySvg style={{ height: 136, marginTop: 22 }} />
                <Text
                    style={{
                        paddingHorizontal: 33,
                        marginTop: 38,
                        fontFamily: 'Gelion-Regular',
                        fontSize: 17,
                        lineHeight: 24,
                        letterSpacing: 0,
                        textAlign: 'center',
                        color: iptcColors.almostBlack,
                    }}
                >
                    {i18n.t('oneTimeWelcomeMessage1')}
                </Text>
            </View>
            <View
                style={{
                    paddingHorizontal: 30,
                    width: '100%',
                }}
            >
                <Button
                    modeType="green"
                    bold={true}
                    style={{
                        width: '100%',
                    }}
                    labelStyle={{
                        fontSize: 20,
                        lineHeight: 24
                    }}
                    onPress={() => navigation.navigate(Screens.Profile)}
                >
                    {i18n.t('connectWithValora')}
                </Button>
                <Button
                    modeType="gray"
                    bold={true}
                    style={{
                        marginTop: 16,
                        marginBottom: 41,
                        width: '100%',
                    }}
                    labelStyle={{
                        fontSize: 18,
                        lineHeight: 22,
                        letterSpacing: 0.3,
                    }}
                    onPress={() => navigation.goBack()}
                >
                    {i18n.t('exploreCommunities')}
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
