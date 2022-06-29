import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, Button,SafeAreaView, Pressable} from 'react-native';
import Constants from 'expo-constants';
import firebase from '../firestore';
import 'firebase/compat/auth';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
// import 'react-native-gesture-handler';


export default function App({navigation}) {
  const [email, setEmail] = useState('');

  async function ResetPass() {
    await firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        alert('ส่งอีเมล์เรียบร้อยแล้ว');
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  return (
    <SafeAreaView style={styles.main}>
        <Ionicons name="email" size={100} color="black" />
        <TextInput style={styles.input} placeholder="Email" 
         onChangeText={setEmail} />
        <Pressable
          style={[styles.button2, { backgroundColor: '#927583' }]}
          onPress={() => ResetPass()}>
          <Text style={{ color: 'white' }}>Reset Password</Text>
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
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#49FFDE',
  },
});