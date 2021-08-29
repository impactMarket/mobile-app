import i18n from 'assets/i18n';
import Modal from 'components/Modal';
import Button from 'components/core/Button';
import { modalDonateAction } from 'helpers/constants';
import { ModalActionTypes } from 'helpers/types/redux';
import { IRootState } from 'helpers/types/state';
import React, { Component, Dispatch } from 'react';
import { StyleSheet } from 'react-native';
import { Paragraph } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';

interface IErrorModalProps {}
class ErrorModal extends Component<IErrorModalProps & PropsFromRedux, object> {
    render() {
        const {
            visible,
            dismissModal,
            userCurrency,
            goBackToDonateModal,
        } = this.props;

        return (
            <Modal
                title={i18n.t('donate.donateSymbol', {
                    symbol: userCurrency,
                })}
                visible={visible}
                buttons={
                    <Button
                        modeType="gray"
                        bold
                        labelStyle={styles.donateLabel}
                        onPress={goBackToDonateModal}
                    >
                        {i18n.t('generic.backWithSymbol')}
                    </Button>
                }
                onDismiss={dismissModal}
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
                    {i18n.t('donate.donationBiggerThanBalance')}
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

const mapStateToProps = (state: IRootState) => {
    const { currency } = state.user.metadata;
    const { modalErrorOpen } = state.modalDonate;
    return {
        userCurrency: currency,
        visible: modalErrorOpen,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<ModalActionTypes>) => {
    return {
        goBackToDonateModal: () =>
            dispatch({ type: modalDonateAction.GO_BACK_TO_DONATE }),
        dismissModal: () => dispatch({ type: modalDonateAction.CLOSE }),
    };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ErrorModal);
