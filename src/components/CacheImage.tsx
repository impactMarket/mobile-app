import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system';
import React, { Component } from 'react';
import {
    View,
    Image,
    ImageBackground,
    ImageProps,
    ImageURISource,
} from 'react-native';

interface ICachedImageProps extends ImageProps {
    isBackground?: boolean;
    source: ImageURISource;
}
/**
 * The `uri`always exists as this is intended to be for cache web images
 */
export default class CachedImage extends Component<ICachedImageProps, object> {
    state = {
        imgURI: '',
    };

    async componentDidMount() {
        const filesystemURI = await this.getImageFilesystemKey(
            this.props.source.uri!
        );
        await this.loadImage(filesystemURI, this.props.source.uri!);
    }

    async componentDidUpdate() {
        const filesystemURI = await this.getImageFilesystemKey(
            this.props.source.uri!
        );
        if (
            this.props.source.uri! === this.state.imgURI ||
            filesystemURI === this.state.imgURI
        ) {
            return null;
        }
        await this.loadImage(filesystemURI, this.props.source.uri!);
    }

    async getImageFilesystemKey(remoteURI: string) {
        const hashed = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            remoteURI
        );
        return `${FileSystem.cacheDirectory}${hashed}`;
    }

    async loadImage(filesystemURI: string, remoteURI: string) {
        try {
            // Use the cached image if it exists
            const metadata = await FileSystem.getInfoAsync(filesystemURI);
            if (metadata.exists) {
                this.setState({
                    imgURI: filesystemURI,
                });
                console.log('loading from cache');
                return;
            }

            // otherwise download to cache
            console.log('loading from aws');
            const imageObject = await FileSystem.downloadAsync(
                remoteURI,
                filesystemURI
            );
            this.setState({
                imgURI: imageObject.uri,
            });
        } catch (err) {
            console.log('Image loading error:', err);
            this.setState({ imgURI: remoteURI });
        }
    }

    render() {
        if (this.state.imgURI === null || this.state.imgURI.length === 0) {
            return (
                <View style={{ height: (this.props.style as any).height }} />
            );
        }
        return (
            <View>
                {this.props.isBackground ? (
                    <ImageBackground
                        {...this.props}
                        source={{ uri: this.state.imgURI }}
                    >
                        {this.props.children}
                    </ImageBackground>
                ) : (
                    <Image
                        {...this.props}
                        source={{ uri: this.state.imgURI }}
                    />
                )}
            </View>
        );
    }
}
