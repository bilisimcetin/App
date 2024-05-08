import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from './Splash';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import LoginEnter from './LoginEnter';
import UserLogin from './user/UserLogin';
import UserSignup from './user/UserSignup';
import Home from './user/Home';

const Stack = createNativeStackNavigator();

const AuthNavigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
            <Stack.Screen name="signup" component={Signup}  options={{ headerShown: false }}/>
            <Stack.Screen name="login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="dashboard" component={Dashboard} options={{ headerShown: false }} />
            <Stack.Screen name="loginenter" component={LoginEnter} options={{ headerShown: false }} />
            <Stack.Screen name="userlogin" component={UserLogin} options={{ headerShown: false }} />
            <Stack.Screen name="usersignup" component={UserSignup}  options={{ headerShown: false }}/>
            <Stack.Screen name="home" component={Home} options={{ headerShown: false }} />
           
            

        </Stack.Navigator>
    );
};

export default AuthNavigation;

const styles = StyleSheet.create({});
