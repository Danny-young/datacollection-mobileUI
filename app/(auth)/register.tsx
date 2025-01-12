import React, { useState } from 'react'
import { View } from 'react-native'
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText } from '../../components/ui/form-control'
import { Input, InputField } from '../../components/ui/input'
import { VStack } from '../../components/ui/vstack'
import { HStack } from '@/components/ui/hstack'
import { Button, ButtonText } from '../../components/ui/button'
import { AlertCircleIcon } from '../../components/ui/icon'
import { useMutation } from '@tanstack/react-query';
import { register } from '@/api/auth'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('') 
 
  const registerMutation = useMutation({
    mutationFn: () => register(name, email, Number(phoneNumber)),
    onSuccess: (data) => {
      console.log('Success: ', data);
    },
    onError: () => {
      console.log('Error');
    }
  });
 // AG019 - 819be01e

  return (
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
  )
}
