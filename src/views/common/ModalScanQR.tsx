import i18n from 'assets/i18n';
import ValidatedTextInput from 'components/ValidatedTextInput';
import { ethers } from 'ethers';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { IRootState } from 'helpers/types';
import React from 'react';
import { StyleSheet, View, Alert, Modal } from 'react-native';
import {
    Button,
    Dialog,
    Divider,
    IconButton,
    Paragraph,
    Portal,
} from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';

interface IModalScanQRProps {
    isVisible: boolean;
    openInCamera: boolean;
    onDismiss: () => void;
    inputText: string;
    selectButtonText: string;
    selectButtonInProgress?: boolean;
    callback: (inputAddress: string) => void;
    personalAddressWarningMessage?: string;
    usedAddressWarningMessage?: string;
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

    componentWillReceiveProps = (nextProps: IModalScanQRProps) => {
        if (nextProps.isVisible) {
            this.setState({ useCamera: nextProps.openInCamera });
        } else if (this.state.useCamera) {
            this.setState({ useCamera: false });
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
                } else {
                    scannedAddress = ethers.utils.getAddress(data);
                    this.setState({
                        scanned: true,
                        inputAddress: scannedAddress,
                    });
                }
                if (this.props.openInCamera) {
                    this.props.callback(scannedAddress);
                    this.setState({ useCamera: false, scanned: false });
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
            isVisible,
            personalAddressWarningMessage,
            openInCamera,
            onDismiss,
            usedAddressWarningMessage,
            user,
            network,
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
                    <Button
                        mode="contained"
                        style={{ bottom: 0 }}
                        onPress={() => {
                            if (openInCamera) {
                                onDismiss();
                                this.setState({
                                    useCamera: false,
                                    scanned: false,
                                });
                            } else {
                                this.setState({ useCamera: false });
                            }
                        }}
                    >
                        {i18n.t('close')}
                    </Button>
                </View>
            );
        }

        const personalAddressWarningMessageCondition =
            inputAddress.toLowerCase() === user.celoInfo.address.toLowerCase();
        const usedAddressWarningMessageCondition =
            network.community.beneficiaries.added.find(
                (b) => b.address.toLowerCase() === inputAddress.toLowerCase()
            ) !== undefined;

        return (
            <Portal>
                <Dialog
                    visible={isVisible && !openInCamera}
                    onDismiss={onDismiss}
                >
                    <Dialog.Content>
                        {personalAddressWarningMessage !== undefined &&
                            personalAddressWarningMessageCondition && (
                                <View style={{ alignItems: 'center' }}>
                                    <IconButton
                                        icon="alert"
                                        color="#f0ad4e"
                                        size={20}
                                    />
                                    <Paragraph
                                        style={{
                                            marginHorizontal: 10,
                                            textAlign: 'center',
                                        }}
                                    >
                                        {personalAddressWarningMessage}
                                    </Paragraph>
                                </View>
                            )}
                        {usedAddressWarningMessage !== undefined &&
                            usedAddressWarningMessageCondition && (
                                <View style={{ alignItems: 'center' }}>
                                    <IconButton
                                        icon="alert"
                                        color="#f0ad4e"
                                        size={20}
                                    />
                                    <Paragraph
                                        style={{
                                            marginHorizontal: 10,
                                            textAlign: 'center',
                                        }}
                                    >
                                        {usedAddressWarningMessage}
                                    </Paragraph>
                                </View>
                            )}
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
                            disabled={
                                usedAddressWarningMessageCondition
                                // inputAddress.length === 0 ||
                                // (selectButtonInProgress !== undefined &&
                                //     selectButtonInProgress === true)
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
                            // disabled={
                            //     selectButtonInProgress !== undefined &&
                            //     selectButtonInProgress === true
                            // }
                            onPress={onDismiss}
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
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
    },
});

export default connector(ModalScanQR);
