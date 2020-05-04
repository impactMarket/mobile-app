import React, { useState } from 'react';
import {
    StyleSheet, Alert,
} from 'react-native';
import {
    ICommunityViewInfo,
} from '../../../helpers/types';
import {
    Button,
    Dialog,
    Paragraph,
    Portal,
} from 'react-native-paper';
import { requestJoinAsBeneficiary } from '../../../services';


export default function ApplyAsBeneficiary(props: { community: ICommunityViewInfo, beneficiaryWalletAddress: string }) {
    const [openModalApplyAsBeneficiary, setOpenModalApplyAsBeneficiary] = useState(false);
    const { community } = props;

    const handleApplyHasBeneficiary = () => {
        requestJoinAsBeneficiary(
            props.beneficiaryWalletAddress,
            community.publicId,
        ).then((success) => {
            if (success) {
                Alert.alert(
                    'Success',
                    'Your request as been sent.',
                    [
                        { text: 'OK' },
                    ],
                    { cancelable: false }
                );
            } else {
                Alert.alert(
                    'Failure',
                    'An error occurred!',
                    [
                        { text: 'OK' },
                    ],
                    { cancelable: false }
                );
            }
            setOpenModalApplyAsBeneficiary(false);
        })
    }

    return (
        <>
            <Button
                style={{ margin: 20 }}
                mode="contained"
                onPress={() => setOpenModalApplyAsBeneficiary(true)}
            >
                Apply as Beneficiary
            </Button>
            <Portal>
                <Dialog
                    visible={openModalApplyAsBeneficiary}
                    onDismiss={() => setOpenModalApplyAsBeneficiary(false)}
                >
                    <Dialog.Title>Apply as Beneficicary</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla lacinia eros ut tortor rhoncus fringilla. Quisque imperdiet, arcu ut iaculis dignissim, massa leo vehicula nisl, in semper velit elit vitae eros.
                        </Paragraph>
                        <Paragraph style={{ marginTop: 20, fontWeight: 'bold' }}>Applying to {community.name}</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button mode="contained" style={{ marginRight: 10 }} onPress={() => handleApplyHasBeneficiary()}>
                            Apply
                    </Button>
                        <Button mode="contained" onPress={() => setOpenModalApplyAsBeneficiary(false)}>
                            Cancel
                    </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    );
}

const styles = StyleSheet.create({
});