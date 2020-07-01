import React, { useState } from 'react';
import {
    StyleSheet,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import { List, Text } from 'react-native-paper';


function FAQScreen() {
    const navigation = useNavigation();

    const [expanded, setExpanded] = useState(true);

    const handlePress = () => setExpanded(!expanded);
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
                    expanded={expanded}
                    onPress={handlePress}>
                    <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam finibus neque id urna ultricies, vitae auctor purus vulputate. Maecenas viverra augue ac ex iaculis convallis. Praesent nec orci convallis leo tristique facilisis nec nec mi. Etiam vestibulum risus maximus ornare pretium. Nunc posuere ipsum ac aliquam luctus. Aenean scelerisque tellus vel imperdiet pulvinar. Sed facilisis nisi sit amet augue mattis imperdiet. Nulla molestie ut arcu at dapibus. Nunc dictum nisi est, nec vulputate purus placerat dictum.</Text>
                </List.Accordion>
                <List.Accordion
                    title="Do I need to buy crypto to join a community?"
                >
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
        marginHorizontal: 20,
    },
});

export default FAQScreen;