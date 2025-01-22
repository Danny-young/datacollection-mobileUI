import React, { useState } from 'react'
import { Text } from 'react-native'
import { View } from 'react-native'
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText } from '../../components/ui/form-control'
import { Input, InputField, InputIcon, InputSlot } from '../../components/ui/input'
import { VStack } from '@/components/ui/vstack'
import { Button, ButtonText } from '../../components/ui/button'
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from '../../components/ui/icon'
import { useMutation } from '@tanstack/react-query';
import { login } from '@/api/auth'
import { HStack } from '@/components/ui/hstack'
import { Redirect, router } from 'expo-router'
import { useToast } from '@/components/ui/toast'
import { useAuth } from '@/store/authStore'
// import { useAuth } from '@/store/authStore'
// import { Redirect } from 'expo-router'
const API_URL = process.env.EXPO_PUBLIC_API_URL;
console.log(API_URL);
export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  
  const setUser = useAuth((s: any) => s.setUser);
  const isLoggedIn = useAuth((s: any) => !!s.username)

  const toast = useToast()

  const handleState = () => {
    setShowPassword((showState) => {
    return !showState;
  });
    };

    // const loginMutation = useMutation({
    //   mutationFn: () => login(username , password),
    //   onSuccess: (data) => {
    //     console.log('Success: ', data);
    //     console.log(`User data ${data.agentCode}`)
    //     router.replace('/(tabs)');
    //     if(data) {
    //       setUser(data);
    //       console.log(setUser)
    //       toast.show({
    //         title: "Success",
    //         description: "Logged in successfully!",
    //         variant: "success"
    //       });
    //     }
    //   },

      const loginMutation = useMutation({
        mutationFn: () => login(username, password),
        onSuccess: (data) => {
          console.log('Full Login Response:', data)
          
          if (!data) {
            toast.show({
              title: "Error",
              description: "Invalid response from server",
              variant: "error"
            });
            return;
          }

          console.log('first_login value:', data.user.first_login)
          console.log('data fields', data);

          if (data.user.first_login === true) {
            setUser({
              username: data.user.user_name,
              first_login: data.user.first_login              
            })
            router.replace('/changePassword')
            toast.show({
              title: "Welcome!",
              description: "Please change your password for security.",
              variant: "info"
            })
          } else {
            setUser({
              username: data.user.user_name,
              first_login: data.user.first_login              
            })
            
            router.replace('/(tabs)')
            console.log("setUseeer", setUser)
            toast.show({
              title: "Success",
              description: "Logged in successfully!",
              variant: "success"
            })
          }
        },
      onError: (error) => {
        console.error('Login error:', error);
        toast.show({
          title: "Error",
          description: error.message || "Failed to login. Please check your credentials.",
          variant: "error"
        });
      }
    });
  
    if(isLoggedIn) {
      return <Redirect href={'/(tabs)'} />
    }
  
    return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <VStack className="w-full max-w-[300px] rounded-md border border-background-200 p-4">
      <FormControl
        size="md"
        isDisabled={false}
        isReadOnly={false}
        isRequired={false}
      >
        <FormControlLabel>
          <FormControlLabelText>Agent Code</FormControlLabelText>
        </FormControlLabel>
        <Input 
        size='xl'
        className="my-1" /* size={xl} */ >
          <InputField
            type="text"
            placeholder="username"
            value={username}
            onChangeText={(text:string) => setUsername(text)}
          />
        </Input>
        <FormControlLabel>
          <FormControlLabelText>Password</FormControlLabelText>
        </FormControlLabel>
        <Input size='xl' className="my-1">
          <InputField
            type={showPassword ? 'text' : 'password'}
            placeholder="password"
            value={password}
            onChangeText={(text:string) => setPassword(text)}
          />
           <InputSlot className='p-3' onPress={handleState}>
      <InputIcon as={showPassword ? EyeIcon : EyeOffIcon}
      className='text-darkBlue-500'/>
    </InputSlot>
        </Input>
        
      </FormControl>
      <VStack className='flex  gap-5 mt-4'>
      <Button size="sm" variant="outline">
        <ButtonText>Forgot Password?</ButtonText>
      </Button>
      <HStack className='flex:1 gap-3'>
      <Button className="w-fit self-end mt-4 flex-1" 
      size="sm" 
      onPress={() => router.push('/register')}>
        <ButtonText>Register</ButtonText>
      </Button>
      <Button className="flex-1 w-fit self-end mt-4 " size="sm" onPress={() => loginMutation.mutate()}>
        <ButtonText>Login</ButtonText>
      </Button>
        </HStack>
      </VStack>
    </VStack>
    </View>
  )
}


