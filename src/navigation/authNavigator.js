import { createAppContainer } from 'react-navigation';
import {  createStackNavigator, TransitionPresets } from 'react-navigation-stack';
import Welcome from '../authScreens/welcome';
import Login from '../authScreens/Login';
import Signup from '../authScreens/SignUp';
import OTP from '../authScreens/OTP_Verification';

const AuthScreens = createStackNavigator({
    Welcome : {
        screen : Welcome,
        navigationOptions : {
            ...TransitionPresets.ScaleFromCenterAndroid
        }
    },

    Login : {
        screen : Login,
        navigationOptions : {
            ...TransitionPresets.SlideFromRightIOS
        }
    },

    OTP : {
        screen : OTP,
        navigationOptions : {
            ...TransitionPresets.SlideFromRightIOS
        }
    },

    Signup : {
        screen : Signup,
        navigationOptions : {
            ...TransitionPresets.SlideFromRightIOS
        }
    },
},{
    headerMode : 'none',
    mode : 'modal',
    navigationOptions: {
        headerVisible: false
    }
})

export default createAppContainer(AuthScreens);