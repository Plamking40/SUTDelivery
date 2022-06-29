import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    ScrollView,
    Button,
    Pressable
} from 'react-native';
import Constants from 'expo-constants';

import * as SecureStore from 'expo-secure-store';

import firebase from 'firebase/compat/app';
import firestore from '../../firestore';
import 'firebase/compat/auth';


import { AntDesign } from '@expo/vector-icons';


export default function OrderBasket({ navigation }) {
    const [cuser, setCuser] = useState(null);
    const [products, setProducts] = useState([]);

    const [image, setImage] = useState('');
    const [fname, setFname] = useState('');

    const [status, setStatus] = useState('กำลังจัดส่ง');


    useEffect(() => {

        async function CheckLogin() {
            firebase.auth().onAuthStateChanged(async (user) => {
                if (user) {
                    setCuser(user);

                    /// แสดงชื่อ user เริ่ม ///
                    let username = await SecureStore.getItemAsync('username')
                    setFname(username)
                    /// แสดงชื่อ user จบ ///

                    //     /// แสดงโปรไฟล์ เริ่ม ////
                    let result = await SecureStore.getItemAsync('key');
                    setImage(result);
                    //     /// แสดงโปรไฟล์ จบ ////


                    let collRef = firestore.collection('users').doc(user.uid).collection('cart');

                    collRef.get().then((querySnap) => {
                        const tempDoc = querySnap.docs.map((doc) => {
                            return { id: doc.id, ...doc.data() };
                        });
                        setProducts(tempDoc);
                    });
                }
            });
        }
        const nusubs = navigation.addListener('focus', () => {
            CheckLogin();
        })
        return nusubs;
    }, [navigation]);


    function renderHeade() {
        return (
            <View style={{ borderBottomWidth: 1, flexDirection: 'row', height: 50 }}>
                <TouchableOpacity
                    style={{ width: 50, paddingLeft: 20, justifyContent: 'center' }}
                >
                    <Image
                        source={image == '' ? require('../../assets/logo1.png') : { uri: image }}
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

    async function RemoveProduct(id) {
        let collRef = firestore.collection('users').doc(cuser.uid).collection('cart').doc(id);

        await collRef.delete();
        alert("ลบสินค้าในตะกร้าแล้ว")
    }

    async function DeleteProduct() {
        let collRef = firestore.collection('users').doc(cuser.uid).collection('cart');

        collRef.get().then(async (querySnap) => {
            let tempDoc = querySnap.forEach(async (doc) => {
                await collRef.doc(doc.id).delete();
            });
        });
        alert("ยกเลิกสินค้าทั้งหมดในตะกร้า")
    }

    async function OrderProduct() {
        let collRef = firestore.collection('users').doc(cuser.uid).collection('cart');

        console.log("กำลังเชื่อมต่อฐานข้อมูล")

        let orderRef = await firestore.collection('orders').add({
            userid: cuser.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: status,
        });

        console.log("กำลัง Add ข้อมูล")

        collRef.get().then(async (querySnap) => {
            let tempDoc = querySnap.forEach(async (doc) => {
                await orderRef.collection('products').add(doc.data());
                await collRef.doc(doc.id).delete();
            });

            console.log("ยกเลิกอาหารในตะกร้าเสร็จสิ้น")

        });

        setProducts([]);
        alert('สั่งซื้ออาหารในตะกร้า เรียบร้อย');
    }

    return (
        <SafeAreaView style={{ paddingTop: Constants.statusBarHeight, flex: 1 }}>
            {renderHeade()}
            <Text></Text>
            <View style={{ alignItems: 'center', height: 45, padding: 8, backgroundColor: '#75FDE4' }} >
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#463A3A' }}>ตะกร้าสินค้า</Text>
            </View>
            <View style={{ flex: 2, paddingLeft: 30 }}>
                <ScrollView >
                    {products.map((item) => (
                        <Pressable style={{
                            borderRadius: 8,
                            padding: 6,
                            height: 38,
                            width: '90%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: "#BFBABC",
                            marginVertical: 3,
                            flexDirection: "row"
                        }} key={item.id} >
                            <Image source={{ uri: item.picture }} resizeMode="cover" style={{ height: 35, width: 35, borderRadius: 5 }} />
                            <Text style={{ color: "black", fontSize: 15, paddingLeft: 30, flex: 4 }}>{item.name}</Text>
                            <AntDesign style={{ flex: 1 }} onPress={() => RemoveProduct(item.id)} name="closecircleo" size={24} color="red" />
                        </Pressable>
                    ))}
                </ScrollView>
            </View>
            <View style={{ alignItems: 'center' }}>
                <Pressable style={{
                    borderRadius: 8,
                    padding: 6,
                    height: 40,
                    width: '50%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: "#7084FF",
                    marginVertical: 2,
                }} onPress={() => OrderProduct()} ><Text style={{ color: "white", fontSize: 15 }}>ยืนยันสินค้า</Text></Pressable>
                <Pressable style={{
                    borderRadius: 8,
                    padding: 6,
                    height: 35,
                    width: '50%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: "#BFBABC",
                    marginVertical: 3,
                }} onPress={() => DeleteProduct()} ><Text style={{ color: "white", fontSize: 15 }}>ยกเลิกทุกรายการ</Text></Pressable>
            </View>
        </SafeAreaView>
    );
};