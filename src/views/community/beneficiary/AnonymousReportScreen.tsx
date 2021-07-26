import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import Button from 'components/core/Button';
import renderHeader from 'components/core/HeaderBottomSheetTitle';
import Input from 'components/core/Input';
import Select from 'components/core/Select';
import CloseStorySvg from 'components/svg/CloseStorySvg';
import BackSvg from 'components/svg/header/BackSvg';
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

    const userCommunity = useSelector(
        (state: IRootState) => state.user.community.metadata
    );

    useLayoutEffect(() => {
        if (userCommunity.publicId !== undefined) {
            navigation.setOptions({
                headerLeft: () => <BackSvg />,
                headerRight: () => (
                    <SubmitStory
                        disabled={reportInput.length === 0}
                        submit={submitReport}
                        submitting={submitting}
                    />
                ),
            });
        }
        if (showWebview) {
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
    }, [
        navigation,
        reportInput,
        submitting,
        userCommunity,
        submittedWithSuccess,
        showWebview,
    ]);

    const submitReport = () => {
        if (reportInput.length === 0) {
            return;
        }
        setSubmitting(true);
        Api.user
            .report(userCommunity.id, reportInput, category)
            .then((r) => {
                setSubmittedWithSuccess(true);
                navigation.goBack();
            })
            .catch(() => {
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

    const textCategory = (g: string | undefined) => {
        switch (g) {
            case 'general':
                return i18n.t('reportIlegal.general');
            case 'potential-fraud':
                return i18n.t('reportIlegal.potencialFraud');
            default:
                return i18n.t('reportIlegal.selectCategory');
        }
    };

    const handleChangeCategory = async (category: string | undefined) => {
        setCategory(category);
        modalizeCategoryRef.current?.close();
    };

    const renderWebview = () => {
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
                        uri:
                            'https://docs.impactmarket.com/general/anonymous-reporting',
                    }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    onLoadStart={() => setVisible(true)}
                    onLoad={() => setVisible(false)}
                />
            </>
        );
    };

    const renderSubmitSuccessModal = () => (
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
                        {i18n.t('reportIlegal.alertCongrat')}
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
                        {i18n.t('reportIlegal.alertCongratLink')}
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
                        {i18n.t('continue')}
                    </Button>
                </Card.Content>
            </Card>
        </Modal>
    );

    const renderCategoryContent = () => (
        <View style={{ flex: 1, height: '50%', paddingLeft: 8 }}>
            <RadioButton.Group
                onValueChange={(value) => {
                    handleChangeCategory(value);
                }}
                value={category ? category : ''}
            >
                <RadioButton.Item
                    key="general"
                    label={i18n.t('reportIlegal.general')}
                    value="general"
                />
                <RadioButton.Item
                    key="potential-fraud"
                    label={i18n.t('reportIlegal.potencialFraud')}
                    value="potential-fraud"
                />
            </RadioButton.Group>
        </View>
    );

    return (
        <>
            {submittedWithSuccess ? (
                renderSubmitSuccessModal()
            ) : showWebview ? (
                renderWebview()
            ) : (
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
                        {i18n.t('reportIlegal.message')}
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
                        {i18n.t('reportIlegal.alertCongratLink')}
                    </Text>
                    <View style={{ marginBottom: 28 }}>
                        <Select
                            label={i18n.t('reportIlegal.category')}
                            value={textCategory(category)}
                            onPress={() => {
                                modalizeCategoryRef.current?.open();
                            }}
                        />
                    </View>
                    <Input
                        label={i18n.t('reportIlegal.label')}
                        multiline
                        numberOfLines={12}
                        value={reportInput}
                        maxLength={256}
                        isBig
                        onChangeText={(value) => setReportInput(value)}
                        style={{
                            fontFamily: 'Gelion-Regular',
                            fontSize: 17,
                        }}
                    />
                </View>
            )}
            <Portal>
                <Modalize
                    ref={modalizeCategoryRef}
                    HeaderComponent={renderHeader(
                        i18n.t('reportIlegal.category'),
                        modalizeCategoryRef
                    )}
                    adjustToContentHeight
                >
                    {renderCategoryContent()}
                </Modalize>
            </Portal>
        </>
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
