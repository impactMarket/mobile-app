import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import Button from 'components/core/Button';
import SuccessSvg from 'components/svg/SuccessSvg';
import { IRootState } from 'helpers/types/state';
import React from 'react';
import { View, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { ipctColors } from 'styles/index';

function WaitingTxScreen() {
    const navigation = useNavigation();
    const inProgress = useSelector(
        (state: IRootState) => state.modalDonate.inProgress
    );
    const donationValues = useSelector(
        (state: IRootState) => state.modalDonate.donationValues
    );

    return (
        <View
            style={{
                flex: 2,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <View
                style={{
                    flex: 0.9,
                    flexDirection: 'row-reverse',
                    alignItems: 'flex-end',
                }}
            >
                {inProgress ? (
                    <Image
                        style={{
                            height: 58,
                            width: 58,
                        }}
                        source={require('../../../../assets/images/waitingTx.gif')}
                    />
                ) : (
                    <SuccessSvg />
                )}
            </View>
            <View
                style={{
                    flex: 1.1,
                    justifyContent: 'space-between',
                }}
            >
                <View>
                    <Text
                        style={{
                            marginTop: 14,
                            fontFamily: 'Gelion-Bold',
                            fontSize: 24,
                            lineHeight: 29,
                            textAlign: 'center',
                            color: ipctColors.almostBlack,
                        }}
                    >
                        {inProgress
                            ? i18n.t('generic.pleaseWait')
                            : i18n.t('generic.thankYou')}
                    </Text>
                    <Text
                        style={{
                            marginTop: 29,
                            marginHorizontal: 100,
                            fontSize: 18,
                            lineHeight: 22,
                            textAlign: 'center',
                            color: ipctColors.almostBlack,
                        }}
                    >
                        {inProgress
                            ? i18n.t('donationBeingProcessed')
                            : i18n.t('yourDonationWillBackFor', {
                                  backNBeneficiaries:
                                      donationValues.backNBeneficiaries,
                                  backForDays: donationValues.backForDays,
                              })}
                    </Text>
                </View>
                <Button
                    modeType="default"
                    bold
                    style={{
                        margin: 40,
                        display: inProgress ? 'none' : 'flex',
                    }}
                    onPress={() => navigation.goBack()}
                >
                    {i18n.t('generic.continue')}
                </Button>
            </View>
        </View>
    );
}

WaitingTxScreen.navigationOptions = () => {
    return {
        headerShown: false,
    };
};

export default WaitingTxScreen;
