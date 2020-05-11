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
    ICommunity,
} from '../../../helpers/types';
import {
    Button,
    List,
    Portal,
    Dialog,
    Paragraph
} from 'react-native-paper';
import {
    getBeneficiariesRequestByCommunity,
    getCommunityByContractAddress,
    celoWalletRequest,
    acceptBeneficiaryRequest
} from '../../../services';
import { getBeneficiariesByCommunity } from '../../../services/api';


interface ICommunityManagerViewProps {
    navigation: any;
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & ICommunityManagerViewProps
interface ICommunityManagerViewState {
    beneficiaryRequests: IBeneficiary[];
    beneficiaries: IBeneficiary[];
    modalConfirmation: boolean;
    requestConfirmation?: IBeneficiary;
    community?: ICommunity;
}
class CommunityManagerView extends React.Component<Props, ICommunityManagerViewState> {

    constructor(props: any) {
        super(props);
        this.state = {
            beneficiaryRequests: [],
            beneficiaries: [],
            modalConfirmation: false,
        }
    }

    componentDidMount = () => {
        getCommunityByContractAddress(
            this.props.network.contracts.communityContract._address,
        ).then((community) => {
            if (community === undefined) {
                // TODO: show error
                return;
            }
            getBeneficiariesRequestByCommunity(community.publicId)
                .then((beneficiaryRequests) => this.setState({ beneficiaryRequests }))
            getBeneficiariesByCommunity(community.contractAddress)
                .then((beneficiaries) => this.setState({ beneficiaries }))
            this.setState({ community });
        });
        // TODO: load current beneficiaries from a community
    }

    handleAcceptBeneficiaryRequest = async () => {
        // TODO: accept
        const { requestConfirmation, community } = this.state;
        const { user, network } = this.props;
        const { communityContract } = network.contracts;
        const { address } = user.celoInfo;

        if (communityContract === undefined) {
            // TODO: do something beatiful, la la la
            return;
        }

        celoWalletRequest(
            address,
            communityContract.options.address,
            await communityContract.methods.addBeneficiary(requestConfirmation?.walletAddress),
            'accept_beneficiary_request',
            network,
        ).then(async (result) => {
            // TODO: update UI (sending)
            const success = await acceptBeneficiaryRequest(result.transactionHash, community!.publicId);
            if (success) {
                Alert.alert(
                    'Success',
                    'You\'ve accepted the beneficiary request!',
                    [
                        { text: 'OK' },
                    ],
                    { cancelable: false }
                );
            } else {
                Alert.alert(
                    'Failure',
                    'An error happened while accepting the request!',
                    [
                        { text: 'OK' },
                    ],
                    { cancelable: false }
                );
            }
            // TODO: update UI (sent)
            this.setState({ modalConfirmation: false })
        })
    }

    render() {
        const {
            beneficiaryRequests,
            modalConfirmation,
            requestConfirmation,
            beneficiaries,
            community,
        } = this.state;
        if (community === undefined) {
            return <View>
                <Paragraph>Loading...</Paragraph>
            </View>
        }
        return (
            <View>
                <View>
                    <Paragraph>contractAddress {community.contractAddress}</Paragraph>
                    <Paragraph>createdAt {community.createdAt}</Paragraph>
                    <Paragraph>description {community.description}</Paragraph>
                    <Paragraph>location {community.location.title}</Paragraph>
                    <Paragraph>name {community.name}</Paragraph>
                </View>
                <List.Section>
                    <List.Subheader>Pending requests</List.Subheader>
                    {beneficiaryRequests.map((request) =>
                        <List.Item
                            key={request.walletAddress}
                            title={request.walletAddress}
                            description={request.createdAt}
                            onPress={() => this.setState({ requestConfirmation: request, modalConfirmation: true })}
                        />
                    )}
                </List.Section>
                <List.Section>
                    <List.Subheader>Community Beneficiaries</List.Subheader>
                    {beneficiaries.map((request) =>
                        <List.Item
                            key={request.walletAddress}
                            title={request.walletAddress}
                            description={request.createdAt}
                        />
                    )}
                </List.Section>
                <Portal>
                    <Dialog
                        visible={modalConfirmation}
                        onDismiss={() => this.setState({ modalConfirmation: false })}
                    >
                        <Dialog.Title>Confirmation</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>Do you really want to approve {requestConfirmation?.walletAddress}?</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button mode="contained" style={{ marginRight: 10 }} onPress={this.handleAcceptBeneficiaryRequest}>Accept</Button>
                            <Button mode="contained" onPress={() => this.setState({ modalConfirmation: false })}>Done</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
});

export default connector(CommunityManagerView);