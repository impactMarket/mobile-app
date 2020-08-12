import moment from 'moment';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { List, Avatar, Text } from 'react-native-paper';

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
        const fromIsAddress = this.props.item.from.slice(0, 2) === '0x';

        const avatarSrc =
            this.props.item.avatar !== undefined ? (
                <Avatar.Image
                    size={46}
                    source={{ uri: this.props.item.avatar }}
                />
            ) : (
                <Avatar.Text
                    size={46}
                    label={
                        fromIsAddress ? '?' : this.props.item.from.slice(0, 1)
                    }
                />
            );

        const renderRight = (
            <View>
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
            </View>
        );

        const from = fromIsAddress
            ? `${this.props.item.from.slice(
                  0,
                  (titleMaxLength - 4) / 2
              )}..${this.props.item.from.slice(
                  42 - (titleMaxLength - 4) / 2,
                  42
              )}`
            : this.props.item.from;

        return (
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
                    {this.props.item.value !== undefined && renderRight}
                </View>
            </View>
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