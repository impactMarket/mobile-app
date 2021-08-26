import i18n from 'assets/i18n';
import Button from 'components/core/Button';
import { Camera } from 'expo-camera';
import { IRootState } from 'helpers/types/state';
import React from 'react';
import { StyleSheet, View, Alert, Modal } from 'react-native';
import { Portal } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';

import { BarCodeFinder } from './BarCodeFinder';

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
}
const mapStateToProps = (state: IRootState) => {
    const { user, app } = state;
    return { user, app };
};
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & IModalScanQRProps;

class ScanQR extends React.Component<Props, IModalScanQRState> {
    constructor(props: any) {
        super(props);
        this.state = {
            hasPermission: false,
            scanned: false,
            isVisible: this.props.isVisible,
            invalidAddressWarningOpen: false,
        };
    }

    componentDidUpdate = (prevProps: Readonly<Props>) => {
        if (prevProps.isVisible !== this.props.isVisible) {
            this.setState({ isVisible: this.props.isVisible });
            if (this.props.isVisible) {
                this.handleAskCameraPermission();
            }
        }
    };

    handleBarCodeScanned = ({ type, data }: { type: any; data: any }) => {
        let scannedAddress: string = '';
        if (!this.state.invalidAddressWarningOpen) {
            try {
                const isCeloLink = (data as string).indexOf('celo://');
                if (isCeloLink !== -1) {
                    scannedAddress = data.match(/address=([0-9a-zA-Z]+)/)[1];
                } else {
                    scannedAddress = this.props.app.kit.web3.utils.toChecksumAddress(
                        data
                    );
                }
                this.props.callback(scannedAddress);
                this.props.onDismiss();
            } catch (e) {
                this.setState({ invalidAddressWarningOpen: true });
                Alert.alert(
                    i18n.t('generic.failure'),
                    i18n.t('generic.scanningInvalidAddress'),
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
        const hasPermission = await Camera.getPermissionsAsync();
        if (hasPermission.status === 'granted') {
            this.setState({ hasPermission: true });
        } else {
            const { status } = await Camera.requestPermissionsAsync();
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
                        <Camera
                            onBarCodeScanned={this.handleBarCodeScanned}
                            ratio="16:9"
                            type={Camera.Constants.Type.back}
                            style={StyleSheet.absoluteFillObject}
                            barCodeScannerSettings={{
                                barCodeTypes: ['qr'],
                            }}
                        >
                            <BarCodeFinder
                                height={200}
                                width={200}
                                borderColor="black"
                                borderWidth={5}
                            />
                            <Button
                                modeType="default"
                                bold
                                style={{
                                    position: 'absolute',
                                    bottom: '5%',
                                    alignSelf: 'center',
                                }}
                                onPress={onDismiss}
                            >
                                {i18n.t('generic.close')}
                            </Button>
                        </Camera>
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
                {/* <Dialog
                    visible={
                        (hasPermission === null || hasPermission === false) &&
                        requestingCameraPermissions === true
                    }
                    onDismiss={() =>
                        this.setState({ requestingCameraPermissions: false })
                    }
                >
                    <Dialog.Title>
                        {i18n.t('generic.requestingPermission')}
                    </Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>
                            {i18n.t('generic.requestCameraPermission')}
                        </Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={this.handleAskCameraPermission}>
                            {i18n.t('manager.allowCamera')}
                        </Button>
                        <Button
                            onPress={() =>
                                this.setState({
                                    requestingCameraPermissions: false,
                                })
                            }
                        >
                            {i18n.t('generic.close')}
                        </Button>
                    </Dialog.Actions>
                </Dialog> */}
            </Portal>
        );
    }
}

const styles = StyleSheet.create({
    scannerView: {
        height: '100%',
        backgroundColor: '#000',
    },
});

export default connector(ScanQR);
