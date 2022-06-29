import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground, StyleSheet, ScrollView, TextInput, Button } from 'react-native';

import firebase from 'firebase/compat/app';
import firestore from '../firestore';
import 'firebase/compat/auth';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import * as SecureStore from 'expo-secure-store';

import { AntDesign } from '@expo/vector-icons';


export default function CardMenuStore(props) {

    async function Order(id, name, price, picture) {
        await SecureStore.setItemAsync('editid', id);
        await SecureStore.setItemAsync('editname', name);
        await SecureStore.setItemAsync('editprice', price);
        await SecureStore.setItemAsync('editpicture', picture);
        alert("เลือก " + name + " ดำเนินการแก้ไข");

    }

    async function Delete(id,name) {
        let collRef = firestore.collection('products');
        await collRef.doc(id).delete();
        alert(" ลบเมนู " + name + " เรียบร้อย");

    }

    return (


        <View style={styles.container} >
            <ImageBackground source={{ uri: props.picture }} resizeMode="cover" style={styles.image}>
                <Text style={styles.text1}>{props.name} </Text>
                <Text style={styles.text2}>{props.price} .-</Text>
                <TouchableOpacity style={{flex:1,alignItems:"center",backgroundColor: "#000000c0",}} onPress={() => {
                    Order(props.id, props.name, props.price, props.picture);
                }}>
                    <MaterialCommunityIcons style={{   

                        color: "yellow",
                        lineHeight: 60,

                    }} name="wrench" size={24} />
                </TouchableOpacity>
                <TouchableOpacity style={{flex:1,alignItems:"center",backgroundColor: "#000000c0"}} onPress={() => {
                    Delete(props.id, props.name);
                }}>
                    <AntDesign style={{

                        color: "red",
                        lineHeight: 60,

                    }}  name="closecircleo" size={24} />
                </TouchableOpacity>
            </ImageBackground>

        </View>


    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        height: 80,
    },
    image: {
        flex: 1,
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center"

    },
    text1: {
        flex: 5.5,
        color: "white",
        fontSize: 22,
        lineHeight: 60,
        fontWeight: "bold",
        textAlign: "left",
        backgroundColor: "#000000c0",
        paddingLeft: 10,

    },
    text2: {
        flex: 1,
        color: "white",
        fontSize: 14,
        lineHeight: 60,
        fontWeight: "bold",
        textAlign: "left",
        backgroundColor: "#000000c0",
        paddingLeft: 10,

    },

});