import React, { useEffect, useState } from "react";
import { View,Text, StyleSheet, StatusBar, Image, TouchableNativeFeedback, ToastAndroid, FlatList } from 'react-native';
import { heightPercentageToDP as hp , widthPercentageToDP as wp} from "react-native-responsive-screen";
import { lightBlack } from "../styles/colors";
import { AntDesign } from '../Icons/icons';
import { Card, Button } from "react-native-paper";
import moment from "moment";
import { Styles } from './EventDetails';
import { styles } from './home';
import Loader from "../components/DataLoader";
import { NavigationEvents } from "react-navigation";

export default function MyEvents(props){

    const [ data, setData ] = useState([]);
    const [ loading, setloading ] = useState(false);

    useEffect(() => {
        loadData();
    },[]);

    const loadData = async () => {
        setloading(true);
        const events = global.events;
        const userEvents = global.userevents;
        var finaldata = [];
        userEvents.forEach(e => {
            events.forEach(res => {
                if(e.id === res.id){
                    finaldata.push({
                        Name : res.Name,
                        Date : res.Date,
                        Category : res.Category,
                        Image : res.Image,
                        Place : res.Place,
                        Price : res.Price,
                        ContactNo : res.ContactNo,
                        id : res.id.toString().trim()
                    })
                }
            })
        })
        setData(finaldata);
        setloading(false);
    }

    const onClick = (data) => {
        var udata = global.userevents;
        udata = udata.filter((res) => {
            return res.id === data.id
        })
        props.navigation.navigate({
            routeName : 'Details',
            params : {
                data : data,
                register : 1,
                udata : udata,
                screen : "my"
            }
        })
    }

    const EventUI = (data) => {

        return(
            <TouchableNativeFeedback onPress = {() => onClick(data.item)}>
                <Card style={styles.event}>
                    <Image 
                        source={{uri : data.item.Image}}
                        style = {{ height : hp('26%') }}
                    />

                    <View style={{flexDirection : 'row',justifyContent : 'space-between',marginTop : hp('2%')}}>

                        <Text style={{...styles.subTitle,...{marginTop : hp('0%')}}}>{data.item.Name}</Text>

                        <View style={{flexDirection : 'row',marginRight : wp('5%'),alignSelf : 'center'}}>
                            <AntDesign name="calendar" size = {hp('3%')} color={lightBlack} />
                            <Text style={{ marginLeft : wp('3%'),color : lightBlack,fontWeight : "bold",alignSelf : 'center' }}>
                                {moment(data.item.Date.toDate()).format('DD/MM/YYYY')}
                            </Text>
                        </View>
                    </View>
                </Card>
            </TouchableNativeFeedback>
        )
    }

    const Refersh = () => {
        props.navigation.setParams({ update: false })
        global.update = false
        loadData();
    }

    return(
        <View style={{flex : 1}}>
            <NavigationEvents onDidFocus={() => {
                (props.navigation.getParam('update') || global.update) === true
                ? Refersh()
                : console.log('Not update')
                }}
            />

            {loading ? (
                <View style={{flex : 1}}>
                    <Loader 
                        style = {{flex : 1}}
                    />
                </View>
            ):(
                <View style={{flex : 1}}>
                    <View style={Styles.header}>
                        <Text style={Styles.title}>Your Events</Text>
                    </View>

                    {data.length <= 0 ? (
                        <View style={{flex : 1,alignItems : 'center',justifyContent : 'center'}}>
                            <Text style={{fontSize : hp('3%'),fontWeight : 'bold'}}>No Events Found</Text>
                        </View>
                    ):(
                        <View style={{flex : 1}}>
                            <FlatList
                                    style = {{flex : 1}}
                                    data = {data}
                                    keyExtractor = {(item,index)=>index.toString()}
                                    renderItem={EventUI}
                                    showsVerticalScrollIndicator = {false}
                                    ListFooterComponent = {
                                        <View style = {{marginTop : hp('5%')}}>
                                            
                                        </View>
                                    }
                                />
                        </View>
                    )}
                </View>
            )}
        </View>
    )
}