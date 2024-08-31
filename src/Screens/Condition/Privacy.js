import { View, Text } from 'react-native'
import React from 'react'
import { WebView } from 'react-native-webview';

const Privacy = () => {
  return (
    <WebView source={{ uri: 'https://raicetechsoft.com/privacy-policy.php' }} style={{ flex: 1 }} />
  )
}

export default Privacy