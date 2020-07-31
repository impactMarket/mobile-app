import React from 'react';
import {
    connect,
    ConnectedProps
} from 'react-redux';
import {
    IRootState,
} from '../../../../../helpers/types';
import {
    Button,
    Portal,
    Dialog,
    List,
    Subheading
} from 'react-native-paper';
import { View } from 'react-native';


interface IListCommunityManagersProps {
    managers: string[];
}
interface IListCommunityManagersState {
    modalListManagers: boolean;
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};
const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & IListCommunityManagersProps

class ListCommunityManagers extends React.Component<Props, IListCommunityManagersState> {

    constructor(props: any) {
        super(props);
        this.state = {
            modalListManagers: false,
        }
    }

    render() {
        const { modalListManagers } = this.state;
        const { managers } = this.props;

        return (
            <>
                <View style={{ flex: 1, flexDirection: 'row', marginVertical: 5 }}>
                    <Subheading>Active</Subheading>
                    <Button
                        mode="contained"
                        style={{ marginLeft: 'auto' }}
                        onPress={() => this.setState({ modalListManagers: true })}
                    >
                        {managers.length}
                    </Button>
                </View>
                <Portal>
                    <Dialog
                        visible={modalListManagers}
                        onDismiss={() => this.setState({ modalListManagers: false })}
                    >
                        <Dialog.Title>Managers</Dialog.Title>
                        <Dialog.Content>
                            {managers.map((manager) => <List.Item
                                key={manager}
                                title="User Name"
                                description={`${manager.slice(0, 12)}..${manager.slice(31, 42)}`}
                            />)}
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button
                                mode="contained"
                                onPress={() => this.setState({
                                    modalListManagers: false
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

export default connector(ListCommunityManagers);