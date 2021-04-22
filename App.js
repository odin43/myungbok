import React, { useEffect } from 'react';
//import type {Node} from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    BackHandler,
    Alert,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import { Container, Content } from 'native-base';
import { WebView } from 'react-native-webview';
import SplashScreen from 'react-native-splash-screen';

const App = () =>  {
    let { height, width } = Dimensions.get('window');
    const url = "https://dmonster1547.cafe24.com/index.php?chk_app=Y";
    const [urls, set_urls] = React.useState("ss");
    const webViews = React.useRef();
    const [is_loading, set_is_loading] = React.useState(false);

    useEffect( () => {
        setTimeout(() => {
            SplashScreen.hide();
        }, 2000);
    },[])


	const onWebViewMessage = (webViews) => {
		let jsonData = JSON.parse(webViews.nativeEvent.data);

	}

    const onNavigationStateChange = (webViewState)=>{
        console.log('webViewState.url' + webViewState.url);
        set_urls(webViewState.url);
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    }

    const handleBackButton = () => {
        console.log('urls' + urls);
        if(urls == url){
            Alert.alert(
                '어플을 종료할까요?', '',
                [
                    { text: '네', onPress: () =>  BackHandler.exitApp() },
                    { text: '아니요' }
                ]
            );
        } else {
            webViews.current.goBack();
        }
        return true;
    }

    const onShouldStartLoadWithRequest = (event) => {
        const { url, lockIdentifier } = event;

        if (event.lockIdentifier === 0 /* && react-native-webview 버전이 v10.8.3 이상 */) {
            /**
            * [feature/react-native-webview] 웹뷰 첫 렌더링시 lockIdentifier === 0
            * 이때 무조건 onShouldStartLoadWithRequest를 true 처리하기 때문에
            * Error Loading Page 에러가 발생하므로
            * 강제로 lockIdentifier를 1로 변환시키도록 아래 네이티브 코드 호출
            */

            RNCWebView.onShouldStartLoadWithRequestCallback(false, event.lockIdentifier);
        }

        if (event.url.startsWith('http://') || event.url.startsWith('https://') || event.url.startsWith('about:blank')) {
            return true;
        }
        if (Platform.OS === 'android') {
            console.log('event.url', event.url);
            SendIntentAndroid.openChromeIntent(event.url)
            .then((isOpened) => {
                console.log(isOpened);
                if (!isOpened) {
                    Alert.alert('앱 실행이 실패했습니다');
                }
            })
            .catch((err) => {
                console.log(err);
            });
            return false;
        } else {
            Linking.openURL(event.url).catch((err) => {
                Alert.alert('앱 실행이 실패했습니다. 설치가 되어있지 않은 경우 설치하기 버튼을 눌러주세요.');
            });
            return false;
        }
    };

	

    return (
        <Container>
            {/* <Content> */}
                {/* <ScrollView contentContainerStyle={{flex: 1,height:Dimensions.get("window").height}}> */}
                    <WebView
                        ref={webViews}
                        source={{
                            uri: url,
                        }}
                        style={{flex: 1,height:Dimensions.get("window").height}}
                        useWebKit
                        sharedCookiesEnabled
                        onMessage={webViews => onWebViewMessage(webViews)}
                        onNavigationStateChange={(webViews) => onNavigationStateChange(webViews)}
                        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                        javaScriptEnabledAndroid={true}
                        allowFileAccess={true}
                        renderLoading={true}
                        mediaPlaybackRequiresUserAction={false}
                        setJavaScriptEnabled = {false}
                        scalesPageToFit={true}
                        originWhitelist={['*']}
                    />
                {/* </ScrollView> */}
            {/* </Content> */}
        </Container>
    );
};

export default App;