import React from 'react';
import { Image, View, Text } from 'react-native';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Circle } from 'react-native-animated-spinkit'
import { blue } from '../styles/colors';

export default function Loader(props){
    return(
        <View style = {{...props.style, ...{alignItems : 'center',justifyContent : 'center'}}}>
            <Circle size = {hp('6%')} color = {blue}/>
            <Text style = {{textAlign : 'center', fontSize : hp('2%'),marginTop : hp('2%'),marginLeft : wp('3%'),color : 'black'}}>Loading....</Text>
        </View>
    )
}