import React from 'react';
import {
    ScrollView,
} from 'react-native';
import {
    connect,
    ConnectedProps
} from 'react-redux';
import { IRootState, ICommunityInfoBeneficiary } from 'helpers/types';
import ListActionItem from 'components/ListActionItem';
import Header from 'components/Header';
import { useNavigation } from '@react-navigation/native';
import { getUserCurrencySymbol, amountToUserCurrency } from 'helpers/index';


interface IRemovedScreenProps {
    route: {
        params: {
            beneficiaries: ICommunityInfoBeneficiary[];
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
    const beneficiaries = props.route.params.beneficiaries as ICommunityInfoBeneficiary[];

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
                    key={beneficiary.address}
                    item={{
                        description: `${getUserCurrencySymbol(props.user.user)} ${amountToUserCurrency(beneficiary.claimed, props.user.user)}`,
                        from: beneficiary.name,
                        key: beneficiary.address,
                        timestamp: 0
                    }}
                >
                </ListActionItem>)}
            </ScrollView>
        </>
    );
}

export default connector(RemovedScreen);