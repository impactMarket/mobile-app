import React from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from '../../../helpers/types';


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
}
class CommunityManagerView extends React.Component<Props, ICommunityManagerViewState> {

    constructor(props: any) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <View>
                
            </View>
        );
    }
}

const styles = StyleSheet.create({
});

export default connector(CommunityManagerView);