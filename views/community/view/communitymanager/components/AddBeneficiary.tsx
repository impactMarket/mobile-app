import React from 'react';
import {
    StyleSheet,
    View,
    Alert,
} from 'react-native';
import {
    connect,
    ConnectedProps
} from 'react-redux';
import {
    IRootState,
    IBeneficiary,
} from '../../../../../helpers/types';
import {
    Button,
    Portal,
    Dialog,
    Paragraph,
} from 'react-native-paper';
import {
    celoWalletRequest,
} from '../../../../../services';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { ethers } from 'ethers';
import ValidatedTextInput from '../../../../../components/ValidatedTextInput';


interface IAddBeneficiaryProps {
    addBeneficiaryCallback: () => void;
}
interface IAddBeneficiaryState {
    newBeneficiaryAddress: string;
    modalNewBeneficiary: boolean;
    modalListBeneficiary: boolean;
    requestConfirmation?: IBeneficiary;
    hasPermission: boolean;
    scanned: boolean;
    useCamera: boolean;
    addInProgress: boolean;
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};
const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & IAddBeneficiaryProps

class AddBeneficiary extends React.Component<Props, IAddBeneficiaryState> {

    constructor(props: any) {
        super(props);
        this.state = {
            newBeneficiaryAddress: '',
            modalNewBeneficiary: false,
            modalListBeneficiary: false,
            hasPermission: false,
            scanned: false,
            useCamera: true,
            addInProgress: false,
        }
    }


    handleAddBeneficiary = async () => {
        const { newBeneficiaryAddress } = this.state;
        const { user, network } = this.props;
        const { communityContract } = network.contracts;
        const { address } = user.celoInfo;
        let addressToAdd: string;

        if (communityContract === undefined) {
            // TODO: do something beatiful, la la la
            return;
        }

        try {
            addressToAdd = ethers.utils.getAddress(newBeneficiaryAddress);
        } catch (e) {
            Alert.alert(
                'Failure',
                'You are trying to add an invalid address!',
                [{ text: 'Close' }],
                { cancelable: false }
            );
            return;
        }

        this.setState({ addInProgress: true });
        celoWalletRequest(
            address,
            communityContract.options.address,
            await communityContract.methods.addBeneficiary(addressToAdd),
            'acceptbeneficiaryrequest',
            network,
        ).then(() => {

            // TODO: update UI
            setTimeout(() => this.props.addBeneficiaryCallback, 10000);

            Alert.alert(
                'Success',
                'You\'ve accepted the beneficiary request!',
                [{ text: 'OK' }],
                { cancelable: false }
            );
        }).catch(() => {
            Alert.alert(
                'Failure',
                'An error happened while accepting the request!',
                [{ text: 'Close' }],
                { cancelable: false }
            );

        }).finally(() => {
            this.setState({ modalNewBeneficiary: false, addInProgress: false })
        });
    }

    handleBarCodeScanned = ({ type, data }: { type: any, data: any }) => {
        let scannedAddress: string;
        try {
            const parsed = JSON.parse(data);
            scannedAddress = ethers.utils.getAddress(parsed.address);
        } catch (e) {
            scannedAddress = ethers.utils.getAddress(data);
        }
        this.setState({ scanned: true, newBeneficiaryAddress: scannedAddress });
    };

    handleAskCameraPermission = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        this.setState({ hasPermission: status === 'granted' });
    }


    render() {
        const {
            newBeneficiaryAddress,
            modalNewBeneficiary,
            hasPermission,
            scanned,
            useCamera,
            addInProgress,
        } = this.state;
        let inputMethod;

        if (!useCamera) {
            inputMethod = <>
                <ValidatedTextInput
                    label="Beneficiary Address"
                    value={newBeneficiaryAddress}
                    required={true}
                    onChangeText={value => this.setState({ newBeneficiaryAddress: value })}
                />
            </>;
        }
        else if (hasPermission === null || hasPermission === false) {
            inputMethod = <Button mode="contained" onPress={this.handleAskCameraPermission}>Allow camera</Button>;
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

                    {scanned && <Button onPress={() => this.setState({ scanned: false })}>Tap to Scan Again</Button>}
                </View>
                <Paragraph>Current Address:</Paragraph>
                {
                    newBeneficiaryAddress.length > 0 &&
                    <Paragraph style={{ fontWeight: 'bold', fontFamily: 'Gelion-Bold' }}>
                        {newBeneficiaryAddress.slice(0, 12)}..{newBeneficiaryAddress.slice(31, 42)}
                    </Paragraph>
                }
            </>
        }

        return (
            <>
                <Button
                    mode="contained"
                    style={{ marginVertical: 5 }}
                    onPress={() => this.setState({ modalNewBeneficiary: true, newBeneficiaryAddress: '', addInProgress: false })}
                >
                    Add Beneficiary
                </Button>
                <Portal>
                    <Dialog
                        visible={modalNewBeneficiary}
                        onDismiss={() => this.setState({ modalNewBeneficiary: false })}
                    >
                        <Dialog.Content style={{ height: 350, width: '100%' }}>
                            {inputMethod}
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button
                                mode="outlined"
                                style={{ marginHorizontal: 10 }}
                                onPress={() => this.setState({ newBeneficiaryAddress: '', useCamera: !useCamera })}
                            >
                                Use {useCamera ? 'text' : 'camera'}
                            </Button>
                            <Button
                                mode="contained"
                                disabled={newBeneficiaryAddress.length === 0 || addInProgress}
                                loading={addInProgress}
                                style={{ marginRight: 10 }}
                                onPress={this.handleAddBeneficiary}
                            >
                                Add
                            </Button>
                            <Button
                                mode="contained"
                                disabled={addInProgress}
                                onPress={() => this.setState({
                                    modalNewBeneficiary: false,
                                    newBeneficiaryAddress: ''
                                })}
                            >
                                Cancel
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </>
        );
    }
}

export default connector(AddBeneficiary);