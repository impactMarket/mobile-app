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
    Paragraph
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
import { humanifyNumber } from '../../helpers';
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
    const [currency, setCurrency] = useState('usd');

    useEffect(() => {
        if (props.route.params !== undefined) {
            const community = props.route.params.community as ICommunityInfo;
            if (community !== undefined) {
                setName(community.name);
                setDescription(community.description);
                setLocationTitle(community.location.title);
                setGpsLocation({
                    coords: {
                        latitude: community.location.latitude,
                        longitude: community.location.longitude,
                    }
                } as Location.LocationData)
                // cover image
                setAmountByClaim(humanifyNumber(community.vars._amountByClaim));
                setBaseInterval(community.vars._baseIntervalTime);
                setIncrementalInterval(new BigNumber(community.vars._incIntervalTime).div(3600).toString());
                setClaimHardcap(humanifyNumber(community.vars._claimHardCap));
                // currency

                setIsNameValid(true);
                setIsDescriptionValid(true);
                setIsLocationNameValid(true);
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
                    {
                        title: locationTitle,
                        latitude: gpsLocation!.coords.latitude,
                        longitude: gpsLocation!.coords.longitude,
                    },
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
                title={editing ? 'Edit Community' : 'New Community'}
                navigation={navigation}
                hasBack={true}
            />
            <ScrollView>
                <View style={styles.container}>
                    <Card>
                        <Card.Content style={{ margin: -16 }}>
                            <Text style={{ ...styles.textNote, backgroundColor: '#f0f0f0', padding: 16 }}>
                                By creating a community, you are creating a contract where all beneficiaries added to that community by you, have equal access to the funds raised to that contract, based on a few parameters.
                            </Text>
                            <View
                                style={{
                                    margin: 16
                                }}
                            >
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
                            </View>
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
                                    <Picker.Item label="Hourly" value="3601" />
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
                        {editing ? 'Edit' : 'Create'} Community
                    </Button>
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
    textNote: {
        color: 'grey',
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