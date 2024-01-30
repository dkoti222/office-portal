import {View, Text, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {TextInput} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SelectDropdown from 'react-native-select-dropdown';
import {RadioButton} from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import Alert from '../Alert';
import storage from '@react-native-firebase/storage';
import {ActivityIndicator} from 'react-native-paper';

const ProfileCreation = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Male');
  const [designation, setDesignation] = useState(null);
  const [experience, setExperience] = useState('');
  const [recruitmentType, setRecruitmentType] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlert2, setShowAlert2] = useState(false);
  const [showAlert3, setShowAlert3] = useState(false);
  const [imagedata, setImagedata] = useState('');
  const [fileUri, setFileUri] = useState(null);
  const [address, setAddress] = useState('');
  const designationOptions = [
    'Accountant',
    'Administrative Assistant',
    'Operations Manager',
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
  const recruitmentTypeOptions = [
    'IT',
    'NON-IT',
    'INHOUSE IT',
    'INHOUSE NON-IT',
    'Indian Recruiters',
    'US Recruiters',
  ];
  const genderOptions = ['Male', 'Female'];

  const profileData = async () => {
    if (
      !name ||
      !designation ||
      !email ||
      !phone ||
      !address ||
      !experience ||
      !gender ||
      !recruitmentType ||
      !imagedata ||
      !fileUri
    ) {
      setShowAlert(true);
      return;
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setShowAlert3(true);
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setShowAlert3(true);
      return;
    }

    try {
      const useData = {
        id: uuid.v4(),
        phone: phone,
        name: name,
        email: email,
        experience: experience,
        address:address,
        designation: designation,
        gender: gender,
        recruitmentType: recruitmentType,
        status: 'ShortList',
        fileUri: fileUri,
        imagedata: imagedata,
      };
      const documentReference = await firestore()
        .collection('Recruitment')
        .add(useData);
      const docId = documentReference.id;
      setPhone(''),
        setName(''),
        setEmail(''),
        setExperience(''),
        setAddress(''),
        setGender(''),
        setDesignation(null),
        setRecruitmentType(null),
        setFileUri(null);
      setImagedata(null);
      navigation.navigate('Recruitment');
    } catch (err) {
      console.log(err);
    }
  };
  const pickImage = async () => {
    try {
      const response = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
        copyTo: 'cachesDirectory',
      });
      if (response) {
        setImagedata(response);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const uploadImage = async fileUri => {
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

      const reference = storage().ref(`${imagedata.type}`);
      await reference.putFile(fileUri);
      const downloadURL = await reference.getDownloadURL();
      setFileUri(downloadURL);
      console.log('fileeee  uploaded successfully.');
      setIsLoading(false);
      setShowAlert2(true);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', backgroundColor: '#f1f1f1'}}>
      <View style={styles.top}>
        <TouchableOpacity onPress={() => navigation.navigate('Recruitment')}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headtext}>Profile Creation</Text>
      </View>

         <ScrollView showsVerticalScrollIndicator={false}>
         <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <TextInput
            style={styles.input}
            placeholderTextColor="grey"
            placeholder="Name"
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
            placeholder="Phone"
            keyboardType="numeric"
            value={phone}
            onChangeText={text => setPhone(text)}
          />
           <TextInput
            style={styles.input}
            placeholderTextColor="grey"
            placeholder="Address"
            value={address}
            onChangeText={(text) => setAddress(text)}
          />

          <View style={styles.radioview}>
            <Text style={{color: 'black', marginTop: hp(1), fontSize: hp(2)}}>
              Gender
            </Text>
            <View style={styles.radioButtons}>
              {genderOptions.map(option => (
                <View key={option} style={styles.radioButton}>
                  <RadioButton
                    value={option}
                    status={gender === option ? 'checked' : 'unchecked'}
                    onPress={() => setGender(option)}
                    color={gender === option ? '#E97724' : '#1a6372'}
                  />
                  <Text>{option}</Text>
                </View>
              ))}
            </View>
          </View>

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
              paddingVertical: hp(1.5),
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

          <TextInput
            style={styles.input}
            placeholderTextColor="grey"
            placeholder="Experience"
            keyboardType="numeric"
            value={experience}
            onChangeText={text => setExperience(text)}
          />

          <SelectDropdown
            data={recruitmentTypeOptions}
            onSelect={(selectedItem, index) => setRecruitmentType(selectedItem)}
            buttonTextAfterSelection={(selectedItem, index) => selectedItem}
            defaultButtonText="Recruitment Type"
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
              paddingVertical: hp(1.5),
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
              color: recruitmentType ? 'black' : 'grey',
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
            <TouchableOpacity onPress={pickImage} style={styles.filechoose}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.choosename}>
                  {' '}
                  {imagedata && imagedata.name
                    ? imagedata.name.substring(0, 15)
                    : 'Choose File'}{' '}
                </Text>

                <AntDesign name="folderopen" size={30} color="#E97724" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => uploadImage(imagedata?.fileCopyUri)}
              style={styles.upload}>
              <Entypo name="upload" size={30} color="#E97724" />
            </TouchableOpacity>
          </View>

         
        </View>

         </ScrollView>
     
      
        <TouchableOpacity style={styles.button} onPress={profileData}>
            <Text style={styles.logintext}>SAVE</Text>
          </TouchableOpacity>
        <Alert
          isVisible={showAlert}
          title="Invalid Data"
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
          message="please check phone number or email."
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
export default ProfileCreation;

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
    marginLeft: wp(15),
    width: wp(60),
  },
  input: {
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.5),
    borderWidth: 1,
    borderColor: '#E97724',
    width: wp(90),
    backgroundColor: 'white',
    borderRadius: wp(1),
    marginTop: hp(2),
  },
  filechoose: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderWidth: 1,
    borderColor: '#E97724',
    width: wp(65),
    backgroundColor: 'white',
    borderRadius: wp(1),
    marginTop: hp(2),
    marginHorizontal: wp(1),
  },
  upload: {
    width: wp(22),
    borderWidth: 1,
    borderColor: '#E97724',
    borderRadius: wp(1),
    paddingVertical: hp(1.5),
    marginTop: hp(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    width: wp(60),
    backgroundColor: '#1a6372',
    borderRadius: wp(1),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    marginVertical:hp(2.5)

  },

  radioview: {
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.5),
    width: wp(90),
    borderRadius: wp(2),
    marginTop: hp(2),
    flexDirection: 'row',
  },
  picker: {
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.5),
    borderWidth: 1,
    borderColor: '#E97724',
    width: wp(90),
    backgroundColor: 'white',
    borderRadius: wp(2),
    marginTop: hp(2),
  },

  pickertext: {
    fontSize: hp(3),
    color: 'black',
    fontFamily: 'OpenSans-SemiBold',
    textAlign: 'center',
  },
  logintext: {
    fontSize: hp(3),
    color: 'white',
    fontFamily: 'OpenSans-SemiBold',
  },
  radioButtons: {
    flexDirection: 'row',
    marginLeft: wp(5),
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  choosename: {
    fontSize: hp(2.5),
    color: 'black',
    fontFamily: 'OpenSans-SemiBold',
  },
});
