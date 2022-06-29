import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Iconicons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

import Login from './screens/Login';
import Register from './screens/Register';
import Reset from './screens/Reset';
//Store
import OrderList from './screens/OrderList';
import OrderMenu from './screens/OrderMenu'
import OrderCom from './screens/OrderCom';
import ProFileStore from './screens/ProFileStore';
import OrderInput from './screens/OrderInput';
import OrderEdit from './screens/OrderEdit';
//Customer
import MenuAll from './screens/Customer/MenuAll';
import OrderBasket from './screens/Customer/OrderBasket';
import ListStatus from './screens/Customer/ListStatus';

import CardMenuStore from './screens/CardMenuStore';

import firebase from 'firebase/compat/app';
import firestore from './firestore';
import 'firebase/compat/auth';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {

  function HomeCustomer({ navigation }) {
    return (
      <Tab.Navigator screenOptions={{headerShown: false,tabBarActiveTintColor:'#5AE9CF'}}>
        <Tab.Screen name="MenuAll" component={MenuAll}
          options={{ tabBarLabel: 'หน้าแรก', tabBarIcon: ({ color, size }) => ( <Iconicons name='home'color={color} size={size}/> ), }}
        />
        <Tab.Screen name="OrderBasket" component={OrderBasket}
          options={{ tabBarLabel: 'ตะกร้าสินค้า', tabBarIcon: ({ color, size }) => ( <FontAwesome name='shopping-basket' color={color} size={size} /> ), }}
        />
        <Tab.Screen name="ListStatus" component={ListStatus}
          options={{ tabBarLabel: 'สถานะการสั่งซื้อ', tabBarIcon: ({ color, size }) => ( <MaterialCommunityIcons name="bell" color={color} size={size} /> ), }}
        />
        <Tab.Screen name="ProFile" component={ProFileStore}
          options={{ tabBarLabel: 'เพิ่มเติม', tabBarIcon: ({ color, size }) => ( <FontAwesome5 name='bars' color={color} size={size} /> ), }}
        />
      </Tab.Navigator>
    );
  }

  function HomeStore({ navigation }) {
    return (
      <Tab.Navigator screenOptions={{headerShown: false,tabBarActiveTintColor:'#5AE9CF'}}>
        <Tab.Screen name="OrderList" component={OrderList}
          options={{ tabBarLabel: 'คำสั่งซื้อ', tabBarIcon: ({ color, size }) => ( <FontAwesome name='shopping-basket' color={color} size={size} /> ), }}
        />
        <Tab.Screen name="OrderMenu" component={OrderMenu}
          options={{ tabBarLabel: 'เมนู', tabBarIcon: ({ color, size }) => ( <Iconicons name='book' color={color} size={size} /> ), }}
        />
        <Tab.Screen name="OrderCom" component={OrderCom}
          options={{ tabBarLabel: 'ประวัติคำสั่งซื้อ', tabBarIcon: ({ color, size }) => ( <MaterialCommunityIcons name="bell" color={color} size={size} /> ), }}
        />
        <Tab.Screen name="ProFile" component={ProFileStore}
          options={{ tabBarLabel: 'เพิ่มเติม', tabBarIcon: ({ color, size }) => ( <FontAwesome5 name='bars' color={color} size={size} /> ), }}
        />
      </Tab.Navigator>
    );
  }
  
  

  return (
    <NavigationContainer>
      <Stack.Navigator  screenOptions={{headerShown: false,}} initialRouteName="Login">
        <Stack.Screen name="Home" component={HomeCustomer} />
        <Stack.Screen name="HomeStore" component={HomeStore} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Reset" component={Reset} />
        <Stack.Screen name="OrderEdit" component={OrderEdit} />
        <Stack.Screen name="OrderInput" component={OrderInput} />
        <Stack.Screen name="CardMenuStore" component={CardMenuStore} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  price: {
    margin: 0,
    marginTop: 30,
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'papayawhip',
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
  profile: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button1: {
    width: '80%',

    padding: 15,
    marginVertical: 5,

    alignItems: 'center',
    borderRadius: 5,
  },
  button2: {
    width: '60%',

    padding: 15,
    marginVertical: 5,

    alignItems: 'center',
    borderRadius: 5,
  },
  pum: {
    width: '100%',
    padding: 5,
    alignItems: 'center',
    borderRadius: 0,
    borderWidth: 0.5,
  },
  pum1: {
    marginVertical: 20,
    width: '100%',
    padding: 5,
    alignItems: 'center',
    borderRadius: 0,
    borderWidth: 0.5,
  },
  pum2: {
    marginVertical: 20,
    width: '100%',
    padding: 5,
    alignItems: 'center',
    borderRadius: 0,
    borderWidth: 0.5,
  },
});