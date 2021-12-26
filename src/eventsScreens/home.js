import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableNativeFeedback, Image, StatusBar,BackHandler, Alert } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Background, black, blue, lightBlack, red } from "../styles/colors";
import SearchBar from "react-native-dynamic-search-bar";
import { Card } from "react-native-paper";
import { AntDesign } from "../Icons/icons";
import { FlatList } from "react-native-gesture-handler";
import { auth, firestore } from "../config/config";
import moment from "moment";
import Loader from "../components/DataLoader";

export default function Home(props){

    const [ events, setEvents ] = useState([]);
    const [ name, setName ] = useState('');
    const [ eventsData, seteventsData ] = useState([]);
    const [ Loading, setLoading ] = useState(true);
    const [ tech, settech ] = useState(false);
    const [ nontech, setnontech ] = useState(false);
    const [ sports, setsports ] = useState(false);
    const [ filtered, setfiltered ] = useState(false);
    const [ filterData, setfilterdata ] = useState([]);

    useEffect(() => { 
        LoadEventData();
        const backAction = () => {
            Alert.alert('Hold on!', 'Are you sure you want to close the App?', [
              {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel'
              },
              { text: 'YES', onPress: () => BackHandler.exitApp() }
            ])
            return true
          }
      
          const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
          )

          return () => backHandler.remove()
    },[]);

    const LoadEventData = async () => {
        setLoading(true);
        var edata = [];
        setEvents([]);
        const date = new Date();
        const ref = firestore.collection('events').where('Date','>',date).orderBy('Date', 'asc');

        await ref.get().then(data => {
            data.forEach(doc => {
                var res = doc.data();
                edata.push({
                    Name : res.Name,
                    Date : res.Date,
                    Category : res.Category,
                    Image : res.Image,
                    Place : res.Place,
                    Price : res.Price,
                    ContactNo : res.ContactNo,
                    id : doc.id.toString().trim()
                })
            })
        })
        global.events = edata;
        setEvents(edata);

        LoadUSerData();
    }

    const LoadUSerData = async () => {
        const date = new Date();
        var userId = auth.currentUser.uid;
        var userRef = firestore.collection('users').doc(userId);

        await userRef.get().then((res) => {
            setName(res.data().userName);
        })

        userRef.collection('events').where('Date','>',date).orderBy('Date', 'asc').onSnapshot((res) => {
            var userEvents = [];
            res.forEach((data) => {
                userEvents.push({
                    id : data.data().id.toString().trim(),
                    registredDate : data.data().registredDate,
                    docId : data.id
                })
            })

            global.userevents = userEvents;
            seteventsData(userEvents);
        })

        setLoading(false)
    }

    const onClick = (data) => {
        const registred = eventsData.filter(data2 => {
            return data2.id === data.id;
        });
        console.log(registred);
        props.navigation.navigate({
            routeName : 'Details',
            params : {
                data : data,
                register : registred.length,
                udata : registred
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

    const onTech = () => {
        if(!tech){
            settech(true);
            setnontech(false);
            setsports(false);
            var filter_data = events.filter(res => {
                return res.Category === "Tech"
            })
            setfilterdata(filter_data);
            setfiltered(true);
        }else{
            settech(false);
            setfilterdata([]);
            setfiltered(false);
        }
    }

    const onNonTech = () => {
        if(!nontech){
            setnontech(true);
            setsports(false);
            settech(false);
            var filter_data = events.filter(res => {
                return res.Category === "NonTech"
            })
            setfilterdata(filter_data);
            setfiltered(true);
        }else{
            setnontech(false);
            setfilterdata([]);
            setfiltered(false);
        }
    }

    const onSerch = (text) => {
        if(text !== ''){
            const newData = events.filter(e => {
                const Name = e.Name;
                return Name.indexOf(text) > -1;
            })
            setfiltered(true);
            setfilterdata(newData);
        }else{
            setfilterdata([]);
            setfiltered(false);
        }
    }

    const onCancelPress = () => {
        setfilterdata([]);
        setfiltered(false);
    }


    const onSports = () => {
        if(!sports){
            setsports(true);
            setnontech(false);
            settech(false);
            var filter_data = events.filter(res => {
                return res.Category === "Sports"
            })
            setfilterdata(filter_data);
            setfiltered(true);
        }else{
            setsports(false);
            setfilterdata([]);
            setfiltered(false);
        }
    }

    return(
        <View style = {{flex : 1}}>

            {Loading ? (
                <View style = {{flex : 1}}>
                    <Loader 
                        style = {{flex : 1}}
                    />
                </View>
            ):(
                <View style={styles.background}>
                    <StatusBar backgroundColor={blue}/>

                    <View style={{marginTop : hp('3%'),paddingHorizontal : wp('5%'),flexDirection : 'row',justifyContent : 'space-between'}}>
                        <View>
                            <Text style={{...styles.title,...{}}}>Hello,</Text>
                            <Text style={{...styles.name,...{}}}>{name}</Text>
                        </View>
                        <Image 
                            source={require('../../assets/bvmLogo.png')}
                            style = {{height : hp('8%'),width : hp('8%'),resizeMode : 'contain',alignSelf : 'center'}}
                        />
                    </View>

                    <SearchBar 
                        placeholder="Serch Event Name.."
                        onChangeText = {(text) =>  onSerch(text) }
                        onClearPress = {onCancelPress}
                        style={{
                            marginTop : hp('3%'),
                            marginHorizontal : -wp('3%'),
                            backgroundColor : Background,
                            height : hp('7%'),
                            elevation : 20,
                            borderColor : black,
                            borderWidth : 1,
                        }}
                        searchIconImageStyle={{tintColor : blue}}
                        clearIconImageStyle={{tintColor : red}}
                        editable = {true}
                        placeholderTextColor= {lightBlack}
                        textInputStyle = {{
                            fontSize : hp('2%'),
                            color : 'black',
                            padding : wp('2%')
                        }}
                    />

                    {!(events.length > 0) || (filtered && filterData.length <= 0) ? (
                        <View>
                            <Text style={styles.subTitle}>Top Categories</Text>

                            <View style={{marginTop : hp('3%'),marginHorizontal : wp('5%'),flexDirection : "row"}}>
                                <TouchableNativeFeedback onPress={() => onTech()}>
                                    <Card style={{...styles.category,...{backgroundColor : tech ? "#BCE5FF" : Background}}}>
                                        <View style={{padding : hp('1%'),alignItems : 'center'}}>
                                            <Image 
                                                source={require('../../assets/tech.png')}
                                                style = {styles.categoryImage}
                                            />

                                            <Text style={styles.categoryTitle}>Tech</Text>
                                        </View>
                                    </Card>
                                </TouchableNativeFeedback>

                                <TouchableNativeFeedback onPress={() => onNonTech()}>
                                    <Card style={{...styles.category,...{backgroundColor : nontech ? "#BCE5FF" : Background}}}>
                                        <View style={{padding : hp('1%'),alignItems : 'center'}}>
                                            <Image 
                                                source={require('../../assets/nontech.png')}
                                                style = {styles.categoryImage}
                                            />

                                            <Text style={styles.categoryTitle}>Non Tech</Text>
                                        </View>
                                    </Card>
                                </TouchableNativeFeedback>

                                <TouchableNativeFeedback onPress={() => onSports()}>
                                    <Card style={{...styles.category,...{marginRight : wp('0%'),backgroundColor : sports ? "#BCE5FF" : Background}}}>
                                        <View style={{padding : hp('1%'),alignItems : 'center'}}>
                                            <Image 
                                                source={require('../../assets/sports.png')}
                                                style = {styles.categoryImage}
                                            />

                                            <Text style={styles.categoryTitle}>Sports</Text>
                                        </View>
                                    </Card>
                                </TouchableNativeFeedback>
                            </View>

                            <Text style={{...styles.subTitle,...{marginTop : hp('5%')}}}>Top Events</Text>

                            <Text style = {{marginTop : hp('8%'),alignSelf : 'center',fontSize : hp('3%'),fontWeight : 'bold',color : lightBlack}}>No Events Found</Text>
                        </View>
                    ):(
                        <View style={{flex : 1}}>
                            <FlatList
                                style = {{flex : 1}}
                                data = {filtered ? filterData : events}
                                keyExtractor = {(item,index)=>index.toString()}
                                renderItem={EventUI}
                                showsVerticalScrollIndicator = {false}
                                ListHeaderComponent={
                                    <View>
                                        <Text style={styles.subTitle}>Top Categories</Text>

                                        <View style={{marginTop : hp('3%'),marginHorizontal : wp('5%'),flexDirection : "row"}}>
                                            <TouchableNativeFeedback onPress={() => onTech()}>
                                                <Card style={{...styles.category,...{backgroundColor : tech ? "#BCE5FF" : Background}}}>
                                                    <View style={{padding : hp('1%'),alignItems : 'center'}}>
                                                        <Image 
                                                            source={require('../../assets/tech.png')}
                                                            style = {styles.categoryImage}
                                                        />

                                                        <Text style={styles.categoryTitle}>Tech</Text>
                                                    </View>
                                                </Card>
                                            </TouchableNativeFeedback>

                                            <TouchableNativeFeedback onPress={() => onNonTech()}>
                                                <Card style={{...styles.category,...{backgroundColor : nontech ? "#BCE5FF" : Background}}}>
                                                    <View style={{padding : hp('1%'),alignItems : 'center'}}>
                                                        <Image 
                                                            source={require('../../assets/nontech.png')}
                                                            style = {styles.categoryImage}
                                                        />

                                                        <Text style={styles.categoryTitle}>Non Tech</Text>
                                                    </View>
                                                </Card>
                                            </TouchableNativeFeedback>

                                            <TouchableNativeFeedback onPress={() => onSports()}>
                                                <Card style={{...styles.category,...{marginRight : wp('0%'),backgroundColor : sports ? "#BCE5FF" : Background}}}>
                                                    <View style={{padding : hp('1%'),alignItems : 'center'}}>
                                                        <Image 
                                                            source={require('../../assets/sports.png')}
                                                            style = {styles.categoryImage}
                                                        />

                                                        <Text style={styles.categoryTitle}>Sports</Text>
                                                    </View>
                                                </Card>
                                            </TouchableNativeFeedback>
                                        </View>

                                        <Text style={{...styles.subTitle,...{marginTop : hp('5%')}}}>Top Events</Text>
                                    </View>
                                }
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

export const styles = StyleSheet.create({
    background : {
        flex : 1,
        backgroundColor : "#F2F2F2"
    },

    title : {
        color : black,
        fontSize : hp('3.5%'),
        fontWeight : 'bold'
    },

    name : {
        color : lightBlack,
        fontSize : hp('2.5%'),
        marginTop : hp('0.5%')
    },

    subTitle : {
        color : blue,
        fontSize : hp('2.5%'),
        fontWeight : 'bold',
        marginTop : hp('3%'),
        marginLeft : wp('5%')
    },

    category : {
        height : hp('14%'),
        width : wp('26.6%'),
        elevation : 5,
        borderRadius : wp('5%'),
        marginRight : wp('5%')
    },

    categoryImage : {
        height : hp('7%'),
        width : hp('7%'),
        marginTop : hp('1%'),
        resizeMode : 'contain'
    },

    categoryTitle : {
        color : black,
        marginTop : hp('1%'),
        fontWeight : 'bold'
    },

    event : {
        marginTop : hp('3%'),
        marginHorizontal : wp('5%'),
        backgroundColor : Background,
        height : hp('35%'),
        elevation : 10,
        borderRadius : wp('5%'),
        overflow : 'hidden'
    }
});