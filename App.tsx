import { View, Text, StatusBar } from 'react-native'
import Navigation from './src/Screens/Navigation/Naviagtion'

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#1E5B70" />
      <Navigation />
    </View>
  );
};


export default App