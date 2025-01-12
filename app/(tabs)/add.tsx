import { Image, StyleSheet, Platform, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useRef, useState } from 'react';
import {
  Button,
  ButtonText,
  ButtonSpinner,
  ButtonIcon,
  ButtonGroup,
} from "@/components/ui/button"
import {
  Card,
} from "@/components/ui/card";
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { Input, InputField } from '@/components/ui/input';
import { BarChart, PieChart } from "react-native-gifted-charts";
import { VStack } from '@/components/ui/vstack';
// import { Heading } from '@/components/ui/heading';  
import { FormControl, 
  FormControlLabel,
  FormControlLabelText,
  FormControlHelper,
  FormControlHelperText,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
 } from '@/components/ui/form-control';
import { AlertCircleIcon, ChevronDownIcon, PhoneIcon } from '@/components/ui/icon';
import { useToast, Toast, ToastTitle, ToastDescription } from '@/components/ui/toast';
import { useMutation } from '@tanstack/react-query';
import { collectiondata,fetchLocations, fetchLocalitiesByMunicipality } from '@/api/datacollection';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import {  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,} from '@/components/ui/select';
  import { useQuery } from '@tanstack/react-query';
import * as Location from 'expo-location';
//import { MapPin } from 'lucide-react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Alert,  AlertIcon, AlertText } from '@/components/ui/alert';




export default function add() {

 console.log(fetchLocations)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nationality: 'Ghanaian', // Default value
    telephone: '',
    idType: '',
    idNumber: '',
    electoralArea: '',
    locality: '',
    streetName: '',
    geolocation: '',
    valuationNo: '',
    dataType: '',
    dataParticular: 'business',
    accuracy: null as number | null,
    latitude: null as number | null,
    longitude: null as number | null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

   // Reference for the Select Bottom Sheet
   const selectRef = useRef<any>(null);

  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.telephone.trim()) newErrors.telephone = 'Phone number is required';
    if (!formData.idType) newErrors.idType = 'ID type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    setSubmitAttempted(true);
    if (validateForm()) {
      collectionMutation.mutate(formData);
    }
  };

 
    // Add queries for municipalities and localities
    const { data:municipalities, isLoading, error } = useQuery({
      queryKey: ['municipalities'],
      queryFn: fetchLocations
    });

     // Query for localities based on selected municipality
  const { data: localities,} = useQuery({
    queryKey: ['localities', formData.electoralArea],
    queryFn: () => fetchLocalitiesByMunicipality(formData.electoralArea),
    enabled: !!formData.electoralArea // Only fetch when a municipality is selected
  });

 
  const collectionMutation = useMutation({
    mutationFn: collectiondata as (data: typeof formData) => Promise<any>,
    onSuccess: (data) => {
      console.log('Success:', data);
    },
    onError: (error) => {
      console.error('Error:', error);
    },
  });

  console.log(localities)

    // Handler for electoral area change
    const handleElectoralAreaChange = (value: string) => {
      setFormData(prev => ({
        ...prev,
        electoralArea: value,
        locality: '' // Reset locality when electoral area changes
      }));
    };
  
