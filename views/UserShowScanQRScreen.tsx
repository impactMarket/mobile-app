import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from '../helpers/types';
import { useNavigation } from '@react-navigation/native';
import SvgQRCode from 'react-native-qrcode-svg';
import { Paragraph, Headline, Subheading, Card, Button, Text, Avatar } from 'react-native-paper';


const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector>


function UserShowScanQRScreen(props: PropsFromRedux) {
    const navigation = useNavigation();

    useEffect(() => {
    }, []);

    return (
        <ScrollView style={styles.contentView}>
            <Headline>Scan to pay</Headline>
            <Subheading>Show QR to be scanned</Subheading>
            <Card style={styles.card}>
                <Card.Content>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View>
                            <Text>John Doe</Text>
                            <Text style={{ color: 'grey' }}>United States</Text>
                        </View>
                        <Avatar.Image
                            style={{ alignSelf: 'center', marginLeft: 'auto' }}
                            size={58}
                            source={require('../assets/hello.png')}
                        />
                    </View>
                    <View style={styles.qrView}>
                        <SvgQRCode
                            value={props.user.celoInfo.address}
                            size={200}
                        />
                    </View>
                    <Button
                        mode="outlined"
                        onPress={() => console.log('oi')}
                    >
                        Scan to Pay
                    </Button>
                </Card.Content>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    contentView: {
        marginHorizontal: 20,
    },
    card: {
        marginVertical: 10,
    },
    qrView: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
    }
});

export default connector(UserShowScanQRScreen);