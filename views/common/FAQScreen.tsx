import React, { useState } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Image,
} from 'react-native';
import * as Linking from 'expo-linking';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import { List, Text } from 'react-native-paper';
import { iptcColors } from '../../helpers';


function FAQScreen() {
    const navigation = useNavigation();
    const [expanded, setExpanded] = useState<string[]>([]);

    const handlePress = (tag: string) => {
        let newExpanded: string[];
        if (expanded.indexOf(tag) === -1) {
            newExpanded = [...expanded];
            newExpanded.push(tag);
        } else {
            newExpanded = expanded.filter((e) => e !== tag);
        }
        setExpanded(newExpanded);
    }
    return (
        <>
            <Header
                title="FAQ"
                navigation={navigation}
                hasBack={true}
            />
            <ScrollView style={styles.contentView}>

                <List.Accordion
                    title="Where can I claim?"
                    expanded={expanded.indexOf('where_can_i_claim') !== -1}
                    onPress={() => handlePress('where_can_i_claim')}
                >
                    <View style={styles.descriptionView}>
                        <Text style={styles.descriptionText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam finibus neque id urna ultricies, vitae auctor purus vulputate. Maecenas viverra augue ac ex iaculis convallis. Praesent nec orci convallis leo tristique facilisis nec nec mi. <Text style={{ color: iptcColors.softBlue }} onPress={() => Linking.openURL('https://google.pt')}>Etiam vestibulum risus maximus</Text> ornare pretium. Nunc posuere ipsum ac aliquam luctus. Aenean scelerisque tellus vel imperdiet pulvinar. Sed facilisis nisi sit amet augue mattis imperdiet. Nulla molestie ut arcu at dapibus. Nunc dictum nisi est, nec vulputate purus placerat dictum.</Text>
                        <Image
                            style={{ width: 50, height: 50 }}
                            source={{
                                uri: 'https://reactnative.dev/img/tiny_logo.png',
                            }}
                        />
                        <Text style={styles.descriptionText}>Mauris ac eros in enim scelerisque commodo. Suspendisse potenti. Vivamus vel dolor enim. Interdum et malesuada fames ac ante ipsum primis in faucibus. Curabitur hendrerit vehicula vestibulum.</Text>
                    </View>
                </List.Accordion>
                <List.Accordion
                    title="Do I need to buy crypto to join a community?"
                    expanded={expanded.indexOf('need_to_buy_crypto_to_join_community') !== -1}
                    onPress={() => handlePress('need_to_buy_crypto_to_join_community')}
                >
                    <View style={styles.descriptionView}>
                        <Text style={styles.descriptionText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam finibus neque id urna ultricies, vitae auctor purus vulputate. Maecenas viverra augue ac ex iaculis convallis. Praesent nec orci convallis leo tristique facilisis nec nec mi.</Text>
                    </View>
                </List.Accordion>
                <List.Accordion
                    title="How can I communicate with my community?"
                >
                </List.Accordion>
                <List.Accordion
                    title="How do I use the money I claimed?"
                >
                </List.Accordion>
                <List.Accordion
                    title="Are communities wallets insured?"
                >
                </List.Accordion>
                <List.Accordion
                    title="How can I leave my community?"
                >
                </List.Accordion>

            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    contentView: {
        paddingHorizontal: 20,
    },
    descriptionView: {
        paddingHorizontal: 20
    },
    descriptionText: {
        opacity: 0.84,
        fontFamily: "Gelion-Regular",
        fontSize: 18,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 25,
        letterSpacing: 0,
        color: "#1e3252"
    }
});

export default FAQScreen;