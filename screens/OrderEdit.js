import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Pressable,
  LogBox
} from 'react-native';
import Logo from '../assets/icon-edit.png';

import * as SecureStore from 'expo-secure-store';

import Constants from 'expo-constants';
import firebase from '../firestore';
import firestore from '../firestore';
import 'firebase/compat/auth';

import { Picker } from '@react-native-picker/picker';

export default function OrderEdit() {
  const [name, setName] = useState('');
  const [picture, setPicture] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('');

  const [image, setImage] = useState('');
  const [fname, setFname] = useState('');

  useEffect(() => {
    async function CheckLogin() {
      /// แสดงชื่อ user เริ่ม ///
      let username = await SecureStore.getItemAsync('username')
      setFname(username)
      /// แสดงชื่อ user จบ ///

      /// แสดงโปรไฟล์ เริ่ม ////
      let result = await SecureStore.getItemAsync('key');
      setImage(result);
      /// แสดงโปรไฟล์ จบ ////
    }
    CheckLogin()
    GetProducts()
    LogBox.ignoreAllLogs();
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

  async function GetProducts() {
    let result = await SecureStore.getItemAsync('editid');
    console.log("Get Data Product")
    let collRef = firestore.collection("products").doc(result);

    collRef.get().then((doc) => {
      setName(doc.data().name)
      setPrice(doc.data().price)
      setType(doc.data().type)
      setPicture(doc.data().picture)
    });
  };

  async function Edit() {  /// แก้ไขเรียบร้อย
    let result = await SecureStore.getItemAsync('editid');
    let usera = await SecureStore.getItemAsync('userid')

    let collRef = firestore.collection("products").doc(result);
    await collRef.update({
      name: name,
      picture: picture,
      price: price,
      type: type,
      userid: usera
    });
    alert("แก้ไขรายการอาหารเสร็จสิ้น")
  }

  return (
    <View showsHorizontalScrollIndicator={false} style={{ paddingTop: Constants.statusBarHeight }}>
      {renderHeade()}
      <View style={styles.root}>
        <Text style={styles.title}>แก้ไขเมนูอาหาร</Text>

        <Image
          source={require('../assets/icon-edit.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text>เพิ่มรูป</Text>

        <TextInput style={styles.input}
          placeholder="ชื่ออาหาร"
          onChangeText={setName}
          value={name}
        />
        <Picker style={styles.input}
          selectedValue={type}
          onValueChange={(itemValue, itemIndex) =>
            setType(itemValue)
          }>
          <Picker.Item label="Rice" value="Rice" />
          <Picker.Item label="Noodles" value="Noodles" />
          <Picker.Item label="Hot Dogs" value="Hot Dogs" />
          <Picker.Item label="Salads" value="Salads" />
          <Picker.Item label="Burgers" value="Burgers" />
          <Picker.Item label="Pizza" value="Pizza" />
        </Picker>

        <TextInput style={styles.input}
          placeholder="ราคา"
          onChangeText={setPrice}
          value={price}
        />

        <TextInput style={styles.input}
          placeholder="หมายเหตุ"
          onChangeText={setPicture}
          
        />

        
        <Pressable style={{
          borderRadius: 8,
          padding: 6,
          height: 38,
          width: '90%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: "#7084FF",
          marginVertical: 3,
        }}
        onPress={() => Edit()}
        ><Text style={{color:"white"}}>ยืนยัน</Text></Pressable>


      </View>
    </View >
  );
};

const styles = StyleSheet.create({
  button: {

  },
  input: {
    height: 50,
    margin: 12,
    padding: 10,
    //พื้นหลัง
    backgroundColor: 'white',
    width: '100%',
    //เส้นขอบ
    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 5,
    //ระยะห่าง
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  root: {
    alignItems: 'center',
    padding: 60,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    margin: 10,
  },
  text: {
    color: 'grat',
    marginVertical: 10,
  },

  link: {
    color: '#FDB075'
  },

  logo: {
    width: '70%',
    maxWidth: 300,
    maxHeight: 100,
  },
});
