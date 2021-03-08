import { useNavigation } from '@react-navigation/native';
import { Screens } from 'helpers/constants';
import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Card, Text, Button, IconButton } from 'react-native-paper';
import { View, Dimensions } from 'react-native';
import { SHOW_REPORT_CARD } from 'helpers/constants';

import ReportSvg from './ReportSvg';

import i18n from 'assets/i18n';

const ReportCard = ({ setOpenModal }) => {
    const navigation = useNavigation();

    const registerFirstAccessReport = async () => {
        await AsyncStorage.setItem(SHOW_REPORT_CARD, 'false');
    };

    React.useEffect(() => {
        registerFirstAccessReport();
    });

    const goToReportView = () => {
        setOpenModal(false);
        navigation.navigate(Screens.AnonymousReport);
    };

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
                        <ReportSvg isLink={false} />
                    </View>
                </View>

                <Card.Actions>
                    <Button
                        onPress={goToReportView}
                        style={{ fontFamily: 'Gelion-Bold', fontSize: 18 }}
                    >
                        {i18n.t('reportIlegal.btnText')}
                    </Button>
                </Card.Actions>
            </Card>
        </View>
    );
};

export default ReportCard;
