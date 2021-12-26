import React from 'react';
import { ImageBackground, LogBox,Text } from 'react-native';
import { f } from '../config/config';
import { View, Image, StatusBar} from 'react-native';
import {
  widthPercentageToDP as wp, 
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { blue,black } from '../styles/colors';
import {  CircleFade } from 'react-native-animated-spinkit';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default class Loading extends React.Component {

  constructor()
  {
    super();
  }

  componentDidMount = async () => {
        var that = this;

        const unsubscribe = f.auth().onAuthStateChanged(
            function(user) {
                if (user) {
                    that.props.navigation.navigate('Events');
                }else {
                    that.props.navigation.navigate('Auth');
                }

                unsubscribe();
            },
        );

        GoogleSignin.configure({
            webClientId: '612569034163-3ifj3kkrcqn2d0i9etvk2gvr3srjsdga.apps.googleusercontent.com',
        });
  }

  render(){
    return(
        <View style = {{flex : 1,backgroundColor : 'white'}}>
            <StatusBar 
                backgroundColor={blue}
            />
            <ImageBackground 
                source={require('../../assets/headerImg.png')}
                style = {{height : hp('25%'),width : wp('100%')}}
            />

        <View style = {{flex : 1,alignItems : 'center',justifyContent : 'center'}}>

            <Image 
                source={require('../../assets/bvmLogo.png')}
                style = {{height : hp('20%'),width : hp('20%'),resizeMode : 'contain',alignSelf : 'center'}}
            />

            <Text
                style={{
                    marginTop : hp('5%'),
                    color : blue,
                    fontSize : hp('3%'),
                    fontWeight : 'bold',
                    alignSelf : 'center'
                }}
            >
                B V M
            </Text>

            <Text
                style={{
                    marginTop : hp('2%'),
                    color : black,
                    fontSize : hp('3%'),
                    fontWeight : 'bold',
                    alignSelf : 'center'
                }}
            >
                Events App
            </Text>
            
            <CircleFade 
                size={hp('5%')}
                style = {{marginTop : hp('10%')}}
                color = {blue}
            />

        </View>

        </View>
    )
  }
}
