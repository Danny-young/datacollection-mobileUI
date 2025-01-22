import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/store/authStore';
import { 
  Avatar,
  AvatarBadge,
  AvatarImage,
  AvatarFallbackText 
} from '@/components/ui/avatar';
import { 
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlHelper,
  FormControlHelperText,
  FormControlError,
  FormControlErrorText
} from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { 
  Card,
  // CardHeader,
  // CardContent,
  // CardFooter 
} from '@/components/ui/card';
import { Text } from "@/components/ui/text"
import { Box } from '@/components/ui/box';

import { useToast } from '@/components/ui/toast';
import { individualAgent } from '@/api/agents';
// import { 
//   UserIcon,
//   PhoneIcon,
//   MailIcon,
//   BuildingIcon,
//   MapPinIcon,
//   PenIcon,
//   PersonIcon,
//   EmailIcon 
// } from '@/components/ui/icon';
import { Heading } from '@/components/ui/heading';
import { AddIcon, Icon } from '@/components/ui/icon';
import { LogOut, MailIcon, MailsIcon, PhoneIcon, ShoppingCart, UserCheck2 } from 'lucide-react-native';

interface UserProfile {
  agentCode: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  location: string;
  role: string;
  avatarUrl?: string;
  joinDate: string;
}

interface ProfileItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  isEditing?: boolean;
  onEdit?: (value: string) => void;
}


const ProfileItem = ({ icon, label, value, isEditing, onEdit }: ProfileItemProps) => (
  <HStack space="md" className="py-2">
    <Box className="w-8">{icon}</Box>
    {isEditing ? (
      <FormControl>
        <FormControlLabel>
          <FormControlLabelText>{label}</FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            value={value}
            onChangeText={onEdit}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        </Input>
      </FormControl>
    ) : (
      <VStack>
        <Text className="text-sm text-gray-500">{label}</Text>
        <Text className="text-base font-medium">{value}</Text>
      </VStack>
    )}
  </HStack>
);


