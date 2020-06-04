import React, { useState, useEffect } from 'react';
import {
    AsyncStorage,
    StyleSheet,
    View,
} from 'react-native';
import {
    connect,
    ConnectedProps
} from 'react-redux';
import {
    IRootState,
    STORAGE_USER_FIRST_TIME,
} from '../../helpers/types';
import {
    Button,
    Avatar,
    Text,
    TextInput
} from 'react-native-paper';
import {
    setUserCeloInfo,
    setUserIsCommunityManager,
    setUserIsBeneficiary
} from '../../helpers/redux/actions/ReduxActions';
import {
    ScrollView
} from 'react-native-gesture-handler';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';
import { getCountryFromPhoneNumber } from '../../helpers';
import ValidatedTextInput from '../../components/ValidatedTextInput';
import { getUsername, setUsername } from '../../services/api';


interface IEditProfileProps {
    EditProfileCallback: () => void;
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};
const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & IEditProfileProps

function EditProfile(props: Props) {
    const navigation = useNavigation();
    const [name, setName] = useState('');

    useEffect(() => {
        getUsername(props.user.celoInfo.address).then(setName);
    }, []);

    const handleLogout = () => {
        AsyncStorage.clear();
        AsyncStorage.setItem(STORAGE_USER_FIRST_TIME, 'false');
        props.dispatch(setUserCeloInfo({
            address: '',
            phoneNumber: '',
            balance: '0',
        }));
        props.dispatch(setUserIsCommunityManager(false));
        props.dispatch(setUserIsBeneficiary(false));
        navigation.goBack();
    }

    return (
        <>
            <Header
                title="Edit Profile"
                hasBack={true}
                navigation={navigation}
            />
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    <Avatar.Image
                        style={{
                            alignSelf: 'center',
                            marginVertical: 20
                        }}
                        size={121}
                        source={require('../../assets/hello.png')}
                    />
                    <Button
                        mode="contained"
                        disabled={true}
                    >
                        Change Photo
                    </Button>
                    <ValidatedTextInput
                        label="Name"
                        value={name}
                        maxLength={32}
                        required={true}
                        onEndEditing={(e) => setUsername(props.user.celoInfo.address, name)}
                        onChangeText={value => setName(value)}
                    />
                    <TextInput
                        label="Country"
                        style={{ marginVertical: 3 }}
                        value={getCountryFromPhoneNumber(props.user.celoInfo.phoneNumber)}
                        disabled={true}
                    />
                    <TextInput
                        label="Phone Number"
                        style={{ marginVertical: 3 }}
                        value={props.user.celoInfo.phoneNumber}
                        disabled={true}
                    />
                    <Button
                        mode="contained"
                        style={{ marginVertical: 20 }}
                        onPress={handleLogout}
                    >
                        Logout
                    </Button>
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    scrollView: {
    },
    container: {
        marginHorizontal: 20
    }
});


export default connector(EditProfile);