import React, { useState } from "react";
import { Text,View, TextInput, TouchableNativeFeedback, Image, ToastAndroid, StatusBar, Platform, Alert } from 'react-native';
import { Card, Button } from "react-native-paper";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Ionicons, AntDesign } from '../Icons/icons';
import { Background, blue, lightBlack, black } from "../styles/colors";
import { main } from "../styles/main";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Error from '../components/error';
import validateEmail from "../components/validateEmail";
import validatePhoneNumber from "../components/valdiatePhoneNumber";
import { auth, f, firestore } from "../config/config";
import Loading from '../components/Loading';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function SignUp(props){

    const [ userName,setUserName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ phoneNo, setPhoneNo ] = useState('');
    const [ error, seterror ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("please! enter the all details");
    const [ process, setProcess ] = useState(0);

    const uploadData = async (emailId,userName_,no_) => {
        var userID = auth.currentUser.uid;

        const data = {
            userId : userID,
            email : emailId,
            userName : userName_,
            phoneNo : no_
        }

        await firestore.collection('users').doc(userID).set(data).then(r => {
            ToastAndroid.show('Successfully Signed Up...',ToastAndroid.LONG);
            goToWaitScreen();
        }).catch(e => {
            setProcess(0);
            ToastAndroid.show("Invalid OTP",ToastAndroid.LONG);
            console.log(e);
        })
    }

    const GooglesignUp = async () => {
        if(Platform.OS === 'android'){
            try{
                const { idToken } = await GoogleSignin.signIn();
                setProcess(2);
                const googleCredentials = f.auth.GoogleAuthProvider.credential(idToken);
                const user  = await auth.signInWithCredential(googleCredentials);
                if(user.additionalUserInfo.isNewUser){
                    uploadData(user.user.email,user.user.displayName,"+91" + user.user.phoneNumber);
                }else{
                    setProcess(0);
                    goToWaitScreen();
                }
            }catch(e){
                console.log(e)
                setProcess(0);
            }
        }else{
            Alert.alert("please, use phone number authentication cause google sign in only works in android");
        }
    }

    const goToWaitScreen = () => {
        setProcess(0);
        props.navigation.navigate("Events");
    }

    const onBackPressed = () => {
        seterror(false);
        props.navigation.navigate("Welcome");
    }

    const CheckingInputs = () => {
        setProcess(2);
        if(userName != '' && email != '' && phoneNo != ''){
            if(!userName.length > 2 || !userName.match("^[A-Za-z][A-Za-z0-9_]{3,20}$")){
                setProcess(0);
                seterror(true);
                setErrorMessage("Invalid Username, space can't used");
            }else if(!email.length > 10 || !validateEmail(email)){
                setProcess(0);
                seterror(true);
                setErrorMessage("Invalid Email");
            }else if(!phoneNo.length === 10 || !validatePhoneNumber(phoneNo)){
                setProcess(0);
                seterror(true);
                setErrorMessage("Invalid Phone Number");
            }else{
                checkingUser();
            }
        }else{
            seterror(true);
            setProcess(0);
            setErrorMessage("please! enter the all details");
        }
    }

    const checkingUser = async () => {
        var finalNumber = '+91' + phoneNo;

        await firestore.collection('users')
        .where('phoneNo','==',finalNumber).get()
        .then(docs => {
            if(docs.docs.length > 0){
                setProcess(0);
                seterror(true);
                setErrorMessage("User already Exist!...");
            }else{
                SignUp(finalNumber);
            }
        }).catch(e => {
            setProcess(0);
            console.log(e)
        });
    }

    const SignUp = async (no) => {
        await auth.signInWithPhoneNumber(no).then(result => {
            setProcess(0);
            props.navigation.navigate({
                routeName : 'OTP',
                params : {
                    userName : userName,
                    email : email,
                    phoneNo : no,
                    confirmResult : result,
                    type : 1
                }
            })
        }).catch(e => {
            setProcess(0);
            ToastAndroid.show("Something Bad Happen!",ToastAndroid.LONG);
            console.log(e);
        })
    }

    return(
        <KeyboardAwareScrollView
            enableAutomaticScroll={true}
        >

            <StatusBar 
                backgroundColor={"white"}
            />

            <View>
                <Card style = {{paddingHorizontal : wp('5%'),paddingBottom : hp('2%'),elevation : 10,borderBottomLeftRadius : wp('10%'),borderBottomRightRadius : wp('10%')}}>
                    <Ionicons name="md-arrow-back-sharp" size={hp("4%")} color = {blue} style = {{marginTop : hp('4%')}} onPress={() => onBackPressed()}/>

                    <Image 
                        source={require('../../assets/bvmLogo.png')}
                        style= {{...main.logo,...{alignSelf : 'center',marginTop : -hp('4%')}}}
                    />

                    <Text style = {main.bigTitle}>B V M</Text>
                </Card>

                <View style = {main.background}>
                    <Text style = {main.smallTitle}>create a new account</Text>

                    <View style = {{marginTop : hp('2%')}}>
                        <Card style = {main.inputContainer}>
                            <TextInput
                                editable={true}
                                placeholder={'User Name'}
                                placeholderTextColor='#CDC7C7'
                                style={main.input}
                                numberOfLines={1}
                                maxLength={25}
                                onChangeText={setUserName}
                            />
                        </Card>

                        <Card style = {main.inputContainer}>
                            <TextInput
                                editable={true}
                                placeholder={'Email'}
                                placeholderTextColor='#CDC7C7'
                                style={main.input}
                                numberOfLines={1}
                                keyboardType="email-address"
                                onChangeText={setEmail}
                            />
                        </Card>

                        <Card style = {main.inputContainer}>
                            <TextInput
                                editable={true}
                                placeholder={'Phone no'}
                                placeholderTextColor='#CDC7C7'
                                style={main.input}
                                numberOfLines={1}
                                keyboardType="number-pad"
                                onChangeText={setPhoneNo}
                            />
                        </Card>

                        <TouchableNativeFeedback activeOpacity={0.7} onPress={() => CheckingInputs()}>
                            <Button 
                                style = {{backgroundColor : blue,borderRadius : wp('5%'),paddingVertical : hp('1%'),marginHorizontal : wp('4%'),elevation : 5,marginVertical : hp('5%')}}
                                labelStyle = {{color : Background,fontWeight : "bold", fontSize : hp('2%')}}
                            >
                                SIGN UP
                            </Button>
                        </TouchableNativeFeedback>

                        <View>
                        <Text style = {{fontSize : hp('2.5%'),alignSelf : 'center',color : lightBlack,fontWeight : 'bold'}}>-- OR --</Text>
                        <TouchableNativeFeedback onPress={() => GooglesignUp()}>
                            <Card 
                                style = {{
                                    height : hp('7%'),
                                    marginVertical : hp('6%'),
                                    elevation : 5,
                                    borderRadius : wp('4%'),
                                    borderWidth : 1, 
                                    borderColor : blue,
                                    marginHorizontal : wp('3%')
                                }}
                            >

                                <View style = {{flexDirection : 'row',marginHorizontal : wp("5%"),justifyContent : 'center'}}>
                                    <AntDesign name="googleplus" size={hp('3.5%')} color="black" style = {{marginTop : hp('1.5%')}} />
                                    <Text style = {{marginTop : hp('1.8%'),color : black,marginLeft : wp('5%'),fontWeight : 'bold'}}>Continue with Google</Text>
                                </View>

                            </Card>
                        </TouchableNativeFeedback>
                    </View>

                    </View>
                </View>

                <Error 
                    isVisible = {error}
                    text = {errorMessage}
                    onBackdrop = {() => seterror(false)}
                    onBackButton = {() => seterror(false)}
                />

                <Loading
                    isVisible = {process > 1}
                    data = "Verifying"
                />

            </View>
        </KeyboardAwareScrollView>
    );
}