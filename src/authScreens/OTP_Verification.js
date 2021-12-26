import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableNativeFeedback,
    StyleSheet,
    ToastAndroid,
    StatusBar
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Ionicons } from '../Icons/icons';
import { Card, Button } from 'react-native-paper';
import { Background, blue } from "../styles/colors";
import { main } from "../styles/main";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { auth, firestore } from "../config/config";
import Loading from '../components/Loading';

export default function OTP(props){

    const [value, setValue] = useState('');
    const [ process, setProcess ] = useState(0);
    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [cprops, getCellOnLayoutHandler] = useClearByFocusCell({
      value,
      setValue,
    });

    const userName = props.navigation.getParam('userName');
    const email = props.navigation.getParam('email');
    const no = props.navigation.getParam('phoneNo');
    const result = props.navigation.getParam('confirmResult');
    const type = props.navigation.getParam('type');

    const CELL_COUNT = 6;

    const onBackPressed = () => {
        props.navigation.navigate("Welcome");
    }

    const CheckingInputs = () => {
        setProcess(2);
        if(!value.length === 6){
            setProcess(0);
            ToastAndroid.show("please, enter the otp",ToastAndroid.LONG)
        }else{
            confirmCode();
        }
    }

    const confirmCode = async () => {
        try{
            const user = auth.currentUser;
            console.log(user);
            if(user){
                if(type === 1){
                    uploadData();
                }else{
                    ToastAndroid.show('Successfully Logged In...',ToastAndroid.LONG);
                    goToWaitScreen();
                }
            }else{
                try{
                    await result.confirm(value).then(async r => {
                        if(type === 1){
                            uploadData();
                        }else{
                            ToastAndroid.show('Successfully Logged In...',ToastAndroid.LONG);
                            goToWaitScreen();
                        }
                    })
                }catch(e){
                    setProcess(0);
                    ToastAndroid.show("Invalid OTP",ToastAndroid.LONG);
                    console.log(e);
                }
            }
        }catch(e){
            setProcess(0);
            ToastAndroid.show("Invalid OTP",ToastAndroid.LONG);
            console.log(e);
        }
    }

    const uploadData = async () => {
        var userID = auth.currentUser.uid;

        const data = {
            userId : userID,
            email : email,
            userName : userName,
            phoneNo : no
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

    const goToWaitScreen = () => {
        setProcess(0);
        props.navigation.navigate("Events");
    }

    return (
        <KeyboardAwareScrollView
          enableAutomaticScroll={true}
          style={{ flex: 1, backgroundColor: 'white' }}
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

                <View style = {{...main.background,...{marginTop : hp('3%')}}}>
                    <Image source={require('../../assets/otp.jpg')} style = {{height : hp('25%'),width : hp('25%'),alignSelf : 'center'}}/>
                    <Text style = {{...main.smallTitle,...{alignSelf : 'center'}}}>Enter the OTP</Text>
                    <CodeField
                        ref={ref}
                        {...cprops}
                        value={value}
                        onChangeText={setValue}
                        cellCount={CELL_COUNT}
                        rootStyle={styles.codeFieldRoot}
                        keyboardType="number-pad"
                        textContentType="oneTimeCode"
                        renderCell={({index, symbol, isFocused}) => (
                            <Text
                                key={index}
                                style={[styles.cell, isFocused && styles.focusCell]}
                                onLayout={getCellOnLayoutHandler(index)}>
                                {symbol || (isFocused ? <Cursor /> : null)}
                            </Text>
                        )}
                    />
                </View>

                <TouchableNativeFeedback activeOpacity={0.7} onPress={() => CheckingInputs()}>
                    <Button 
                        style = {{backgroundColor : blue,borderRadius : wp('5%'),paddingVertical : hp('1%'),marginHorizontal : wp('4%'),elevation : 5,marginVertical : hp('7%')}}
                        labelStyle = {{color : Background,fontWeight : "bold", fontSize : hp('2%')}}
                    >
                        Verify
                    </Button>
                </TouchableNativeFeedback>

                <Loading 
                    isVisible = { process > 1 }
                    data = "Checking"
                />

            </View>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1
    },

    codeFieldRoot: {
        marginTop: hp('5%')
    },

    cell: {
      width: wp('12%'),
      height: wp('12%'),
      lineHeight: hp('6%'),
      fontSize: hp('3%'),
      borderWidth: 2,
      borderColor: '#00000030',
      textAlign: 'center',
      borderRadius : wp('3%')
    },

    focusCell: {
      borderColor: blue,
    },
});