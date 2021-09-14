import { LinearGradient } from 'expo-linear-gradient';
import React, { PureComponent } from 'react';
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

/**
 * Super special thanks to https://github.com/tomzaku/react-native-shimmer-placeholder
 */

const getOutputRange = (width: number, isReversed: boolean) =>
    isReversed ? [width, -width] : [-width, width];

interface IShimmerPlaceholderProps {
    width?: number;
    height?: number;
    duration?: number;
    delay?: number;
    shimmerColors?: string[];
    isReversed?: boolean;
    stopAutoRun?: boolean;
    visible?: boolean;
    location?: number[];
    style?: any;
    contentStyle?: StyleProp<ViewStyle>;
    shimmerStyle?: StyleProp<ViewStyle>;
    isInteraction?: boolean;
    children?: any;
    animatedValue?: Animated.CompositeAnimation;
    beginShimmerPosition?: any;
    shimmerWidthPercent?: number;
    containerProps?: StyleProp<ViewStyle>;
    shimmerContainerProps?: StyleProp<ViewStyle>;
    childrenContainerProps?: StyleProp<ViewStyle>;
}
interface IShimmerPlaceholderState {
    beginShimmerPosition: Animated.Value;
}

class ShimmerPlaceholder extends PureComponent<
    IShimmerPlaceholderProps,
    IShimmerPlaceholderState
> {
    state = {
        beginShimmerPosition: new Animated.Value(-1),
    };
    getAnimated = () => {
        const { delay, duration, isInteraction } = this.props;
        return Animated.loop(
            Animated.timing(this.state.beginShimmerPosition, {
                toValue: 1,
                delay,
                duration,
                useNativeDriver: true,
                isInteraction,
            })
        );
    };
    animatedValue = this.getAnimated();

    render() {
        return (
            <BasedShimmerPlaceholder
                {...this.props}
                animatedValue={this.animatedValue}
                beginShimmerPosition={this.state.beginShimmerPosition}
            />
        );
    }
}

const BasedShimmerPlaceholder = (props: IShimmerPlaceholderProps) => {
    const {
        width = 200,
        height = 15,
        shimmerColors = ['#ebebeb', '#c5c5c5', '#ebebeb'],
        isReversed = false,
        stopAutoRun = false,
        visible,
        location = [0.3, 0.5, 0.7],
        style,
        contentStyle,
        shimmerStyle,
        children,
        animatedValue,
        beginShimmerPosition,
        shimmerWidthPercent = 1,
        containerProps,
        shimmerContainerProps,
        childrenContainerProps,
    } = props;

    const linearTranslate = beginShimmerPosition.interpolate({
        inputRange: [-1, 1],
        outputRange: getOutputRange(width, isReversed),
    });

    React.useEffect(() => {
        if (!stopAutoRun) {
            animatedValue.start();
        }
        return () => {
            animatedValue.stop();
        };
    }, [animatedValue, stopAutoRun]);

    React.useEffect(() => {
        if (visible) {
            animatedValue.stop();
        }
        if (!visible && !stopAutoRun) {
            animatedValue.start();
        }
    }, [visible, stopAutoRun, animatedValue]);

    return (
        <View
            style={[
                !visible && { height, width },
                styles.container,
                !visible && shimmerStyle,
                style,
            ]}
            {...containerProps}
        >
            {/* Force render children to restrict rendering twice */}
            <View
                style={[
                    !visible && { width: 0, height: 0, opacity: 0 },
                    visible && contentStyle,
                ]}
                {...childrenContainerProps}
            >
                {children}
            </View>
            {!visible && (
                <View
                    style={{ flex: 1, backgroundColor: shimmerColors[0] }}
                    {...shimmerContainerProps}
                >
                    <Animated.View
                        style={{
                            flex: 1,
                            transform: [{ translateX: linearTranslate }],
                        }}
                    >
                        <LinearGradient
                            colors={shimmerColors}
                            style={{
                                flex: 1,
                                width: width * shimmerWidthPercent,
                            }}
                            start={{
                                x: -1,
                                y: 0.5,
                            }}
                            end={{
                                x: 2,
                                y: 0.5,
                            }}
                            locations={location}
                        />
                    </Animated.View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
});

export default ShimmerPlaceholder;
