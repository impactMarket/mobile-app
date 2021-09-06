import i18n from 'assets/i18n';
import Button from 'components/core/Button';
import { modalDonateAction } from 'helpers/constants';
import { ModalActionTypes } from 'helpers/types/redux';
import { IRootState } from 'helpers/types/state';
import React, { Component, Dispatch } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';

interface IErrorModalProps {}
class ErrorModal extends Component<IErrorModalProps & PropsFromRedux, object> {
    render() {
        return (
            <>
                <View
                    style={{
                        borderRadius: 8,
                        borderColor: 'red',
                        borderWidth: 1,
                        borderStyle: 'solid',
                        margin: 22,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'Inter-Regular',
                            marginHorizontal: 22,
                            marginVertical: 22,
                            fontSize: 14,
                            lineHeight: 24,
                            textAlign: 'center',
                        }}
                    >
                        {i18n.t('donate.donationBiggerThanBalance')}
                    </Text>
                </View>
                <Button
                    style={{
                        width: '90%',
                        alignSelf: 'center',
                        marginTop: 10,
                    }}
                    modeType="default"
                    labelStyle={styles.donateLabel}
                    onPress={this.props.goBackToDonateModal}
                >
                    {i18n.t('donate.adjustContributionAmount')}
                </Button>
            </>
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