console.log(municipalities);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  };

  const withinRange = formData.accuracy !== null && formData.accuracy <= 4;

  return (
    
    <ScrollView className='flex-1 w-full'>
     <FormControl className="border rounded-lg border-outline-300">

<View className="max-w mx-auto space-y-4">
<Card size="sm" variant="ghost" className="">
  <Heading size="md" className="text-center font-extrabold">
    DATA COLLECTION
  </Heading>
  
</Card>
<Card size="sm" variant="filled" className="">
  <Heading size="md" className="mb-1">
    Personal Information
  </Heading>

<HStack className='flex gap-2 mb-1'>
<VStack className="flex-1">
        <FormControlLabel>
          <FormControlLabelText className="text-typography-500">Surname</FormControlLabelText>
        </FormControlLabel>
        <Input className=""
        size="xl">
          <InputField
          value={formData.lastName}
          onChangeText={(text: string) => setFormData(prev => ({...prev, lastName: text}))}

          />
        </Input>      
 </VStack>     
<VStack className="flex-1">
        <FormControlLabel>
          <FormControlLabelText className="text-typography-500">FirstName</FormControlLabelText>
        </FormControlLabel>
        <Input className=""
         size="xl"
         isInvalid={!!(submitAttempted && errors.firstName)}
         >
         <InputField
           value={formData.firstName}
           onChangeText={(text: string) => setFormData(prev => ({...prev, firstName: text}))}
          />
        </Input>      
 </VStack> 
 </HStack>    
<HStack className='flex gap-2 mb-1'>
<VStack className="flex-1">
  <FormControlLabel>
    <FormControlLabelText className="text-typography-500">Phone No.</FormControlLabelText>
  </FormControlLabel>
  <Input
    size="xl"
    isInvalid={!!(submitAttempted && errors.telephone)}
  >
    <InputField
      value={formData.telephone}
      onChangeText={(text: string) => {
        const numberPart = text.replace('+233', '');
        if (numberPart.length <= 9 && /^\d*$/.test(numberPart)) {
          setFormData((prev) => ({ ...prev, telephone: '+233' + numberPart }));
        }
      }}
      placeholder="+233XXXXXXXXX"
      keyboardType="number-pad"
    />
  </Input>
  {submitAttempted && errors.telephone && (
    <Text className="text-error">{errors.telephone}</Text>
  )}
</VStack>

<VStack className="flex-1">
  <FormControlLabel>
    <FormControlLabelText className="text-typography-500">Nationality</FormControlLabelText>
  </FormControlLabel>
  <Input size="xl" isDisabled={true}>
    <InputField value={formData.nationality} editable={false} />
  </Input>
</VStack>
 </HStack>  

 <HStack className='flex gap-2 mb-1'>
     <VStack className="flex-1 mb-1">
      <FormControl isInvalid={!!(submitAttempted && errors.idType)}>
        <FormControlLabel>
          <FormControlLabelText className="text-typography-500">ID Type*:</FormControlLabelText>
        </FormControlLabel>
        <Select
          onValueChange={(value) => {
            setFormData((prev) => ({ ...prev, idType: value }));
          }}
        >
          <SelectTrigger>
            <SelectInput
              size='xl'
              placeholder="Select ID Type"
              className="flex-1 w-[600px]"
              value={formData.idType}
            />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              <SelectItem
                label="Ghana Card"
                value="Ghana Card"
              />
              <SelectItem
                label="Passport"
                value="passport"
              />
              <SelectItem
                label="Driver's License"
                value="Driver's License"
              />
            </SelectContent>
          </SelectPortal>
        </Select>
        {submitAttempted && errors.idType && (
          <FormControlError>
            <Text className="text-error">{errors.idType}</Text>
          </FormControlError>
        )}
      </FormControl>
    </VStack>

    <VStack className="flex-1 mb-2">
  <FormControl isInvalid={!!(submitAttempted && errors.idNumber)}>
    <FormControlLabel>
      <FormControlLabelText className="text-typography-500">ID Number*</FormControlLabelText>
    </FormControlLabel>
    <Input size="xl" isInvalid={!!(submitAttempted && errors.idNumber)}>
      <InputField
        placeholder="Enter ID number"
        value={formData.idNumber}
        onChangeText={(value: string) =>
          setFormData((prev) => ({ ...prev, idNumber: value }))
        }
      />
    </Input>
    {submitAttempted && errors.idNumber && (
      <FormControlError>
        <Text className="text-error">{errors.idNumber}</Text>
      </FormControlError>
    )}
  </FormControl>
</VStack> 
</HStack >
</Card>

<Card size="sm" variant="filled" className="">
  <Heading size="md" className="">
    Location
  </Heading>

  <FormControlLabel>
          <FormControlLabelText>Electoral Area</FormControlLabelText>
        </FormControlLabel>
        <Select
  selectedValue={formData.electoralArea}
  onValueChange={handleElectoralAreaChange}
>
          <SelectTrigger>
            <SelectInput placeholder="Select Electoral Area" />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              {municipalities?.map((municipality: any) => (
                
                <SelectItem 
                  key={municipality.id} 
                  label={municipality.municipalities} 
                  value={municipality.municipalities} 
                />
              ))}
            </SelectContent>
          </SelectPortal>
        </Select>

        <FormControlLabel>
        <FormControlLabelText>Locality</FormControlLabelText>
      </FormControlLabel>
      <Select
        selectedValue={formData.locality}
        onValueChange={(value) => setFormData(prev => ({ ...prev, locality: value }))}
        isDisabled={!formData.electoralArea}
      >
        <SelectTrigger>
          <SelectInput placeholder="Select Locality" />
          <ChevronDownIcon className="mr-3" />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            {localities?.map((locality: any) => (
              <SelectItem 
                key={locality.id} 
                label={locality.name} 
                value={locality.id.toString()} 
              />
            ))}
          </SelectContent>
        </SelectPortal>
      </Select>
        
      <VStack className="space-y-2">
  <FormControlLabel>
    <FormControlLabelText>Geolocation*</FormControlLabelText>
  </FormControlLabel>

  <HStack className="items-center space-x-2">
    <Button
      variant="outline"
      size="sm"
      isDisabled={isLocating}
      onPress={async () => {
        try {
          setIsLocating(true);
          setLocationError(null);

          const hasPermission = await requestLocationPermission();
          if (!hasPermission) {
            setLocationError('Location permission denied');
            return;
          }

          const locationSubscription = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              timeInterval: 1000,
              distanceInterval: 1,
            },
            (location) => {
              setFormData((prev) => ({
                ...prev,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                accuracy: location.coords.accuracy,
                geolocation: `${location.coords.latitude}, ${location.coords.longitude}`,
              }));

              if (location.coords?.accuracy && location.coords.accuracy <= 4) {
                locationSubscription.remove();
                setIsLocating(false);
              }
            }
          );
        } catch (error) {
          setLocationError('Unable to get location');
          console.error(error);
        }
      }}
    >
      <FontAwesome5 name="map-marker-alt" size={24} color={isLocating ? "blue" : "black"} />
      <ButtonText>{isLocating ? 'Getting location...' : 'Get Location'}</ButtonText>
    </Button>

    <Input
      className="flex-1"
      isDisabled
      size="md"
    >
      <InputField
        value={formData.geolocation}
        placeholder="Tap button to get location"
      />
    </Input>
  </HStack>

  {locationError && (
    <Text className="text-red-500">{locationError}</Text>
  )}

  {formData.accuracy && (
    <Text
      className={formData.accuracy <= 4 ? "text-green-600" : "text-red-600"}
    >
      Accuracy: {formData.accuracy.toFixed(2)}m
    </Text>
  )}
