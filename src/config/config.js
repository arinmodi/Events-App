import firebase from '@react-native-firebase/app';
import at from '@react-native-firebase/auth';
import fs from '@react-native-firebase/firestore';

export const f = firebase;
export const auth = at();
export const firestore = fs();
export const timestamp = firebase.firestore;