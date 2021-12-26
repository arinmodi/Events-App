import React, { useState } from 'react';
import { View,Text,TouchableNativeFeedback, ToastAndroid } from 'react-native';
import { Button } from 'react-native-paper';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Background, black, red } from '../styles/colors';
import { Styles } from './EventDetails';
import Confirmation from "../components/Confirmation";
import { auth } from '../config/config';
import { NavigationActions } from 'react-navigation';

export default function About(props){

    const [ model, setmodel ] = useState(false);

    const showModel = () => {
        setmodel(true);
    }

    const HideModel = () => {
        setmodel(false);
    }

    const onLogOut = async () => {
        global.restart = true;
        HideModel();
        await auth.signOut().then((r) => {
            ToastAndroid.show('Signed Out', ToastAndroid.LONG);
            global.stackNavigator.dispatch(
                NavigationActions.navigate({
                  routeName: 'Welcome'
                })
            )
        }).catch(e => {
            console.log(e)
            alert('Something bad happend')
            global.restart = false;
        })
    }

    return(
        <View style={{flex : 1}}>
            <View style={Styles.header}>
                <Text style={Styles.title}>About Us</Text>
            </View>

            <View style={{flex : 1,alignItems : 'center',justifyContent : 'center'}}>
                <Text style={{...Styles.title2,...{fontSize : hp('3%')}}}>Developed By</Text>
                <Text style={{...Styles.title2,...{fontSize : hp('2.5%'), marginTop : hp("2%"),color : black}}}>Arin Modi</Text>

                <TouchableNativeFeedback activeOpacity={0.7} onPress={() => showModel()}>
                    <Button 
                        style = {{backgroundColor : red,borderRadius : wp('5%'),paddingVertical : hp('1%'),paddingHorizontal : wp('4%'),elevation : 5,marginTop : hp('5%')}}
                        labelStyle = {{color : Background,fontWeight : "bold", fontSize : hp('2%')}}
                    >
                        Logout
                    </Button>
                </TouchableNativeFeedback>

                <Confirmation 
                    isVisible = {model}
                    onBackButtonPress={() => HideModel()}
                    onBackdropPress={() => HideModel()}
                    question={'Are You Sure, Want To Log OUT ?'}
                    onPressNo={() => HideModel()}
                    onPressYes={() => onLogOut()}
                />
            </View>

        </View>
    )
}