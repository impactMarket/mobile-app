import React from 'react';
import { Image, SafeAreaView, View } from 'react-native';
import { Text } from 'react-native-paper';
import i18n from 'assets/i18n';
import { iptcColors } from 'helpers/index';
import Button from 'components/Button';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Welcome() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center',
                paddingTop: insets.top,
            }}
        >
            <Image
                style={{ height: 82, maxWidth: '51%' }}
                source={require('../../assets/images/splash/logo.png')}
            />
            <Image
                style={{
                    height: 136,
                    maxWidth: '100%',
                }}
                source={require('../../assets/images/splash/diversity.png')}
            />
            <View
                style={{
                    paddingHorizontal: 30,
                    width: '100%',
                }}
            >
                <Text
                    style={{
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
                <View
                    style={{
                        marginVertical: 16,
                        width: '100%',
                    }}
                >
                    <Button
                        modeType="green"
                        bold={true}
                        style={{
                            width: '100%',
                        }}
                        onPress={() => navigation.navigate('profile')}
                    >
                        {i18n.t('connectWithValora')}
                    </Button>
                    <Button
                        modeType="default"
                        bold={true}
                        style={{
                            marginVertical: 16,
                            width: '100%',
                        }}
                        onPress={() => navigation.goBack()}
                    >
                        {i18n.t('exploreCommunities')}
                    </Button>
                </View>
            </View>
        </View>
    );
}
