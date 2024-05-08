import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigation from './screens/AuthNavigation';

const AppNavigation = () => {
    return (
        <NavigationContainer>
            <AuthNavigation />
        </NavigationContainer>
    );
};

export default AppNavigation;

const styles = StyleSheet.create({});
