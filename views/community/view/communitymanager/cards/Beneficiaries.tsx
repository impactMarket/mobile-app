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
    Headline,
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
            <Card.Content>
                <Headline
                    style={{
                        opacity: 0.48,
                        fontFamily: "Gelion-Bold",
                        fontSize: 13,
                        fontWeight: "500",
                        fontStyle: "normal",
                        lineHeight: 12,
                        letterSpacing: 0.7,
                    }}
                >
                    BENEFICIARIES
            </Headline>
                <ListBeneficiaries
                    beneficiaries={props.community.beneficiaries}
                />
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