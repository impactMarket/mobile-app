import React, { useState } from 'react';
import {
    StyleSheet,
    Clipboard,
    ToastAndroid,
} from 'react-native';
import {
    ICommunityViewInfo,
} from '../../../helpers/types';
import { Button, Dialog, Paragraph, Portal, TextInput } from 'react-native-paper';


export default function Donate(props: { community: ICommunityViewInfo }) {
    const [openModalDonate, setOpenModalDonate] = useState(false);
    const [openModalDonateWithCelo, setOpenModalDonateWithCelo] = useState(false);
    const [amountDonate, setAmountDonate] = React.useState('');
    const { community } = props;

    const handleOpenDonateWithCelo = () => {
        setOpenModalDonateWithCelo(true);
        setOpenModalDonate(false);
    }

    const handleDonateWithCeloWallet = () => {
        // TODO: open modal to introduce amount and then send request
    }

    const handleCopyAddressToClipboard = () => {
        Clipboard.setString(community.contractAddress)
        ToastAndroid.show('Address copied to clipboard!', ToastAndroid.SHORT);
    }

    return (
        <>
            <Button
                mode="contained"
                onPress={() => setOpenModalDonate(true)}
            >
                Donate
            </Button>
            <Portal>
                <Dialog
                    visible={openModalDonate}
                    onDismiss={() => setOpenModalDonate(false)}
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
                            onPress={handleCopyAddressToClipboard}
                        >
                            {community.contractAddress.substr(0, 10)}...{community.contractAddress.substr(community.contractAddress.length - 7, community.contractAddress.length)}
                        </Button>
                        <Button
                            mode="contained"
                            style={{ marginTop: 10 }}
                            onPress={handleOpenDonateWithCelo}
                        >
                            Donate with Celo wallet
                        </Button>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button mode="contained" onPress={() => setOpenModalDonate(false)}>Done</Button>
                    </Dialog.Actions>
                </Dialog>
                <Dialog
                    visible={openModalDonateWithCelo}
                    onDismiss={() => setOpenModalDonateWithCelo(false)}
                >
                    <Dialog.Title>Donate</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla lacinia eros ut tortor rhoncus fringilla.
                        </Paragraph>
                        <TextInput
                            label='Amount'
                            mode="outlined"
                            keyboardType="numeric"
                            value={amountDonate}
                            onChangeText={text => setAmountDonate(text)}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button mode="contained" style={{ marginRight: 10 }} onPress={handleDonateWithCeloWallet}>Donate</Button>
                        <Button mode="contained" onPress={() => setOpenModalDonateWithCelo(false)}>Close</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    );
}

const styles = StyleSheet.create({
});