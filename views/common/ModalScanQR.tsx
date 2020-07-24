import React from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import {
    connect,
    ConnectedProps
} from 'react-redux';
import {
    IRootState,
} from '../../helpers/types';
import {
    Button,
    Portal,
    Dialog,
    Paragraph,
} from 'react-native-paper';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { ethers } from 'ethers';
import ValidatedTextInput from '../../components/ValidatedTextInput';
import i18n from '../../assets/i18n';


interface IModalScanQRProps {
    buttonStyle?: any;
    buttonText: string;
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
    const { user, network } = state
    return { user, network }
};
const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & IModalScanQRProps

class ModalScanQR extends React.Component<Props, IModalScanQRState> {

    constructor(props: any) {
        super(props);
        this.state = {
            inputAddress: '',
            modalScanQR: false,
            hasPermission: false,
            scanned: false,
            useCamera: true,
        }
    }

    handleBarCodeScanned = ({ type, data }: { type: any, data: any }) => {
        let scannedAddress: string;
        try {
            const parsed = JSON.parse(data);
            scannedAddress = ethers.utils.getAddress(parsed.address);
        } catch (e) {
            scannedAddress = ethers.utils.getAddress(data);
        }
        this.setState({ scanned: true, inputAddress: scannedAddress });
    };

    handleAskCameraPermission = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        this.setState({ hasPermission: status === 'granted' });
    }

    handleOpenModalScanQR = () => {
        this.setState({ modalScanQR: true, inputAddress: '', scanned: false });
    }

    render() {
        const {
            inputAddress,
            modalScanQR,
            hasPermission,
            scanned,
            useCamera,
        } = this.state;
        let inputMethod;

        if (!useCamera) {
            inputMethod = <>
                <ValidatedTextInput
                    label={i18n.t('beneficiaryAddress')}
                    value={inputAddress}
                    required={true}
                    onChangeText={value => this.setState({ inputAddress: value })}
                />
            </>;
        }
        else if (hasPermission === null || hasPermission === false) {
            inputMethod = <Button mode="contained" onPress={this.handleAskCameraPermission}>
                {i18n.t('allowCamera')}
            </Button>;
        } else {
            inputMethod = <>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                    }}>

                    <BarCodeScanner
                        onBarCodeScanned={this.handleBarCodeScanned}
                        style={StyleSheet.absoluteFillObject}
                    />

                    {scanned && <Button onPress={() => this.setState({ scanned: false })}>
                        {i18n.t('tapToScanAgain')}
                    </Button>}
                </View>
                <Paragraph>{i18n.t('currentAddress')}:</Paragraph>
                {
                    inputAddress.length > 0 &&
                    <Paragraph style={{ fontWeight: 'bold', fontFamily: 'Gelion-Bold' }}>
                        {inputAddress.slice(0, 12)}..{inputAddress.slice(31, 42)}
                    </Paragraph>
                }
            </>
        }

        return (
            <>
                <Button
                    mode="contained"
                    style={this.props.buttonStyle}
                    onPress={this.handleOpenModalScanQR}
                >
                    {this.props.buttonText}
                </Button>
                <Portal>
                    <Dialog
                        visible={modalScanQR}
                        onDismiss={() => this.setState({ modalScanQR: false })}
                    >
                        <Dialog.Content style={{ height: 350, width: '100%' }}>
                            {inputMethod}
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button
                                mode="outlined"
                                style={{ marginHorizontal: 10 }}
                                onPress={() => this.setState({ inputAddress: '', useCamera: !useCamera })}
                            >
                                {useCamera ? i18n.t('useText') : i18n.t('useCamera')}
                            </Button>
                            <Button
                                mode="contained"
                                disabled={inputAddress.length === 0}
                                style={{ marginRight: 10 }}
                                onPress={() => this.props.callback(inputAddress)}
                            >
                                {i18n.t('add')}
                            </Button>
                            <Button
                                mode="contained"
                                onPress={() => this.setState({
                                    modalScanQR: false,
                                    inputAddress: ''
                                })}
                            >
                                {i18n.t('cancel')}
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </>
        );
    }
}

export default connector(ModalScanQR);