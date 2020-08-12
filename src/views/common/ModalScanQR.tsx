import i18n from 'assets/i18n';
import ValidatedTextInput from 'components/ValidatedTextInput';
import { ethers } from 'ethers';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { IRootState } from 'helpers/types';
import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { BottomSheet } from 'react-native-btr';
import { Button, Card } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';

interface IModalScanQRProps {
    buttonStyle?: any;
    buttonText: string;
    inputText: string;
    selectButtonText: string;
    callback: (inputAddress: string) => void;
}
interface IModalScanQRState {
    inputAddress: string;
    modalScanQR: boolean;
    hasPermission: boolean;
    scanned: boolean;
    useCamera: boolean;
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
            modalScanQR: false,
            hasPermission: false,
            scanned: false,
            useCamera: false,
        };
    }

    handleBarCodeScanned = ({ type, data }: { type: any; data: any }) => {
        let scannedAddress: string = '';
        try {
            const parsed = JSON.parse(data);
            scannedAddress = ethers.utils.getAddress(parsed.address);
        } catch (e) {
            try {
                scannedAddress = ethers.utils.getAddress(data);
                this.setState({ scanned: true, inputAddress: scannedAddress });
            } catch (e) {
                Alert.alert(
                    i18n.t('failure'),
                    i18n.t('scanningInvalidAddress'),
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
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
            buttonStyle,
            callback,
        } = this.props;
        let inputCameraMethod;

        if (hasPermission === null || hasPermission === false) {
            inputCameraMethod = (
                <Button
                    mode="contained"
                    style={styles.optionButtons}
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
                        style={StyleSheet.absoluteFillObject}
                    />
                </View>
            );
        }

        return (
            <>
                <Button
                    mode="contained"
                    style={buttonStyle}
                    onPress={this.handleOpenModalScanQR}
                >
                    {buttonText}
                </Button>
                <BottomSheet
                    visible={modalScanQR}
                    onBackButtonPress={() =>
                        this.setState({ modalScanQR: false })
                    }
                    onBackdropPress={() =>
                        this.setState({ modalScanQR: false })
                    }
                >
                    <Card elevation={8}>
                        <Card.Content style={{ marginVertical: -16 }}>
                            <ValidatedTextInput
                                label={inputText}
                                value={inputAddress}
                                required
                                onChangeText={(value) =>
                                    this.setState({ inputAddress: value })
                                }
                            />
                        </Card.Content>
                        <Card.Actions
                            style={{
                                justifyContent: 'space-between',
                                marginVertical: 15,
                            }}
                        >
                            <Button
                                mode="contained"
                                style={styles.optionButtons}
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
                                disabled={inputAddress.length === 0}
                                style={styles.optionButtons}
                                onPress={() => callback(inputAddress)}
                            >
                                {selectButtonText}
                            </Button>
                            <Button
                                mode="contained"
                                style={styles.optionButtons}
                                onPress={() =>
                                    this.setState({
                                        modalScanQR: false,
                                        inputAddress: '',
                                    })
                                }
                            >
                                {i18n.t('cancel')}
                            </Button>
                        </Card.Actions>
                    </Card>
                </BottomSheet>
                <BottomSheet
                    visible={useCamera && !scanned}
                    onBackButtonPress={() =>
                        this.setState({ useCamera: false })
                    }
                    onBackdropPress={() => this.setState({ useCamera: false })}
                >
                    <Card elevation={8}>
                        <Card.Content
                            style={{ marginVertical: -16, height: 400 }}
                        >
                            {inputCameraMethod}
                        </Card.Content>
                    </Card>
                </BottomSheet>
            </>
        );
    }
}

const styles = StyleSheet.create({
    optionButtons: {
        marginHorizontal: 10,
    },
    scannerView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
});

export default connector(ModalScanQR);
