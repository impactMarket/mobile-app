import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import Button from 'components/core/Button';
import renderHeader from 'components/core/HeaderBottomSheetTitle';
import Input from 'components/core/Input';
import Select from 'components/core/Select';
import CloseStorySvg from 'components/svg/CloseStorySvg';
import BackSvg from 'components/svg/header/BackSvg';
import { docsURL } from 'helpers/index';
import { IRootState } from 'helpers/types/state';
import SubmitStory from 'navigator/header/SubmitStory';
import React, { useState, useLayoutEffect, useRef } from 'react';
import { View, Text, Alert, Image } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal, RadioButton, Modal, Card } from 'react-native-paper';
import WebView from 'react-native-webview';
import { useSelector } from 'react-redux';
import Api from 'services/api';
import { ipctColors } from 'styles/index';

function AnonymousReportScreen() {
    const navigation = useNavigation();
    const modalizeCategoryRef = useRef<Modalize>(null);
    const [reportInput, setReportInput] = useState('');
    const [category, setCategory] = useState<string | undefined>();
    const [submitting, setSubmitting] = useState(false);
    const [submittedWithSuccess, setSubmittedWithSuccess] = useState(false);
    const [isVisible, setVisible] = useState(false);
    const [showWebview, setShowWebview] = useState(false);

    const [isValidCategory, setIsValidCategory] = useState(true);
    const [isValidDescription, setIsValidDescription] = useState(true);

    const userCommunity = useSelector(
        (state: IRootState) => state.user.community.metadata
    );
    const { language } = useSelector(
        (state: IRootState) => state.user.metadata
    );

    useLayoutEffect(() => {
        const submitReport = () => {
            const isValid = reportInput.length > 0 && category !== undefined;
            setIsValidDescription(reportInput.length > 0);
            setIsValidCategory(category !== undefined);
            if (!isValid) {
                return;
            }
            setSubmitting(true);
            Api.user
                .report(userCommunity.id, reportInput, category)
                .then((_) => {
                    setSubmittedWithSuccess(true);
                })
                .catch(() => {
                    Alert.alert(
                        i18n.t('generic.failure'),
                        i18n.t('report.alertFailure'),
                        [{ text: 'OK' }],
                        { cancelable: false }
                    );
                })
                .finally(() => {
                    setSubmitting(false);
                });
        };
        if (userCommunity.publicId !== undefined) {
            navigation.setOptions({
                headerLeft: () => <BackSvg />,
                headerRight: () => (
                    <SubmitStory
                        disabled={false}
                        submit={submitReport}
                        submitting={submitting}
                    />
                ),
            });
        } else if (showWebview) {
            navigation.setOptions({
                headerLeft: null,
                headerRight: () => (
                    <CloseStorySvg
                        style={{ marginRight: 26 }}
                        onPress={() => {
                            setShowWebview(false);
                        }}
                    />
                ),
            });
        }
    }, [submitting, userCommunity, showWebview, reportInput, category]);

    const errorCategory = isValidCategory
        ? null
        : i18n.t('report.categoryIsRequired');
    const errorDescription = isValidDescription
        ? null
        : i18n.t('report.descriptionIsRequired');

    const textCategory = (g: string | undefined) => {
        switch (g) {
            case 'general':
                return i18n.t('report.general');
            case 'potential-fraud':
                return i18n.t('report.potencialFraud');
            default:
                return i18n.t('report.selectCategory');
        }
    };

    const handleChangeCategory = async (category: string | undefined) => {
        setCategory(category);
        setIsValidCategory(true);
        modalizeCategoryRef.current?.close();
    };

    const HelpWebview = () => {
        if (!showWebview) {
            return null;
        }
        return (
            <>
                {isVisible ? (
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Image
                            style={{
                                height: 58,
                                width: 58,
                                alignSelf: 'center',
                            }}
                            source={require('../../../../src/assets/images/waitingTx.gif')}
                        />
                    </View>
                ) : null}
                <WebView
                    originWhitelist={['*']}
                    source={{
                        uri: docsURL('/general/anonymous-reporting', language),
                    }}
                    javaScriptEnabled
                    domStorageEnabled
                    onLoadStart={() => setVisible(true)}
                    onLoad={() => setVisible(false)}
                />
            </>
        );
    };

    const SuccessSubmission = () => {
        if (!submittedWithSuccess) {
            return null;
        }
        return (
            <Modal visible dismissable={false}>
                <Card
                    style={{
                        marginHorizontal: 20,
                        borderRadius: 8,
                    }}
                >
                    <Card.Content
                        style={{
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'Gelion-Regular',
                                fontSize: 17,
                                lineHeight: 21,
                                color: ipctColors.nileBlue,
                                marginBottom: 16,
                                textAlign: 'center',
                            }}
                        >
                            {i18n.t('report.alertCongrat')}
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'Gelion-Regular',
                                fontSize: 17,
                                lineHeight: 21,
                                color: ipctColors.blueRibbon,
                                marginBottom: 16,
                                textAlign: 'center',
                            }}
                            onPress={() => {
                                setSubmittedWithSuccess(true);
                                setShowWebview(true);
                            }}
                        >
                            {i18n.t('report.alertCongratLink')}
                        </Text>
                        <Button
                            modeType="gray"
                            style={{
                                backgroundColor: 'rgba(206, 212, 218, .27)',
                                width: '100%',
                            }}
                            labelStyle={{
                                fontSize: 15,
                                lineHeight: 18,
                            }}
                            onPress={() => navigation.goBack()}
                        >
                            {i18n.t('generic.continue')}
                        </Button>
                    </Card.Content>
                </Card>
            </Modal>
        );
    };

    const Categories = () => (
        <View style={{ flex: 1, height: '50%', paddingLeft: 8 }}>
            <RadioButton.Group
                onValueChange={(value) => {
                    handleChangeCategory(value);
                }}
                value={category ? category : ''}
            >
                <RadioButton.Item
                    key="general"
                    label={i18n.t('report.general')}
                    value="general"
                />
                <RadioButton.Item
                    key="potential-fraud"
                    label={i18n.t('report.potencialFraud')}
                    value="potential-fraud"
                />
            </RadioButton.Group>
        </View>
    );

    return (
        <>
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
                        marginBottom: 16,
                    }}
                >
                    {i18n.t('report.message')}
                </Text>
                <Text
                    style={{
                        fontFamily: 'Gelion-Regular',
                        fontSize: 17,
                        lineHeight: 21,
                        color: ipctColors.blueRibbon,
                        marginBottom: 16,
                    }}
                    onPress={() => {
                        setShowWebview(true);
                    }}
                >
                    {i18n.t('report.alertCongratLink')}
                </Text>
                <View style={{ marginBottom: 28 }}>
                    <Select
                        label={i18n.t('report.category')}
                        value={textCategory(category)}
                        error={errorCategory}
                        onPress={() => {
                            modalizeCategoryRef.current?.open();
                        }}
                    />
                </View>
                <Input
                    label={i18n.t('report.label')}
                    multiline
                    numberOfLines={12}
                    value={reportInput}
                    maxLength={256}
                    error={errorDescription}
                    isBig
                    onChangeText={(value) => setReportInput(value)}
                    onEndEditing={(_) =>
                        setIsValidDescription(reportInput.length > 0)
                    }
                    style={{
                        fontFamily: 'Gelion-Regular',
                        fontSize: 17,
                    }}
                />
            </View>
            <Portal>
                <SuccessSubmission />
                <HelpWebview />
                <Modalize
                    ref={modalizeCategoryRef}
                    HeaderComponent={renderHeader(
                        i18n.t('report.category'),
                        modalizeCategoryRef
                    )}
                    adjustToContentHeight
                >
                    <Categories />
                </Modalize>
            </Portal>
        </>
    );
}

AnonymousReportScreen.navigationOptions = () => {
    return {
        headerTitle: i18n.t('report.report'),
    };
};

export default AnonymousReportScreen;
