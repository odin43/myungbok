import React, {
	Component, useEffect, useState, useRef
}
from 'react';
import { View } from 'react-native';

import {
	WebView
}
from 'react-native-webview';

export default function Custom_webview(props) {

    return (
        <View style={{flex:1}}>
            <WebView
                source={{uri: props.url}}
            />
        </View>
    );
}