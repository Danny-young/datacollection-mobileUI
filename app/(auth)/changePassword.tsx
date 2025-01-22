import React, { useState } from 'react';
import { View } from 'react-native';
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from '../../components/ui/form-control';
import { Input, InputField, InputSlot, InputIcon } from '../../components/ui/input';
import { VStack } from '@/components/ui/vstack';
import { Button, ButtonText } from '../../components/ui/button';
import { EyeIcon, EyeOffIcon } from '../../components/ui/icon';
import { useToast } from '@/components/ui/toast';
import { HStack } from '@/components/ui/hstack';
import { useMutation } from '@tanstack/react-query';
import { changePassword } from '@/api/auth';
import { router } from 'expo-router';

export default function ChangePassword() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [formData, setFormData] = useState({
    user_name: '',
    oldPassword: '',
    newPassword: '',
  });

  const toast = useToast();

  const handleToggleOldPassword = () => setShowOldPassword((prev) => !prev);
  const handleToggleNewPassword = () => setShowNewPassword((prev) => !prev);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const changePasswordMutation = useMutation({
    mutationFn: () => changePassword(
      formData.user_name,
      formData.oldPassword,
      formData.newPassword
    ),
    onSuccess: () => {
      toast.show({
        // title: 'Success',
        // description: 'Password changed successfully!',
        // variant: 'success',
      });
      setFormData({ user_name: '', oldPassword: '', newPassword: '' });
      router.replace('/login'); // Redirect to login after success
    },
    onError: (error) => {
      toast.show({
        // title: 'Error',
        // description: error?.message || 'Failed to change password. Please try again.',
        // variant: 'error',
      });
    },
  });

  const handleSubmit = () => {
    changePasswordMutation.mutate();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <VStack className="w-full max-w-[300px] rounded-md border border-background-200 p-4">
        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>Agent Code</FormControlLabelText>
          </FormControlLabel>
          <Input size="xl" className="my-1">
            <InputField
              type="text"
              placeholder="Enter your Agent Code"
              value={formData.user_name}
              onChangeText={(text: string) => handleChange('user_name', text)}
            />
          </Input>

          <FormControlLabel>
            <FormControlLabelText>Old Password</FormControlLabelText>
          </FormControlLabel>
          <Input size="xl" className="my-1">
            <InputField
              type={showOldPassword ? 'text' : 'password'}
              placeholder="Enter old password"
              value={formData.oldPassword}
              onChangeText={(text: string) => handleChange('oldPassword', text)}
            />
            <InputSlot className="p-3" onPress={handleToggleOldPassword}>
              <InputIcon as={showOldPassword ? EyeIcon : EyeOffIcon} className="text-darkBlue-500" />
            </InputSlot>
          </Input>

          <FormControlLabel>
            <FormControlLabelText>New Password</FormControlLabelText>
          </FormControlLabel>
          <Input size="xl" className="my-1">
            <InputField
              type={showNewPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              value={formData.newPassword}
              onChangeText={(text: string) => handleChange('newPassword', text)}
            />
            <InputSlot className="p-3" onPress={handleToggleNewPassword}>
              <InputIcon as={showNewPassword ? EyeIcon : EyeOffIcon} className="text-darkBlue-500" />
            </InputSlot>
          </Input>
        </FormControl>

        <HStack className="flex gap-5 mt-4">
          <Button
            className="flex-1 w-fit self-end mt-4"
            size="sm"
            variant="outline"
            onPress={() => router.push('/forgot-password')}
          >
            <ButtonText>Forgot Password?</ButtonText>
          </Button>
          <Button
            className="flex-1 w-fit self-end mt-4"
            size="sm"
            onPress={handleSubmit}
           // isLoading={changePasswordMutation.isLoading}
          >
            <ButtonText>Change Password</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </View>
  );
}
