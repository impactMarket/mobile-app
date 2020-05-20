import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import {
    connect,
    ConnectedProps,
} from 'react-redux';
import {
    IRootState,
    ICommunityInfo,
} from '../../helpers/types';
import {
    Card,
    Headline,
    ProgressBar,
    DataTable,
    Title,
    Button,
    Appbar,
    Avatar,
    Paragraph,
} from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { getAllValidCommunities } from '../../services';
import { NavigationState, NavigationProp, useNavigation } from '@react-navigation/native';



const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux
function MyCircleScreen(props: Props) {
    const navigation = useNavigation();

    return (
        <SafeAreaView>
            <Appbar.Header style={styles.appbar}>
                <Appbar.Content title="My Circle" />
                <Appbar.Action icon="help-circle-outline" />
                <Appbar.Action icon="qrcode" />
            </Appbar.Header>
            <ScrollView style={styles.scrollView}>
                <Card style={styles.card}>
                    <Card.Cover style={{ height: 100 }} source={{ uri: 'https://picsum.photos/500' }} />
                    <Card.Content>
                        <Paragraph>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sit amet augue justo. In id dolor nec nisi vulputate cursus in a magna. Donec varius elementum ligula, vitae vulputate felis eleifend non.</Paragraph>
                        <Button
                            mode="contained"
                            onPress={() => navigation.navigate('Communities')}
                        >
                            Find communities to donate
                        </Button>
                    </Card.Content>
                </Card>
                <Card style={styles.card}>
                    <Card.Content>
                        <Paragraph>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sit amet augue justo. In id dolor nec nisi vulputate cursus in a magna. Donec varius elementum ligula, vitae vulputate felis eleifend non.</Paragraph>
                        <Button
                            mode="outlined"
                            onPress={() => navigation.navigate('CreateCommunityScreen')}
                        >
                            Create Community
                        </Button>
                    </Card.Content>
                </Card>
                <Card style={styles.card}>
                    <Card.Content>
                        <Paragraph>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sit amet augue justo. In id dolor nec nisi vulputate cursus in a magna. Donec varius elementum ligula, vitae vulputate felis eleifend non.</Paragraph>
                    </Card.Content>
                </Card>
                {/** TODO: introduce empty space */}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        marginTop: 10,
        marginBottom: 80
    },
    card: {
        marginHorizontal: 20,
        marginVertical: 10,
    },
    appbar: {
        backgroundColor: 'transparent',
    },
});

export default connector(MyCircleScreen);