import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Alert, Text, View, Picker, TextInput, TextInputProperties } from 'react-native';
import { Card, Button, Paragraph } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from '../../helpers/types';
import { requestCreateCommunity } from '../../services';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import config from '../../config';
import BigNumber from 'bignumber.js';


interface INewCommunityFormFields {
    name: string;
    description: string;
    location: string;
    coverImage: string;
    amountByClaim: string;
    baseInterval: string;
    incrementalInterval: string;
    claimHardcap: string;
    currency: string;
}

const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

interface IStyledTextInputProps extends TextInputProperties {
    label: string;
}
const StyledTextInput = (props: IStyledTextInputProps) => <>
    <Paragraph style={styles.inputTextFieldLabel}>{props.label}</Paragraph>
    <TextInput
        style={styles.inputTextField}
        {...props}
    />
</>;

function CreateCommunityScreen(props: PropsFromRedux) {
    const navigation = useNavigation();

    const [sending, setSending] = useState(false);
    const [location, setLocation] = useState<Location.LocationData>();
    const [newCommunityForm, setNewCommunityForm] = useState<INewCommunityFormFields>(
        {
            name: '',
            description: '',
            location: '',
            coverImage: 'https://picsum.photos/600',
            amountByClaim: '',
            baseInterval: '86400',
            incrementalInterval: '',
            claimHardcap: '',
            currency: '',
        }
    );

    useEffect(() => {
        const requestAccessToLocation = async () => {
            let { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
                // TODO: do some stuff
            }

            let loc = await Location.getCurrentPositionAsync();
            setLocation(loc);
            console.log('loc', loc);
        }
        requestAccessToLocation();
    }, []);

    const submitNewCommunity = () => {
        if (location === undefined) {
            // TODO: show error!
        }
        const decimals = new BigNumber(10).pow(config.cUSDDecimals);
        setSending(true);
        requestCreateCommunity(
            props.user.celoInfo.address,
            newCommunityForm.name,
            newCommunityForm.description,
            {
                title: newCommunityForm.location,
                latitude: location!.coords.latitude,
                longitude: location!.coords.longitude,
            },
            newCommunityForm.coverImage,
            {
                amountByClaim: new BigNumber(newCommunityForm.amountByClaim).multipliedBy(decimals).toString(),
                baseInterval: newCommunityForm.baseInterval,
                incrementalInterval: (parseInt(newCommunityForm.incrementalInterval, 10) * 3600).toString(),
                claimHardcap: new BigNumber(newCommunityForm.claimHardcap).multipliedBy(decimals).toString(),
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

    const handleTextInputChanges = (name: string, value: string) => {
        switch (name) {
            case 'name':
                setNewCommunityForm({ ...newCommunityForm, name: value });
                break;
            case 'description':
                setNewCommunityForm({ ...newCommunityForm, description: value });
                break;
            case 'location':
                setNewCommunityForm({ ...newCommunityForm, location: value });
                break;
            case 'amountByClaim':
                setNewCommunityForm({ ...newCommunityForm, amountByClaim: value });
                break;
            case 'baseInterval':
                setNewCommunityForm({ ...newCommunityForm, baseInterval: value });
                break;
            case 'incrementalInterval':
                setNewCommunityForm({ ...newCommunityForm, incrementalInterval: value });
                break;
            case 'claimHardcap':
                setNewCommunityForm({ ...newCommunityForm, claimHardcap: value });
                break;
        }
    }

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
                        <StyledTextInput
                            label="Name"
                            value={newCommunityForm.name}
                            onChangeText={value => handleTextInputChanges('name', value)}
                        />
                        <StyledTextInput
                            label="Description"
                            value={newCommunityForm.description}
                            onChangeText={value => handleTextInputChanges('description', value)}
                            multiline={true}
                            numberOfLines={6}
                        />
                        <StyledTextInput
                            label="City"
                            value={newCommunityForm.location}
                            onChangeText={value => handleTextInputChanges('location', value)}
                        />
                    </Card.Content>
                </Card>
                <Card style={{ marginVertical: 15 }}>
                    <Card.Content>
                        <Paragraph style={styles.inputTextFieldLabel}>Currency</Paragraph>
                        <View style={styles.pickerBorder}>
                            <Picker
                                selectedValue={newCommunityForm.currency}
                                style={styles.picker}
                                onValueChange={(text, i) => setNewCommunityForm({ ...newCommunityForm, currency: text })}
                            >
                                <Picker.Item label="Dollar (USD)" value="usd" />
                            </Picker>
                        </View>
                        <StyledTextInput
                            label="Claim Amount"
                            keyboardType="numeric"
                            value={newCommunityForm.amountByClaim}
                            onChangeText={value => handleTextInputChanges('amountByClaim', value)}
                        />
                        <Paragraph style={styles.inputTextFieldLabel}>Base Interval</Paragraph>
                        <View style={styles.pickerBorder}>
                            <Picker
                                selectedValue={newCommunityForm.baseInterval}
                                style={styles.picker}
                                onValueChange={(value) => handleTextInputChanges('baseInterval', value)}
                            >
                                <Picker.Item label="Daily" value="86400" />
                                <Picker.Item label="Weekly" value="604800" />
                            </Picker>
                        </View>
                        <StyledTextInput
                            label="Incremental Time (in hours)"
                            keyboardType="numeric"
                            value={newCommunityForm.incrementalInterval}
                            onChangeText={value => handleTextInputChanges('incrementalInterval', value)}
                        />
                        <StyledTextInput
                            label="Max Claim"
                            keyboardType="numeric"
                            value={newCommunityForm.claimHardcap}
                            onChangeText={value => handleTextInputChanges('claimHardcap', value)}
                        />
                    </Card.Content>
                </Card>
                <Button
                    mode="outlined"
                    loading={sending}
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