import i18n from 'assets/i18n';
import Button from 'components/core/Button';
import Modal from 'components/Modal';
import {
    formatInputAmountToTransfer,
    getCurrencySymbol,
} from 'helpers/currency';
import { ICommunity } from 'helpers/types/endpoints';
import { IUserState } from 'helpers/types/state';
import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Paragraph } from 'react-native-paper';
import { Trans } from 'react-i18next';

interface IConfirmModalProps {
    visible: boolean;
    onDismiss: () => void;
    user: IUserState;
    community: ICommunity;
    confirmAmount: string;
    donateWithCeloWallet: () => void;
    goBack: () => void;
}
interface IConfirmModalState {
    donating: boolean;
}
export default class ConfirmModal extends Component<
    IConfirmModalProps,
    IConfirmModalState
> {
    constructor(props: any) {
        super(props);
        this.state = {
            donating: false,
        };
    }

    render() {
        const {
            visible,
            onDismiss,
            user,
            community,
            confirmAmount,
            goBack,
            donateWithCeloWallet,
        } = this.props;
        const { donating } = this.state;

        const amountInDollars =
            parseFloat(formatInputAmountToTransfer(confirmAmount)) /
            this.props.user.exchangeRate;

        return (
            <Modal
                title={i18n.t('donateSymbol', {
                    symbol: user.metadata.currency,
                })}
                visible={visible}
                buttons={
                    <View
                        style={{
                            height: 42 /** TODO: this is currently th buttons height */,
                        }}
                    >
                        <View
                            style={{
                                flex: 2,
                                flexDirection: 'row',
                            }}
                        >
                            <Button
                                modeType="gray"
                                bold={true}
                                style={{
                                    marginRight: 14.48,
                                    flex: 1,
                                }}
                                labelStyle={styles.donateLabel}
                                onPress={goBack}
                            >
                                {i18n.t('backWithSymbol')}
                            </Button>
                            <Button
                                modeType="default"
                                bold={true}
                                style={{ flex: 1 }}
                                loading={donating}
                                labelStyle={styles.donateLabel}
                                onPress={donateWithCeloWallet}
                            >
                                {i18n.t('donate')}
                            </Button>
                        </View>
                    </View>
                }
                onDismiss={onDismiss}
            >
                <Paragraph
                    style={{
                        marginHorizontal: 44,
                        marginVertical: 50,
                        fontSize: 19,
                        lineHeight: 23,
                        textAlign: 'center',
                    }}
                >
                    <Trans
                        i18nKey="donateConfirmMessage"
                        values={{
                            symbol: getCurrencySymbol(user.metadata.currency),
                            amount: confirmAmount
                                .trim()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                            amountInDollars: amountInDollars.toFixed(2),
                            to: community.name,
                        }}
                        components={{
                            bold: (
                                <Text
                                    style={{
                                        fontFamily: 'Gelion-Bold',
                                    }}
                                />
                            ),
                        }}
                    />
                </Paragraph>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    donate: {
        borderRadius: 0,
        height: 69,
    },
    donateLabel: {
        fontSize: 16,
        lineHeight: 19,
        letterSpacing: 0.3,
    },
});
