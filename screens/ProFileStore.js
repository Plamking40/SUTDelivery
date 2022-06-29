import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Platform,
    Button,
    Pressable,
    LogBox
} from 'react-native';

import firebase from 'firebase/compat/app';
import firestore from '../firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';

import * as SecureStore from 'expo-secure-store';

import * as ImagePicker from 'expo-image-picker';

export default function ProFile({ navigation }) {
    const [cuser, setCuser] = useState('');
    const [fname, setFname] = useState('');
    const [image, setImage] = useState('');

    useEffect(() => {
        async function CheckLogin() {
            firebase.auth().onAuthStateChanged(async (user) => {
                if (user) {
                    setCuser(user);

                    /// แสดงชื่อ user เริ่ม ///
                    let username = await SecureStore.getItemAsync('username')
                    setFname(username)
                        /// แสดงชื่อ user จบ ///

                        /// แสดงโปรไฟล์ เริ่ม ////
                        let result = await SecureStore.getItemAsync('key');
                        setImage(result);
                        /// แสดงโปรไฟล์ จบ ////

                   
                }
            });
        }
        CheckLogin();
        LogBox.ignoreAllLogs();
    }, []);

    useEffect(() => {
        async function AskPer() {
            if (Platform.OS !== 'web') {
                const { status } =
                    await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Need permission');
                }
            }
        }
        AskPer();
    }, []);

    async function UploadPic() {
        let result = await ImagePicker.launchImageLibraryAsync();

        if (!result.cancelled) {
            let respose = await fetch(result.uri);
            let blob = await respose.blob();

            let storageRef = firebase.storage().ref();
            let picRef = storageRef.child(cuser.uid + '.jpg');

            picRef.put(blob).then((pic) => {
                alert("Uploaded!")
            });
        }
    }

    async function onLogOutPress() {
        await firebase.auth().signOut();
        await SecureStore.deleteItemAsync('key');
        await SecureStore.deleteItemAsync('username');
        await SecureStore.deleteItemAsync('userid');
        await SecureStore.deleteItemAsync('editid');
        await SecureStore.deleteItemAsync('editname');
        await SecureStore.deleteItemAsync('editprice');
        await SecureStore.deleteItemAsync('editpicture');
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        console.log("ออจากระบบ และ เคลียร์ข้อมลทั้งหมด เรียบร้อย")
    }
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

            <View style={{ flexDirection: "row", alignItems: 'flex-end', justifyContent: 'center' }}>
                <Image source={image == '' ? require('../assets/logo1.png') : { uri: image }} resizeMode="cover"
                    style={{ width: 120, height: 120, borderRadius: 5, }} />
                <Pressable style={{ padding: 5, backgroundColor: "gray", borderRadius: 10 }} onPress={() => UploadPic()} >
                    <Text style={{ color: "white" }}>Edit Image</Text>
                    </Pressable>
            </View>

            <View style={{ alignItems: 'center',height:200 }}>
                <Text style={{ color: 'black', fontWeight: 'bold',padding:10,fontSize:28 }}><Text style={{fontSize:24}}>{fname}</Text></Text>
            </View>

            <TouchableOpacity onPress={onLogOutPress}>
                <View style={{ backgroundColor: 'red', height: 50, padding: 15, justifyContent: 'center', borderRadius: 10, alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>ออกจากระบบ</Text>
                </View>
            </TouchableOpacity>

        </View>
    );
}