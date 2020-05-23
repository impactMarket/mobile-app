import React from 'react';
import {
    View,
} from 'react-native';
import {
    connect,
    ConnectedProps
} from 'react-redux';
import {
    IRootState,
    ICommunityInfo,
} from '../../../../../helpers/types';
import {
    Card,
    Subheading,
} from 'react-native-paper';
import {
    getCommunityByContractAddress,
} from '../../../../../services';
import AddBeneficiary from '../components/AddBeneficiary';
import ListBeneficiaries from '../components/ListBeneficiaries';


interface IBeneficiariesProps {
    community: ICommunityInfo;
    updateCommunity: (community: ICommunityInfo) => void;
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};
const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & IBeneficiariesProps

function Beneficiaries(props: Props) {
    return (
        <Card>
            <Card.Title
                title=""
                style={{ backgroundColor: '#f0f0f0' }}
                subtitleStyle={{ color: 'grey' }}
                subtitle="BENEFICIARIES"
            />
            <Card.Content>
                <View style={{ flex: 1, flexDirection: 'row', marginVertical: 5 }}>
                    <Subheading>Accepted</Subheading>
                    <ListBeneficiaries
                        beneficiaries={props.community.beneficiaries}
                    />
                </View>
                <AddBeneficiary
                    addBeneficiaryCallback={() => {
                        const { _address } = props.network.contracts.communityContract;
                        getCommunityByContractAddress(_address)
                            .then((community) => props.updateCommunity(community!));
                    }}
                />
            </Card.Content>
        </Card>
    );
}

export default connector(Beneficiaries);