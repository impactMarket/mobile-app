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
import {
    DispatchContext,
    formAction,
    StateContext,
    validateField,
} from './state';

interface HelperProps {
    helperRef: React.MutableRefObject<IHandles>;
    setHelperInfo: {
        title: React.Dispatch<React.SetStateAction<string>>;
        content: React.Dispatch<React.SetStateAction<string>>;
    };
}

function CommunityMinimunExpectedDuration() {
    const state = useContext(StateContext);

    if (
        state.claimAmount.length === 0 ||
        state.maxClaim.length === 0 ||
        state.incrementInterval.length === 0
    ) {
        return null;
    }

    const totalClaims =
        parseInt(state.maxClaim, 10) / parseInt(state.claimAmount, 10);
    const estimatedSeconds = //78912420; // 2 years, 6 months, 3 days, 8 hours, 7 minutes
        parseInt(state.baseInterval, 10) * (totalClaims - 2) +
        parseInt(state.incrementInterval, 10) *
            (totalClaims - 1) *
            state.incrementIntervalUnit;

    const years = Math.floor(estimatedSeconds / 31536000);
    const months = Math.floor((estimatedSeconds % 2629800) / 86400);
    const days = Math.floor(((estimatedSeconds % 31536000) % 2629800) / 86400);
    const hours = Math.floor(((estimatedSeconds % 31536000) % 86400) / 3600);
    const minutes = Math.floor(
        (((estimatedSeconds % 31536000) % 86400) % 3600) / 60
    );

    return (
        <Text
            style={{
                marginBottom: 22,
                fontFamily: 'Manrope-Bold',
                fontSize: 18,
                lineHeight: 28,
            }}
        >
            {i18n.t('createCommunity.expectedUBIDuration', {
                years,
                months,
                days,
                hours,
                minutes,
            })}
        </Text>
    );
}

function CommunityVisibility(props: HelperProps) {
    const modalizeVisibilityRef = useRef<Modalize>(null);

    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    return (
        <View style={{ marginTop: 28, marginBottom: 22 }}>
            <Select
                label={i18n.t('createCommunity.visibility')}
                help
                onHelpPress={() => {
                    props.setHelperInfo.title(
                        i18n.t('createCommunity.visibility')
                    );
                    props.setHelperInfo.content(
                        i18n.t('createCommunity.visibilityHelp')
                    );
                    props.helperRef.current.open();
                }}
                value={
                    state.visibility === 'public'
                        ? i18n.t('createCommunity.public')
                        : i18n.t('createCommunity.private')
                }
                onPress={() => modalizeVisibilityRef.current?.open()}
            />
            <Portal>
                <Modalize
                    ref={modalizeVisibilityRef}
                    HeaderComponent={renderHeader(
                        i18n.t('createCommunity.visibility'),
                        modalizeVisibilityRef
                    )}
                    adjustToContentHeight
                >
                    <View
                        style={{
                            paddingLeft: 8,
                            // height: 120,
                            marginBottom: 22,
                        }}
                    >
                        <RadioButton.Group
                            onValueChange={(value) => {
                                dispatch({
                                    type: formAction.SET_VISIBILITY,
                                    payload: value,
                                });
                                modalizeVisibilityRef.current?.close();
                            }}
                            value={state.visibility}
                        >
                            <RadioButton.Item
                                label={i18n.t('createCommunity.public')}
                                value="public"
                            />
                            <RadioButton.Item
                                label={i18n.t('createCommunity.private')}
                                value="private"
                            />
                        </RadioButton.Group>
                    </View>
                </Modalize>
            </Portal>
        </View>
    );
}

function CommunityIncrementInterval(props: HelperProps) {
    const modalizeClaimIncrementRef = useRef<Modalize>(null);

    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const handleChangeIncrementIntervalUnit = (value: string) => {
        dispatch({
            type: formAction.SET_INCREMENT_INTERVAL_UNIT,
            payload: Number(value),
        });
        modalizeClaimIncrementRef.current?.close();
    };

    const handleChangeIncrementInterval = (value: string) =>
        dispatch({
            type: formAction.SET_INCREMENT_INTERVAL,
            payload: value,
        });

    const handleEndEdit = () =>
        validateField(state, dispatch).incrementInterval();

    const error = state.validation.incrementInterval
        ? undefined
        : i18n.t('createCommunity.incrementalIntervalRequired');

    return (
        <>
            <Text
                style={{
                    marginTop: 22,
                    fontFamily: 'Manrope-Bold',
                    fontSize: 14,
                    lineHeight: 24,
                }}
            >
                {i18n.t('createCommunity.contractIncrementTitle')}
            </Text>
            <View
                style={{
                    marginTop: 8,
                    flex: 2,
                    flexDirection: 'row',
                }}
            >
                <View style={{ flex: 1, marginRight: 10 }}>
                    <Input
                        accessibilityLabel={i18n.t('createCommunity.time')}
                        label={i18n.t('createCommunity.time')}
                        value={state.incrementInterval}
                        help
                        onPress={() => {
                            props.setHelperInfo.title(
                                i18n.t(
                                    'createCommunity.timeIncrementAfterClaim'
                                )
                            );
                            props.setHelperInfo.content(
                                i18n.t(
                                    'createCommunity.timeIncrementAfterClaimHelp'
                                )
                            );
                            props.helperRef.current.open();
                        }}
                        placeholder="0"
                        maxLength={14}
                        keyboardType="numeric"
                        onChangeText={handleChangeIncrementInterval}
                        onEndEditing={handleEndEdit}
                        error={error}
                    />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Select
                        value={
                            state.incrementIntervalUnit === 60
                                ? i18n.t('createCommunity.minutes')
                                : state.incrementIntervalUnit === 3600
                                ? i18n.t('createCommunity.hours')
                                : i18n.t('createCommunity.days')
                        }
                        onPress={() =>
                            modalizeClaimIncrementRef.current?.open()
                        }
                    />
                </View>
            </View>
            <Portal>
                <Modalize
                    ref={modalizeClaimIncrementRef}
                    HeaderComponent={renderHeader(
                        i18n.t('createCommunity.incrementalFrequency'),
                        modalizeClaimIncrementRef
                    )}
                    adjustToContentHeight
                >
                    <View
                        style={{
                            // height: 160,
                            marginBottom: 22,
                            paddingLeft: 8,
                        }}
                    >
                        <RadioButton.Group
                            onValueChange={handleChangeIncrementIntervalUnit}
                            value={state.incrementIntervalUnit.toString()}
                        >
                            <RadioButton.Item
                                label={i18n.t('createCommunity.minutes')}
                                value="60"
                            />
                            <RadioButton.Item
                                label={i18n.t('createCommunity.hours')}
                                value="3600"
                            />
                            <RadioButton.Item
                                label={i18n.t('createCommunity.days')}
                                value="86400"
                            />
                        </RadioButton.Group>
                    </View>
                </Modalize>
            </Portal>
        </>
    );
}

