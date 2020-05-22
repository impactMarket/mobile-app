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
} from '../../../../helpers/types';
import {
    Button,
    Portal,
    Dialog,
    Paragraph,
} from 'react-native-paper';
import {
    celoWalletRequest,
} from '../../../../services';
import { BarCodeScanner } from 'expo-barcode-scanner';


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
        }
    }


    handleAddBeneficiary = async () => {
        const { newBeneficiaryAddress } = this.state;
        const { user, network } = this.props;
        const { communityContract } = network.contracts;
        const { address } = user.celoInfo;

        if (communityContract === undefined) {
            // TODO: do something beatiful, la la la
            return;
        }

        // TODO: validate newBeneficiaryAddress

        celoWalletRequest(
            address,
            communityContract.options.address,
            await communityContract.methods.addBeneficiary(newBeneficiaryAddress),
            'accept_beneficiary_request',
            network,
        ).then(() => {

            // TODO: update UI
            setTimeout(() => this.props.addBeneficiaryCallback, 10000);

            Alert.alert(
                'Success',
                'You\'ve accepted the beneficiary request!',
                [
                    { text: 'OK' },
                ],
                { cancelable: false }
            );
        }).catch(() => {
            Alert.alert(
                'Failure',
                'An error happened while accepting the request!',
                [
                    { text: 'OK' },
                ],
                { cancelable: false }
            );

        }).finally(() => {
            this.setState({ modalNewBeneficiary: false })
        });
    }

    handleBarCodeScanned = ({ type, data }: { type: any, data: any }) => {
        this.setState({ scanned: true, newBeneficiaryAddress: data });
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
        } = this.state;
        let barCodeScanner;

        if (hasPermission === null || hasPermission === false) {
            barCodeScanner = <Button onPress={this.handleAskCameraPermission}>Allow camera</Button>;
        } else {
            barCodeScanner = <View
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
        }

        return (
            <>
                <Button
                    mode="outlined"
                    style={{ width: '100%' }}
                    onPress={() => this.setState({ modalNewBeneficiary: true })}
                >
                    Add Beneficiary
                </Button>
                <Portal>
                    <Dialog
                        visible={modalNewBeneficiary}
                        onDismiss={() => this.setState({ modalNewBeneficiary: false })}
                    >
                        <Dialog.Title>Confirmation</Dialog.Title>
                        <Dialog.Content style={{ height: 350, width: '100%' }}>
                            {barCodeScanner}
                            <Paragraph>Current scanned address:</Paragraph>
                            <Paragraph style={{ fontWeight: 'bold' }}>{newBeneficiaryAddress}</Paragraph>
                            <Paragraph>Click Add to add as beneficiary</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button
                                mode="contained"
                                disabled={newBeneficiaryAddress.length === 0}
                                style={{ marginRight: 10 }}
                                onPress={this.handleAddBeneficiary}
                            >
                                Add
                                </Button>
                            <Button
                                mode="contained"
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