</VStack>
<HStack className="items-center space-x-2 gap-2">
<VStack className="space-y-2 flex-1">
  <FormControlLabel>
    <FormControlLabelText>Street Name*</FormControlLabelText>
  </FormControlLabel>
  <Input className=""
         size="xl"
         isInvalid={!!(submitAttempted && errors.streetName)}
         >
         <InputField
           value={formData.streetName}
           onChangeText={(text:string) => setFormData(prev => ({...prev, streetName: text}))}
          />
        </Input> 
</VStack>
<VStack className="space-y-2">
  <FormControlLabel>
    <FormControlLabelText>Valuation Number*</FormControlLabelText>
  </FormControlLabel>
  <Input className=""
         size="xl"
         isInvalid={!!(submitAttempted && errors.valuationNo)}
         >
         <InputField
           value={formData.valuationNo}
           onChangeText={(text:string) => setFormData(prev => ({...prev, valuationNo: text}))}
          />
        </Input> 
</VStack>
</HStack> 
</Card>

<Card size="sm" variant="filled" className="">
  <Heading size="md" className="">
    Data Information
  </Heading> 
<HStack className='space-x-2 gap-2'>
  <VStack className="space-y-2 flex-1">
  <FormControlLabel>
    <FormControlLabelText>Data Type*</FormControlLabelText>
  </FormControlLabel>
  <Select
    selectedValue={formData.dataType}
    onValueChange={(value) =>
      setFormData((prev) => ({
        ...prev,
        dataType: value,
        dataParticular: value === 'business' ? 'business' : '',
      }))
    }
  >
    <SelectTrigger>
      <SelectInput placeholder="Select data type" />
      <ChevronDownIcon className="mr-3" />
    </SelectTrigger>
    <SelectPortal>
      <SelectBackdrop />
      <SelectContent>
        <SelectItem label="Property" value="property" />
        <SelectItem label="Business" value="business" />
      </SelectContent>
    </SelectPortal>
  </Select>
</VStack>

<VStack className="space-y-2 flex-1">
  <FormControlLabel>
    <FormControlLabelText>Data Particular</FormControlLabelText>
  </FormControlLabel>
  {formData.dataType === 'property' ? (
    <Select
      selectedValue={formData.dataParticular}
      onValueChange={(value) =>
        setFormData((prev) => ({ ...prev, dataParticular: value }))
      }
    >
      <SelectTrigger>
        <SelectInput placeholder="Select property type" />
        <ChevronDownIcon className="mr-3" />
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent>
          <SelectItem label="Residential" value="residential" />
          <SelectItem label="Commercial" value="commercial" />
          <SelectItem label="Mixed Use" value="mixed" />
        </SelectContent>
      </SelectPortal>
    </Select>
  ) : (
    <Input isDisabled>
      <InputField value="business" />
    </Input>
  )}
</VStack>
</HStack>


  </Card>

  {/* <Alert action="error" className="gap-3">
  
    <AlertText className="text-typography-900" size="sm">
    <Text className="mr-2 font-semibold text-typography-900">Heads up:</Text>
     Once done, this action cannot be undone
  </AlertText>
</Alert> */}

<VStack className="space-y-4">
  <TouchableOpacity
    className="w-full"
    onPress={() => {
      setSubmitAttempted(true);
    }}
    disabled={!withinRange}
  >
    <Text>{withinRange ? 'Save' : 'Get Location Within 4m Range To Save'}</Text>
  </TouchableOpacity>
</VStack>


</View>    
   </FormControl>
   </ScrollView> 
      
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
