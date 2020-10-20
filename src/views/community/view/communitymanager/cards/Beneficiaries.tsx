import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import {
    ICommunityInfo,
} from 'helpers/types';
import React from 'react';
import { Alert, View } from 'react-native';
import { Headline } from 'react-native-paper';
import Button from 'components/Button';
import Card from 'components/Card';

interface IBeneficiariesProps {
    community: ICommunityInfo;
    hasFundsToNewBeneficiary: boolean;
}

function Beneficiaries(props: IBeneficiariesProps) {
    const navigation = useNavigation();

    return (
        <View>
            <Card elevation={8}>
                <Card.Content>
                    <Headline
                        style={{
                            opacity: 0.48,
                            fontFamily: 'Gelion-Bold',
                            fontSize: 13,
                            fontWeight: '500',
                            fontStyle: 'normal',
                            lineHeight: 12,
                            letterSpacing: 0.7,
                        }}
                    >
                        {i18n.t('beneficiaries').toUpperCase()}
                    </Headline>
                    <Button
                        modeType="gray"
                        bold={true}
                        disabled={
                            props.community.beneficiaries.added.length === 0
                        }
                        style={{ marginVertical: 5 }}
                        onPress={() =>
                            navigation.navigate('AddedScreen', {
                                beneficiaries:
                                    props.community.beneficiaries.added,
                            })
                        }
                    >
                        {i18n.t('added')} (
                        {props.community.beneficiaries.added.length})
                    </Button>
                    <Button
                        modeType="gray"
                        bold={true}
                        disabled={
                            props.community.beneficiaries.removed.length === 0
                        }
                        style={{ marginVertical: 5 }}
                        onPress={() =>
                            navigation.navigate('RemovedScreen', {
                                beneficiaries:
                                    props.community.beneficiaries.removed,
                            })
                        }
                    >
                        {i18n.t('removed')} (
                        {props.community.beneficiaries.removed.length})
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
                                    navigation.navigate('AddBeneficiaryScreen')
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
