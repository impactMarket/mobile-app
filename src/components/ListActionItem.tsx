import moment from 'moment';
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    GestureResponderEvent,
} from 'react-native';
import { Avatar, Text, IconButton } from 'react-native-paper';
import { IAddressAndName } from 'helpers/types';
import { getAvatarFromId } from 'helpers/index';

export interface IListActionItem {
    key: string;
    avatar?: string;
    timestamp: number;
    description: string;
    from: IAddressAndName;
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
        let titleMaxLength = 15;
        if (this.props.maxTextTitleLength !== undefined) {
            titleMaxLength = this.props.maxTextTitleLength;
        }
        const fromHasName = this.props.item.from.name.length > 0;

        const { avatar } = this.props.item;
        let avatarSrc;
        if (avatar === undefined || avatar.length === 0) {
            avatarSrc = (
                <Avatar.Text
                    size={46}
                    label={
                        fromHasName
                            ? this.props.item.from.name.slice(0, 1)
                            : '?'
                    }
                />
            );
        } else if (avatar.length > 3) {
            avatarSrc = <Avatar.Image size={46} source={{ uri: avatar }} />;
        } else {
            avatarSrc = (
                <Avatar.Image
                    size={46}
                    source={getAvatarFromId(parseInt(avatar))}
                />
            );
        }

        let renderRight;
        let renderAction;
        if (this.props.item.value !== undefined) {
            renderRight = (
                <View>
                    <Text
                        style={{
                            ...styles.rightTextTop,
                            color: this.props.item.isValueIn
                                ? 'green'
                                : 'black',
                        }}
                    >
                        {this.props.prefix
                            ? (this.props.item.isValueIn ? '+' : '') +
                              this.props.prefix?.top
                            : ''}
                        {this.props.item.value}
                        {this.props.suffix?.top}
                    </Text>
                    <Text style={styles.rightTextBottom}>
                        {this.props.prefix?.bottom}
                        {moment(this.props.item.timestamp * 1000).fromNow()}
                        {this.props.suffix?.bottom}
                    </Text>
                </View>
            );
        } else if (this.props.action) {
            renderAction = (
                <View>
                    <IconButton
                        icon={this.props.action?.icon}
                        size={20}
                        onPress={this.props.action?.click}
                    />
                </View>
            );
        }

        const from = !fromHasName
            ? `${this.props.item.from.address.slice(
                  0,
                  (titleMaxLength - 4) / 2
              )}..${this.props.item.from.address.slice(
                  42 - (titleMaxLength - 4) / 2,
                  42
              )}`
            : this.props.item.from.name;

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
                        <View style={{ marginRight: 5 }}>{avatarSrc}</View>
                        <View style={{ justifyContent: 'center' }}>
                            <Text style={styles.textTitle}>
                                {from.length > titleMaxLength
                                    ? from.slice(0, titleMaxLength) + '...'
                                    : from}
                            </Text>
                            <Text style={styles.textDescription}>
                                {this.props.item.description}
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
