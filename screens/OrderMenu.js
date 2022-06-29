import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    ScrollView,
    LogBox
} from 'react-native';
import Constants from 'expo-constants';

import CardMenuStore from './CardMenuStore';

import firebase from 'firebase/compat/app';
import firestore from '../firestore';
import 'firebase/compat/auth';

import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

import { getAuth } from 'firebase/auth';

import * as SecureStore from 'expo-secure-store';

export default function OrderMenu({ navigation }) {
    const [products, setProducts] = useState([]);

    const [cuser, setCuser] = useState('');

    const [image, setImage] = useState('');
    const [fname, setFname] = useState('');

    const user = getAuth().currentUser;

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
                    return true
                } else {
                    return false
                }
            });
        }

        if (CheckLogin()) {
            GetProducts()
        }
        LogBox.ignoreAllLogs(); // ปิด Log
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

    const onEditPressed = () => {
        navigation.navigate('OrderEdit');
    }
    const onInSertPressed = () => {
        navigation.navigate('OrderInput');
    }

    if (user !== null) {
        var uid = user.uid;
    }

    async function GetProducts() {

        let collRef = firestore.collection('products').where("userid", '==', uid);

        collRef.onSnapshot((querySnap) => {
            const dataquery = [];

            querySnap.forEach(documentSnapshot => {
                dataquery.push({
                    ...documentSnapshot.data(),
                    key: documentSnapshot.id,
                });
            });
            setProducts(dataquery);
        });

    }




    return (
        <SafeAreaView style={{ paddingTop: Constants.statusBarHeight,flex:1 }}>

            {renderHeade()}
            <View style={{flex:1}}>

                <View style={{ flexDirection: "row", paddingTop: 15, alignItems: "center" }} >
                    <Text style={{ flex: 2 }}></Text>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#463A3A', flex: 6, padding: 10 }}>รายการคำสั่งซื้อจากลูกค้า </Text>
                    <TouchableOpacity style={{ flex: 1 }}  onPress={onEditPressed}>
                        <FontAwesome  name="edit" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1 }}  onPress={onInSertPressed}>
                        <AntDesign  name="plussquare" size={30} color="green" />
                    </TouchableOpacity>

                </View>
                <View style={{flex:5}}>
                    <ScrollView>

                        {products.map((item) =>

                            <CardMenuStore key={item.id} id={item.key} name={item.name} price={item.price} stock={item.stock} picture={item.picture} />)

                        }

                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    );
};
