import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import { Background,black, blue, lightBlack, red } from '.././styles/colors';
import { StyleSheet } from 'react-native';

export const main = StyleSheet.create({
    background : {
        flex : 1,
        paddingHorizontal : wp("5%")
    },

    header : {
        marginTop : hp("3%"),
        flexDirection : 'row',
    },

    logo : {
        height : hp('7%'),
        width : hp('7%'),
        resizeMode : 'contain'
    },

    textTitle : {
        fontSize : hp('2.5%'),
        marginLeft : wp('5%'),
        color : lightBlack,
        fontWeight : 'bold',
        alignSelf : 'center'
    },

    illustrator : {
        height : hp('40%'),
        width : hp('40%'),
        resizeMode : 'contain',
        alignSelf : 'center',
        marginTop : hp('2%')
    },

    title : {
        color : black,
        fontSize : hp('3%'),
        alignSelf : 'center',
        fontWeight : 'bold'
    },

    subtext : {
        alignSelf : 'center',
        marginTop : hp('2%'),
        fontSize : hp('2%'),
        color : lightBlack,
        fontWeight : '600'
    },

    higtlight : {
        alignSelf : 'center',
        marginTop : hp('0.5%'),
        fontSize : hp('2%'),
        color : blue,
        fontWeight : 'bold'
    },

    bigTitle : {
        color : blue,
        fontSize : hp('4%'),
        fontWeight : '500',
        marginLeft : wp('3%'),
        alignSelf : 'center',
        marginTop : hp('2%')
    },

    smallTitle : {
        color : black,
        fontSize : hp('2.5%'),
        marginLeft : wp('3%'),
        marginTop : hp('4%'),
        fontWeight : 'bold'
    },

    inputContainer : {
        height : hp('8%'),
        marginHorizontal : wp('2%'),
        elevation : 5,
        borderRadius : wp('5%'),
        marginTop : hp('4%'),
        backgroundColor : "#f7f7f7"
    },

    input : {
        marginLeft : wp('5%'),
        fontSize : hp('2.5%'),
        marginTop : hp('1%')
    },
})