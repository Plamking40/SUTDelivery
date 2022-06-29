import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  SafeAreaView,
  Pressable,
  LogBox,

} from 'react-native';
import Constants from 'expo-constants';
import firebase from 'firebase/compat/app';
import firestore from '../firestore';
import 'firebase/compat/auth';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';


export default function Register({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [selectedstatus, setSelectedstatus] = useState();


  async function UserLogin() {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        let collRef = firestore.collection('users').doc(user.user.uid);
        console.log("กำลังบันทึกข้อมูล")
        console.log("user" + user)
        console.log("collRef" + collRef)
        collRef.set({
          email: email,
          name: name,
          status: selectedstatus
        });
        console.log("บันทึกข้อมูลเสร็จสิ้น")
        
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  return (
    <SafeAreaView style={styles.main}>
      <Ionicons name="account-plus" size={100} color="black" />
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
      <TextInput
        style={styles.input}
        placeholder="Name"
        onChangeText={setName}
      />

      <Picker style={styles.input}
        selectedValue={selectedstatus}
        onValueChange={(itemValue, itemIndex) =>
          setSelectedstatus(itemValue)
        }>
        <Picker.Item label="Customer" value="customer" />
        <Picker.Item label="Store" value="store" />
      </Picker>


      <Pressable
        style={[styles.button2, { backgroundColor: '#927583' }]}
        onPress={() => UserLogin()}>
        <Text style={{ color: 'white' }}>Register</Text>
      </Pressable>

      <Pressable
        style={[styles.button2, { backgroundColor: '#927583' }]}
        onPress={() => navigation.goBack()}>
        <Text style={{ color: 'white' }}>Back</Text>
      </Pressable>
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