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
// import { useAuth } from '@/store/authStore'
// import { Redirect } from 'expo-router'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  
  // const setUser = useAuth((s)=> s.setUser())
  // const isLoggedIn = useAuth((s) => !!s.username)

  const handleState = () => {
    setShowPassword((showState) => {
    return !showState;
  });
    };

    const loginMutation = useMutation({
      mutationFn: () => login(username , password),
      onSuccess: (data) => {
        console.log('Success: ', data);
        if(data.username) {
          //setUser(data.username);
        }
      },
      onError: () => {
        console.log('Error');
      }
    });
  
    // if(isLoggedIn) {
    //   return <Redirect href={'/(tabs)'} />
    // }
  
    return (
    
    <VStack className="w-full max-w-[300px] rounded-md border border-background-200 p-4">
      <FormControl
        size="md"
        isDisabled={false}
        isReadOnly={false}
        isRequired={false}
      >
        <FormControlLabel>
          <FormControlLabelText>Login</FormControlLabelText>
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
        <FormControlHelper>
          <FormControlHelperText>
            Must be atleast 6 characters.
          </FormControlHelperText>
        </FormControlHelper>
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>
            Atleast 6 characters are required.
          </FormControlErrorText>
        </FormControlError>
      </FormControl>
      <VStack className='flex  gap-5 mt-4'>
      <Button size="sm" variant="outline">
        <ButtonText>Forgot Password?</ButtonText>
      </Button>
      <Button className="w-fit self-end mt-4" size="sm" onPress={() => loginMutation.mutate()}>
        <ButtonText>Login</ButtonText>
      </Button>
      </VStack>
    </VStack>
  )
}


