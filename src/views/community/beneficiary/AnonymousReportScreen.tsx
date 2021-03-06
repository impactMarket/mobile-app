import React, { useState, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { IRootState } from 'helpers/types/state';
import i18n from 'assets/i18n';
import Input from 'components/core/Input';
import BackSvg from 'components/svg/header/BackSvg';
import SubmitStory from 'navigator/header/SubmitStory';
import Api from 'services/api';
import { ipctColors } from 'styles/index';
import { Paragraph } from 'react-native-paper';

function AnonymousReportScreen() {
    const navigation = useNavigation();
    const [reportInput, setReportInput] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submittedWithSuccess, setSubmittedWithSuccess] = useState(false);

    const userCommunity = useSelector(
        (state: IRootState) => state.user.community.metadata
    );

    useLayoutEffect(() => {
        if (userCommunity.publicId !== undefined) {
            navigation.setOptions({
                headerRight: () => (
                    <SubmitStory
                        disabled={reportInput.length === 0}
                        submit={submitReport}
                        submitting={submitting}
                    />
                ),
            });
        }
    }, [
        navigation,
        reportInput,
        submitting,
        userCommunity,
        submittedWithSuccess,
    ]);

    const submitReport = () => {
        if (reportInput.length === 0) {
            return;
        }
        setSubmitting(true);
        Api.user
            .report(userCommunity.publicId, reportInput)
            .then((r) => {
                Alert.alert(
                    i18n.t('success'),
                    i18n.t('reportIlegal.alertCongrat'),
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
                setSubmittedWithSuccess(true);
                navigation.goBack();
            })
            .catch((e) => {
                Alert.alert(
                    i18n.t('failure'),
                    i18n.t('reportIlegal.alertFailure'),
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    return (
        <View
            style={{
                padding: 22,
            }}
        >
            <Text
                style={{
                    fontFamily: 'Gelion-Regular',
                    fontSize: 17,
                    lineHeight: 21,
                    color: ipctColors.nileBlue,
                }}
            >
                {i18n.t('reportIlegal.message')}
            </Text>
            <Input
                placeholder={i18n.t('reportIlegal.label')}
                multiline={true}
                numberOfLines={6}
                value={reportInput}
                maxLength={256}
                onChangeText={(value) => setReportInput(value)}
                isBig
                // isReportInput
                style={{ fontFamily: 'Gelion-Regular', fontSize: 17 }}
            />
        </View>
    );
}

AnonymousReportScreen.navigationOptions = ({
    submitReport,
    submitting,
    disabled,
}: {
    submitReport: () => void;
    submitting: boolean;
    disabled: boolean;
}) => {
    return {
        headerLeft: () => <BackSvg />,
        headerTitle: i18n.t('report'),
        headerRight: () => (
            <SubmitStory
                submit={submitReport}
                submitting={submitting}
                disabled={disabled}
            />
        ),
    };
};

export default AnonymousReportScreen;
