import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ActivityIndicator} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Reject = ({navigation}) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const profileGetRequiredName = id => {
    AsyncStorage.setItem('PROFILENAME', JSON.stringify(id));
    navigation.navigate('ProfileView');
  };

  const getItems = async () => {
    setIsLoading(true);
    try {
      firestore()
        .collection('Recruitment')
        .onSnapshot(snap => {
          const temArray = [];
          snap.forEach(item => {
            temArray.push(item.data());
          });
          setItems(temArray);
          setIsLoading(false);
        });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getItems();
  }, []);
  const RejectListItems = items.filter(ele => ele.status === 'Reject');
  const renderItem = ({ item }) => (

    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.namesub}>{item.designation}</Text>
        <Text style={styles.namesub}>{item.email}</Text>
        <Text style={styles.namesub}>{item.phone}</Text>
      </View>
      <View>
        {/* <Text style={styles.name}>Offer Released</Text> */}
        <TouchableOpacity style={styles.status}  
        onPress={() => profileGetRequiredName(item)} activeOpacity={1} 
        >
          <Text style={styles.statustext}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
 
);
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      {RejectListItems.length > 0 ? (
        <FlatList data={RejectListItems} renderItem={renderItem} />
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            height: hp(50),
          }}>
          <Text style={styles.noData}>No data available</Text>
        </View>
      )}
      <View style={{position: 'absolute', top: hp(45), left: wp(44)}}>
        {isLoading && (
          <ActivityIndicator size={45} animating={true} color={'#1E5B70'} />
        )}
      </View>
    </View>
  );
};

export default Reject;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    width: wp(95),
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(2.5),
    paddingHorizontal: wp(5),
    marginHorizontal: wp(2),
    borderRadius: wp(1),
    marginTop: hp(0.8),
  },
  noDataContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(50),
  },
  noData: {
    fontSize: hp(3),
    color: 'black',
  },
  name: {
    fontFamily: 'OpenSans-Bold',
    color: 'black',
    fontSize: hp(2.3),
    paddingVertical: hp(0.5),
        width:wp(50)
  },
  namesub: {
    color: 'grey',
    fontFamily: 'OpenSans-Bold',
    fontSize: hp(2),
    paddingVertical: hp(0.1),
    width:wp(55),
  
  },
  status: {
    backgroundColor: '#1E5B70',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(0.6),
    borderRadius: 15,
    height:hp(4),
    width:wp(30)
  },
  statustext: {
    color: 'white',
    fontSize: hp(1.7),
  },
  plusButton: {
    position: 'absolute',
    bottom: 40,
    left: wp(45),
  },
  loadingIndicator: {
    position: 'absolute',
    top: hp(45),
    left: wp(44),
  },
});
