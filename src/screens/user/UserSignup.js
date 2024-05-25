import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { colors, titles, btn1, hr90 } from '../globals/style';
import { AntDesign } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../../../firebaseconfig';
import { doc, setDoc } from 'firebase/firestore';
import firebase from 'firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserSignup = ({ navigation }) => {
    const [emailfocus, setEmailfocus] = useState(false);
    const [passwordfocus, setPasswordfocus] = useState(false);
    const [phonefocus, setPhonefocus] = useState(false);
    const [namefocus, setNameFocus] = useState(false);
    const [showpassword, setShowpassword] = useState(false);
    const [showcpassword, setShowcpassword] = useState(false);
    const [cpasswordfocus, setcPasswordfocus] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword, setcPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [customError, setCustomError] = useState('');
    const [successmsg, setSuccessmsg] = useState(null);
    const [address, setAddress] = useState('');

    const getCoordinates = async (address) => {
        const apiKey = 'AIzaSyBu45lcxxeWMAhOjXmPtNS79NNBJTIg04Q';
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`);
        const data = await response.json();
        const location = data.results[0].geometry.location;
        return {
            latitude: location.lat,
            longitude: location.lng
        };
    };

    const handleSignup = () => {
        if (password != cpassword) {
            setCustomError("Şifreler Uyuşmuyor");
            return;
        } else if (phone.length != 10) {
            setCustomError("Telefon numarası 10 karakter olmalı");
            return;
        }
        try {
            createUserWithEmailAndPassword(auth, email, password)
                .then(async (userCredentials) => {
                    console.log(userCredentials?.user.uid);
                    console.log('user created')
                    if (userCredentials?.user.uid != null) {
                        const user = userCredentials.user;
                        const role = 'user';
                        const coordinates = await getCoordinates(address);
                        await setDoc(doc(db, "users", user.uid), {
                            email: email,
                            password: password,
                            phone: phone,
                            name: name,
                            address: address,
                            latitude: coordinates.latitude,
                            longitude: coordinates.longitude,
                            role: role,
                            uid: userCredentials?.user?.uid,
                            cart: [],
                        });
                        console.log('data added to firestore')
                        setSuccessmsg('Kullanıcı başarıyla kaydedildi');
                    }
                })
                .catch((error) => {
                    console.log('firestore error ', error);
                })
                .catch((error) => {
                    console.log('sign up firebase error ', error.message)
                    if (error.message == 'Firebase: The email address is already in use by another account. (auth/email-already-in-use).') {
                        setCustomError('Email Zaten Kullanılıyor.')
                    } else if (error.message == 'Firebase: The email address is badly formatted. (auth/invalid-email).') {
                        setCustomError('Geçersiz Mail Formatı')
                    } else if (error.message == 'Firebase: Password should be at least 6 characters (auth/weak-password).') {
                        setCustomError('Şifre en az 6 karakter olmalı')
                    } else {
                        setCustomError(error.message)
                    }
                })
        } catch (error) {
            console.log('sign up system error ', error.message)
        }
    }

    

    return (
        <View style={styles.container}>
            {successmsg == null ?
                <>
                    <Text style={styles.head1}>Kullanıcı Kayıt</Text>
                    {customError !== '' && <Text style={styles.errormsg}>{customError}</Text>}
                    <View style={styles.inputout}>
                        <AntDesign name="user" size={24} color={namefocus === true ? colors.text1 : colors.text2} />
                        <TextInput style={styles.input} placeholder={'İsim soyisim '}
                            onFocus={() => {
                                setEmailfocus(false);
                                setPasswordfocus(false);
                                setShowpassword(false);
                                setNameFocus(true);
                                setPhonefocus(false);
                                setCustomError('');
                            }}
                            onChangeText={(text) => setName(text)}
                        />
                    </View>
                    <View style={styles.inputout}>
                        <Entypo name="email" size={24} color={emailfocus === true ? colors.text1 : colors.text2} />
                        <TextInput style={styles.input} placeholder={'Email '}
                            onFocus={() => {
                                setEmailfocus(true);
                                setPasswordfocus(false);
                                setShowpassword(false);
                                setNameFocus(false);
                                setPhonefocus(false);
                                setCustomError('');
                            }}
                            onChangeText={(text) => setEmail(text)}
                        />
                    </View>
                    <View style={styles.inputout}>
                        <Feather name="smartphone" size={24} color={phonefocus === true ? colors.text1 : colors.text2} />
                        <TextInput style={styles.input} placeholder={'Telefon Numarası '}
                            onFocus={() => {
                                setEmailfocus(false);
                                setPhonefocus(true);
                                setPasswordfocus(false);
                                setShowpassword(false);
                                setNameFocus(false);
                                setCustomError('');
                            }}
                            onChangeText={(text) => setPhone(text)}
                        />
                    </View>
                    <View style={styles.inputout}>
                        <MaterialCommunityIcons name="lock-outline" size={24}
                            color={passwordfocus == true ? colors.text1 : colors.text2} />
                        <TextInput style={styles.input} placeholder={'Şifre '}
                            onFocus={() => {
                                setEmailfocus(false);
                                setPasswordfocus(true);
                                setShowcpassword(false);
                                setNameFocus(false);
                                setPhonefocus(false);
                                setCustomError('');
                            }}
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry={showpassword === false ? true : false}
                        />
                        <Octicons name={showpassword == false ? "eye-closed" : "eye"} size={24} color="black" onPress={() => setShowpassword(!showpassword)} />
                    </View>
                    <View style={styles.inputout}>
                        <MaterialCommunityIcons name="lock-outline" size={24}
                            color={cpasswordfocus == true ? colors.text1 : colors.text2} />
                        <TextInput style={styles.input} placeholder={'Şifreyi Doğrula '}
                            onFocus={() => {
                                setEmailfocus(false);
                                setPasswordfocus(true);
                                setShowpassword(false);
                                setNameFocus(false);
                                setPhonefocus(false);
                                setCustomError('');
                            }}
                            onChangeText={(text) => setcPassword(text)}
                            secureTextEntry={showcpassword === false ? true : false}
                        />
                        <Octicons name={showcpassword == false ? "eye-closed" : "eye"} size={24} color="black" onPress={() => setShowcpassword(!showcpassword)} />
                    </View>

                    <Text style={styles.address}>Lütfen Adresinizi Giriniz</Text>
                    <View style={styles.inputout} >
                        <TextInput style={styles.input1} placeholder="Adresinizi Giriniz" onChangeText={(text) => setAddress(text)}
                            onPress={() => {
                                setEmailfocus(false)
                                setPasswordfocus(false)
                                setShowpassword(false)
                                setNamefocus(false)
                                setPhonefocus(false)
                                setCustomError('')
                            }}
                        />
                    </View>
                    <TouchableOpacity style={btn1} onPress={() => handleSignup()}>
                        <Text style={styles.btnText}>Kaydol</Text>
                    </TouchableOpacity>
                    <View style={hr90}></View>
                    <Text style={styles.signup} onPress={() => navigation.navigate('userlogin')}>
                        Zaten bir hesabınız var mı?
                        <Text style={{ color: colors.text1 }}> Giriş</Text>
                    </Text>
                </>
                :
                <View style={styles.container1}>
                    <Text style={styles.successmessage}>{successmsg}</Text>
                    <TouchableOpacity style={btn1} onPress={() => navigation.navigate('userlogin')}>
                        <Text style={{ color: colors.col1, fontSize: titles.btntxt, fontWeight: "bold" }}>Giriş Yap</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={btn1} onPress={() => setSuccessmsg(null)}>
                        <Text style={{ color: colors.col1, fontSize: titles.btntxt, fontWeight: "bold" }}>Geri Dön</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        marginTop: 60,
    },
    head1: {
        fontSize: titles.title1,
        color: colors.text1,
        textAlign: 'center',
        marginVertical: 10,
    },
    inputout: {
        flexDirection: 'row',
        width: '80%',
        marginVertical: 10,
        backgroundColor: colors.col1,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        alignSelf: 'center',
        elevation: 20,
        fontSize: 18,
        marginLeft: 10,
    },
    input: {
        fontSize: 18,
        marginLeft: 10,
        width: '80%',
    },
    btnText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    signup: {
        color: colors.text1,
    },
    adress: {
        fontSize: 18,
        color: colors.text2,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default UserSignup;
