import React from 'react';
import {
  View,
  LogBox,
  Image,
  Text
} from 'react-native';
import MainApp from './src/navigation/main';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import Modal from 'react-native-modal'
import NetInfo from '@react-native-community/netinfo'
import { blue } from './src/styles/colors';
import SplashScreen from 'react-native-splash-screen'

class App extends React.Component {

  constructor(){
    super()
    this.state = {
      connection: true
    }
  }

  componentDidMount(){
    SplashScreen.hide();
    global.userEvents = [];
    global.events = [];
    var that = this
    LogBox.ignoreLogs(["EventEmitter.removeListener"])

    NetInfo.addEventListener(networkState => {
      if (networkState.isConnected) {
        that.setState({
          connection: true
        })
      } else {
        that.setState({
          connection: false
        })
      }
    })
  }

  render(){

    return (
      <View style={{flex : 1}}>
        <MainApp ref={x => (global.stackNavigator = x)} />

        <Modal isVisible={!this.state.connection}>
          <View
            style={{
              height: hp('30%'),
              backgroundColor: 'white',
              borderRadius: wp('5%'),
              overflow: 'hidden',
              alignItems: 'center'
            }}
          >
            <Image
              source={require('./assets/offline.png')}
              style={{
                height: hp('8%'),
                width: hp('8%'),
                resizeMode: 'contain',
                marginTop: hp('4%')
              }}
            />
            <Text
              style={{
                marginVertical: hp('2%'),
                color: 'red',
                fontWeight: 'bold',
                fontSize: hp('1.8%')
              }}
            >
              Connection Error
            </Text>
            <Text
              style={{ fontSize: hp('2%'), color: blue, fontWeight: 'bold' }}
            >
              Check Your Connection and{' '}
            </Text>
            <Text
              style={{
                fontSize: hp('2%'),
                color: 'black',
                fontWeight: 'bold',
                marginTop: hp('1%')
              }}
            >
              Restart the app..!
            </Text>
          </View>
        </Modal>
      </View>
    );
  }
};

export default App;
