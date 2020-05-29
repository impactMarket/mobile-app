import React from 'react';
import {
    StyleSheet,
    View,
    Alert,
    AsyncStorage,
} from 'react-native';
import {
    connect,
    ConnectedProps
} from 'react-redux';
import {
    IRootState,
    IBeneficiary,
    STORAGE_USER_FIRST_TIME,
} from '../../helpers/types';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { setUserCeloInfo, setUserIsCommunityManager, setUserIsBeneficiary } from '../../helpers/redux/actions/ReduxActions';


interface IEditProfileProps {
    EditProfileCallback: () => void;
}
interface IEditProfileState {
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};
const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & IEditProfileProps

class EditProfile extends React.Component<Props, IEditProfileState> {

    constructor(props: any) {
        super(props);
        this.state = {
        }
    }

    handleLogout = () => {
        AsyncStorage.clear();
        AsyncStorage.setItem(STORAGE_USER_FIRST_TIME, 'false');
        this.props.dispatch(setUserCeloInfo({
            address: '',
            phoneNumber: '',
            balance: '0',
        }));
        this.props.dispatch(setUserIsCommunityManager(false));
        this.props.dispatch(setUserIsBeneficiary(false));
    }

    render() {
        return (
            <SafeAreaView>
                <Button
                    mode="contained"
                    onPress={this.handleLogout}
                >
                    Logout
                </Button>
            </SafeAreaView>
        );
    }
}

export default connector(EditProfile);