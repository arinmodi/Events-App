import React, { useEffect } from "react";
import { View,Text,Image, TouchableNativeFeedback, BackHandler, Alert } from 'react-native';
import { main } from '.././styles/main';
import { Button } from 'react-native-paper';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Background, blue } from "../styles/colors";
import RNRestart from 'react-native-restart'
import { NavigationEvents } from "react-navigation";

export default function Welcome(props){

    useEffect(() => {
        const backAction = () => {
            Alert.alert('Hold on!', 'Are you sure you want to close the App?', [
              {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel'
              },
              { text: 'YES', onPress: () => BackHandler.exitApp() }
            ])
            return true
          }
      
          const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
          )

          return () => backHandler.remove()
    },[]);

    const onLoginPress = () => {
        props.navigation.navigate('Login');
    }

    const onSignupPress = () => {
        props.navigation.navigate('Signup');
    }

    const Restart = () => {
        global.restart = false;
        RNRestart.Restart();
    }

    return(
        <View style={{...main.background,...{backgroundColor : 'white'}}}>
            <NavigationEvents onDidFocus={() => {
                (global.restart) === true
                ? Restart()
                : console.log('Not Restart')
                }}
            />
            <View style={main.header}>
                <Image 
                    source={require('../../assets/bvmLogo.png')}
                    style= {main.logo}
                />

                <Text style={main.textTitle}>BVM</Text>
            </View>

            <Image
                source={require('../../assets/welcomeImage.png')}
                style = {main.illustrator} />
            
            <Text style = {main.title}>Hello, there!</Text>

            <Text style = {main.subtext}>Enhance Your Career By Taking Part</Text>

            <Text style = {main.higtlight}>In BVM TechFest</Text>

            <View style = {{marginTop : hp('8%')}}>

                <TouchableNativeFeedback activeOpacity={0.7} onPress={() => onLoginPress()}>
                    <Button 
                        style = {{backgroundColor : blue,borderRadius : wp('5%'),paddingVertical : hp('1%'),marginHorizontal : wp('7%'),elevation : 5}}
                        labelStyle = {{color : Background,fontWeight : "bold", fontSize : hp('2%')}}
                    >
                        LOGIN
                    </Button>
                </TouchableNativeFeedback>

                <TouchableNativeFeedback activeOpacity={0.7} onPress={() => onSignupPress()}>
                    <Button 
                        style = {{backgroundColor : Background,borderRadius : wp('5%'),paddingVertical : hp('1%'),marginHorizontal : wp('7%'),elevation : 5,marginTop : hp('2%'),borderWidth : hp('0.2%'),borderColor : blue}}
                        labelStyle = {{color : blue,fontWeight : "bold", fontSize : hp('2%')}}
                    >
                        SIGN UP
                    </Button>
                </TouchableNativeFeedback>

            </View>
        </View>
    );
}

