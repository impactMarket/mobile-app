import React, { useState } from 'react';
import {
    StyleSheet,
    ScrollView,
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
import { IRootState } from '../../../../helpers/types';


const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};
const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

function RemovedScreen(props: PropsFromRedux) {
   

    return (
        <ScrollView>
            
        </ScrollView>
    );
}

const styles = StyleSheet.create({
});

export default connector(RemovedScreen);