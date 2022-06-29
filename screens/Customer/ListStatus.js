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
    Modal,
    Pressable
} from 'react-native';
import Constants from 'expo-constants';
import { getAuth } from 'firebase/auth';

import * as SecureStore from 'expo-secure-store';

import firebase from 'firebase/compat/app';
import firestore from '../../firestore';
import 'firebase/compat/auth';


export default function ListStatus({ navigation }) {
    const [products, setProducts] = useState([]);
    const [cuser, setCuser] = useState(null);
    const [image, setImage] = useState('');
    const [fname, setFname] = useState('');
    const [cart, setCart] = useState([]);

    const user = getAuth().currentUser;

    if (user !== null) {
        var uid = user.uid;
    }

    async function GetCart(id) {
        console.log(id);
        let collRef = firestore.collection('orders').doc(id);
        collRef.collection('products').get().then((doc) => {

            setCart(doc.data().name);
            console.log(cart);
        });

        // await collRef.collection('products').doc(id).get().then(async (doc) => {
        //     setCart(doc.data());
        // });

    }

    async function GetProducts() {

        let collRef = firestore.collection('orders').where("userid", '==', uid);

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
    useEffect(() => {
        CheckLogin()
        GetProducts()
        // return () => {setProducts([]); setImage([]);};
    },[])

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

    const [modalVisible, setModalVisible] = useState(false); //Set Pop-up

    return (
        <SafeAreaView style={{ paddingTop: Constants.statusBarHeight, flex: 1 }}>
            {renderHeade()}
            <Text></Text>
            <View style={{ alignItems: 'center', height: 45, padding: 8, backgroundColor: '#75FDE4' }} >
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#463A3A' }}>สถานะการสั่งซื้อ</Text>
            </View>

            <ScrollView style={{ flex: 1, paddingLeft: 30 }}>
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
                    }}
                        key={item.key} onPress={() => {
                             setModalVisible(!modalVisible);
                            // GetCart(item.key);
                        }
                        } >
                        <Text style={{ flex: 3 }}>{new Date(item.createdAt.seconds * 1000).toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })}</Text>
                        <Text style={{ flex: 1, color: "red" }}>{item.status}</Text>
                    </Pressable>

                ))}

                <Modal transparent={true} visible={modalVisible} >
                    <View
                        style={{
                            backgroundColor: 'white',
                            margin: 50,
                            borderRadius: 10,
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 5,
                        }}>
                        <View
                            style={{
                                backgroundColor: '#49FFDE',
                                padding: 20,
                                borderTopRightRadius: 10,
                                borderTopLeftRadius: 10,
                                alignItems: 'center',
                            }}>
                            <Text style={{ fontSize: 24 }}>AF-229</Text>
                        </View>
                        <View
                            style={{
                                backgroundColor: '#2222',
                                paddingLeft: 20,
                                paddingRight: 20,
                                flexDirection: 'row',
                            }}>
                            <Text style={{ fontSize: 16, flex: 4 }}>Bison Burgers</Text>
                            <Text style={{ fontSize: 16, flex: 1 }}>2</Text>
                            <Text style={{ fontSize: 16, flex: 1 }}>39</Text>
                            <Text style={{ fontSize: 16, flex: 1 }}>78</Text>
                        </View>
                        <View
                            style={{
                                backgroundColor: '#2222',
                                paddingLeft: 20,
                                paddingRight: 20,
                                flexDirection: 'row',
                            }}>
                            <Text style={{ fontSize: 16, flex: 5 }}>รวม</Text>
                            <Text style={{ fontSize: 16, flex: 1 }}>300</Text>
                            <Text style={{ fontSize: 16, flex: 1 }}>บาท</Text>
                        </View>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <Button title="ออก" onPress={() => setModalVisible(!modalVisible)} />
                        </View>
                    </View>
                </Modal>

            </ScrollView>

        </SafeAreaView>
    );
};