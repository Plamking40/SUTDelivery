import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, Button, SafeAreaView, Pressable, LogBox,Image,TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';

import firebase from 'firebase/compat/app';
import firestore from '../firestore';
import 'firebase/compat/auth';
import { getAuth } from 'firebase/auth';

import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import Logo from '../assets/logo1.png';
// import 'react-native-gesture-handler';


export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');  

  async function UserLogin() {
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async () => {
        const user = getAuth().currentUser;
        
        const docRef = firestore.collection('users').doc(user.uid);

        console.log("คุณ " + user.uid +" กำลังตรวจสอบ")
        const status = (await docRef.get()).data().status


        console.log("กำลังโหลด สถานะ: "+status)
        
        if (status === "store") {
          alert('ยินดีต้อนรับ Store เข้าสู่ระบบสำเร็จ');
          navigation.reset({ index: 0, routes: [{ name: 'HomeStore' }] });
          console.log("สถานะ: "+status+" ตรวจสอบสำเร็จ")
        } else if (status === "customer") {
          alert('ยินดีต้อนรับ Customer เข้าสู่ระบบสำเร็จ');
          navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
          console.log("สถานะ:"+status+" ตรวจสอบสำเร็จ")
        }
        
      })
      .catch((error) => {
        // alert(error.message);
        alert("กรุณากรอกรหัสผ่านใหม่");
      });
  }

  return (
    <SafeAreaView style={styles.main}>
        <Image
          source={Logo}
          
          resizeMode="contain"
        />
        <Text>Login to your Account</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={setPassword}
          secureTextEntry
        />
        <Pressable
          style={[styles.button2, { backgroundColor: '#927583' }]}
          onPress={() =>
            UserLogin()
          }>
          <Text style={{ color: 'white' }}>LOGIN</Text>
        </Pressable>
        <Text style={{paddingTop:70}} > Don’t have an account? <TouchableOpacity onPress={() => navigation.navigate('Register')}><Text style={{color:"white"}}>REGISTER</Text></TouchableOpacity>  </Text>
        <Text > Reset your Password? <TouchableOpacity onPress={() => navigation.navigate('Reset')}><Text style={{color:"white"}}>FORGOT PASSWORD</Text></TouchableOpacity>  </Text>
        {/* <Pressable
          style={[styles.button2, { backgroundColor: '#927583' }]}
          onPress={() => navigation.navigate('Register')}>
          <Text style={{ color: 'white' }}>REGISTER</Text>
        </Pressable>
        <Pressable
          style={[styles.button2, { backgroundColor: '#927583' }]}
          onPress={() => navigation.navigate('Reset')}>
          <Text style={{ color: 'white' }}>FORGOT PASSWORD</Text>
        </Pressable> */}
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  price: {
    margin: 5,
    marginTop: 0,
    fontSize: 14,
    color: 'red',
    fontWeight: 'bold',
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#49FFDE',
  },
  input: {
    width: '60%',
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 2,
    padding: 10,
    marginVertical: 5,
    backgroundColor: 'white',
  },
  button2: {
    width: '60%',

    padding: 15,
    marginVertical: 5,

    alignItems: 'center',
    borderRadius: 5,
  },
});