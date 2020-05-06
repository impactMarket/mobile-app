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
    IBeneficiaryRequest,
    IBasicBeneficiary
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
    celoWalletRequest
} from '../../../services';


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
    beneficiaryRequests: IBeneficiaryRequest[];
    beneficiaries: IBasicBeneficiary[];
    modalConfirmation: boolean;
    requestConfirmation?: IBeneficiaryRequest;
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
        });
        // TODO: load current beneficiaries from a community
    }

    handleAcceptBeneficiaryRequest = async () => {
        // TODO: accept
        const { requestConfirmation } = this.state;
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
        ).then((result) => {
            // TODO: update UI
            console.log('result93', result)
        })
    }

    render() {
        const {
            beneficiaryRequests,
            modalConfirmation,
            requestConfirmation,
            beneficiaries,
        } = this.state;
        return (
            <View>
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
                            description={request.joined}
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