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
    TextInput,
    Button,
    LogBox
} from 'react-native';
import Constants from 'expo-constants';

import icons from "./icon";

import * as SecureStore from 'expo-secure-store';

import CardMenuCustomer from './CardMenuCustomer';

import firebase from 'firebase/compat/app';
import firestore from '../../firestore';
import 'firebase/compat/auth';

export default function MenuAll({ navigation }) {
    const [products, setProducts] = useState([]);

    const [type,setType] = useState('All');

    const [cuser, setCuser] = useState('');

    const [image, setImage] = useState('');
    const [fname, setFname] = useState('');

    async function GetProductsType() {

        let collRef = firestore.collection('products').where("type", '==', type);

        collRef.onSnapshot((querySnap) => {
            const dataquery = [];

            querySnap.forEach(documentSnapshot => {
                dataquery.push({
                    ...documentSnapshot.data(),
                    id: documentSnapshot.id,
                });
            });
            setProducts(dataquery);
        });
    }

    async function GetProducts() {

        let collRef = firestore.collection('products');

        await collRef.get().then((querySnap) => {
            const tempDoc = querySnap.docs.map((doc) => {
                return { id: doc.id, ...doc.data() };
            });
            setProducts(tempDoc);
           
        });
    }

    useEffect(() => {
        if(CheckLogin()){
            if(type == 'All'){
                GetProducts()
            } else {
                GetProductsType()
            }
            
        }
    })

    async function CheckLogin() {
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                setCuser(user);

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
                    setImage(result);
  
                    /// แสดงโปรไฟล์ จบ ////
        
                });
                return true
            } 
            return false
        });
    }

    const categoryData = [
        {
            id: 1,
            name: "All",
            icon: icons.all,
        },
        {
            id: 2,
            name: "Rice",
            icon: icons.rice_bowl,
        },
        {
            id: 3,
            name: "Noodles",
            icon: icons.noodle,
        },
        {
            id: 4,
            name: "Hot Dogs",
            icon: icons.hotdog,
        },
        {
            id: 5,
            name: "Salads",
            icon: icons.salad,
        },
        {
            id: 6,
            name: "Burgers",
            icon: icons.hamburger,
        },
        {
            id: 7,
            name: "Pizza",
            icon: icons.pizza,
        },
    ]

    const [categories, setCategories] = React.useState(categoryData)
    const [selectedCategory, setSelectedCategory] = React.useState(null)

    function onSelectCategory(category) {
        //filter restaurant
        // let restaurantList = restaurantData.filter(a => a.categories.includes(category.id))

        // setRestaurants(restaurantList)
        setType(category.name)
        console.log(type);
        setSelectedCategory(category)
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

    function renderMainCategories() {
        const renderItem = ({ item }) => {
            return (
                <TouchableOpacity
                    style={{
                        padding: 10,
                        paddingBottom: 10,
                        backgroundColor: (selectedCategory?.id == item.id) ? "#49FFDE" : "#FFFFFF",
                        borderRadius: 30,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 10,
                        ...styles.shadow
                    }}
                    onPress={() => onSelectCategory(item)}
                >
                    <View
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: (selectedCategory?.id == item.id) ? "#FFFFFF" : "#F5F5F6",
                        }}
                    >
                        <Image
                            source={item.icon}
                            resizeMode="contain"
                            style={{
                                width: 30,
                                height: 30
                            }}
                        />
                    </View>

                    <Text
                        style={{
                            marginTop: 3,
                            color: (selectedCategory?.id == item.id) ? "#FFFFFF" : "#1E1F20",
                            fontSize: 12, fontWeight: 'bold'
                        }}
                    >
                        {item.name}
                    </Text>
                </TouchableOpacity>
            )
        }

        return (
            <View style={{ padding: 10 }}>
                <ScrollView>
                    <FlatList
                        data={categories}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={item => `${item.id}`}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingVertical: 1 }}
                    />
                </ScrollView>
                <Text style={{ fontSize: 30, fontWeight: 'bold',paddingLeft:20 }}> Menu {type}</Text>
            </View>

        )
    }



    return (
        <SafeAreaView style={{flex:1, paddingTop: Constants.statusBarHeight }}>
            {renderHeade()}

            <View style={{ alignItems: 'center' }} >
                <TextInput style={styles.input}></TextInput>
            </View>
            {renderMainCategories()}
            <ScrollView style={{flex:1}}>
                {products.map((item) =>

                    <CardMenuCustomer key={item.id} name={item.name} price={item.price} stock={item.stock} picture={item.picture} id={item.id} />)

                }
            </ScrollView>
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