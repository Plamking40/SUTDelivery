import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import Constants from 'expo-constants';

import * as SecureStore from 'expo-secure-store';

import firebase from 'firebase/compat/app';
import firestore from '../firestore';
import 'firebase/compat/auth';

export default function OrderList({ navigation }) {

    const [cuser, setCuser] = useState('');
    const [image, setImage] = useState('');
    const [fname, setFname] = useState('');

    useEffect(() => {  
            firebase.auth().onAuthStateChanged(async (user) => {
                if (user) {
                    setCuser(user);
                    await SecureStore.setItemAsync('userid',user.uid);

                    /// แสดงชื่อ user เริ่ม ///
                    const docRef = firestore.collection('users').doc(user.uid);

                    docRef.get().then( async (doc) => {
                        await SecureStore.setItemAsync('username',(doc.data().name));
                        let username = await SecureStore.getItemAsync('username')
                        setFname(username)
                        /// แสดงชื่อ user จบ ///

                        
                        /// แสดงโปรไฟล์ เริ่ม ////
                        let storageRef = firebase.storage().ref();
                        let picRef = storageRef.child(user.uid + '.jpg').getDownloadURL();
                        
                        picRef.then(async (url) => await SecureStore.setItemAsync('key', url));
                        let result = await SecureStore.getItemAsync('key');
                        console.log("Set to SecureStore")
                        setImage(result);
                        
                        
                        /// แสดงโปรไฟล์ จบ ////
                    });
                }
            });
    }, []);

    function renderHeade() {
        return (
            <View style={{ borderBottomWidth: 1, flexDirection: 'row', height: 50 }}>
                <TouchableOpacity
                    style={{ width: 50, paddingLeft: 20, justifyContent: 'center' }}
                >
                    <Image
                        source={image == '' ? require('../assets/logo1.png') : { uri: image }}
                        resizeMode="contain"
                        style={{ width: 30, height: 30, borderRadius: 20, }}
                    />

                </TouchableOpacity>

                <View style={{ flex: 1, }}>
                    <View
                        style={{ width: '50%', height: "100%", justifyContent: 'center', borderRadius: 30, paddingLeft: 10 }}
                    >

                        <Text style={{ fontSize: 20 }}>{fname}</Text>
                    </View>
                </View>

            </View>
        )
    }

    return (
        <SafeAreaView style={{ paddingTop: Constants.statusBarHeight }}>
            {renderHeade()}
            <Text></Text>
            <View style={{ alignItems: 'center', height: 35, padding: 4 }} >
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#463A3A' }}>รายการคำสั่งซื้อจากลูกค้า</Text>
                <View style={{ backgroundColor: '#F4D4D4', height: 60, width: '100%', borderBottomWidth: 1 }}>
                </View>
                <View style={{ backgroundColor: '#F4D4D4', height: 60, width: '100%', borderBottomWidth: 1 }}>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F8F9",

    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
    },
    input: {

        height: 40,

        //พื้นหลัง
        backgroundColor: 'white',
        width: '60%',
        //เส้นขอบ
        borderColor: '#e8e8e8',
        borderWidth: 5,
        borderRadius: 20,
        //ระยะห่าง
        paddingHorizontal: 20,
        marginVertical: 1,
    },
})

