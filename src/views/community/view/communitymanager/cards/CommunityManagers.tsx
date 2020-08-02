import React from 'react';
import {
    connect,
    ConnectedProps
} from 'react-redux';
import {
    IRootState,
} from 'helpers/types';
import {
    Button,
    Card,
} from 'react-native-paper';
import ListCommunityManagers from 'components/ListCommunityManagers';


interface ICommunityManagersProps {
    managers: string[];
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};
const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & ICommunityManagersProps

class CommunityManagers extends React.Component<Props, {}> {

    render() {
        const { managers } = this.props;

        return (
            <>
                <Card elevation={8} style={{ marginVertical: 15 }}>
                    <Card.Title
                        title=""
                        style={{ backgroundColor: '#f0f0f0' }}
                        subtitleStyle={{ color: 'grey' }}
                        subtitle="COMMUNITY LEADERS"
                    />
                    <Card.Content>
                        <ListCommunityManagers
                            managers={managers}
                        />
                        <Button
                            mode="outlined"
                            style={{ width: '100%' }}
                            disabled={true}
                        >
                            Add Community Leader
                        </Button>
                    </Card.Content>
                </Card>
            </>
        );
    }
}

export default connector(CommunityManagers);