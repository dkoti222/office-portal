import { View, Text } from 'react-native'
import React from 'react'
import { WebView } from 'react-native-webview';

const Terms = () => {
  return (
    <WebView source={{ uri: 'https://raicetechsoft.com/terms-conditions.php' }} style={{ flex: 1 }} />
  )
}

export default Terms