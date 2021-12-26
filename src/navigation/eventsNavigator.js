import React from 'react';
import { createAppContainer } from 'react-navigation';
import {  createStackNavigator, TransitionPresets } from 'react-navigation-stack';
import Home from '../eventsScreens/home';
import MyEvents from '../eventsScreens/myEvents';
import About from '../eventsScreens/AboutUs';
import Details from '../eventsScreens/EventDetails';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { MaterialIcons, AntDesign, Ionicons } from '../Icons/icons';
import { blue, black } from '../styles/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


const HomeScreens = createStackNavigator({
    Main : {
        screen : Home
    },

    Details : {
        screen : Details,
        navigationOptions : {
            ...TransitionPresets.SlideFromRightIOS
        }
    }
},{
    headerMode : 'none',
    mode : 'modal',
    navigationOptions: {
        headerVisible: false,
    }
});

const MyEventsScreen = createStackNavigator({
    Events : MyEvents,
    Details : {
        screen : Details,
        navigationOptions : {
            ...TransitionPresets.SlideFromRightIOS
        }
    }
},{
    headerMode : 'none',
    mode : 'modal',
    navigationOptions: {
        headerVisible: false,
    }
});

const Tabs = {
    Home : {
        screen : HomeScreens,
        navigationOptions : () => ({
            tabBarIcon : ({tintColor}) => {
                return(
                    <AntDesign name="home" size={hp('4%')} color={tintColor} />
                )
            }
        })
    },

    Event : {
        screen : MyEventsScreen,
        navigationOptions : () => ({
            tabBarIcon : ({tintColor}) => {
                return(
                    <MaterialIcons name="event" size={hp('4%')} color={tintColor} />
                )
            }
        })
    },

    About : {
        screen :About,
        navigationOptions : () => ({
            tabBarIcon : ({tintColor}) => {
                return(
                    <Ionicons name="people-circle" size={hp('4%')} color={tintColor} />
                )
            }
        })
    }
};

const eventsBottom = createBottomTabNavigator(
    Tabs,
    {
        tabBarOptions : {
            activeTintColor : blue,
            inactiveTintColor : black,
            style : {
                height : hp('9%'),
                elevation : 24
            }
        }
    }
)

const MainScreens = createStackNavigator({
    Main : eventsBottom
},{
    headerMode : 'none',
    mode : 'modal',
    navigationOptions: {
        headerVisible: false,
    }
})

export default createAppContainer(MainScreens);