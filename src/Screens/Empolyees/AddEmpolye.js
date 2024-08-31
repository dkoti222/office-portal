import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import uuid from 'react-native-uuid';
import Entypo from 'react-native-vector-icons/Entypo';
import firestore from '@react-native-firebase/firestore';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SelectDropdown from 'react-native-select-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Alert from '../Alert';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import {ActivityIndicator} from 'react-native-paper';

const AddEmpolye = ({navigation}) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [experience, setExperience] = useState('');
  const [designation, setDesignation] = useState(null);
  const [role, setRole] = useState(null);
  const [imagedata, setImagedata] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [fileUri, setFileUri] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlert2, setShowAlert2] = useState(false);
  const [showAlert3, setShowAlert3] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const designationOptions = [
    'Accountant',
    'Administrative Assistant',
    'Operations manager',
    'BDM',
    'React js Developer',
    'React Native Developer',
    'Software developer',
    'Digital marketer',
    'HR manager',
    'IT Recruiter',
    'IT Recruiter Intern',
    'IT Intern',
    'Web Designer',
    'Chief Technical Officer',
  ];

  const roleOptions = ['CEO', 'CTO', 'CIO', 'HR', 'EMPLOYEE'];

  const updateData = async () => {
    if (
      !name ||
      !code ||
      !designation ||
      !email ||
      !password ||
      !phone ||
      !experience ||
      !imagedata ||
      !imageUri ||
      !fileData ||
      !fileUri
    ) {
      setShowAlert(true);
      return;
    }
    if (!/^[a-z0-9.%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setShowAlert3(true);
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setShowAlert3(true);
      return;
    }

    if (password.length < 6) {
      setShowAlert(true);
      return;
    }
    if (!/^[A-Za-z ]+$/.test(name) || name.length < 3) {
      setMsg('Invalid Name or minimum  3 characters Required');
      setShowAlert3(true);
      return;
    }

    try {
      const employeeId = uuid.v4();
      let roleID;
      if (role === 'CEO') {
        roleID = 1;
      } else if (role === 'CTO') {
        roleID = 2;
      } else if (role === 'CIO') {
        roleID = 3;
      } else if (role === 'HR') {
        roleID = 4;
      } else if (role === 'EMPLOYEE') {
        roleID = 5;
      }

      const useData = {
        id: employeeId,
        phone: phone,
        password: password,
        name: name,
        email: email,
        code: code,
        experience: experience,
        designation: designation,
        role: role,
        roleId: roleID,
        imagedata: imagedata,
        imageUri: imageUri,
        fileData: fileData,
        fileUri: fileUri,
      };
      console.log(useData, 'first check');

      await firestore().collection('Empolyeelist').add(useData);
      setPhone(''),
        setPassword(''),
        setCode(''),
        setName(''),
        setEmail(''),
        setExperience(''),
        setDesignation(null),
        setRole(null),
        setImagedata(null);
      setImageUri(null);
      setFileData(null), setFileUri(null), navigation.navigate('EmpolyeList');
    } catch (err) {
      console.log(err);
    }
  };

  const pickImage = async () => {
    try {
      const response = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
        copyTo: 'cachesDirectory',
      });
      if (response) {
        setImagedata(response);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const uploadImage = async imageUri => {
    setIsLoading(true);
    try {
      if (!imageUri) {
        setShowAlert(true);
        setIsLoading(false);
        return;
      }
      if (imageUri.startsWith('https://firebasestorage.googleapis.com')) {
        setIsLoading(false);
        setShowAlert2(true);
        return;
      }
      const reference = storage().ref(`images/${uuid.v4()}`);
      await reference.putFile(imageUri);
      const downloadURL = await reference.getDownloadURL();
      setImageUri(downloadURL);
      console.log('File uploaded successfully.');
      setIsLoading(false);
      setShowAlert2(true);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const PickFile = async () => {
    try {
      const response = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
        copyTo: 'cachesDirectory',
      });
      if (response) {
        setFileData(response);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const uploadFile = async fileUri => {
    setIsLoading(true);
    try {
      if (!fileUri) {
        setShowAlert(true);
        setIsLoading(false);
        return;
      }
      if (fileUri.startsWith('https://firebasestorage.googleapis.com')) {
        setIsLoading(false);
        setShowAlert2(true);
        return;
      }

      const reference = storage().ref(`files/${uuid.v4()}`);
      await reference.putFile(fileUri);
      const downloadURL = await reference.getDownloadURL();
      setFileUri(downloadURL);
      console.log('File uploaded successfully.');
      setIsLoading(false);
      setShowAlert2(true);
    } catch (error) {
      console.error('Error uploading File:', error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center'}}>
      <View style={styles.top}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headtext}>Add Employees</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <TextInput
          style={styles.input}
          placeholderTextColor="grey"
          placeholder="Phone Number"
          keyboardType="numeric"
          value={phone}
          onChangeText={text => setPhone(text)}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="grey"
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="grey"
          placeholder="Full Name"
          value={name}
          onChangeText={text => setName(text)}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="grey"
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="grey"
          placeholder="Employee ID"
          value={code}
          onChangeText={text => setCode(text)}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="grey"
          placeholder="Experience"
          keyboardType="numeric"
          value={experience}
          onChangeText={text => setExperience(text)}
        />
        <SelectDropdown
          data={designationOptions}
          onSelect={(selectedItem, index) => setDesignation(selectedItem)}
          buttonTextAfterSelection={(selectedItem, index) => selectedItem}
          defaultButtonText="Designation"
          rowStyle={{
            borderRadius: wp(2),
            backgroundColor: '#f1f1f1',
            marginTop: hp(1),
            paddingHorizontal: wp(4),
            borderWidth: 1,
            borderColor: '#E97724',
          }}
          rowTextStyle={{textAlign: 'left'}}
          buttonStyle={{
            paddingHorizontal: wp(4),
            paddingVertical: hp(1),
            width: wp(90),
            backgroundColor: 'white',
            marginTop: hp(2),
            borderRadius: wp(1),
            borderWidth: 1,
            borderColor: '#E97724',
          }}
          dropdownStyle={{
            backgroundColor: '#d1d8e0',
            borderRadius: wp(2),
            paddingVertical: hp(2),
            paddingHorizontal: wp(3),
            borderWidth: 1,
            borderColor: '#E97724',
            height: hp(40),
          }}
          buttonTextStyle={{
            color: designation ? 'black' : 'grey',
            textAlign: 'left',
            fontSize: hp(2),
          }}
          renderDropdownIcon={() => {
            return (
              <View>
                <Entypo name="chevron-down" size={30} color="#E97724" />
              </View>
            );
          }}
        />
        <SelectDropdown
          data={roleOptions}
          onSelect={(selectedItem, index) => setRole(selectedItem)}
          buttonTextAfterSelection={(selectedItem, index) => selectedItem}
          defaultButtonText="Role"
          rowStyle={{
            borderRadius: wp(1),
            backgroundColor: '#f1f1f1',
            marginTop: hp(1),
            paddingHorizontal: wp(4),
            borderWidth: 1,
            borderColor: '#E97724',
          }}
          rowTextStyle={{textAlign: 'left'}}
          buttonStyle={{
            paddingHorizontal: wp(4),
            paddingVertical: hp(1),
            width: wp(90),
            backgroundColor: 'white',
            marginTop: hp(2),
            borderRadius: wp(1),
            borderWidth: 1,
            borderColor: '#E97724',
          }}
          dropdownStyle={{
            backgroundColor: '#d1d8e0',
            borderRadius: wp(1),
            paddingVertical: hp(2),
            paddingHorizontal: wp(3),
            borderWidth: 1,
            borderColor: '#E97724',
            height: hp(40),
          }}
          buttonTextStyle={{
            color: role ? 'black' : 'grey',
            textAlign: 'left',
            fontSize: hp(2),
          }}
          renderDropdownIcon={() => {
            return (
              <View>
                <Entypo name="chevron-down" size={30} color="#E97724" />
              </View>
            );
          }}
        />

        <View
          style={{
            flexDirection: 'row',
            width: wp(90),
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity onPress={PickFile} style={styles.filechoose}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.choosename}>
                {' '}
                {fileData && fileData.name
                  ? fileData.name.substring(0, 15)
                  : 'Choose File'}{' '}
              </Text>
              <AntDesign name="folderopen" size={30} color="#E97724" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => uploadFile(fileData?.fileCopyUri)}
            style={styles.upload}>
            <Entypo name="upload" size={30} color="#E97724" />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: wp(90),
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity onPress={pickImage} style={styles.filechoose}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.choosename}>
                {' '}
                {imagedata && imagedata.name
                  ? imagedata.name.substring(0, 15)
                  : 'Choose Image'}{' '}
              </Text>
              <Entypo name="image" size={30} color="#E97724" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => uploadImage(imagedata?.fileCopyUri)}
            style={styles.upload}>
            <Entypo name="upload" size={30} color="#E97724" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity
        activeOpacity={1}
        style={styles.button}
        onPress={updateData}>
        <Text style={styles.logintext}>SAVE</Text>
      </TouchableOpacity>

      <Alert
        isVisible={showAlert}
        title=" Invalid Data"
        message="Please fill in all fields."
        onClose={() => setShowAlert(false)}
      />
      <Alert
        isVisible={showAlert2}
        title="Success!"
        message="your file has been uploaded successfully."
        onClose={() => setShowAlert2(false)}
      />
      <Alert
        isVisible={showAlert3}
        title="Invalid Data"
        // message="please check phone number or email or password muustbe 6 characters."
        message={msg}
        onClose={() => setShowAlert3(false)}
      />

      <View style={{position: 'absolute', top: hp(45), left: wp(44)}}>
        {isLoading && (
          <ActivityIndicator size={45} animating={true} color={'#1E5B70'} />
        )}
      </View>
    </SafeAreaView>
  );
};

export default AddEmpolye;

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: wp(6),
    paddingVertical: hp(1),
    borderWidth: 1,
    borderColor: '#E97724',
    width: wp(90),
    backgroundColor: 'white',
    borderRadius: wp(1),
    marginTop: hp(2),
  },
  button: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    width: wp(60),
    backgroundColor: '#1a6372',
    borderRadius: wp(1),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2),
    elevation: 5,
    borderWidth: 1,
    marginVertical: hp(2),
  },
  logintext: {
    fontSize: hp(3),
    color: 'white',
    fontFamily: 'OpenSans-SemiBold',
  },
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
    marginLeft: wp(15),
    width: wp(60),
  },
  choosename: {
    fontSize: hp(2.5),
    color: 'black',
    fontFamily: 'OpenSans-SemiBold',
  },
  upload: {
    width: wp(22),
    borderWidth: 1,
    borderColor: '#E97724',
    borderRadius: wp(0.7),
    paddingVertical: hp(1),
    marginTop: hp(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  filechoose: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderWidth: 1,
    borderColor: '#E97724',
    width: wp(65),
    backgroundColor: 'white',
    borderRadius: wp(0.7),
    marginTop: hp(2),
    marginHorizontal: wp(1),
  },
});
