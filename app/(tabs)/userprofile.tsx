import React from 'react'
import {  Text, View } from 'react-native'
import Login from '@/app/(auth)/login'
import Register from '@/app/(auth)/register'
import { Button, ButtonText } from '@/components/ui/button'

export default function userprofile() {
  return (
    <View>
        <Text>
        userprofile
        </Text>
        
        <Login/>
        <Register/>
        </View>
  )
}
