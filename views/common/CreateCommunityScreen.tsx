import React, { useState } from 'react';
import {
    StyleSheet,
    ScrollView,
    Alert,
    Text,
    View,
    Picker,
} from 'react-native';
import {
    Card,
    Button,
    Paragraph
} from 'react-native-paper';
import {
    connect,
    ConnectedProps
} from 'react-redux';
import { IRootState } from '../../helpers/types';
import { requestCreateCommunity } from '../../services';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import config from '../../config';
import BigNumber from 'bignumber.js';
import ValidatedTextInput from '../../components/ValidatedTextInput';


const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};
const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

function CreateCommunityScreen(props: PropsFromRedux) {
    const navigation = useNavigation();

    const [sending, setSending] = useState(false);
    const [gpsLocation, setGpsLocation] = useState<Location.LocationData>();
    //
    const [isNameValid, setIsNameValid] = useState(false);
    const [isDescriptionValid, setIsDescriptionValid] = useState(false);
    const [isLocationNameValid, setIsLocationNameValid] = useState(false);
    const [isAmountByClaimValid, setIsAmountByClaimValid] = useState(false);
    const [isIncrementalIntervalValid, setIsIncrementalIntervalValid] = useState(false);
    const [isClaimHardcapValid, setIsClaimHardcapValid] = useState(false);
    //
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [locationTitle, setLocationTitle] = useState('');
    const [coverImage, setCoverImage] = useState('https://picsum.photos/600');
    const [amountByClaim, setAmountByClaim] = useState('');
    const [baseInterval, setBaseInterval] = useState('86400');
    const [incrementalInterval, setIncrementalInterval] = useState('');
    const [claimHardcap, setClaimHardcap] = useState('');
    const [currency, setCurrency] = useState('');

    const submitNewCommunity = () => {
        if (gpsLocation === undefined) {
            // TODO: show error!
            return;
        }
        if (new BigNumber(claimHardcap).lt(amountByClaim)) {
            Alert.alert('Failure',
                'Claim Amount should be bigger that Max Claim!',
                [{ text: 'OK' }], { cancelable: false }
            );
            return;
        }
        if (new BigNumber(amountByClaim).eq(0)) {
            Alert.alert('Failure',
                'Claim Amount should not be zero!',
                [{ text: 'OK' }], { cancelable: false }
            );
            return;
        }
        if (new BigNumber(claimHardcap).eq(0)) {
            Alert.alert('Failure',
                'Max Claim should not be zero!',
                [{ text: 'OK' }], { cancelable: false }
            );
            return;
        }
        const decimals = new BigNumber(10).pow(config.cUSDDecimals);
        setSending(true);
        requestCreateCommunity(
            props.user.celoInfo.address,
            name,
            description,
            {
                title: locationTitle,
                latitude: gpsLocation!.coords.latitude,
                longitude: gpsLocation!.coords.longitude,
            },
            coverImage,
            {
                amountByClaim: new BigNumber(amountByClaim).multipliedBy(decimals).toString(),
                baseInterval: baseInterval,
                incrementalInterval: (parseInt(incrementalInterval, 10) * 3600).toString(),
                claimHardcap: new BigNumber(claimHardcap).multipliedBy(decimals).toString(),
            },
        ).then((success) => {
            if (success) {
                navigation.goBack();
                Alert.alert(
                    'Success',
                    'Your request to create a new community was placed!',
                    [
                        { text: 'OK' },
                    ],
                    { cancelable: false }
                );
            } else {
                Alert.alert(
                    'Failure',
                    'An error happened while placing the request to create a community!',
                    [
                        { text: 'OK' },
                    ],
                    { cancelable: false }
                );
            }
            setSending(false);
        });
    }

    const enableGPSLocation = async () => {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
            // TODO: do some stuff
            return;
        }

        let loc = await Location.getCurrentPositionAsync();
        setGpsLocation(loc);
        console.log('loc', loc);
    }

    const isSubmitAvailable = isNameValid &&
        isDescriptionValid &&
        isLocationNameValid &&
        isAmountByClaimValid &&
        isIncrementalIntervalValid &&
        isClaimHardcapValid &&
        gpsLocation !== undefined &&
        !sending;

    if (props.user.celoInfo.address.length === 0) {
        return <ScrollView>
            <View style={styles.container}>
                <Text>You need to login to create communities.</Text>
            </View>
        </ScrollView>
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <Card>
                    <Card.Content>
                        <Text style={{ color: 'grey', backgroundColor: '#f0f0f0', paddingVertical: 10 }}>
                            Praesent eget condimentum enim, elementum viverra dui. Nam aliquam, nisi sit amet eleifend finibus, tellus metus dignissim est, vel fringilla urna mi ut lorem. Suspendisse blandit bibendum nunc, non bibendum mauris laoreet non. Morbi eget sollicitudin nunc. In laoreet nisi ac lacus maximus aliquet. Ut ullamcorper rutrum dolor non fringilla. Donec nunc metus, pulvinar ac dapibus eget, faucibus sit amet urna. Aliquam erat volutpat.
                        </Text>
                        <ValidatedTextInput
                            label="Name"
                            value={name}
                            maxLength={32}
                            required={true}
                            setValid={setIsNameValid}
                            onChangeText={value => setName(value)}
                        />
                        <ValidatedTextInput
                            label="Description"
                            value={description}
                            maxLength={256}
                            required={true}
                            setValid={setIsDescriptionValid}
                            onChangeText={value => setDescription(value)}
                            multiline={true}
                            numberOfLines={6}
                        />
                        <ValidatedTextInput
                            label="City"
                            value={locationTitle}
                            maxLength={32}
                            required={true}
                            setValid={setIsLocationNameValid}
                            onChangeText={value => setLocationTitle(value)}
                        />
                        {gpsLocation === undefined && <Button
                            mode="outlined"
                            onPress={() => enableGPSLocation()}
                        >
                            Get GPS Location
                        </Button>}
                        {gpsLocation !== undefined && <Button
                            icon="check"
                            mode="outlined"
                            disabled={true}
                        >
                            Valid Coordinates
                        </Button>}
                    </Card.Content>
                </Card>
                <Card style={{ marginVertical: 15 }}>
                    <Card.Content>
                        <Paragraph style={styles.inputTextFieldLabel}>Currency</Paragraph>
                        <View style={styles.pickerBorder}>
                            <Picker
                                selectedValue={currency}
                                style={styles.picker}
                                onValueChange={(text) => setCurrency(text)}
                            >
                                <Picker.Item label="Dollar (USD)" value="usd" />
                            </Picker>
                        </View>
                        <ValidatedTextInput
                            label="Claim Amount"
                            keyboardType="numeric"
                            value={amountByClaim}
                            required={true}
                            setValid={setIsAmountByClaimValid}
                            onChangeText={value => setAmountByClaim(value)}
                        />
                        <Paragraph style={styles.inputTextFieldLabel}>Base Interval</Paragraph>
                        <View style={styles.pickerBorder}>
                            <Picker
                                selectedValue={baseInterval}
                                style={styles.picker}
                                onValueChange={(value) => setBaseInterval(value)}
                            >
                                <Picker.Item label="Daily" value="86400" />
                                <Picker.Item label="Weekly" value="604800" />
                            </Picker>
                        </View>
                        <ValidatedTextInput
                            label="Incremental Time (in hours)"
                            keyboardType="numeric"
                            value={incrementalInterval}
                            required={true}
                            setValid={setIsIncrementalIntervalValid}
                            onChangeText={value => setIncrementalInterval(value)}
                        />
                        <ValidatedTextInput
                            label="Max Claim"
                            keyboardType="numeric"
                            value={claimHardcap}
                            required={true}
                            setValid={setIsClaimHardcapValid}
                            onChangeText={value => setClaimHardcap(value)}
                        />
                    </Card.Content>
                </Card>
                <Button
                    mode="outlined"
                    loading={sending}
                    disabled={!isSubmitAvailable}
                    onPress={() => submitNewCommunity()}
                >
                    Create Community
                </Button>
                <Text style={{ color: 'grey', marginVertical: 20 }}>
                    Praesent eget condimentum enim, elementum viverra dui. Nam aliquam, nisi sit amet eleifend finibus, tellus metus dignissim est, vel fringilla urna mi ut lorem. Suspendisse blandit bibendum nunc, non bibendum mauris laoreet non. Morbi eget sollicitudin nunc. In laoreet nisi ac lacus maximus aliquet. Ut ullamcorper rutrum dolor non fringilla. Donec nunc metus, pulvinar ac dapibus eget, faucibus sit amet urna. Aliquam erat volutpat.
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    cardContent: {
        marginLeft: 30,
        marginRight: 30,
    },
    inputTextFieldLabel: {
        color: 'grey',
        fontFamily: 'sans-serif-thin'
    },
    inputTextField: {
        padding: 10,
        marginVertical: 5,
        borderStyle: 'solid',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 5
    },
    container: {
        margin: 20
    },
    //
    imageBackground: {
        width: '100%',
        height: 180,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    communityName: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white'
    },
    communityLocation: {
        fontSize: 20,
        color: 'white'
    },
    picker: {
        height: 50,
        width: '100%',
    },
    pickerBorder: {
        marginVertical: 10,
        borderStyle: 'solid',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 5
    }
});

export default connector(CreateCommunityScreen);