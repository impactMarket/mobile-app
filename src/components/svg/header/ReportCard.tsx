import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'assets/i18n';
import { SHOW_REPORT_CARD } from 'helpers/constants';
import * as React from 'react';
import { View, Dimensions } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';

import AnonymousIconCardSvg from '../AnonymousIconCardSvg';

const ReportCard = ({
    setOpenModal,
}: {
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const registerFirstAccessReport = async () => {
        await AsyncStorage.setItem(SHOW_REPORT_CARD, 'false');
    };

    React.useEffect(() => {
        registerFirstAccessReport();
    });

    return (
        <View
            style={{
                position: 'absolute',
                backgroundColor: 'rgba(255, 255, 255)',
                top: Dimensions.get('screen').height * 0.12,
                right: Dimensions.get('screen').width * 0.05,
                width: Dimensions.get('screen').width * 0.9,
                height: Dimensions.get('screen').height * 0.23,
            }}
        >
            <Card
                style={{
                    borderRadius: 12,
                }}
            >
                <Card.Title
                    title={i18n.t('reportIlegal.title')}
                    right={(props) => (
                        <IconButton
                            {...props}
                            icon="close"
                            size={24}
                            onPress={() => setOpenModal(false)}
                        />
                    )}
                    titleStyle={{ fontFamily: 'Gelion-Bold', fontSize: 18 }}
                />
                <View
                    style={{
                        flexDirection: 'row',
                        padding: 20,
                    }}
                >
                    <View
                        style={{
                            width: '70%',
                            display: 'flex',
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'Gelion-Regular',
                                fontSize: 15,
                            }}
                        >
                            {i18n.t('reportIlegal.message')}
                        </Text>
                    </View>
                    <View
                        style={{
                            width: '30%',
                            display: 'flex',
                            alignItems: 'flex-end',
                        }}
                    >
                        <AnonymousIconCardSvg />
                    </View>
                </View>
            </Card>
        </View>
    );
};

export default ReportCard;
