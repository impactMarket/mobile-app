import React, { Component } from 'react';
import {
    StyleSheet,
    Clipboard,
    ToastAndroid,
    Alert,
    Platform,
} from 'react-native';
import {
    ICommunityInfo, IRootState,
} from '../../../helpers/types';
import {
    Button,
    Dialog,
    Paragraph,
    Portal,
    TextInput,
} from 'react-native-paper';
import { ConnectedProps, connect } from 'react-redux';
import { celoWalletRequest } from '../../../services';
import BigNumber from 'bignumber.js';


interface IExploreScreenProps {
    community: ICommunityInfo
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & IExploreScreenProps
interface IDonateState {
    openModalDonate: boolean;
    openModalDonateWithCelo: boolean;
    donating: boolean;
    amountDonate: string;
}
class Donate extends Component<Props, IDonateState> {
    constructor(props: any) {
        super(props);
        this.state = {
            openModalDonate: false,
            openModalDonateWithCelo: false,
            donating: false,
            amountDonate: '',
        }
    }

    handleOpenDonateWithCelo = () => {
        this.setState({ openModalDonate: false, openModalDonateWithCelo: true });
    }

    handleDonateWithCeloWallet = async () => {
        this.setState({ donating: true });
        const stableToken = await this.props.network.kit.contracts.getStableToken()
        const cUSDDecimals = await stableToken.decimals();
        const txObject = stableToken.transfer(
            this.props.community.contractAddress,
            new BigNumber(
                this.state.amountDonate
            ).multipliedBy(
                new BigNumber(10).pow(cUSDDecimals)
            ).toString()
        ).txo
        const requestId = "donate-to-community";
        celoWalletRequest(
            this.props.user.celoInfo.address,
            stableToken.address,
            txObject,
            requestId,
            this.props.network,
        ).then(() => {
            Alert.alert(
                'Success',
                'You\'ve donated!',
                [
                    { text: 'OK' },
                ],
                { cancelable: false }
            );
        }).catch(() => {
            Alert.alert(
                'Failure',
                'An error happened while donating!',
                [
                    { text: 'OK' },
                ],
                { cancelable: false }
            );
        }).finally(() => {
            this.setState({
                openModalDonate: false,
                openModalDonateWithCelo: false,
                donating: false,
                amountDonate: '',
            });
        });
    }

    handleCopyAddressToClipboard = () => {
        Clipboard.setString(this.props.community.contractAddress)
        if (Platform.OS === 'android') {
            ToastAndroid.show('Address copied to clipboard!', ToastAndroid.SHORT);
        }
        // TODO: add ios notification
    }

    render() {
        const {
            openModalDonate,
            openModalDonateWithCelo,
            donating,
            amountDonate,
        } = this.state;
        const {
            community,
        } = this.props;

        return (
            <>
                <Button
                    mode="contained"
                    onPress={() => this.setState({ openModalDonate: true })}
                >
                    Donate
                </Button>
                <Portal>
                    <Dialog
                        visible={openModalDonate}
                        onDismiss={() => this.setState({ openModalDonate: false })}
                    >
                        <Dialog.Title>Donate</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla lacinia eros ut tortor rhoncus fringilla.
                            </Paragraph>
                            <Paragraph style={{ marginTop: 20 }}>
                                Donating to {community.name}
                            </Paragraph>
                            <Button
                                mode="contained"
                                onPress={this.handleCopyAddressToClipboard}
                            >
                                {community.contractAddress.substr(0, 10)}...{community.contractAddress.substr(community.contractAddress.length - 7, community.contractAddress.length)}
                            </Button>
                            <Button
                                mode="contained"
                                disabled={this.props.user.celoInfo.address.length === 0}
                                style={{ marginTop: 10 }}
                                onPress={this.handleOpenDonateWithCelo}
                            >
                                Donate with Celo wallet
                            </Button>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button mode="contained" onPress={() => this.setState({ openModalDonate: false })}>Done</Button>
                        </Dialog.Actions>
                    </Dialog>
                    <Dialog
                        visible={openModalDonateWithCelo}
                        onDismiss={() => this.setState({ openModalDonateWithCelo: false })}
                    >
                        <Dialog.Title>Donate</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla lacinia eros ut tortor rhoncus fringilla.
                            </Paragraph>
                            <TextInput
                                label='Amount ($)'
                                mode="outlined"
                                keyboardType="numeric"
                                value={amountDonate}
                                onChangeText={text => this.setState({ amountDonate: text })}
                            />
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button mode="contained" loading={donating} style={{ marginRight: 10 }} onPress={this.handleDonateWithCeloWallet}>Donate</Button>
                            <Button mode="contained" onPress={() => this.setState({ openModalDonateWithCelo: false })}>Close</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </>
        );
    }
}

const styles = StyleSheet.create({
});

export default connector(Donate)