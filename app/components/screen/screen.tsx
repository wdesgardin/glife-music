import * as React from "react"
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, View } from "react-native"
import { useSafeArea } from "react-native-safe-area-context"
import { ScreenProps } from "./screen.props"
import { isNonScrolling, offsets, presets } from "./screen.presets"
import PlayerPreviewComponent from "../player-preview/player-preview"
import { Wallpaper } from "../wallpaper/wallpaper"
import { color } from "../../theme"

const isIos = Platform.OS === "ios"

function ScreenWithoutScrolling(props: ScreenProps) {
    const insets = useSafeArea()
    const preset = presets.fixed
    const style = {...props.style, flex: 1}
    const backgroundStyle = { backgroundColor: props.backgroundColor || color.transparent }
    const insetStyle = { paddingTop: props.unsafe ? 0 : insets.top }

    return (
        <KeyboardAvoidingView
            style={[preset.outer, backgroundStyle]}
            behavior={isIos ? "padding" : null}
            keyboardVerticalOffset={offsets[props.keyboardOffset || "none"]}
        >
            <StatusBar barStyle={props.statusBar || "light-content"} />
                {!props.backgroundColor && <Wallpaper />}
                <View style={[preset.inner, style, insetStyle]}>{props.children}</View>
                {props.showPlayerPreview  && <PlayerPreviewComponent />}
        </KeyboardAvoidingView>
    )
}

function ScreenWithScrolling(props: ScreenProps) {
    const insets = useSafeArea()
    const preset = presets.scroll
    const style = props.style || {}
    const backgroundStyle = { backgroundColor: props.backgroundColor || color.transparent }
    const insetStyle = { paddingTop: props.unsafe ? 0 : insets.top }

    return (
        <KeyboardAvoidingView
            style={[preset.outer, backgroundStyle]}
            behavior={isIos ? "padding" : null}
            keyboardVerticalOffset={offsets[props.keyboardOffset || "none"]}
        >
            <StatusBar barStyle={props.statusBar || "light-content"} />
            <View style={[preset.outer, backgroundStyle, insetStyle]}>
                {!props.backgroundColor && <Wallpaper />}
                <ScrollView
                    style={[preset.outer, backgroundStyle]}
                    contentContainerStyle={[preset.inner, style]}
                >
                    {props.children}
                </ScrollView>
                {props.showPlayerPreview && <PlayerPreviewComponent />}
            </View>
        </KeyboardAvoidingView>
    )
}

/**
 * The starting component on every screen in the app.
 *
 * @param props The screen props
 */
export function Screen(props: ScreenProps) {
    if (isNonScrolling(props.preset)) {
        return <ScreenWithoutScrolling {...props} />
    } else {
        return <ScreenWithScrolling {...props} />
    }
}
