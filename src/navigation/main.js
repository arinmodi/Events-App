import { createAppContainer } from 'react-navigation';
import {  createStackNavigator, TransitionPresets } from 'react-navigation-stack';
import AuthScreens from '../navigation/authNavigator';
import Loading from '../LoadingScreens/Loading';
import MainScreens from './eventsNavigator';

const MainApp  = createStackNavigator({

    Loading : {
        screen : Loading,
        navigationOptions : {
            ...TransitionPresets.ScaleFromCenterAndroid
        }
    },

    Auth : {
        screen : AuthScreens
    },

    Events : {
        screen : MainScreens,
        navigationOptions : {
            ...TransitionPresets.ScaleFromCenterAndroid
        }
    }
},{
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false
    }
})

export default createAppContainer(MainApp);