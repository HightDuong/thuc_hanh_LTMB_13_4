import { CommonActions } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

 const handleLogin = async () => {
  try {
    const userData = await AsyncStorage.getItem('user');
    console.log('User data from AsyncStorage:', userData);
    if (userData) {
      const user = JSON.parse(userData);
      if (user.email === email && user.password === password) {
        await AsyncStorage.setItem('isLoggedIn', 'true');
        console.log('Login successful, navigating to Home');

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          })
        );
      } else {
        Alert.alert('Error', 'Invalid email or password.');
      }
    } else {
      Alert.alert('Error', 'No user found. Please register first.');
    }
  } catch (error) {
    console.error('Error during login:', error);
    Alert.alert('Error', 'An error occurred during login. Please try again.');
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title="Login"
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
        onPress={handleLogin}
      />
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  button: {
    backgroundColor: '#6200EE',
    borderRadius: 25,
    paddingVertical: 15,
    width: '100%',
    marginVertical: 10,
  },
  buttonText: { fontSize: 16, fontWeight: 'bold' },
  link: { color: '#6200EE', marginTop: 10 },
});