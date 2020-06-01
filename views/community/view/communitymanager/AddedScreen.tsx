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
import ListActionItem from '../../../../components/ListActionItem';


interface IAddedScreenProps {
    route: {
        params: {
            beneficiaries: string[];
        }
    }
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};
const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & IAddedScreenProps

function AddedScreen(props: Props) {
    const beneficiaries = props.route.params.beneficiaries as string[];
    return (
        <ScrollView>
            {beneficiaries.map((beneficiary) => <ListActionItem
                key={beneficiary}
                item={{
                    description: '',
                    from: beneficiary,
                    key: beneficiary,
                    timestamp: 0
                }}
            />)}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
});

export default connector(AddedScreen);