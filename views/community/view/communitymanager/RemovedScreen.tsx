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
import Header from '../../../../components/Header';
import { useNavigation } from '@react-navigation/native';
import { celoWalletRequest } from '../../../../services';


interface IRemovedScreenProps {
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
type Props = PropsFromRedux & IRemovedScreenProps

function RemovedScreen(props: Props) {
    const navigation = useNavigation();
    const beneficiaries = props.route.params.beneficiaries as string[];

    console.log(beneficiaries);
    return (
        <>
            <Header
                title="Removed"
                hasHelp={true}
                hasBack={true}
                navigation={navigation}
            />
            <ScrollView style={{ marginHorizontal: 15 }}>
                {beneficiaries.map((beneficiary) => <ListActionItem
                    key={beneficiary}
                    item={{
                        description: '',
                        from: beneficiary,
                        key: beneficiary,
                        timestamp: 0
                    }}
                >
                </ListActionItem>)}
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
});

export default connector(RemovedScreen);