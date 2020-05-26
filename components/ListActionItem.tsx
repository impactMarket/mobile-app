import React, { Component } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import {
    List,
    Avatar,
    Text
} from 'react-native-paper';
import moment from 'moment';


export interface IListActionItem {
    key: string;
    avatar?: string;
    timestamp: number;
    description: string;
    from: string;
    value?: string;
}
interface IListActionItemProps {
    item: IListActionItem;
    prefix?: {
        top?: string;
        bottom?: string;
    };
    suffix?: {
        top?: string;
        bottom?: string;
    };
}

export default class ListActionItem extends Component<IListActionItemProps, {}> {
    constructor(props: any) {
        super(props);
    }

    render() {
        const fromIsAddress = this.props.item.from.slice(0, 2) === '0x';

        const avatarSrc = this.props.item.avatar !== undefined ?
            <Avatar.Image size={46} source={{ uri: this.props.item.avatar }} /> :
            <Avatar.Text size={46} label={fromIsAddress ? '?' : this.props.item.from.slice(0, 1)} />;

        const renderRight = <View>
            <Text style={styles.rightTextTop}>
                {this.props.prefix?.top}
                {this.props.item.value}
                {this.props.suffix?.top}
            </Text>
            <Text style={styles.rightTextBottom}>
                {this.props.prefix?.bottom}
                {moment(this.props.item.timestamp * 1000).fromNow()}
                {this.props.suffix?.bottom}
            </Text>
        </View>;

        const from = fromIsAddress ?
            `${this.props.item.from.slice(0, 5)}..${this.props.item.from.slice(37, 42)}` :
            this.props.item.from;

        return <List.Item
            key={this.props.item.key}
            title={from}
            description={this.props.item.description}
            left={() => avatarSrc}
            right={() => this.props.item.value !== undefined && renderRight}
        />;
    }
}

const styles = StyleSheet.create({
    rightTextTop: {
        textAlign: 'right',
        fontSize: 20
    },
    rightTextBottom: {
        textAlign: 'right',
        color: 'grey'
    }
});