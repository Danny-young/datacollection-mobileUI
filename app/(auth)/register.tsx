import React, { useState } from 'react'
import { View, Text, Modal } from 'react-native'
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText } from '../../components/ui/form-control'
import { Input, InputField } from '../../components/ui/input'
import { VStack } from '../../components/ui/vstack'
import { HStack } from '@/components/ui/hstack'
import { Button, ButtonText } from '../../components/ui/button'
import { AlertCircleIcon } from '../../components/ui/icon'
import { useMutation } from '@tanstack/react-query';
import { register } from '@/api/auth'
import { useAuth } from '@/store/authStore'
import { router } from 'expo-router'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('') 
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [showCredentials, setShowCredentials] = useState(false)
  const [agentCode, setAgentCode] = useState('');
  //const setUser = useAuth((s: any) => s.setUser);
  // const setToken = useAuth((s: any) => s.setToken);
  //   const isLoggedIn = useAuth((s: any) => !!s.token);
  const registerMutation = useMutation({
    mutationFn: () => register(name, email, phoneNumber),
    onSuccess: (data) => {
      console.log('Success: ', data);
      setGeneratedPassword(data.temporaryPassword);
      setAgentCode(data.AgentCode);
      setShowCredentials(true);
    },
    onError: (error) => {
      console.error('Registration Error:', error);
    }
  });
  // AG019 - 819be01e

  const handleCloseCredentials = () => {
    setShowCredentials(false);
    router.replace('/(auth)/login');
  };

  return (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <VStack className="w-full max-w-[300px] rounded-md border border-background-200 p-4">
    <FormControl
    //   isInvalid={isInvalid}
      size="md"
      isDisabled={false}
      isReadOnly={false}
      isRequired={false}
    >
      <FormControlLabel>
        <FormControlLabelText>Register</FormControlLabelText>
      </FormControlLabel>
      <Input 
      size='xl'
      className="my-1" /* size={xl} */ >
        <InputField
          type="text"
          placeholder="Name"
          value={name}
          onChangeText={(text:string) => setName(text)}
        />
      </Input>
      
      <Input size='xl' className="my-1">
        <InputField
          type="text"
          placeholder="email"
          value={email}
          onChangeText={(text:string) => setEmail(text)}
        />
      </Input>
     
      {/* <FormControlLabel>
        <FormControlLabelText>Password</FormControlLabelText>
      </FormControlLabel> */}
      <Input size='xl' className="my-1">
        <InputField
          type="text"
          placeholder="Telephone Number"
          value={phoneNumber}
          onChangeText={(text:string) => setPhoneNumber(text)}
        />
      </Input>
    
    </FormControl>
    <HStack className='flex  gap-5 mt-4'>
    
    <Button className=" flex-1" size="sm" onPress={() => registerMutation.mutate()}>
      <ButtonText>Register</ButtonText>
    </Button>
    </HStack>
  </VStack>
  
  <Modal
    visible={showCredentials}
    transparent={true}
    animationType="slide"
  >
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)'
    }}>
      <View style={{
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
      }}>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>Your Login Credentials</Text>
        <Text>Agent Code: {agentCode}</Text>
        <Text>Password: {generatedPassword}</Text>
        <Button className="mt-4" onPress={handleCloseCredentials}>
          <ButtonText>OK</ButtonText>
        </Button>
      </View>
    </View>
  </Modal>
</View>
  )
}
