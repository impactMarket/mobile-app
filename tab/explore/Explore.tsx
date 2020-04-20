import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    ImageBackground,
} from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from '../../helpers/types';
import { Card, Title, Paragraph, Button, Avatar, Headline, ProgressBar, DataTable } from 'react-native-paper';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { AntDesign } from '@expo/vector-icons';


interface IExploreProps {
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & IExploreProps
interface IExploreState {
}
class Explore extends React.Component<Props, IExploreState> {

    constructor(props: any) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="rgba(0, 0, 0, 0.2)" translucent />
                {/** */}
                <Headline style={{ margin: 10 }}>Explore</Headline>
                <Card elevation={12} style={styles.card}>
                    <Card.Content style={{ margin: 0 }}>
                        <ImageBackground
                            source={{ uri: 'https://picsum.photos/700' }}
                            resizeMode={'cover'}
                            style={{
                                width: '100%',
                                height: 180,
                                justifyContent: 'center',
                                alignContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{ fontSize: 25, fontWeight: 'bold', color:'white' }}>Fehsolna</Text>
                            <Text style={{ fontSize: 20, color:'white' }}><AntDesign name="enviromento" size={20} /> São Paulo</Text>
                        </ImageBackground>
                        <View>
                            <DataTable>
                                <DataTable.Row style={{ borderBottomColor: 'transparent', marginBottom: -20 }}>
                                    <DataTable.Cell>
                                        <Text style={{ fontWeight: 'bold' }}>2</Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell>
                                        <Text style={{ fontWeight: 'bold' }}>14</Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell>
                                        <Text style={{ fontWeight: 'bold' }}>$1/day</Text>
                                    </DataTable.Cell>
                                </DataTable.Row>

                                <DataTable.Row style={{ borderBottomColor: 'transparent'}}>
                                    <DataTable.Cell>
                                        <Text style={{ color: 'grey' }}>Backers</Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell>
                                        <Text style={{ color: 'grey' }}>Beneficiaries</Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell>
                                        <Text style={{ color: 'grey' }}>UBI Rate</Text>
                                    </DataTable.Cell>
                                </DataTable.Row>
                            </DataTable>
                            <ProgressBar style={{ marginTop: 10 }} progress={0.5} color={Colors.red800} />
                        </View>
                    </Card.Content>
                </Card>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        margin: 5,
        paddingTop: Expo.Constants.statusBarHeight,
    },
    card: {
        margin: 10,
    }
});

export default connector(Explore);