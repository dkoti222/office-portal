import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Splash from '../Login/Splash';
import Login from '../Login/Login';
import Home from '../Home/Home';
import EmpolyeList from '../Empolyees/EmpolyeList';
import AddEmpolye from '../Empolyees/AddEmpolye';
import ProfileCreation from '../Recruitment/ProfileCreation';
import Recruitment from '../Recruitment/Recruitment';
import ShortList from '../Recruitment/ShortList';
import ProfileView from '../Recruitment/ProfileView';
import ProfileData from '../Empolyees/ProfileData';
import Attendance from '../Attendance/Attendance';
import TopBarAttendance from '../Attendance/TopBarAttendance';
import Onboarding from '../Onboarding/Onboarding';
import Leaves from '../Leaves/Leaves';
import CalenderView from '../Attendance/CalenderView';
import CalenderViewEmpolyee from '../Attendance/CalenderViewEmpolyee';
import Terms from '../Condition/Terms';
import Privacy from '../Condition/Privacy';
const Stack = createStackNavigator();
const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }} >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="EmpolyeList" component={EmpolyeList} />
        <Stack.Screen name="Recruitment" component={Recruitment} />
        <Stack.Screen name="AddEmpolye" component={AddEmpolye} />
        <Stack.Screen name="ProfileCreation" component={ProfileCreation} />
        <Stack.Screen name="ShortList" component={ShortList} />
        <Stack.Screen name="ProfileView" component={ProfileView} />
        <Stack.Screen name="ProfileData" component={ProfileData} />
        <Stack.Screen name="Attendance" component={Attendance} />
        <Stack.Screen name="TopBarAttendance" component={TopBarAttendance } />
        <Stack.Screen name="Onboarding" component={Onboarding } />
        <Stack.Screen name="Leaves" component={Leaves } />
        <Stack.Screen name="CalenderView" component={CalenderView } />
        <Stack.Screen name="CalenderViewEmpolyee" component={CalenderViewEmpolyee } />
        <Stack.Screen name="Terms" component={Terms } />
        <Stack.Screen name="Privacy" component={Privacy } />
  
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation