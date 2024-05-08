import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Not = () => {
  return (
    <View style={styles.header}>
        <Text style={styles.headerText}>Bildirimler</Text>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 80,
    width: '120%',
    backgroundColor: '#fff',
    elevation: 5,
    paddingLeft: 20,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'tomato',
  },
});

export default Not;
