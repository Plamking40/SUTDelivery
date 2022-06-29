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

import firebase from 'firebase/compat/app';
import firestore from '../firestore';
import 'firebase/compat/auth';

import * as SecureStore from 'expo-secure-store';

export default function OrderCom({ navigation }) {


    const [cuser, setCuser] = useState('');
    const [image, setImage] = useState('');
    const [fname, setFname] = useState('');

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
