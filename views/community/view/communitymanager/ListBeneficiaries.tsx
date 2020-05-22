import React from 'react';
import {
    connect,
    ConnectedProps
} from 'react-redux';
import {
    IRootState,
} from '../../../../helpers/types';
import {
    Button,
    Portal,
    Dialog,
    List,
} from 'react-native-paper';


interface IListBeneficiariesProps {
    beneficiaries: string[];
}
interface IListBeneficiariesState {
    modalListBeneficiary: boolean;
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};
const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & IListBeneficiariesProps

class ListBeneficiaries extends React.Component<Props, IListBeneficiariesState> {
    constructor(props: any) {
        super(props);
        this.state = {
            modalListBeneficiary: false,
        }
    }

    render() {
        const { modalListBeneficiary } = this.state;
        return (
            <>
                <Button
                    mode="contained"
                    disabled={this.props.beneficiaries.length === 0}
                    style={{ marginLeft: 'auto' }}
                    onPress={() => this.setState({ modalListBeneficiary: true })}
                >
                    {this.props.beneficiaries.length}
                </Button>
                <Portal>
                    <Dialog
                        visible={modalListBeneficiary}
                        onDismiss={() => this.setState({ modalListBeneficiary: false })}
                    >
                        <Dialog.Title>Beneficiaries</Dialog.Title>
                        <Dialog.Content>
                            {this.props.beneficiaries.map((beneficiary) => <List.Item
                                key={beneficiary}
                                title="User Name"
                                description={`${beneficiary.slice(0, 12)}..${beneficiary.slice(31, 42)}`}
                            />)}
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button
                                mode="contained"
                                onPress={() => this.setState({
                                    modalListBeneficiary: false
                                })}
                            >
                                Close
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </>
        );
    }
}

export default connector(ListBeneficiaries);