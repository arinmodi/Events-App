import React from 'react';
import { View,Text, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { MaterialIcons } from '../Icons/icons';
import { black } from '../styles/colors';

export default function Error(props){
    return(
        <View style={{flex:1}}>
            <Modal
                isVisible = {props.isVisible}
                animationIn = {"fadeIn"}
                onBackdropPress={props.onBackdrop}
                onBackButtonPress={props.onBackButton}
            >
                <View style={{backgroundColor : 'white',height : hp('17%'),marginHorizontal : wp('5%'),borderRadius : wp('5%'),paddingTop : hp('3%'),paddingHorizontal : wp('5%'),alignItems : 'center'}}>
                    <MaterialIcons name="error" size={hp('5%')} color="red" />
                    <Text style = {{marginTop : hp('1%'),fontSize : hp('2%'),color : black,fontWeight : 'bold'}}>{props.text}</Text>
                </View>
            </Modal>
        </View>
    )
} 