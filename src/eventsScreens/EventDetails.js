import React, { useState } from "react";
import { View,Text, StyleSheet, StatusBar, Image, TouchableNativeFeedback, ToastAndroid } from 'react-native';
import { heightPercentageToDP as hp , widthPercentageToDP as wp} from "react-native-responsive-screen";
import { Background, black, blue, red } from "../styles/colors";
import { Ionicons } from '../Icons/icons';
import { Card, Button } from "react-native-paper";
import moment from "moment";
import { ScrollView } from "react-native-gesture-handler";
import Confirmation from "../components/Confirmation";
import Loading from '../components/Loading';
import { auth, firestore } from "../config/config";


export default function Details(props){

    const data = props.navigation.getParam('data');
    const isRegister = props.navigation.getParam('register') > 0 ? true : false;
    const userData = props.navigation.getParam('udata');
    const screen = props.navigation.getParam("screen");

    const [ widthawModel, setwidthawModel ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ text, setText ] = useState('');

    const onRegistration = async () => {
        setText("Registrating...");
        setLoading(true);

        const user = auth.currentUser.uid;
        const docRef = firestore.collection('users').doc(user).collection('events')

        try{

            await docRef.add({
                id : data.id,
                registredDate : new Date(),
                Date : data.Date
            })

            setLoading(false);
            ToastAndroid.show("Registration Completed",ToastAndroid.LONG);
        }catch(e){
            setLoading(false);
            ToastAndroid.show("something bad Happen...",ToastAndroid.LONG);
        }

        global.update = true;

        props.navigation.navigate('Main');
    }

    const ShowModel = () => {
        setwidthawModel(true);
    }

    const onWidthraw = async () => {
        setText('Widthrawing ...')
        HideModel();
        setLoading(true);

        const user = auth.currentUser.uid;
        const docRef = firestore.collection('users').doc(user).collection('events').doc(userData[0].docId);

        try{
            await docRef.delete();

            setLoading(false);
            ToastAndroid.show("Registration Cancelled",ToastAndroid.LONG);
        }catch(e){
            setLoading(false);
            ToastAndroid.show("something bad Happen, try again...",ToastAndroid.LONG);
        }

        if(screen === "my"){
            props.navigation.navigate({routeName : 'Events', params : {
                update : true
            }});
        }else{
            props.navigation.navigate('Main');
        }
    }

    const HideModel = () => {
        setLoading(false);
        setwidthawModel(false);
    }

    const onBack = () => {
        if(screen === "my"){
            props.navigation.navigate('Events');
        }else{
            props.navigation.navigate('Main');
        }
    }

    return(
        <ScrollView>
            <View>

                <StatusBar backgroundColor={blue} />

                <View style={Styles.header}>
                    <Ionicons name="md-arrow-back-sharp" size={hp("4%")} color = {Background} onPress={() => onBack()}/>
                    <Text style={Styles.title}>Event Details</Text>
                </View>

                <Card style={Styles.details}>
                    <Image 
                        source={{uri:data.Image}}
                        style = {Styles.backgroundImage}
                    />
                </Card>

                <Card style={{...Styles.details2,...{ height : isRegister ? hp('55%') : hp('50%')}}}>
                    <Text style={Styles.title2}>{data.Name}</Text>

                    <View style={{flexDirection : "row",marginTop : hp('5%'),marginHorizontal : wp('4%')}}>
                        <Text style={Styles.label}>Date : </Text>
                        <Text style={Styles.text}>{moment(data.Date.toDate()).format('DD/MM/YYYY')}</Text>
                    </View>

                    <View style={{flexDirection : "row",marginTop : hp('2%'),marginHorizontal : wp('4%')}}>
                        <Text style={Styles.label}>Event Type : </Text>
                        <Text style={Styles.text}>{data.Category}</Text>
                    </View>

                    <View style={{flexDirection : "row",marginTop : hp('2%'),marginHorizontal : wp('4%')}}>
                        <Text style={Styles.label}>Event Location : </Text>
                        <Text style={Styles.text}>{data.Place}</Text>
                    </View>

                    <View style={{flexDirection : "row",marginTop : hp('2%'),marginHorizontal : wp('4%')}}>
                        <Text style={Styles.label}>Prize : </Text>
                        <Text style={Styles.text}>{data.Price}</Text>
                    </View>

                    <View style={{flexDirection : "row",marginTop : hp('2%'),marginHorizontal : wp('4%')}}>
                        <Text style={Styles.label}>Contact No : </Text>
                        <Text style={Styles.text}>{data.ContactNo}</Text>
                    </View>

                    {isRegister ? (
                        <View style={{flexDirection : "row",marginTop : hp('2%'),marginHorizontal : wp('4%')}}>
                            <Text style={Styles.label}>Registration Date : </Text>
                            <Text style={Styles.text}>{moment(userData[0].registredDate.toDate()).format('DD/MM/YYYY')}</Text>
                        </View>
                    ):(null)}

                    {isRegister ? (
                        <TouchableNativeFeedback activeOpacity={0.7} onPress={() => ShowModel()}>
                            <Button 
                                style = {{backgroundColor : red,borderRadius : wp('5%'),paddingVertical : hp('1%'),marginHorizontal : wp('4%'),elevation : 5,marginTop : hp('5%')}}
                                labelStyle = {{color : Background,fontWeight : "bold", fontSize : hp('2%')}}
                            >
                                Wthdraw
                            </Button>
                        </TouchableNativeFeedback>
                    ):(
                        
                    <TouchableNativeFeedback activeOpacity={0.7} onPress={() => onRegistration()}>
                        <Button 
                            style = {{backgroundColor : blue,borderRadius : wp('5%'),paddingVertical : hp('1%'),marginHorizontal : wp('4%'),elevation : 5,marginTop : hp('5%')}}
                            labelStyle = {{color : Background,fontWeight : "bold", fontSize : hp('2%')}}
                        >
                            Register
                        </Button>
                    </TouchableNativeFeedback>
                    )}

                </Card>

                {
                    isRegister ? (
                        <Confirmation 
                            isVisible = {widthawModel}
                            onBackButtonPress={() => HideModel()}
                            onBackdropPress={() => HideModel()}
                            question={'Are You Sure, Want To Widthraw ?'}
                            onPressNo={() => HideModel()}
                            onPressYes={() => onWidthraw()}
                        />
                    ):(null)
                }

                <Loading
                    isVisible = {loading}
                    data = {text}
                />

            </View>
        </ScrollView>
    )
}

