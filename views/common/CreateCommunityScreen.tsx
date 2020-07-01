import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    ScrollView,
    Alert,
    Text,
    View,
    Picker,
    ImageBackground,
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
import { humanifyNumber, loadContracts, validateEmail, getUserCurrencySymbol, amountToUserCurrency } from '../../helpers';
import Header from '../../components/Header';
import { editCommunity, uploadImageAsync } from '../../services/api';
import * as ImagePicker from 'expo-image-picker';


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
    const [isEmailValid, setIsEmailValid] = useState(true); // avoid initial error TODO: fix!
    const [isClaimAmountValid, setIsClaimAmountValid] = useState(false);
    const [isIncrementalIntervalValid, setIsIncrementalIntervalValid] = useState(false);
    const [isMaxClaimValid, setIsMaxClaimValid] = useState(false);
    //
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [email, setEmail] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [claimAmount, setClaimAmount] = useState('');
    const [baseInterval, setBaseInterval] = useState('86400');
    const [incrementInterval, setIncrementalInterval] = useState('');
    const [maxClaim, setMaxClaim] = useState('');
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
                setClaimAmount(humanifyNumber(community.vars._claimAmount).toString());
                setBaseInterval(community.vars._baseInterval);
                setIncrementalInterval(new BigNumber(community.vars._incrementInterval).div(60).toString());
                setMaxClaim(humanifyNumber(community.vars._maxClaim).toString());
                // currency

                setIsNameValid(true);
                setIsDescriptionValid(true);
                setIsCityValid(true);
                setIsClaimAmountValid(true);
                setIsIncrementalIntervalValid(true);
                setIsMaxClaimValid(true);

                setEditing(true);
            }
        }
    }, []);

    useEffect(() => {
        if (props.network.community !== undefined && sending === true) {
            // wait until community is not undefined!
            setSending(false);
            navigation.goBack();
            Alert.alert(
                'Success',
                'Your request to create a new community was placed!',
                [
                    { text: 'OK' },
                ],
                { cancelable: false }
            );
        }
    }, [props.network.community]);

    const submitNewCommunity = async () => {
        if (gpsLocation === undefined) {
            // TODO: show error!
            return;
        }
        if (new BigNumber(maxClaim).lt(claimAmount)) {
            Alert.alert('Failure',
                'Claim Amount should be bigger that Max Claim!',
                [{ text: 'OK' }], { cancelable: false }
            );
            return;
        }
        if (new BigNumber(claimAmount).eq(0)) {
            Alert.alert('Failure',
                'Claim Amount should not be zero!',
                [{ text: 'OK' }], { cancelable: false }
            );
            return;
        }
        if (new BigNumber(maxClaim).eq(0)) {
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
                _claimAmount,
                _baseInterval,
                _maxClaim,
                _incrementInterval
            } = props.route.params.community.vars;
            try {
                if (
                    !new BigNumber(claimAmount).multipliedBy(decimals).eq(_claimAmount) ||
                    baseInterval !== _baseInterval ||
                    parseInt(incrementInterval, 10) * 3600 !== parseInt(_incrementInterval, 10) ||
                    !new BigNumber(maxClaim).multipliedBy(decimals).eq(_maxClaim)
                ) {
                    // if one of the fields is changed, sent contract edit!
                    await celoWalletRequest(
                        props.user.celoInfo.address,
                        community.contractAddress,
                        await props.network.contracts.communityContract.methods.edit(
                            new BigNumber(claimAmount).multipliedBy(decimals).toString(),
                            new BigNumber(maxClaim).multipliedBy(decimals).toString(),
                            baseInterval,
                            (parseInt(incrementInterval, 10) * 60).toString(),
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
                    await loadContracts(props.user.celoInfo.address, props.network.kit, props);
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
            let uploadResponse, uploadImagePath;
            try {
                uploadResponse = await uploadImageAsync(coverImage);
                if (uploadResponse?.status === 200) {
                    uploadImagePath = uploadResponse.data.location;
                }
                // console.log('uploadResponse', uploadResponse);
            } catch (e) {
                console.log({ uploadResponse });
                console.log({ uploadImagePath });
                console.log({ e });
                Alert.alert(
                    'Failure',
                    'An error happened while placing the request to create a community!',
                    [
                        { text: 'OK' },
                    ],
                    { cancelable: false }
                );
                setSending(false);
                return;
            }
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
                uploadImagePath,
                {
                    claimAmount: new BigNumber(claimAmount).multipliedBy(decimals).toString(),
                    maxClaim: new BigNumber(maxClaim).multipliedBy(decimals).toString(),
                    baseInterval: baseInterval,
                    incrementInterval: (parseInt(incrementInterval, 10) * 60).toString(),
                },
            ).then((success) => {
                if (success) {
                    loadContracts(props.user.celoInfo.address, props.network.kit, props);
                    // the remaining process is done in useEffect
                } else {
                    Alert.alert(
                        'Failure',
                        'An error happened while placing the request to create a community!',
                        [
                            { text: 'OK' },
                        ],
                        { cancelable: false }
                    );
                    setSending(false);
                }
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

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            setCoverImage(result.uri);
        }
    };

    const isSubmitAvailable = isNameValid &&
        isDescriptionValid &&
        isCityValid &&
        isCountryValid &&
        isEmailValid && email.length > 0 &&
        isClaimAmountValid &&
        isIncrementalIntervalValid &&
        isMaxClaimValid &&
        gpsLocation !== undefined &&
        coverImage.length > 0 &&
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
                                <ImageBackground source={coverImage.length === 0 ? require('../../assets/placeholder.png') : { uri: coverImage }} style={styles.imageCover}>
                                    <Button
                                        mode="contained"
                                        style={{ margin: 16 }}
                                        onPress={pickImage}
                                    >
                                        {coverImage.length === 0 ? 'Select Cover Image' : 'Change Cover Image'}
                                    </Button>
                                </ImageBackground>
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
                                    maxLength={512}
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
                                    whenEndEditing={(e) => setIsEmailValid(validateEmail(email))}
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
                            lineHeight: 13,
                            letterSpacing: 0.7,
                            marginTop: 20,
                            marginHorizontal: 10
                        }}
                    >
                        CONTRACT DETAILS
                    </Headline>
                    <View style={{ marginBottom: 15 }}>
                        <View>
                            <ValidatedTextInput
                                label="Claim Amount"
                                placeholder="$0"
                                marginBox={10}
                                keyboardType="numeric"
                                value={claimAmount}
                                required={true}
                                setValid={setIsClaimAmountValid}
                                onChangeText={value => setClaimAmount(value)}
                            />
                            {
                                claimAmount.length > 0 && <Text
                                    style={styles.aroundCurrencyValue}
                                >
                                    around {getUserCurrencySymbol(props.user.user)}
                                    {amountToUserCurrency(
                                        new BigNumber(claimAmount)
                                            .multipliedBy(new BigNumber(10).pow(config.cUSDDecimals)),
                                        props.user.user
                                    )}
                                </Text>
                            }
                        </View>
                        <Divider />
                        <View>
                            <ValidatedTextInput
                                label="Total claim amount per beneficiary"
                                placeholder="$0"
                                marginBox={10}
                                keyboardType="numeric"
                                value={maxClaim}
                                required={true}
                                setValid={setIsMaxClaimValid}
                                onChangeText={value => setMaxClaim(value)}
                            />
                            {
                                maxClaim.length > 0 && <Text
                                    style={styles.aroundCurrencyValue}
                                >
                                    around {getUserCurrencySymbol(props.user.user)}
                                    {amountToUserCurrency(
                                        new BigNumber(maxClaim)
                                            .multipliedBy(new BigNumber(10).pow(config.cUSDDecimals)),
                                        props.user.user
                                    )}
                                </Text>
                            }
                        </View>
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
                            label="Time increment after each claim (in minutes)"
                            marginBox={10}
                            keyboardType="numeric"
                            value={incrementInterval}
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
    },
    imageCover: {
        flex: 1,
        flexDirection: 'column',
        resizeMode: 'cover',
        justifyContent: "flex-end",
        width: '100%',
        height: 180,
    },
    aroundCurrencyValue: {
        position: 'absolute',
        marginHorizontal: 10,
        marginVertical: 50,
        right: 0,
        fontFamily: "Gelion-Regular",
        fontSize: 15,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 15,
        letterSpacing: 0.25,
        color: "#7e8da6"
    }
});

export default connector(CreateCommunityScreen);