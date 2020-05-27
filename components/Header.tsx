import React, { Component } from 'react';
import {
    StyleSheet,
} from 'react-native';
import {
    Appbar
} from 'react-native-paper';
import { NavigationState, NavigationProp } from '@react-navigation/native';


interface IHeaderProps {
    title: string;
    hasQr?: boolean;
    hasShare?: boolean;
    navigation: NavigationProp<Record<string, object | undefined>, string, NavigationState, {}, {}>
}

export default class Header extends Component<IHeaderProps, {}> {
    constructor(props: any) {
        super(props);
    }

    render() {
        const {
            children,
            navigation,
            hasQr,
            hasShare,
            title,
        } = this.props;

        let appBarContent;
        if (children === undefined) {
            appBarContent = <>
                <Appbar.Action
                    icon="help"
                    style={styles.appbarIcon}
                />
                {hasQr && <Appbar.Action
                    icon="qrcode"
                    style={styles.appbarIcon}
                    onPress={() => navigation.navigate('UserShowScanQRScreen')}
                />}
                {hasShare && <Appbar.Action
                    icon="share"
                    style={styles.appbarIcon}
                    onPress={() => console.log('share')}
                />}
            </>
        } else {
            appBarContent = children;
        }
        return <Appbar.Header style={styles.appbar}>
            <Appbar.Content title={title} />
            {appBarContent}
        </Appbar.Header>
    }
}

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: 'transparent',
    },
    appbarIcon: {
        backgroundColor: '#eaedf0'
    }
});