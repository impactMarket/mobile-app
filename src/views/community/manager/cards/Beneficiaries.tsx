import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import React from 'react';
import { Alert, View } from 'react-native';
import { Headline } from 'react-native-paper';
import Button from 'components/core/Button';
import Card from 'components/core/Card';
import { Screens } from 'helpers/constants';

interface IBeneficiariesProps {
    beneficiaries: {
        active: number;
        inactive: number;
    };
    hasFundsToNewBeneficiary: boolean;
}

function Beneficiaries(props: IBeneficiariesProps) {
    const navigation = useNavigation();

    const { active, inactive } = props.beneficiaries;

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
                        {i18n.t('beneficiaries').toUpperCase()}
                    </Headline>
                    <Button
                        modeType="gray"
                        bold={true}
                        disabled={active === 0}
                        style={{ marginVertical: 5 }}
                        onPress={() =>
                            navigation.navigate(Screens.AddedBeneficiary)
                        }
                    >
                        {i18n.t('added')} ({active})
                    </Button>
                    <Button
                        modeType="gray"
                        bold={true}
                        disabled={inactive === 0}
                        style={{ marginVertical: 5 }}
                        onPress={() =>
                            navigation.navigate(Screens.RemovedBeneficiary)
                        }
                    >
                        {i18n.t('removed')} ({inactive})
                    </Button>
                    <View>
                        {props.hasFundsToNewBeneficiary ? (
                            <Button
                                modeType="green"
                                bold={true}
                                style={{
                                    marginVertical: 5,
                                }}
                                onPress={() =>
                                    navigation.navigate(Screens.AddBeneficiary)
                                }
                            >
                                {i18n.t('addBeneficiary')}
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
                                        i18n.t('noFunds'),
                                        i18n.t('notFundsToAddBeneficiary'),
                                        [{ text: i18n.t('close') }],
                                        { cancelable: false }
                                    );
                                }}
                            >
                                {i18n.t('addBeneficiary')}
                            </Button>
                        )}
                    </View>
                </Card.Content>
            </Card>
        </View>
    );
}

export default Beneficiaries;