export const Styles = StyleSheet.create({
    header : {
        flexDirection : 'row',
        paddingTop : hp('3%'),
        paddingBottom : hp('2%'),
        paddingHorizontal : wp('5%'),
        backgroundColor : blue,
        elevation : 10
    },

    title : {
        alignSelf : 'center',
        marginLeft : wp('5%'),
        color : Background,
        fontSize : hp('2.5%'),
        fontWeight : 'bold'
    },

    backgroundImage : {
        height : hp('30%')
    },

    details : {
        marginVertical : hp('3%'),
        marginHorizontal : wp('2%'),
        borderRadius : wp('7%'),
        overflow : 'hidden',
        elevation : 10
    },

    details2 : {
        marginHorizontal : wp('2%'),
        marginBottom : hp('5%'),
        borderRadius : wp('5%'),
        elevation : 10,
        paddingHorizontal : wp('3%')
    },

    title2 : {
        marginTop : hp('2%'),
        alignSelf : 'center',
        color : blue,
        fontSize : hp('2.5%'),
        fontWeight : 'bold'
    },

    label : {
        fontSize : hp('2.2%'),
        fontWeight : 'bold',
        color  : black
    },

    text : {
        fontSize : hp('2.2%'),
        color  : black,
        marginLeft : wp('3%'),
        alignSelf : 'center'
    }
})