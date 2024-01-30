import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native';
import EmpolyAttendance from './EmpolyAttendance';
import CalenderView from './CalenderView';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createMaterialTopTabNavigator();

const TopBarAttendance = ({navigation}) => {
  const [nameDetails, setNameDetails] = useState('');

  const storeEmployeeId = async () => {
    const result1 = await AsyncStorage.getItem('NAME');
    const parseItem1 = JSON.parse(result1);
    setNameDetails(parseItem1);
  };

  useEffect(() => {
    storeEmployeeId();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
    <View style={styles.top}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
          <Text style={styles.headtext}>{nameDetails.name}</Text>
      </View>


      <Tab.Navigator
        initialRouteName="EmpolyAttendance"
        screenOptions={{
          tabBarActiveTintColor: 'red',
          tabBarLabelStyle: {fontSize: 12, color: 'black'},
          tabBarStyle: {backgroundColor: 'white'},
        }}>
        <Tab.Screen
          name="EmpolyAttendance"
          component={EmpolyAttendance}
          options={{tabBarLabel: 'Today'}}
        />
        <Tab.Screen
          name="Calender"
          component={CalenderView}
          options={{tabBarLabel: 'Calender'}}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default TopBarAttendance;

const styles = StyleSheet.create({
  top: {
    height: hp(8),
    width: wp(100),
    backgroundColor: '#1E5B70',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: wp(5),
    paddingVertical: hp(1),
  },
  headtext: {
    fontSize: hp(3),
    fontFamily: 'OpenSans-SemiBold',
    color: 'white',
    marginLeft:wp(15),
    width:wp(60)
  },
  text: {
    fontSize: hp(2),
    fontFamily: 'OpenSans-SemiBold',
    color: 'white',
    marginLeft: wp(10),
  },
});
