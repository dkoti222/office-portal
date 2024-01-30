import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

const Alert = ({ isVisible, title, message, onClose }) => {
    return (
      <Modal isVisible={isVisible}>
        <View style={{ backgroundColor: 'white', padding: 20 ,borderRadius:5}}>
          <Text style={{ fontSize: 25, fontWeight: 'bold',textAlign:'center',color:'#1E5B70' }}>{title}</Text>
          <Text style={{ marginTop: 10,textAlign:'center' ,color:'#1E5B70'}}>{message}</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ color: '#E97724', marginTop: 20, textAlign: 'center',fontSize:25,fontWeight: 'bold' }}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };
  export default Alert
  