export default function userprofile() {

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  //const { user } = useAuth();
  const toast = useToast();
  console.log(individualAgent)
    // Fetch user profile data
  //  const { data: profile, isLoading } = useQuery({
  //  queryKey: ['userProfile', user?.username],
  //  queryFn: individualAgent() ,
  //   onSuccess: () => {
  //     setIsEditing(false);
  //     toast.show({
  //       title: "Success",
  //       description: "Profile updated successfully!",
  //       variant: "success",
  //     });
  //   }
  //   onError: (error) => {
  //     toast.show({
  //       title: "Error",
  //       description: error.message || "Failed to update profile",
  //       variant: "error",
  //     });
  //   },
  // });

  // const handleUpdate = () => {
  //   if (individualAgent) {
  //     updateProfileMutation.mutate(profileData);
  //   }
  // };

  // if (isLoading) {
  //   return (
  //     <View className="flex-1 justify-center items-center">
  //       <Text>Loading profile...</Text>
  //     </View>
  //   );
  // }

  if (!individualAgent) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No profile data available</Text>
      </View>
    );
  }

  
  return (
    <ScrollView className="flex-1 bg-gray-50">
    <Card className="m-4">
      <Card>
        <HStack space="sm" className="pb-4 space-x-8 gap-5">
        <Avatar size="xl">
        <AvatarFallbackText>Jane Doe</AvatarFallbackText>
        <AvatarImage
    source={{
      uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    }}
  />
  <AvatarBadge />
</Avatar>

        <VStack space="sm" className="flex-1">
          <Heading 
            size="xl" 
            style={{
              color: '#1E293B',
              fontSize: 28,
              fontWeight: '700',
              letterSpacing: 0.5,
              marginBottom: 4
            }}
          >
            Michael Davidson
          </Heading>
          <HStack 
            style={{
              backgroundColor: '#EEF2FF',
              paddingVertical: 4,
              paddingHorizontal: 12,
              borderRadius: 20,
              alignSelf: 'flex-start',
              marginBottom: 8
            }}
          >
            <Text 
              style={{
                color: '#4F46E5',
                fontSize: 16,
                fontWeight: '600'
              }}
            >
              Agent030
            </Text>
          </HStack>
          <Button
            variant="outline"
            size="sm"
            style={{
              backgroundColor: '#F0F9FF',
              borderColor: '#93C5FD',
              borderWidth: 1,
              borderRadius: 8,
              paddingVertical: 8,
              paddingHorizontal: 16,
              alignSelf: 'flex-start'
            }}
            onPress={() => setIsEditing(!isEditing)}
          >
            <ButtonText 
              style={{
                color: '#2563EB',
                fontSize: 14,
                fontWeight: '600'
              }}
            >
              {isEditing ? '✕ Cancel Editing' : '✎ Edit Profile'}
            </ButtonText>
          </Button>
        </VStack>
        </HStack>
      </Card>
    
   <Card className="p-4 bg-white shadow-md rounded-xl">
    <VStack space="md">
      <HStack space="md" style={{ alignItems: 'center' }} className="p-2 rounded-lg hover:bg-gray-50">
        <Box className="bg-blue-50 p-2 rounded-full">
          <Icon color="#2563eb" size="xl" as={PhoneIcon}/>
        </Box>
        <VStack>
          <Text className="text-gray-500 text-sm">Phone Number</Text>
          <Text className="text-gray-800 text-lg font-medium">054 800 7154</Text>
        </VStack>
      </HStack>

      <HStack space="md" style={{ alignItems: 'center' }} className="p-2 rounded-lg hover:bg-gray-50">
        <Box className="bg-blue-50 p-2 rounded-full">
          <Icon color="#2563eb" size="xl" as={MailsIcon}/>
        </Box>
        <VStack>
          <Text className="text-gray-500 text-sm">Email Address</Text>
          <Text className="text-gray-800 text-lg font-medium">michael2000@gmail.com</Text>
        </VStack>
      </HStack>
    </VStack>
   </Card>

    <Card className="p-4 bg-white shadow-md rounded-xl">
      <HStack 
        style={{
          backgroundColor: '#EEF2FF',
          borderRadius: 12,
          padding: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          minHeight: 120
        }}
        className="justify-around w-full divide-x divide-gray-200"
      >
        <VStack className="flex-1 px-4 py-2">
          <Text 
            style={{ 
              color: '#1E40AF',
              fontSize: 16,
              fontWeight: '600',
              marginBottom: 8,
              textAlign: 'center'
            }}
          >
            Data Collected
          </Text>
          <Text 
            style={{ 
              fontSize: 30,
              fontWeight: '800',
              color: '#1E3A8A',
              textAlign: 'center',
              letterSpacing: 1.5,
              marginBottom: 4,
              lineHeight: 35
            }}
          >
            365
          </Text>
          <Text 
            style={{ 
              color: '#6B7280',
              fontSize: 14,
              textAlign: 'center'
            }}
          >
            Total
          </Text>
        </VStack>

        <VStack className="flex-1 px-4 py-2">
          <Text 
            style={{ 
              color: '#1E40AF',
              fontSize: 16,
              fontWeight: '600',
              marginBottom: 8,
              textAlign: 'center'
            }}
          >
            Electoral Area Visited
          </Text>
          <Text 
            style={{ 
              fontSize: 30,
              fontWeight: '800',
              color: '#1E3A8A',
              textAlign: 'center',
              letterSpacing: 1.5,
              marginBottom: 4,
              lineHeight: 35
            }}
          >
            24
          </Text>
          <Text 
            style={{ 
              color: '#6B7280',
              fontSize: 14,
              textAlign: 'center'
            }}
          >
            Areas
          </Text>
        </VStack>
      </HStack>     
    </Card>

    <Card 
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4
      }}
    >
      <VStack space="lg">
        <HStack 
          style={{
            backgroundColor: '#F0F9FF',
            borderRadius: 12,
            padding: 12,
            marginBottom: 8,
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Text style={{ color: '#64748B', fontSize: 16 }}>Role</Text>
          <HStack 
            style={{
              backgroundColor: '#EEF2FF',
              paddingVertical: 4,
              paddingHorizontal: 12,
              borderRadius: 20
            }}
          >
            <Text style={{ color: '#4F46E5', fontSize: 16, fontWeight: '600' }}>
              Agent
            </Text>
          </HStack>
        </HStack>

        <HStack 
          style={{
            backgroundColor: '#F0F9FF',
            borderRadius: 12,
            padding: 5
          }}
          alignItems="center"
          justifyContent="space-between"
        >
          <Text style={{ color: '#64748B', fontSize: 16 }}>Agent Since</Text>
          <Text 
            style={{ 
              color: '#4F46E5', 
              fontSize: 16, 
              fontWeight: '600',
              backgroundColor: '#EEF2FF',
              paddingVertical: 4,
              paddingHorizontal: 12,
              borderRadius: 20
            }}
          >
            23rd December 2023
          </Text>
        </HStack>
      </VStack>
    </Card>




      <Card 
        style={{
          backgroundColor: 'white',
          borderRadius: 16,
          marginBottom: 5,
          marginTop: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 5,
          elevation: 2
        }}
      >
        <TouchableOpacity 
          style={{
            borderRadius: 12,
            overflow: 'hidden'
          }}
          activeOpacity={0.7}
        >
          <HStack 
            style={{
              padding: 16,
              alignItems: 'center',
              backgroundColor: '#F8FAFF'
            }}
          >
            <Box 
              style={{
                backgroundColor: '#EEF2FF',
                padding: 12,
                borderRadius: 12,
                shadowColor: '#2563eb',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 1
              }}
            >
              <Icon color="#2563eb" size="xl" as={UserCheck2}/>
            </Box>
            <Text 
              style={{ 
                marginLeft: 16,
                fontSize: 16,
                fontWeight: '600',
                color: '#334155'
              }}
            >
              Change Password
            </Text>   
          </HStack>    
        </TouchableOpacity>  
      </Card>

      <Card 
        style={{
          backgroundColor: 'white',
          borderRadius: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 5,
          elevation: 2
        }}
      >
        <TouchableOpacity 
          style={{
            borderRadius: 12,
            overflow: 'hidden'
          }}
          activeOpacity={0.7}
        >
          <HStack 
            style={{
              padding: 16,
              alignItems: 'center',
              backgroundColor: '#FEF2F2'
            }}
          >
            <Box 
              style={{
                backgroundColor: '#FEE2E2',
                padding: 12,
                borderRadius: 12,
                shadowColor: '#dc2626',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 1
              }}
            >
              <Icon color="#dc2626" size="xl" as={LogOut}/>
            </Box>
            <Text 
              style={{ 
                marginLeft: 16,
                fontSize: 16,
                fontWeight: '600',
                color: '#DC2626'
              }}
            >
              Log out
            </Text>   
          </HStack>    
        </TouchableOpacity>  
      </Card>

      {isEditing && (
        <Card>
          <Button
            className="w-full"
            // onPress={handleUpdate}
            // isDisabled={updateProfileMutation.isPending}
          >
            {/* <ButtonText>
              {updateProfileMutation.isPending ? 'Updating...' : 'Save Changes'}
            </ButtonText> */}
          </Button>
        </Card>
      )}
    </Card>
  </ScrollView>
);
}