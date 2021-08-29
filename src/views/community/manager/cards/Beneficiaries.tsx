import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import Button from 'components/core/Button';
import Card from 'components/core/Card';
import { Screens } from 'helpers/constants';
import React from 'react';
import { Alert, View } from 'react-native';
import { Headline } from 'react-native-paper';

import SuspiciousActivity from './SuspiciousActivity';
interface IBeneficiariesProps {
    beneficiaries: number | undefined;
    removedBeneficiaries: number | undefined;
    hasFundsToNewBeneficiary: boolean;
    isSuspeciousDetected: boolean | null;
}

function Beneficiaries(props: IBeneficiariesProps) {
    const navigation = useNavigation();

    const {
        beneficiaries,
        removedBeneficiaries,
        hasFundsToNewBeneficiary,
        isSuspeciousDetected,
    } = props;

    return (
        <View>
            <Card>
                <Card.Content>
                    <Headline
                        style={{
                            opacity: 0.48,
                            fontFamily: 'Gelion-Bold',
                            fontSize: 13,
                            fontWeight: '500',
                            lineHeight: 12,
                            letterSpacing: 0.7,
                        }}
                    >
                        {i18n.t('generic.beneficiaries').toUpperCase()}
                    </Headline>
                    <Button
                        modeType="gray"
                        bold
                        disabled={beneficiaries === 0}
                        style={{ marginVertical: 5 }}
                        onPress={() =>
                            navigation.navigate(Screens.AddedBeneficiary)
                        }
                    >
                        {i18n.t('generic.added')} ({beneficiaries})
                    </Button>
                    <Button
                        modeType="gray"
                        bold
                        disabled={removedBeneficiaries === 0}
                        style={{ marginVertical: 5 }}
                        onPress={() =>
                            navigation.navigate(Screens.RemovedBeneficiary)
                        }
                    >
                        {i18n.t('generic.removed')} ({removedBeneficiaries})
                    </Button>
                    <View>
                        {hasFundsToNewBeneficiary ? (
                            <Button
                                modeType="green"
                                bold
                                style={{
                                    marginVertical: 5,
                                }}
                                onPress={() =>
                                    navigation.navigate(Screens.AddBeneficiary)
                                }
                            >
                                {i18n.t('manager.addBeneficiary')}
                            </Button>
                        ) : (
                            <Button
                                modeType="default"
                                icon="alert"
                                style={{
                                    marginVertical: 5,
                                    backgroundColor: '#f0ad4e',
                                }}
                                onPress={() => {
                                    Alert.alert(
                                        i18n.t('manager.noFunds'),
                                        i18n.t(
                                            'manager.notFundsToAddBeneficiary'
                                        ),
                                        [{ text: i18n.t('generic.close') }],
                                        { cancelable: false }
                                    );
                                }}
                            >
                                {i18n.t('manager.addBeneficiary')}
                            </Button>
                        )}
                        {isSuspeciousDetected && <SuspiciousActivity />}
                    </View>
                </Card.Content>
            </Card>
        </View>
    );
}

export default Beneficiaries;
