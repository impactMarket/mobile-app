import React, { useState, useEffect } from 'react';
import {
    AsyncStorage,
    StyleSheet,
    View,
    Picker,
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
    TextInput,
    Paragraph
} from 'react-native-paper';
import {
    resetUserApp,
    resetNetworkContractsApp,
    setUserInfo
} from '../../helpers/redux/actions/ReduxActions';
import {
    ScrollView
} from 'react-native-gesture-handler';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';
import { getCountryFromPhoneNumber } from '../../helpers';
import ValidatedTextInput from '../../components/ValidatedTextInput';
import { getUser, setUsername, setUserCurrency } from '../../services/api';


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
    const [currency, setCurrency] = useState('usd');

    useEffect(() => {
        setName(props.user.user.name);
        setCurrency(props.user.user.currency);
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.clear();
        await AsyncStorage.setItem(STORAGE_USER_FIRST_TIME, 'false');
        props.dispatch(resetUserApp());
        props.dispatch(resetNetworkContractsApp());
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
                        onEndEditing={(e) => {
                            setUsername(props.user.celoInfo.address, name);
                            props.dispatch(setUserInfo({ ...props.user.user, name }));
                        }}
                        onChangeText={value => setName(value)}
                    />
                    <Paragraph style={styles.inputTextFieldLabel}>Currency</Paragraph>
                    <View style={styles.pickerBorder}>
                        <Picker
                            selectedValue={currency}
                            style={styles.picker}
                            onValueChange={(text) => {
                                setCurrency(text);
                                setUserCurrency(props.user.celoInfo.address, text);
                                props.dispatch(setUserInfo({ ...props.user.user, currency: text }));
                            }}
                        >
                            <Picker.Item label="Dollar (USD)" value="usd" />
                            <Picker.Item label="Euro (EUR)" value="eur" />
                        </Picker>
                    </View>
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
    },
    picker: {
        height: 50,
        width: '100%',
        fontFamily: 'Gelion-Regular',
    },
    pickerBorder: {
        marginVertical: 10,
        borderStyle: 'solid',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 5
    },
    inputTextFieldLabel: {
        color: 'grey',
        fontFamily: 'Gelion-Thin'
    },
});


export default connector(EditProfile);