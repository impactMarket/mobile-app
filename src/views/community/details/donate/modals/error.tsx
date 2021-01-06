import i18n from 'assets/i18n';
import Button from 'components/core/Button';
import Modal from 'components/Modal';
import { IUserState } from 'helpers/types/state';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Paragraph } from 'react-native-paper';

interface IErrorModalProps {
    visible: boolean;
    onDismiss: () => void;
    user: IUserState;
    goBack: () => void;
}
export default class ErrorModal extends Component<IErrorModalProps, {}> {
    render() {
        const { visible, onDismiss, user, goBack } = this.props;

        return (
            <Modal
                title={i18n.t('donateSymbol', {
                    symbol: user.metadata.currency,
                })}
                visible={visible}
                buttons={
                    <Button
                        modeType="gray"
                        bold={true}
                        labelStyle={styles.donateLabel}
                        onPress={goBack}
                    >
                        {i18n.t('backWithSymbol')}
                    </Button>
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
                    {i18n.t('donationBiggerThanBalance')}
                </Paragraph>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    donateLabel: {
        fontSize: 16,
        lineHeight: 19,
        letterSpacing: 0.3,
    },
});
