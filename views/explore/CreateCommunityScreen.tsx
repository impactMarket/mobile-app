import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Card, Button, Paragraph } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from '../../helpers/types';
import { requestCreateCommunity } from '../../services';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';


interface INewCommunityFormFields {
    name: string;
    description: string;
    location: string;
    coverImage: string;
    amountByClaim: string;
    baseInterval: string;
    incrementalInterval: string;
    claimHardcap: string;
}
interface ICommunityFormFieldsError {
    name: boolean;
    description: boolean;
    location: boolean;
    coverImage: boolean;
    amountByClaim: boolean;
    baseInterval: boolean;
    incrementalInterval: boolean;
    claimHardcap: boolean;
}

const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

function CreateCommunityScreen(props: PropsFromRedux) {
    const navigation = useNavigation();

    const [location, setLocation] = useState<Location.LocationData>();
    const [newCommunityForm, setNewCommunityForm] = useState<INewCommunityFormFields>(
        {
            name: '',
            description: '',
            location: '',
            coverImage: '',
            amountByClaim: '',
            baseInterval: '',
            incrementalInterval: '',
            claimHardcap: '',
        }
    );
    const [communityFormError, setCommunityFormError] = useState<ICommunityFormFieldsError>(
        {
            name: false,
            description: false,
            location: false,
            coverImage: false,
            amountByClaim: false,
            baseInterval: false,
            incrementalInterval: false,
            claimHardcap: false,
        }
    );

    useEffect(() => {
        const requestAccessToLocation = async () => {
            let { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
                // TODO: do some stuff
            }

            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc);
            // console.log(loc);
        }
        requestAccessToLocation();
    }, []);

    const submitNewCommunity = () => {
        if (location === undefined) {
            // TODO: show error!
        }
        else if (newCommunityForm.name.length === 0) {
            setCommunityFormError({ ...communityFormError, name: true });
        }
        else if (newCommunityForm.description.length === 0) {
            setCommunityFormError({ ...communityFormError, description: true });
        }
        else if (newCommunityForm.location.length === 0) {
            setCommunityFormError({ ...communityFormError, location: true });
        }
        else if (newCommunityForm.coverImage.length === 0) {
            setCommunityFormError({ ...communityFormError, coverImage: true });
        }
        else if (newCommunityForm.amountByClaim.length === 0) {
            setCommunityFormError({ ...communityFormError, amountByClaim: true });
        }
        else if (newCommunityForm.baseInterval.length === 0) {
            setCommunityFormError({ ...communityFormError, baseInterval: true });
        }
        else if (newCommunityForm.incrementalInterval.length === 0) {
            setCommunityFormError({ ...communityFormError, incrementalInterval: true });
        }
        else if (newCommunityForm.claimHardcap.length === 0) {
            setCommunityFormError({ ...communityFormError, claimHardcap: true });
        }
        else {
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
                    amountByClaim: newCommunityForm.amountByClaim,
                    baseInterval: newCommunityForm.baseInterval,
                    incrementalInterval: newCommunityForm.incrementalInterval,
                    claimHardcap: newCommunityForm.claimHardcap,
                },
            ).then(() => {
                navigation.goBack();
                Alert.alert(
                    'Success',
                    'Your request to create a new community was placed!',
                    [
                        { text: 'OK' },
                    ],
                    { cancelable: false }
                );
            }).catch(() => {
                Alert.alert(
                    'Failure',
                    'An error happened while placing the request to create a community!',
                    [
                        { text: 'OK' },
                    ],
                    { cancelable: false }
                );
            });
        }
    }

    const handleTextInputChanges = (name: string, value: string) => {
        switch (name) {
            case 'name':
                setNewCommunityForm({ ...newCommunityForm, name: value });
                if (value.length > 0) {
                    setCommunityFormError({ ...communityFormError, name: false });
                }
                break;
            case 'description':
                setNewCommunityForm({ ...newCommunityForm, description: value });
                if (value.length > 0) {
                    setCommunityFormError({ ...communityFormError, description: false });
                }
                break;
            case 'location':
                setNewCommunityForm({ ...newCommunityForm, location: value });
                if (value.length > 0) {
                    setCommunityFormError({ ...communityFormError, location: false });
                }
                break;
            case 'coverImage':
                setNewCommunityForm({ ...newCommunityForm, coverImage: value });
                if (value.length > 0) {
                    setCommunityFormError({ ...communityFormError, coverImage: false });
                }
                break;
            case 'amountByClaim':
                setNewCommunityForm({ ...newCommunityForm, amountByClaim: value });
                if (value.length > 0) {
                    setCommunityFormError({ ...communityFormError, amountByClaim: false });
                }
                break;
            case 'baseInterval':
                setNewCommunityForm({ ...newCommunityForm, baseInterval: value });
                if (value.length > 0) {
                    setCommunityFormError({ ...communityFormError, baseInterval: false });
                }
                break;
            case 'incrementalInterval':
                setNewCommunityForm({ ...newCommunityForm, incrementalInterval: value });
                if (value.length > 0) {
                    setCommunityFormError({ ...communityFormError, incrementalInterval: false });
                }
                break;
            case 'claimHardcap':
                setNewCommunityForm({ ...newCommunityForm, claimHardcap: value });
                if (value.length > 0) {
                    setCommunityFormError({ ...communityFormError, claimHardcap: false });
                }
                break;
        }
    }

    return (
        <ScrollView>
            <Card>
                <Card.Cover
                    style={{ height: 100 }}
                    source={{ uri: 'https://picsum.photos/600' }}
                />
                <Card.Content style={styles.cardContent}>
                    <TextInput
                        style={styles.inputTextField}
                        mode="outlined"
                        label="Name"
                        value={newCommunityForm.name}
                        onChangeText={value => handleTextInputChanges('name', value)}
                    />
                    <Paragraph
                        style={{
                            color: 'red',
                            display: communityFormError.name ? 'flex' : 'none'
                        }}
                    >
                        Name is required!
                    </Paragraph>
                    <TextInput
                        style={styles.inputTextField}
                        mode="outlined"
                        label="Description"
                        value={newCommunityForm.description}
                        onChangeText={value => handleTextInputChanges('description', value)}
                    />
                    <Paragraph
                        style={{
                            color: 'red',
                            display: communityFormError.description ? 'flex' : 'none'
                        }}
                    >
                        Description is required!
                    </Paragraph>
                    <TextInput
                        style={styles.inputTextField}
                        mode="outlined"
                        label="Location"
                        value={newCommunityForm.location}
                        onChangeText={value => handleTextInputChanges('location', value)}
                    />
                    <Paragraph
                        style={{
                            color: 'red',
                            display: communityFormError.location ? 'flex' : 'none'
                        }}
                    >
                        Location is required!
                    </Paragraph>
                    <TextInput
                        style={styles.inputTextField}
                        mode="outlined"
                        label="Cover Image"
                        value={newCommunityForm.coverImage}
                        onChangeText={value => handleTextInputChanges('coverImage', value)}
                    />
                    <Paragraph
                        style={{
                            color: 'red',
                            display: communityFormError.coverImage ? 'flex' : 'none'
                        }}
                    >
                        Cover Image is required!
                    </Paragraph>
                    <TextInput
                        style={styles.inputTextField}
                        mode="outlined"
                        keyboardType="numeric"
                        label="Claim Amount"
                        value={newCommunityForm.amountByClaim}
                        onChangeText={value => handleTextInputChanges('amountByClaim', value)}
                    />
                    <Paragraph
                        style={{
                            color: 'red',
                            display: communityFormError.amountByClaim ? 'flex' : 'none'
                        }}
                    >
                        Claim Amount is required!
                    </Paragraph>
                    <TextInput
                        style={styles.inputTextField}
                        mode="outlined"
                        keyboardType="numeric"
                        label="Base Interval"
                        value={newCommunityForm.baseInterval}
                        onChangeText={value => handleTextInputChanges('baseInterval', value)}
                    />
                    <Paragraph
                        style={{
                            color: 'red',
                            display: communityFormError.baseInterval ? 'flex' : 'none'
                        }}
                    >
                        baseInterval is required!
                    </Paragraph>
                    <TextInput
                        style={styles.inputTextField}
                        mode="outlined"
                        keyboardType="numeric"
                        label="Time Increment"
                        value={newCommunityForm.incrementalInterval}
                        onChangeText={value => handleTextInputChanges('incrementalInterval', value)}
                    />
                    <Paragraph
                        style={{
                            color: 'red',
                            display: communityFormError.incrementalInterval ? 'flex' : 'none'
                        }}
                    >
                        Time Increment is required!
                    </Paragraph>
                    <TextInput
                        style={styles.inputTextField}
                        mode="outlined"
                        keyboardType="numeric"
                        label="Max Amount"
                        value={newCommunityForm.claimHardcap}
                        onChangeText={value => handleTextInputChanges('claimHardcap', value)}
                    />
                    <Paragraph
                        style={{
                            color: 'red',
                            display: communityFormError.claimHardcap ? 'flex' : 'none'
                        }}
                    >
                        Max Amount is required!
                    </Paragraph>
                    <Button
                        style={styles.inputTextField}
                        mode="contained"
                        onPress={() => submitNewCommunity()}
                    >
                        Create Community
                    </Button>
                </Card.Content>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    cardContent: {
        marginLeft: 30,
        marginRight: 30,
    },
    inputTextField: {
        marginTop: 10,
    },
});

export default connector(CreateCommunityScreen);