import i18n from 'assets/i18n';
import { ethers } from 'ethers';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { IRootState } from 'helpers/types/state';
import React from 'react';
import { StyleSheet, View, Alert, Modal } from 'react-native';
import { Button, Dialog, Paragraph, Portal } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';

interface IModalScanQRProps {
    isVisible: boolean;
    onDismiss: () => void;
    callback: (qrValue: string) => void;
}
interface IModalScanQRState {
    hasPermission: boolean;
    scanned: boolean;
    isVisible: boolean;
    invalidAddressWarningOpen: boolean;
    requestingCameraPermissions: boolean;
}
const mapStateToProps = (state: IRootState) => {
    const { user } = state;
    return { user };
};
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & IModalScanQRProps;

class ScanQR extends React.Component<Props, IModalScanQRState> {
    constructor(props: any) {
        super(props);
        this.state = {
            hasPermission: true,
            scanned: false,
            isVisible: this.props.isVisible,
            invalidAddressWarningOpen: false,
            requestingCameraPermissions: false,
        };
    }

    componentWillReceiveProps = (nextProps: IModalScanQRProps) => {
        this.setState({ isVisible: nextProps.isVisible });
    };

    handleBarCodeScanned = ({ type, data }: { type: any; data: any }) => {
        let scannedAddress: string = '';
        if (!this.state.invalidAddressWarningOpen) {
            try {
                const isCeloLink = (data as string).indexOf('celo://');
                if (isCeloLink !== -1) {
                    scannedAddress = data.match(/address=([0-9a-zA-Z]+)/)[1];
                } else {
                    scannedAddress = ethers.utils.getAddress(data);
                }
                this.props.callback(scannedAddress);
                this.props.onDismiss();
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
        const hasPermission = await BarCodeScanner.getPermissionsAsync();
        if (hasPermission.status === 'granted') {
            this.setState({ hasPermission: true });
        } else {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            this.setState({ hasPermission: status === 'granted' });
        }
    };

    render() {
        const { hasPermission, scanned, isVisible } = this.state;
        const { onDismiss } = this.props;
        const inputCameraMethod = () => {
            if (hasPermission === true) {
                return (
                    <View style={styles.scannerView}>
                        <BarCodeScanner
                            onBarCodeScanned={this.handleBarCodeScanned}
                            // barCodeTypes={['qr']}
                            style={StyleSheet.absoluteFillObject}
                        />
                        <Button
                            mode="contained"
                            style={{
                                position: 'absolute',
                                bottom: '5%',
                                alignSelf: 'center',
                            }}
                            onPress={onDismiss}
                        >
                            {i18n.t('close')}
                        </Button>
                    </View>
                );
            }
        };

        return (
            <Portal>
                <Modal
                    visible={isVisible && !scanned}
                    onDismiss={onDismiss}
                    transparent
                    onRequestClose={onDismiss}
                >
                    {inputCameraMethod()}
                </Modal>
                <Dialog
                    visible={hasPermission === null || hasPermission === false}
                    onDismiss={() =>
                        this.setState({ requestingCameraPermissions: false })
                    }
                >
                    <Dialog.Title>
                        {i18n.t('requestingPermission')}
                    </Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>
                            {i18n.t('requestCameraPermission')}
                        </Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={this.handleAskCameraPermission}>
                            {i18n.t('allowCamera')}
                        </Button>
                        <Button
                            onPress={() =>
                                this.setState({
                                    requestingCameraPermissions: false,
                                })
                            }
                        >
                            Close
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        );
    }
}

const styles = StyleSheet.create({
    scannerView: {
        height: '100%',
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
    },
});

export default connector(ScanQR);
