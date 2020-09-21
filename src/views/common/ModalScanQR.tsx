import i18n from 'assets/i18n';
import ValidatedTextInput from 'components/ValidatedTextInput';
import { ethers } from 'ethers';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { IRootState } from 'helpers/types';
import React from 'react';
import { StyleSheet, View, Alert, Modal } from 'react-native';
import { Button, Dialog, Divider, Portal } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';

interface IModalScanQRProps {
    isVisible: boolean;
    onDismiss: () => void;
    inputText: string;
    selectButtonText: string;
    selectButtonInProgress?: boolean;
    callback: (inputAddress: string) => void;
}
interface IModalScanQRState {
    inputAddress: string;
    hasPermission: boolean;
    scanned: boolean;
    useCamera: boolean;
    invalidAddressWarningOpen: boolean;
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state;
    return { user, network };
};
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & IModalScanQRProps;

class ModalScanQR extends React.Component<Props, IModalScanQRState> {
    constructor(props: any) {
        super(props);
        this.state = {
            inputAddress: '',
            hasPermission: false,
            scanned: false,
            useCamera: false,
            invalidAddressWarningOpen: false,
        };
    }

    componentDidMount = async () => {
        const { status } = await BarCodeScanner.getPermissionsAsync();
        this.setState({ hasPermission: status === 'granted' });
    };

    handleBarCodeScanned = ({ type, data }: { type: any; data: any }) => {
        let scannedAddress: string = '';
        if (!this.state.invalidAddressWarningOpen) {
            try {
                const isCeloLink = (data as string).indexOf('celo://');
                if (isCeloLink !== -1) {
                    scannedAddress = data.match(/address=([0-9a-zA-Z]+)/)[1];
                    this.setState({
                        scanned: true,
                        inputAddress: scannedAddress,
                    });
                } else {
                    scannedAddress = ethers.utils.getAddress(data);
                    this.setState({
                        scanned: true,
                        inputAddress: scannedAddress,
                    });
                }
            } catch (e) {
                this.setState({ invalidAddressWarningOpen: true });
                Alert.alert(
                    i18n.t('failure'),
                    i18n.t('scanningInvalidAddress'),
                    [
                        {
                            text: 'OK',
                            onPress: () =>
                                this.setState({
                                    invalidAddressWarningOpen: false,
                                }),
                        },
                    ],
                    { cancelable: false }
                );
            }
        }
    };

    handleAskCameraPermission = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        this.setState({ hasPermission: status === 'granted' });
    };

    render() {
        const { inputAddress, hasPermission, scanned, useCamera } = this.state;
        const {
            inputText,
            selectButtonText,
            selectButtonInProgress,
            callback,
        } = this.props;
        let inputCameraMethod;

        if (hasPermission === null || hasPermission === false) {
            inputCameraMethod = (
                <Button
                    mode="contained"
                    onPress={this.handleAskCameraPermission}
                >
                    {i18n.t('allowCamera')}
                </Button>
            );
        } else {
            inputCameraMethod = (
                <View style={styles.scannerView}>
                    <BarCodeScanner
                        onBarCodeScanned={this.handleBarCodeScanned}
                        // barCodeTypes={['qr']}
                        style={StyleSheet.absoluteFillObject}
                    />
                </View>
            );
        }

        return (
            <Portal>
                <Dialog
                    visible={this.props.isVisible}
                    onDismiss={this.props.onDismiss}
                >
                    <Dialog.Content>
                        <ValidatedTextInput
                            label={inputText}
                            value={inputAddress}
                            required
                            onChangeText={(value) =>
                                this.setState({ inputAddress: value })
                            }
                        />
                        <Divider />
                    </Dialog.Content>
                    <Dialog.Actions
                        style={{
                            justifyContent: 'space-between',
                        }}
                    >
                        <Button
                            mode="contained"
                            // disabled={
                            //     selectButtonInProgress !== undefined &&
                            //     selectButtonInProgress === true
                            // }
                            onPress={() =>
                                this.setState({
                                    useCamera: true,
                                    scanned: false,
                                })
                            }
                        >
                            {i18n.t('useCamera')}
                        </Button>
                        <Button
                            mode="contained"
                            // disabled={
                            //     inputAddress.length === 0 ||
                            //     (selectButtonInProgress !== undefined &&
                            //         selectButtonInProgress === true)
                            // }
                            loading={
                                selectButtonInProgress !== undefined &&
                                selectButtonInProgress === true
                            }
                            onPress={() => callback(inputAddress)}
                        >
                            {selectButtonText}
                        </Button>
                        <Button
                            mode="contained"
                            // disabled={
                            //     selectButtonInProgress !== undefined &&
                            //     selectButtonInProgress === true
                            // }
                            onPress={this.props.onDismiss}
                        >
                            {i18n.t('cancel')}
                        </Button>
                    </Dialog.Actions>
                </Dialog>
                <Modal
                    visible={useCamera && !scanned}
                    onDismiss={() => this.setState({ useCamera: false })}
                    transparent
                    onRequestClose={() => this.setState({ useCamera: false })}
                >
                    {inputCameraMethod}
                </Modal>
            </Portal>
        );
    }
}

const styles = StyleSheet.create({
    scannerView: {
        height: '100%',
    },
});

export default connector(ModalScanQR);