function CommunityMaxClaim(props: HelperProps) {
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

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

    const handleChangeMaxClaim = (value: string) =>
        dispatch({
            type: formAction.SET_MAX_CLAIM,
            payload: value,
        });

    const handleEndEdit = () => validateField(state, dispatch).maxClaim();

    const error = state.validation.maxClaim
        ? undefined
        : i18n.t('createCommunity.maxClaimAmountRequired');

    return (
        <View style={{ marginTop: 28 }}>
            <Input
                accessibilityLabel={i18n.t(
                    'createCommunity.totalClaimPerBeneficiary'
                )}
                label={i18n.t('createCommunity.totalClaimPerBeneficiary')}
                help
                onPress={() => {
                    props.setHelperInfo.title(
                        i18n.t('createCommunity.totalClaimPerBeneficiary')
                    );
                    props.setHelperInfo.content(
                        i18n.t('createCommunity.totalClaimPerBeneficiaryHelp')
                    );
                    props.helperRef.current.open();
                }}
                value={state.maxClaim}
                placeholder="$0"
                maxLength={14}
                keyboardType="numeric"
                onChangeText={handleChangeMaxClaim}
                onEndEditing={handleEndEdit}
                error={error}
            />
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
                    {i18n.t('createCommunity.aroundValue', {
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

    const error = state.validation.baseInterval
        ? undefined
        : i18n.t('createCommunity.baseIntervalRequired');

    return (
        <View style={{ marginTop: 28 }}>
            <Select
                label={i18n.t('createCommunity.frequency')}
                error={error}
                help
                onHelpPress={() => {
                    props.setHelperInfo.title(
                        i18n.t('createCommunity.frequency')
                    );
                    props.setHelperInfo.content(
                        i18n.t('createCommunity.frequencyHelp')
                    );
                    props.helperRef.current.open();
                }}
                value={
                    state.baseInterval.length === 0
                        ? i18n.t('generic.select')
                        : state.baseInterval === '86400'
                        ? i18n.t('createCommunity.daily')
                        : i18n.t('createCommunity.weekly')
                }
                onPress={() => modalizeFrequencyRef.current?.open()}
            />
            <Portal>
                <Modalize
                    ref={modalizeFrequencyRef}
                    HeaderComponent={renderHeader(
                        i18n.t('createCommunity.frequency'),
                        modalizeFrequencyRef
                    )}
                    adjustToContentHeight
                >
                    <View
                        style={{
                            // height: 120,
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
                                label={i18n.t('createCommunity.daily')}
                                value="86400"
                            />
                            <RadioButton.Item
                                label={i18n.t('createCommunity.weekly')}
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

    const handleChangeClaimAmount = (value: string) =>
        dispatch({
            type: formAction.SET_CLAIM_AMOUNT,
            payload: value,
        });

    const handleEndEdit = () => validateField(state, dispatch).claimAmount();

    const error = state.validation.claimAmount
        ? undefined
        : i18n.t('createCommunity.claimAmountRequired');

    return (
        <View style={{ marginTop: 28 }}>
            <Input
                accessibilityLabel={i18n.t('createCommunity.claimAmount')}
                label={i18n.t('createCommunity.claimAmount')}
                help
                onPress={() => {
                    props.setHelperInfo.title(
                        i18n.t('createCommunity.claimAmount')
                    );
                    props.setHelperInfo.content(
                        i18n.t('createCommunity.claimAmountHelp')
                    );
                    props.helperRef.current.open();
                }}
                value={state.claimAmount}
                placeholder="$0"
                maxLength={14}
                keyboardType="numeric"
                onChangeText={handleChangeClaimAmount}
                onEndEditing={handleEndEdit}
                error={error}
            />
            {state.claimAmount.length > 0 && (
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
                    {i18n.t('createCommunity.aroundValue', {
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
                {i18n.t('createCommunity.contractDetails')}
            </Headline>
            <Text
                style={{
                    fontFamily: 'Inter-Regular',
                    fontSize: 14,
                    lineHeight: 24,
                }}
            >
                {i18n.t('createCommunity.contractDescriptionLabel')}
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
            <CommunityIncrementInterval
                helperRef={modalizeHelperRef}
                setHelperInfo={{
                    title: setHelperTitle,
                    content: setHelperContent,
                }}
            />
            <CommunityVisibility
                helperRef={modalizeHelperRef}
                setHelperInfo={{
                    title: setHelperTitle,
                    content: setHelperContent,
                }}
            />
            <CommunityMinimunExpectedDuration />
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
