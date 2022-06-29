import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Image, Pressable ,Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import firebase from 'firebase/compat/app';
import firestore from '../../firestore';
import 'firebase/compat/auth';

export default function CardMenuCustomer(props) {

    function Order(id, name, picture) {
        
        firebase.auth().onAuthStateChanged((user) => {
            if (user != null) {
                let docRef = firestore.collection('users').doc(user.uid).collection('cart');

                docRef.add({
                    name: name,
                    prodid: id,
                    picture: picture
                });
            }
            alert("เพิ่ม "+ name + " ลงในตะกร้าสินค้า")
        });

    }

    



    return (


        <View style={styles.container}>
            <Pressable style={{
                borderRadius: 8,
                padding: 3,
                height: 50,
                width: 400,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: "#BFBABC",
                marginVertical: 2,
                flexDirection: 'row',

            }}
            >
                <Image source={{ uri: props.picture }} resizeMode="cover" style={{ borderRadius: 8, height: '100%', width: '100%', position: "absolute", opacity: 0.6 }} />
                <Text style={{ color: "white", flex: 9, shadowColor: "gray", fontSize: 16, fontWeight: "bold" }}> {props.name}</Text>
                <Text style={{ color: "white", flex: 1, fontWeight: "bold" }}>{props.price}.-</Text>
                <View style={{ alignItems: "center", padding: 9 }}>
                    <TouchableOpacity onPress={() => Order(props.id, props.name, props.picture)}>
                        <AntDesign style={{ flex: 1 }} name="pluscircleo" size={24} color="#66FF00" />
                    </TouchableOpacity>
                </View>

            </Pressable>
        </View>


    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center"
    },

});