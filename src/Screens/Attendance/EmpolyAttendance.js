//@ts-nocheck
import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore, {firebase} from '@react-native-firebase/firestore';
import { ActivityIndicator } from 'react-native-paper';

const EmpolyAttendance = ({route}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState('');
  const [nameDetails, setNameDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const closeModal = () => {
    setModalVisible(false);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const handleStatusSelection = async status => {
    setAttendanceStatus(status);
    setIsLoading(true)
    if (nameDetails.docId) {
      firestore()
        .collection('Attendance')
        .doc(nameDetails.docId)
        .update({
          statusType: status,
        })
        .then(() => {
          console.log('User updated!----');
        });
      closeModal();
    }
    setIsLoading(false)
  };

  useEffect(() => {
    const nameData = async () => {
      const result = await AsyncStorage.getItem('NAME');
      const parseItem = JSON.parse(result);
      setNameDetails(parseItem);
      setIsLoading(true)
      if (parseItem) {
        const attendanceRef = firebase.firestore().collection('Attendance');
        const query = attendanceRef
          .where('name', '==', parseItem.name)
          .where('checkInDate', '==', new Date().toISOString().split('T')[0]);
        query
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              const data = doc.data();
              const docId = doc.id;
              data.docId = docId;
              setNameDetails(data);
            });
          })
          .catch(error => {
            console.error('Error getting documents:', error);
          });
      }
      setIsLoading(false)
    };
    nameData();
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <View
        style={{
          height: hp(16),
          width: wp(70),
          borderWidth: 0.5,
          marginVertical: hp(2),
          backgroundColor: 'white',
          borderRadius: 8,
          borderColor: '#1E5B70',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={styles.datetext}>
          {' '}
          {new Date(Date.now()).toLocaleString().split(',')[0].trim()}
        </Text>

        <Text style={styles.datetext}>{nameDetails.status}</Text>
      </View>

      <TouchableOpacity onPress={openModal} style={styles.action}>
        <Text style={styles.text}>Take Attendance</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View
            style={{
              height: hp(30),
              width: wp(75),
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
            }}>
            <TouchableOpacity
              onPress={closeModal}
              style={{position: 'absolute', top: 10, right: 10}}>
              <Entypo
                style={{alignSelf: 'flex-end'}}
                name="circle-with-cross"
                size={25}
                color="#E97724"
              />
            </TouchableOpacity>

            <View>
              <TouchableOpacity
                style={[styles.selection, {backgroundColor: '#27ae60'}]}
                onPress={() => handleStatusSelection('Full')}>
                <Text style={styles.text}>Full</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.selection, {backgroundColor: '#e74c3c'}]}
                onPress={() => handleStatusSelection('Half')}>
                <Text style={styles.text}>Half</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.selection, {backgroundColor: '#2980b9'}]}
                onPress={() => handleStatusSelection('Late')}>
                <Text style={styles.text}>Late</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={{ position: 'absolute', top: hp(45), left: wp(44) }}>
          {isLoading && <ActivityIndicator size={45} animating={true} color={'#1E5B70'} />}
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  action: {
    marginTop: hp(5),
    height: hp(5),
    width: wp(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#1a6372',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(38),
    // backgroundColor: 'white',
  },
  selection: {
    height: hp(4),
    width: wp(30),
    borderColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: hp(1),
  },
  text: {
    fontSize: hp(2),
    color: 'white',
    fontFamily: 'OpenSans-Medium',
  },
  datetext: {
    fontSize: hp(2),
    fontFamily: 'OpenSans-Medium',
    color: '#E97724',
  },
});

export default EmpolyAttendance;
