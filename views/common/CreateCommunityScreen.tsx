import React, { useState, useEffect } from 'react';
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
    Paragraph,
    Headline,
    Divider
} from 'react-native-paper';
import {
    connect,
    ConnectedProps
} from 'react-redux';
import { IRootState, ICommunityInfo, IUserState } from '../../helpers/types';
import { requestCreateCommunity, celoWalletRequest } from '../../services';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import config from '../../config';
import BigNumber from 'bignumber.js';
import ValidatedTextInput from '../../components/ValidatedTextInput';
import { humanifyNumber, loadContracts, validateEmail } from '../../helpers';
import Header from '../../components/Header';
import { editCommunity } from '../../services/api';


interface ICreateCommunityScreen {
    route: {
        params: {
            community: ICommunityInfo,
            user: IUserState,
        }
    }
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};
const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & ICreateCommunityScreen;

function CreateCommunityScreen(props: Props) {
    const navigation = useNavigation();

    const [editing, setEditing] = useState(false);
    const [sending, setSending] = useState(false);
    const [gpsLocation, setGpsLocation] = useState<Location.LocationData>();
    //
    const [isNameValid, setIsNameValid] = useState(false);
    const [isDescriptionValid, setIsDescriptionValid] = useState(false);
    const [isCityValid, setIsCityValid] = useState(false);
    const [isCountryValid, setIsCountryValid] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isAmountByClaimValid, setIsAmountByClaimValid] = useState(false);
    const [isIncrementalIntervalValid, setIsIncrementalIntervalValid] = useState(false);
    const [isClaimHardcapValid, setIsClaimHardcapValid] = useState(false);
    //
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [email, setEmail] = useState('');
    const [coverImage, setCoverImage] = useState('https://picsum.photos/600');
    const [amountByClaim, setAmountByClaim] = useState('');
    const [baseInterval, setBaseInterval] = useState('86400');
    const [incrementalInterval, setIncrementalInterval] = useState('');
    const [claimHardcap, setClaimHardcap] = useState('');
    const [visibility, setVisivility] = useState('public');

    useEffect(() => {
        if (props.route.params !== undefined) {
            const community = props.route.params.community as ICommunityInfo;
            if (community !== undefined) {
                setName(community.name);
                setDescription(community.description);
                setCity(community.city);
                setCountry(community.country);
                setEmail(community.email);
                setVisivility(community.visibility);
                setGpsLocation({
                    coords: {
                        latitude: community.location.latitude,
                        longitude: community.location.longitude,
                    }
                } as Location.LocationData)
                // cover image
                setAmountByClaim(humanifyNumber(community.vars._amountByClaim).toString());
                setBaseInterval(community.vars._baseIntervalTime);
                setIncrementalInterval(new BigNumber(community.vars._incIntervalTime).div(3600).toString());
                setClaimHardcap(humanifyNumber(community.vars._claimHardCap).toString());
                // currency

                setIsNameValid(true);
                setIsDescriptionValid(true);
                setIsCityValid(true);
                setIsAmountByClaimValid(true);
                setIsIncrementalIntervalValid(true);
                setIsClaimHardcapValid(true);

                setEditing(true);
            }
        }
    }, []);

    const submitNewCommunity = async () => {
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
        setSending(true);
        const decimals = new BigNumber(10).pow(config.cUSDDecimals);
        if (editing) {
            const community = props.route.params.community as ICommunityInfo;
            const {
                _amountByClaim,
                _baseIntervalTime,
                _claimHardCap,
                _incIntervalTime
            } = props.route.params.community.vars;
            try {
                if (
                    !new BigNumber(amountByClaim).multipliedBy(decimals).eq(_amountByClaim) ||
                    baseInterval !== _baseIntervalTime ||
                    parseInt(incrementalInterval, 10) * 3600 !== parseInt(_incIntervalTime, 10) ||
                    !new BigNumber(claimHardcap).multipliedBy(decimals).eq(_claimHardCap)
                ) {
                    // if one of the fields is changed, sent contract edit!
                    const cUSDAddress = await props.network.contracts.communityContract.methods.cUSDAddress().call();
                    await celoWalletRequest(
                        props.user.celoInfo.address,
                        community.contractAddress,
                        await props.network.contracts.communityContract.methods.edit(
                            new BigNumber(amountByClaim).multipliedBy(decimals).toString(),
                            baseInterval,
                            (parseInt(incrementalInterval, 10) * 3600).toString(),
                            new BigNumber(claimHardcap).multipliedBy(decimals).toString(),
                            cUSDAddress,
                        ),
                        'editcommunity',
                        props.network,
                    )
                }
                const success = await editCommunity(
                    community.publicId,
                    name,
                    description,
                    city,
                    country,
                    {
                        latitude: gpsLocation!.coords.latitude,
                        longitude: gpsLocation!.coords.longitude,
                    },
                    email,
                    visibility,
                    coverImage
                )
                if (!success) {
                    throw new Error('Some error!');
                } else {
                    navigation.goBack();
                    Alert.alert(
                        'Success',
                        'Your community was updated!',
                        [
                            { text: 'OK' },
                        ],
                        { cancelable: false }
                    );
                }
            } catch (e) {
                Alert.alert(
                    'Failure',
                    'An error happened while updating your community!',
                    [
                        { text: 'OK' },
                    ],
                    { cancelable: false }
                );
            } finally {
                setSending(false);
            }
        } else {
            requestCreateCommunity(
                props.user.celoInfo.address,
                name,
                description,
                city,
                country,
                {
                    latitude: gpsLocation!.coords.latitude,
                    longitude: gpsLocation!.coords.longitude,
                },
                email,
                visibility,
                coverImage,
                {
                    amountByClaim: new BigNumber(amountByClaim).multipliedBy(decimals).toString(),
                    baseInterval: baseInterval,
                    incrementalInterval: (parseInt(incrementalInterval, 10) * 3600).toString(),
                    claimHardcap: new BigNumber(claimHardcap).multipliedBy(decimals).toString(),
                },
            ).then((success) => {
                if (success) {
                    loadContracts(props.user.celoInfo.address, props.network.kit, props)
                        .then(() => {
                            navigation.goBack();
                            Alert.alert(
                                'Success',
                                'Your request to create a new community was placed!',
                                [
                                    { text: 'OK' },
                                ],
                                { cancelable: false }
                            );
                        })
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
        isCityValid &&
        isCountryValid &&
        isEmailValid &&
        isAmountByClaimValid &&
        isIncrementalIntervalValid &&
        isClaimHardcapValid &&
        gpsLocation !== undefined &&
        !sending;

    if (props.user.celoInfo.address.length === 0) {
        return <View>
            <Header
                title={editing ? 'Edit Community' : 'New Community'}
                navigation={navigation}
                hasBack={true}
            />
            <View style={styles.container}>
                <Text>You need to login to create communities.</Text>
            </View>
        </View>
    }

    return (
        <>
            <Header
                title={editing ? 'Edit' : 'Create'}
                navigation={navigation}
                hasBack={true}
            >
                <Button
                    mode="text"
                    loading={sending}
                    disabled={!isSubmitAvailable}
                    onPress={() => submitNewCommunity()}
                >
                    Submit
                </Button>
            </Header>
            <ScrollView>
                <View style={styles.container}>
                    <Card>
                        <Card.Content style={{ margin: -16 }}>
                            <Headline
                                style={{
                                    opacity: 0.48,
                                    fontFamily: "Gelion-Regular",
                                    fontSize: 13,
                                    fontWeight: "500",
                                    fontStyle: "normal",
                                    lineHeight: 12,
                                    letterSpacing: 0.7,
                                    paddingHorizontal: 16,
                                    paddingVertical: 10
                                }}
                            >
                                COMMUNITY DETAILS
                            </Headline>
                            <Text style={{
                                ...styles.textNote,
                                backgroundColor: '#f0f0f0',
                                padding: 16,
                                borderTopColor: '#d8d8d8',
                                borderTopWidth: 1,
                                borderBottomColor: '#d8d8d8',
                                borderBottomWidth: 1
                            }}>
                                By creating a community, you are creating a contract where all beneficiaries added to that community by you, have equal access to the funds raised to that contract, based on a few parameters.
                            </Text>
                            <View>
                                <ValidatedTextInput
                                    label="Community Name"
                                    marginBox={16}
                                    value={name}
                                    maxLength={32}
                                    required={true}
                                    setValid={setIsNameValid}
                                    onChangeText={value => setName(value)}
                                />
                                <Divider />
                                <ValidatedTextInput
                                    label="Short Description"
                                    marginBox={16}
                                    value={description}
                                    maxLength={256}
                                    required={true}
                                    setValid={setIsDescriptionValid}
                                    onChangeText={value => setDescription(value)}
                                    multiline={true}
                                    numberOfLines={6}
                                />
                                <Divider />
                                <ValidatedTextInput
                                    label="City"
                                    marginBox={16}
                                    value={city}
                                    maxLength={32}
                                    required={true}
                                    setValid={setIsCityValid}
                                    onChangeText={value => setCity(value)}
                                />
                                <Divider />
                                <ValidatedTextInput
                                    label="Country"
                                    marginBox={16}
                                    value={country}
                                    maxLength={32}
                                    required={true}
                                    setValid={setIsCountryValid}
                                    onChangeText={value => setCountry(value)}
                                />
                                {gpsLocation === undefined && <Button
                                    mode="outlined"
                                    style={{ marginHorizontal: 16 }}
                                    onPress={() => enableGPSLocation()}
                                >
                                    Get GPS Location
                                </Button>}
                                {gpsLocation !== undefined && <Button
                                    icon="check"
                                    mode="outlined"
                                    style={{ marginHorizontal: 16 }}
                                    disabled={true}
                                >
                                    Valid Coordinates
                                </Button>}
                                <ValidatedTextInput
                                    label="Email"
                                    marginBox={16}
                                    value={email}
                                    maxLength={32}
                                    required={true}
                                    keyboardType="email-address"
                                    isValid={isEmailValid}
                                    whenEndEditing={(e) => {
                                        setIsEmailValid(validateEmail(email));
                                        console.log(email, validateEmail(email));
                                    }}
                                    onChangeText={value => setEmail(value)}
                                />
                            </View>
                        </Card.Content>
                    </Card>
                    <Headline
                        style={{
                            opacity: 0.48,
                            fontFamily: "Gelion-Regular",
                            fontSize: 13,
                            fontWeight: "500",
                            fontStyle: "normal",
                            lineHeight: 12,
                            letterSpacing: 0.7,
                            marginTop: 20,
                            marginHorizontal: 10
                        }}
                    >
                        CONTRACT DETAILS
                    </Headline>
                    <View style={{ marginBottom: 15 }}>
                        <ValidatedTextInput
                            label="Claim Amount"
                            marginBox={10}
                            keyboardType="numeric"
                            value={amountByClaim}
                            required={true}
                            setValid={setIsAmountByClaimValid}
                            onChangeText={value => setAmountByClaim(value)}
                        />
                        <Divider />
                        <ValidatedTextInput
                            label="Total claim amount per beneficiary"
                            marginBox={10}
                            keyboardType="numeric"
                            value={claimHardcap}
                            required={true}
                            setValid={setIsClaimHardcapValid}
                            onChangeText={value => setClaimHardcap(value)}
                        />
                        <Divider />
                        <Paragraph style={styles.inputTextFieldLabel}>Frequency</Paragraph>
                        <View style={styles.pickerBorder}>
                            <Picker
                                selectedValue={baseInterval}
                                style={styles.picker}
                                onValueChange={(value) => setBaseInterval(value)}
                            >
                                <Picker.Item label="Hourly" value="3601" />
                                <Picker.Item label="Daily" value="86400" />
                                <Picker.Item label="Weekly" value="604800" />
                            </Picker>
                        </View>
                        <ValidatedTextInput
                            label="Time increment after each claim (in hours)"
                            marginBox={10}
                            keyboardType="numeric"
                            value={incrementalInterval}
                            required={true}
                            setValid={setIsIncrementalIntervalValid}
                            onChangeText={value => setIncrementalInterval(value)}
                        />
                        <Divider />
                        <Paragraph style={styles.inputTextFieldLabel}>Visibility</Paragraph>
                        <View style={styles.pickerBorder}>
                            <Picker
                                selectedValue={visibility}
                                style={styles.picker}
                                onValueChange={(text) => setVisivility(text)}
                            >
                                <Picker.Item label="Public" value="public" />
                                <Picker.Item label="Private" value="private" />
                            </Picker>
                        </View>
                    </View>
                    <Text style={{ ...styles.textNote, marginVertical: 20 }}>
                        Note: These values should be a minimum basic income that is sufficient to meet your beneficiaries' basic needs. They can claim while there are funds available in the contract. You will have the responsibility to promote your community and to raise funds for it.
                    </Text>
                    <Text style={styles.textNote}>
                        If there is another person or organization among your community you believe is more suitable to drive this initiative, let them know about this possibility and encourage them to create a community.
                    </Text>
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    cardContent: {
        marginLeft: 30,
        marginRight: 30,
    },
    inputTextFieldLabel: {
        marginHorizontal: 10,
        color: 'grey',
        fontFamily: 'Gelion-Thin'
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
    textNote: {
        // color: 'grey',
        fontFamily: 'Gelion-Regular',
    },
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
        fontFamily: 'Gelion-Bold',
        color: 'white'
    },
    communityLocation: {
        fontSize: 20,
        color: 'white'
    },
    picker: {
        height: 50,
        width: '100%',
        fontFamily: 'Gelion-Regular',
    },
    pickerBorder: {
        margin: 10,
        borderStyle: 'solid',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 5
    }
});

export default connector(CreateCommunityScreen);