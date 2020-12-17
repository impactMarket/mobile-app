import moment from 'moment';
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    GestureResponderEvent,
} from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { decrypt } from 'helpers/encryption';

export interface IListActionItem {
    key: string;
    avatar?: string;
    timestamp: number;
    description: string;
    from: {
        address: string;
        username: string | null;
    };
    value?: string;
    isValueIn?: boolean;
}
interface IListActionItemProps {
    item: IListActionItem;
    onPress?: (event: GestureResponderEvent) => void;
    action?: {
        click: ((event: GestureResponderEvent) => void) &
            (() => void | null) &
            ((e: GestureResponderEvent) => void);
        icon: string;
    };
    maxTextTitleLength?: number;
    prefix?: {
        top?: string;
        bottom?: string;
    };
    suffix?: {
        top?: string;
        bottom?: string;
    };
}

export default class ListActionItem extends Component<
    IListActionItemProps,
    object
> {
    constructor(props: any) {
        super(props);
    }

    render() {
        const { item, maxTextTitleLength, prefix, suffix, action } = this.props;
        const { from } = item;

        let titleMaxLength = 15;
        if (maxTextTitleLength !== undefined) {
            titleMaxLength = maxTextTitleLength;
        }
        const fromHasName = from.username !== null && from.username.length > 0;
        let name = '';
        if (from.username !== null && fromHasName) {
            name =
                from.username.length === 32 && from.username.indexOf(' ') === -1 // this is an encrypted name
                    ? decrypt(from.username)
                    : from.username;
        }

        let renderRight;
        let renderAction;
        if (item.value !== undefined) {
            renderRight = (
                <View>
                    <Text
                        style={{
                            ...styles.rightTextTop,
                            color: item.isValueIn ? 'green' : 'black',
                        }}
                    >
                        {prefix
                            ? (item.isValueIn ? '+' : '') + prefix?.top
                            : ''}
                        {item.value}
                        {suffix?.top}
                    </Text>
                    <Text style={styles.rightTextBottom}>
                        {prefix?.bottom}
                        {moment(item.timestamp * 1000).fromNow()}
                        {suffix?.bottom}
                    </Text>
                </View>
            );
        } else if (action) {
            renderAction = (
                <View>
                    <IconButton
                        icon={action?.icon}
                        size={20}
                        onPress={action?.click}
                    />
                </View>
            );
        }

        const itemFrom = fromHasName
            ? name
            : `${from.address.slice(
                  0,
                  (titleMaxLength - 4) / 2
              )}..${from.address.slice(42 - (titleMaxLength - 4) / 2, 42)}`;

        return (
            <TouchableOpacity onPress={this.props.onPress}>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginVertical: 10,
                    }}
                >
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ justifyContent: 'center' }}>
                            <Text style={styles.textTitle}>
                                {itemFrom.length > titleMaxLength
                                    ? itemFrom.slice(0, titleMaxLength) + '...'
                                    : itemFrom}
                            </Text>
                            <Text style={styles.textDescription}>
                                {item.description}
                            </Text>
                        </View>
                    </View>
                    <View style={{ marginLeft: 'auto' }}>
                        {this.props.children}
                        {renderRight}
                        {renderAction}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    textTitle: {
        fontFamily: 'Gelion-Regular',
        fontSize: 20,
        letterSpacing: 0,
    },
    textDescription: {
        fontFamily: 'Gelion-Regular',
        letterSpacing: 0.25,
        color: 'grey',
    },
    rightTextTop: {
        textAlign: 'right',
        fontSize: 20,
    },
    rightTextBottom: {
        textAlign: 'right',
        color: 'grey',
    },
});
