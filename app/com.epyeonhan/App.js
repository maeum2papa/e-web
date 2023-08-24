import { StyleSheet, Text, View, Button, Image,TouchableOpacity  } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaProvider,SafeAreaView } from 'react-native-safe-area-context';
import { useState,useRef } from 'react';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { StatusBar } from 'expo-status-bar';

export default function App() {

  const webViewRef = useRef(null);
  const [networkFlag,setNetworkFlag] = useState(true);
  const [uri,setUri] = useState("https://epyeonhan.com/");
  // const [uri,setUri] = useState("http://192.168.0.8:5173/");

  //네트워크에 연결할 수 없는 경우
  const handleError = (error) =>{
    // webViewRef.current?.stopLoading();
    setNetworkFlag(false);
  }

  const handleReflash = () =>{
    webViewRef.current?.reload();
  }


  const handleMessage = async(e) =>{

    const html = e.nativeEvent.data;
    try{
      const { uri } = await Print.printToFileAsync({ html });
      // console.log('File has been saved to:', uri);
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });  
    }catch(error){
      console.log(error);
    }
    
  }

  

  return (
    <>
    <StatusBar style="auto" />
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView style={styles.container}>
          {networkFlag ? (
            <WebView
              ref={webViewRef}
              style={styles.container}
              source={{ uri }}
              onError={handleError}
              onMessage={handleMessage}
            />
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>네트워크가 불안정합니다.{'\n'}잠시 후에 다시 시도해 주세요.</Text>
              <TouchableOpacity style={styles.button} onPress={handleReflash}>
                <Text style={styles.buttonText}><Image source={require('./assets/reflash.png')} style={{ width: 16, height: 16 }} /> 새로고침</Text>
              </TouchableOpacity>
            </View>
          )}
      </SafeAreaView>
    </SafeAreaProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  errorText: {
    fontSize: 18,
    // fontWeight: 'bold',
    textAlign: 'center',
    lineHeight:26
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button:{
    backgroundColor: '#F7D264',
    marginTop:15,
    padding:10
  },
  buttonText:{
    fontSize:16,
    lineHeight:16
  }
});
