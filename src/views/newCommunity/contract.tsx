import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import renderHeader from 'components/core/HeaderBottomSheetTitle';
import Input from 'components/core/Input';
import Select from 'components/core/Select';
import { amountToCurrency } from 'helpers/currency';
import { IRootState } from 'helpers/types/state';
import React, { useContext, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { IHandles } from 'react-native-modalize/lib/options';
import { Headline, RadioButton } from 'react-native-paper';
import { Portal } from 'react-native-portalize';
import { useSelector } from 'react-redux';
import { ipctColors } from 'styles/index';

import config from '../../../config';
import { DispatchContext, formAction, StateContext } from './state';

interface HelperProps {
    helperRef: React.MutableRefObject<IHandles>;
    setHelperInfo: {
        title: React.Dispatch<React.SetStateAction<string>>;
        content: React.Dispatch<React.SetStateAction<string>>;
    };
}

function CommunityMaxClaim(props: HelperProps) {
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const [isMaxClaimValid, setIsMaxClaimValid] = useState(true);

    const exchangeRates = useSelector(
        (state: IRootState) => state.app.exchangeRates
    );

    const amountInUserCurrency = amountToCurrency(
        new BigNumber(state.maxClaim.replace(/,/g, '.')).multipliedBy(
            new BigNumber(10).pow(config.cUSDDecimals)
        ),
        state.currency.length > 0 ? state.currency : 'USD',
        exchangeRates
    );

    const handleChangeMaxClaim = (value) =>
        dispatch({
            type: formAction.SET_MAX_CLAIM,
            payload: value,
        });

    return (
        <View style={{ marginTop: 28 }}>
            <Input
                style={{
                    fontFamily: 'Gelion-Regular',
                    backgroundColor: 'transparent',
                    paddingHorizontal: 0,
                }}
                label={i18n.t('totalClaimPerBeneficiary')}
                help
                onPress={() => {
                    props.setHelperInfo.title(
                        i18n.t('totalClaimPerBeneficiary')
                    );
                    props.setHelperInfo.content(
                        i18n.t('totalClaimPerBeneficiaryHelp')
                    );
                    props.helperRef.current.open();
                }}
                value={state.maxClaim}
                placeholder="$0"
                maxLength={14}
                keyboardType="numeric"
                onChangeText={handleChangeMaxClaim}
                onEndEditing={() =>
                    setIsMaxClaimValid(
                        state.maxClaim.length > 0 &&
                            /^\d*[.,]?\d*$/.test(state.maxClaim)
                    )
                }
            />
            {/* {!isMaxClaimValid && (
                <HelperText
                    type="error"
                    padding="none"
                    visible
                    style={styles.errorText}
                >
                    {i18n.t('maxClaimAmountRequired')}
                </HelperText>
            )} */}
            {state.maxClaim.length > 0 && (
                <Text
                    style={{
                        marginTop: 14,
                        position: 'absolute',
                        marginHorizontal: 10,
                        right: 0,
                        fontFamily: 'Inter-Regular',
                        fontSize: 12,
                        lineHeight: 20,
                        color: ipctColors.regentGray,
                    }}
                >
                    {i18n.t('aroundValue', {
                        amount: amountInUserCurrency,
                    })}
                </Text>
            )}
        </View>
    );
}

function CommunityClaimFrequency(props: HelperProps) {
    const modalizeFrequencyRef = useRef<Modalize>(null);

    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    return (
        <View style={{ marginTop: 28 }}>
            <Select
                label={i18n.t('frequency')}
                help
                onHelpPress={() => {
                    props.setHelperInfo.title(i18n.t('frequency'));
                    props.setHelperInfo.content(i18n.t('frequencyHelp'));
                    props.helperRef.current.open();
                }}
                value={
                    state.baseInterval === '86400'
                        ? i18n.t('daily')
                        : i18n.t('weekly')
                }
                onPress={() => modalizeFrequencyRef.current?.open()}
            />
            <Portal>
                <Modalize
                    ref={modalizeFrequencyRef}
                    HeaderComponent={renderHeader(
                        i18n.t('frequency'),
                        modalizeFrequencyRef
                    )}
                    adjustToContentHeight
                >
                    <View
                        style={{
                            height: 120,
                            paddingLeft: 8,
                            marginBottom: 22,
                        }}
                    >
                        <RadioButton.Group
                            onValueChange={(value) => {
                                dispatch({
                                    type: formAction.SET_BASE_INTERVAL,
                                    payload: value,
                                });
                                modalizeFrequencyRef.current?.close();
                            }}
                            value={state.baseInterval}
                        >
                            <RadioButton.Item
                                label={i18n.t('daily')}
                                value="86400"
                            />
                            <RadioButton.Item
                                label={i18n.t('weekly')}
                                value="604800"
                            />
                        </RadioButton.Group>
                    </View>
                </Modalize>
            </Portal>
        </View>
    );
}

function CommunityClaimAmount(props: HelperProps) {
    const [isClaimAmountValid, setIsClaimAmountValid] = useState(true);

    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const exchangeRates = useSelector(
        (state: IRootState) => state.app.exchangeRates
    );

    const amountInUserCurrency = amountToCurrency(
        new BigNumber(state.claimAmount.replace(/,/g, '.')).multipliedBy(
            new BigNumber(10).pow(config.cUSDDecimals)
        ),
        state.currency.length > 0 ? state.currency : 'USD',
        exchangeRates
    );

    const handleChangeClaimAmount = (value) =>
        dispatch({
            type: formAction.SET_CLAIM_AMOUNT,
            payload: value,
        });

    return (
        <View>
            <View style={{ marginTop: 28 }}>
                <Input
                    style={{
                        fontFamily: 'Gelion-Regular',
                        backgroundColor: 'transparent',
                        paddingHorizontal: 0,
                    }}
                    label={i18n.t('claimAmount')}
                    help
                    onPress={() => {
                        props.setHelperInfo.title(i18n.t('claimAmount'));
                        props.setHelperInfo.content(i18n.t('claimAmountHelp'));
                        props.helperRef.current.open();
                    }}
                    value={state.claimAmount}
                    placeholder="$0"
                    maxLength={14}
                    keyboardType="numeric"
                    onChangeText={handleChangeClaimAmount}
                    onEndEditing={() =>
                        setIsClaimAmountValid(
                            state.claimAmount.length > 0 &&
                                /^\d*[.,]?\d*$/.test(state.claimAmount)
                        )
                    }
                />
                {/* {!isClaimAmountValid && (
                    <HelperText
                        type="error"
                        padding="none"
                        visible
                        style={styles.errorText}
                    >
                        {i18n.t('claimAmountRequired')}
                    </HelperText>
                )} */}
            </View>
            {state.claimAmount.length > 0 && (
                <Text
                    style={{
                        marginTop: 42,
                        position: 'absolute',
                        marginHorizontal: 10,
                        right: 0,
                        fontFamily: 'Inter-Regular',
                        fontSize: 12,
                        lineHeight: 20,
                        color: ipctColors.regentGray,
                    }}
                >
                    {i18n.t('aroundValue', {
                        amount: amountInUserCurrency,
                    })}
                </Text>
            )}
        </View>
    );
}

export default function Contract() {
    const modalizeHelperRef = useRef<Modalize>(null);
    const [helperTitle, setHelperTitle] = useState('');
    const [helperContent, setHelperContent] = useState('');

    return (
        <View>
            <Headline
                style={{
                    marginTop: 50,
                    fontFamily: 'Manrope-Bold',
                    fontSize: 15,
                    lineHeight: 24,
                }}
            >
                {i18n.t('contractDetails')}
            </Headline>
            <Text
                style={{
                    fontFamily: 'Inter-Regular',
                    fontSize: 14,
                    lineHeight: 24,
                }}
            >
                {i18n.t('contractDescriptionLabel')}
            </Text>
            <CommunityClaimAmount
                helperRef={modalizeHelperRef}
                setHelperInfo={{
                    title: setHelperTitle,
                    content: setHelperContent,
                }}
            />
            <CommunityClaimFrequency
                helperRef={modalizeHelperRef}
                setHelperInfo={{
                    title: setHelperTitle,
                    content: setHelperContent,
                }}
            />
            <CommunityMaxClaim
                helperRef={modalizeHelperRef}
                setHelperInfo={{
                    title: setHelperTitle,
                    content: setHelperContent,
                }}
            />
            <Portal>
                <Modalize ref={modalizeHelperRef} adjustToContentHeight>
                    <View
                        style={{
                            padding: 20,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'Manrope-Bold',
                                fontSize: 18,
                                lineHeight: 20,
                                textAlign: 'left',
                                marginBottom: 20,
                            }}
                        >
                            {helperTitle}
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'Inter-Regular',
                                fontSize: 14,
                                lineHeight: 20,
                                textAlign: 'left',
                            }}
                        >
                            {helperContent}
                        </Text>
                    </View>
                </Modalize>
            </Portal>
        </View>
    );
}
