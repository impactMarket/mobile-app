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
    opened?: boolean;
    buttonStyle?: any;
    buttonText: string;
    inputText: string;
    selectButtonText: string;
    selectButtonInProgress?: boolean;
    callback: (inputAddress: string) => void;
}
interface IModalScanQRState {
    inputAddress: string;
    modalScanQR: boolean;
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
            modalScanQR:
                this.props.opened !== undefined ? this.props.opened : false,
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

    // TODO: stop using this method
    componentWillReceiveProps = (
        nextProps: Readonly<Props>,
        nextContext: any
    ) => {
        if (this.state.modalScanQR !== nextProps.opened && nextProps.opened) {
            this.setState({ modalScanQR: nextProps.opened });
        }
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
                }
            } catch (e) {
                try {
                    scannedAddress = ethers.utils.getAddress(data);
                    this.setState({
                        scanned: true,
                        inputAddress: scannedAddress,
                    });
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
        }
    };

    handleAskCameraPermission = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        this.setState({ hasPermission: status === 'granted' });
    };

    handleOpenModalScanQR = () => {
        this.setState({ modalScanQR: true, scanned: false });
    };

    render() {
        const {
            inputAddress,
            modalScanQR,
            hasPermission,
            scanned,
            useCamera,
        } = this.state;
        const {
            buttonText,
            inputText,
            selectButtonText,
            selectButtonInProgress,
            buttonStyle,
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
            <>
                {this.props.buttonText.length > 0 &&
                    this.props.opened !== false && (
                        <Button
                            mode="contained"
                            style={buttonStyle}
                            onPress={this.handleOpenModalScanQR}
                        >
                            {buttonText}
                        </Button>
                    )}
                <Portal>
                    <Dialog
                        visible={modalScanQR}
                        onDismiss={() => this.setState({ modalScanQR: false })}
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
                                disabled={
                                    selectButtonInProgress !== undefined &&
                                    selectButtonInProgress === true
                                }
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
                                disabled={
                                    inputAddress.length === 0 ||
                                    (selectButtonInProgress !== undefined &&
                                        selectButtonInProgress === true)
                                }
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
                                disabled={
                                    selectButtonInProgress !== undefined &&
                                    selectButtonInProgress === true
                                }
                                onPress={() =>
                                    this.setState({
                                        modalScanQR: false,
                                        inputAddress: '',
                                    })
                                }
                            >
                                {i18n.t('cancel')}
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                    <Modal
                        visible={useCamera && !scanned}
                        onDismiss={() => this.setState({ useCamera: false })}
                        transparent
                        onRequestClose={() =>
                            this.setState({ useCamera: false })
                        }
                    >
                        {inputCameraMethod}
                    </Modal>
                </Portal>
            </>
        );
    }
}

const styles = StyleSheet.create({
    scannerView: {
        height: '100%',
    },
});

export default connector(ModalScanQR);
