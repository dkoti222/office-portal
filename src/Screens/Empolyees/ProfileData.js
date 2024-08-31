import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileData = ({navigation}) => {
  const [nameDetails, setNameDetails] = useState('');

  const getStoredvValues = async () => {
    const result = await AsyncStorage.getItem('NAME');
    const parseItem2 = await JSON.parse(result);

    setNameDetails(parseItem2);
  };

  useEffect(() => {
    getStoredvValues();
  }, []);

  return (
    <View style={{flex: 1}}>
      <LinearGradient colors={['#3baac7', '#06566c']} style={styles.top}>
        <TouchableOpacity
          style={{alignSelf: 'flex-start'}}
          onPress={() => navigation.navigate('EmpolyeList')}>
          <Ionicons name="arrow-back" size={30} color="#1E5B70" />
        </TouchableOpacity>
        <View style={styles.circle}>
          {nameDetails.imageUri && (
            <Image
              style={styles.empolyeimage}
              source={{
                uri: nameDetails.imageUri,
              }}
            />
          )}
        </View>
        <Text style={styles.name}>{nameDetails.name}</Text>
        <Text style={styles.dsgtext}>{nameDetails.designation}</Text>
      </LinearGradient>

      <ImageBackground
        style={{height: hp(80)}}
        source={{
          uri: 'https://image.shutterstock.com/image-vector/abstract-white-background-minimal-geometric-260nw-2281284523.jpg',
        }}>
        <View style={{marginLeft: wp(5)}}>
          <Text style={styles.subheader}>Basic Information:</Text>
          <View style={styles.rowicon}>
            <View style={styles.circle2}>
              <Ionicons name="call-outline" size={20} color="white" />
            </View>

            <Text style={styles.text}>{nameDetails.phone}</Text>
          </View>
          <View style={styles.rowicon}>
            <View style={styles.circle2}>
              <Fontisto name="email" size={20} color="white" />
            </View>
            <Text style={styles.text}>{nameDetails.email}</Text>
          </View>
          <View style={styles.rowicon}>
            <View style={styles.circle2}>
              <FontAwesome5 name="id-card" size={17.5} color="white" />
            </View>
            <Text style={styles.text}>Employee ID:{nameDetails.code}</Text>
          </View>

          <View style={styles.rowicon}>
            <View style={styles.circle2}>
              <FontAwesome5 name="toolbox" size={19} color="white" />
            </View>
            <Text style={styles.text}>
              Experience: {nameDetails.experience} years
            </Text>
          </View>

          <View style={styles.rowicon}>
            <View style={styles.circle2}>
              <FontAwesome6 name="location-dot" size={20} color="white" />
            </View>
            <Text style={styles.text}>Hyderabad,INDIA</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: hp(15),
            }}>
            <MaterialCommunityIcons name="linkedin" size={37} color="#1E5B70" />
            <MaterialCommunityIcons
              name="instagram"
              size={37}
              color="#1E5B70"
            />
            <MaterialCommunityIcons name="twitter" size={37} color="#1E5B70" />
          </View>
        </View>

        <TouchableOpacity
          style={{position: 'absolute', right: wp(10), top: hp(5)}}
          onPress={() => navigation.navigate('TopBarAttendance')}>
          <Ionicons name="calendar-number-sharp" size={45} color="#1E5B70" />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default ProfileData;

const styles = StyleSheet.create({
  top: {
    width: wp(100),
    backgroundColor: '#1E5B70',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    // borderBottomLeftRadius:wp(4),
    // borderBottomRightRadius:wp(4)
  },
  headtext: {
    fontSize: hp(3),
    fontFamily: 'OpenSans-SemiBold',
    color: 'white',
    marginLeft: wp(30),
    width: wp(60),
  },
  circle: {
    borderRadius:
      Math.round(
        Dimensions.get('window').width + Dimensions.get('window').height,
      ) / 2,
    width: Dimensions.get('window').width * 0.22,
    height: Dimensions.get('window').width * 0.22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle2: {
    borderRadius:
      Math.round(
        Dimensions.get('window').width + Dimensions.get('window').height,
      ) / 2,
    width: Dimensions.get('window').width * 0.09,
    height: Dimensions.get('window').width * 0.09,
    backgroundColor: '#1E5B70',
    justifyContent: 'center',
    alignItems: 'center',
  },
  empolyeimage: {
    borderRadius:
      Math.round(
        Dimensions.get('window').width + Dimensions.get('window').height,
      ) / 2,
    width: Dimensions.get('window').width * 0.21,
    height: Dimensions.get('window').width * 0.21,
    resizeMode: 'contain',
  },
  name: {
    fontSize: hp(3.5),
    fontFamily: 'OpenSans-Bold',
    color: 'white',
    marginVertical: hp(1.3),
  },
  dsgtext: {
    fontSize: hp(2.2),
    fontFamily: 'OpenSans-semiBold',
    color: 'white',
  },
  text: {
    fontSize: hp(2.3),
    color: '#1E5B70',
    marginLeft: wp(2),
    textAlign: 'center',
    marginTop: hp(0.5),
  },
  calenderIcon: {
    height: hp(12),
    width: wp(12),
    resizeMode: 'contain',
    position: 'relative',
  },
  card: {
    margin: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 3, // For Android shadow
    shadowOffset: {width: 1, height: 1}, // For iOS shadow
    shadowColor: 'black', // For iOS shadow
    shadowOpacity: 0.3, // For iOS shadow
  },
  subheader: {
    fontSize: hp(2.7),
    marginLeft: wp(1),
    fontFamily: 'OpenSans-Bold',
    paddingVertical: hp(2),
    fontWeight: '700',
    color: '#1E5B70',
  },
  rowicon: {
    flexDirection: 'row',
    paddingVertical: hp(0.6),
    marginBottom: hp(0.5),
  },
});
