import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { TextInput, Card, Button, Paragraph } from 'react-native-paper';
import axios from 'axios';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from '../../helpers/types';


interface INewCommunityFormFields {
    name: string;
    description: string;
    location: string;
    coverImage: string;
    claimAmount: string;
    frequency: string;
    timeIncrement: string;
    maxAmount: string;
}
interface ICommunityFormFieldsError {
    name: boolean;
    description: boolean;
    location: boolean;
    coverImage: boolean;
    claimAmount: boolean;
    frequency: boolean;
    timeIncrement: boolean;
    maxAmount: boolean;
}

const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

function CreateCommunityScreen(props: PropsFromRedux) {
    const [newCommunityForm, setNewCommunityForm] = useState<INewCommunityFormFields>(
        {
            name: '',
            description: '',
            location: '',
            coverImage: '',
            claimAmount: '',
            frequency: '',
            timeIncrement: '',
            maxAmount: '',
        }
    );
    const [communityFormError, setCommunityFormError] = useState<ICommunityFormFieldsError>(
        {
            name: false,
            description: false,
            location: false,
            coverImage: false,
            claimAmount: false,
            frequency: false,
            timeIncrement: false,
            maxAmount: false,
        }
    );

    useEffect(() => {

        axios.get('http://192.168.0.209:5000/api/community/all')
            .then(function (response) {
                // handle success
                console.log(response.data);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    });

    const submitNewCommunity = () => {
        if (newCommunityForm.name.length === 0) {
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
        else if (newCommunityForm.claimAmount.length === 0) {
            setCommunityFormError({ ...communityFormError, claimAmount: true });
        }
        else if (newCommunityForm.frequency.length === 0) {
            setCommunityFormError({ ...communityFormError, frequency: true });
        }
        else if (newCommunityForm.timeIncrement.length === 0) {
            setCommunityFormError({ ...communityFormError, timeIncrement: true });
        }
        else if (newCommunityForm.maxAmount.length === 0) {
            setCommunityFormError({ ...communityFormError, maxAmount: true });
        }
        else {
            // TODO: api call to save new community request
            axios.post('http://localhost:5000/api/community/add', {
                // TODO: change to contract address
                // deploy first
                walletAddress: props.user.celoInfo.address,
                name: newCommunityForm.name,
                description: newCommunityForm.description,
                location: {
                    title: newCommunityForm.location,
                    latitude: 5,
                    longitude: 6,
                },
                coverImage: newCommunityForm.coverImage,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            }).then((response: any) => {
                console.log(response);
            }).catch((error: any) => {
                console.log(error);
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
            case 'claimAmount':
                setNewCommunityForm({ ...newCommunityForm, claimAmount: value });
                if (value.length > 0) {
                    setCommunityFormError({ ...communityFormError, claimAmount: false });
                }
                break;
            case 'frequency':
                setNewCommunityForm({ ...newCommunityForm, frequency: value });
                if (value.length > 0) {
                    setCommunityFormError({ ...communityFormError, frequency: false });
                }
                break;
            case 'timeIncrement':
                setNewCommunityForm({ ...newCommunityForm, timeIncrement: value });
                if (value.length > 0) {
                    setCommunityFormError({ ...communityFormError, timeIncrement: false });
                }
                break;
            case 'maxAmount':
                setNewCommunityForm({ ...newCommunityForm, maxAmount: value });
                if (value.length > 0) {
                    setCommunityFormError({ ...communityFormError, maxAmount: false });
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
                        value={newCommunityForm.claimAmount}
                        onChangeText={value => handleTextInputChanges('claimAmount', value)}
                    />
                    <Paragraph
                        style={{
                            color: 'red',
                            display: communityFormError.claimAmount ? 'flex' : 'none'
                        }}
                    >
                        Claim Amount is required!
                    </Paragraph>
                    <TextInput
                        style={styles.inputTextField}
                        mode="outlined"
                        keyboardType="numeric"
                        label="Frequency"
                        value={newCommunityForm.frequency}
                        onChangeText={value => handleTextInputChanges('frequency', value)}
                    />
                    <Paragraph
                        style={{
                            color: 'red',
                            display: communityFormError.frequency ? 'flex' : 'none'
                        }}
                    >
                        Frequency is required!
                    </Paragraph>
                    <TextInput
                        style={styles.inputTextField}
                        mode="outlined"
                        keyboardType="numeric"
                        label="Time Increment"
                        value={newCommunityForm.timeIncrement}
                        onChangeText={value => handleTextInputChanges('timeIncrement', value)}
                    />
                    <Paragraph
                        style={{
                            color: 'red',
                            display: communityFormError.timeIncrement ? 'flex' : 'none'
                        }}
                    >
                        Time Increment is required!
                    </Paragraph>
                    <TextInput
                        style={styles.inputTextField}
                        mode="outlined"
                        keyboardType="numeric"
                        label="Max Amount"
                        value={newCommunityForm.maxAmount}
                        onChangeText={value => handleTextInputChanges('maxAmount', value)}
                    />
                    <Paragraph
                        style={{
                            color: 'red',
                            display: communityFormError.maxAmount ? 'flex' : 'none'
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