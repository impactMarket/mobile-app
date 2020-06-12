import React, { useState } from 'react';
import {
    StyleSheet,
    ScrollView,
} from 'react-native';
import {
    Card,
    Button,
    Paragraph
} from 'react-native-paper';
import {
    connect,
    ConnectedProps
} from 'react-redux';
import { IRootState, IAddressAndName } from '../../../../helpers/types';
import ListActionItem from '../../../../components/ListActionItem';
import Header from '../../../../components/Header';
import { useNavigation } from '@react-navigation/native';
import { celoWalletRequest } from '../../../../services';


interface IAddedScreenProps {
    route: {
        params: {
            beneficiaries: IAddressAndName[];
        }
    }
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};
const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & IAddedScreenProps

function AddedScreen(props: Props) {
    const navigation = useNavigation();
    const beneficiaries = props.route.params.beneficiaries as IAddressAndName[];

    const [removing, setRemoving] = useState(false);

    const handleRemoveBeneficiary = async (beneficiary: string) => {
        const { user, network } = props;
        const { communityContract } = network.contracts;
        const { address } = user.celoInfo;

        setRemoving(true);
        celoWalletRequest(
            address,
            communityContract.options.address,
            await communityContract.methods.removeBeneficiary(beneficiary),
            'removebeneficiary',
            network,
        ).then(() => {
            //
        }).catch((e) => {
            //
        }).finally(() => {
            setRemoving(false);
        })
    }

    return (
        <>
            <Header
                title="Added"
                hasHelp={true}
                hasBack={true}
                navigation={navigation}
            />
            <ScrollView style={{ marginHorizontal: 15 }}>
                {beneficiaries.map((beneficiary) => <ListActionItem
                    key={beneficiary.address}
                    item={{
                        description: '',
                        from: beneficiary.name,
                        key: beneficiary.address,
                        timestamp: 0
                    }}
                >
                    <Button
                        mode="outlined"
                        disabled={removing}
                        loading={removing}
                        style={{ marginVertical: 5 }}
                        onPress={() => handleRemoveBeneficiary(beneficiary.address)}
                    >
                        Remove
                </Button>
                </ListActionItem>)}
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
});

export default connector(AddedScreen);