import BackSvg from 'components/svg/header/BackSvg';
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

function StoriesScreen() {
    const [storyCommunity, setStoryCommunity] = useState([
        { id: '00', name: 'Relâmpago McQueen' },
        { id: '01', name: 'Agente Tom Mate' },
        { id: '02', name: 'Doc Hudson' },
        { id: '03', name: 'Cruz Ramirez' },
    ]);

    function createRows(data: any[], columns: number) {
        const rows = Math.floor(data.length / columns); // [A]
        let lastRowElements = data.length - rows * columns; // [B]
        while (lastRowElements !== columns) {
            // [C]
            data.push({
                // [D]
                id: `empty-${lastRowElements}`,
                name: `empty-${lastRowElements}`,
                empty: true,
            });
            lastRowElements += 1; // [E]
        }
        return data; // [F]
    }

    return (
        <FlatList
            data={createRows(storyCommunity, 3)}
            style={{ marginHorizontal: 12 }}
            keyExtractor={(item) => item.id}
            numColumns={3} // Número de colunas
            renderItem={({ item }) => {
                if (item.empty) {
                    return <View style={[styles.item, styles.itemEmpty]} />;
                }
                return (
                    <View style={styles.item}>
                        <Text style={styles.text}>{item.name}</Text>
                    </View>
                );
            }}
        />
    );
}

const styles = StyleSheet.create({
    itemEmpty: {
        backgroundColor: 'transparent',
    },
    item: {
        alignItems: 'center',
        backgroundColor: '#dcda48',
        flexGrow: 1,
        flexBasis: 0,
        margin: 6,
        padding: 20,
        height: 182,
        borderRadius: 8,
    },
    text: {
        color: '#333333',
    },
});

StoriesScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
        headerTitle: 'Stories',
    };
};

export default StoriesScreen;
