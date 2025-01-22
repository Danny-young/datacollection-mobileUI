import { Image, StyleSheet, Platform, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
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
import { Icon } from '@/components/ui/icon';
import { SaveIcon, MapPinIcon } from 'lucide-react-native';




export default function add() {

 console.log(fetchLocations)
  const [formData, setFormData] = useState({
    agentCode:'AG038',
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


    if(isLoading){
      <ActivityIndicator/>
    }


    if(error){
      console.log('message:',error)
    }
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

<View className="">
<Card 
  size="sm" 
  style={{
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16
  }}
>
  <Heading 
    size="md" 
    style={{ 
      color: '#1E293B',
      fontSize: 18,
      fontWeight: '800',
      textAlign: 'center',
      marginBottom: 2
    }}
  >
    DATA COLLECTION
  </Heading>
</Card>

<Card 
  size="sm" 
  style={{
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  }}
>
  <Heading 
    size="md" 
    style={{ 
      color: '#1E293B',
      marginBottom: 20,
      fontSize: 18,
      fontWeight: '700'
    }}
  >
    Personal Information
  </Heading>

  <VStack space="lg">
    <HStack space="md" style={{ alignItems: 'flex-start' }}>
      <VStack style={{ flex: 1, gap: 8 }}>
        <FormControlLabel>
          <FormControlLabelText style={{ color: '#334155', fontSize: 16, fontWeight: '600', marginBottom: 2 }}>
            Surname
          </FormControlLabelText>
        </FormControlLabel>
        <Input
          style={{ 
            borderColor: '#CBD5E1',
            borderWidth: 1,
            borderRadius: 8,
            backgroundColor: '#F8FAFC',
            height: 39
          }}
        >
          <InputField
            value={formData.lastName}
            onChangeText={(text: string) => setFormData(prev => ({...prev, lastName: text}))}
            style={{ fontSize: 16, color: '#334155', paddingLeft: 12 }}
          />
        </Input>      
      </VStack>     
      
      <VStack style={{ flex: 1, gap: 8 }}>
        <FormControlLabel>
          <FormControlLabelText style={{ color: '#334155', fontSize: 16, fontWeight: '600' }}>
            FirstName
          </FormControlLabelText>
        </FormControlLabel>
        <Input
          style={{ 
            borderColor: submitAttempted && errors.firstName ? '#EF4444' : '#CBD5E1',
            borderWidth: 1,
            borderRadius: 8,
            backgroundColor: '#F8FAFC',
            height: 39
          }}
        >
          <InputField
            value={formData.firstName}
            onChangeText={(text: string) => setFormData(prev => ({...prev, firstName: text}))}
            style={{ fontSize: 16, color: '#334155', paddingLeft: 12 }}
          />
        </Input>      
      </VStack> 
    </HStack>    

    <HStack space="md" style={{ alignItems: 'flex-start' }}>
      <VStack style={{ flex: 1, gap: 8 }}>
        <FormControlLabel>
          <FormControlLabelText style={{ color: '#334155', fontSize: 16, fontWeight: '600', marginBottom: 2 }}>
            Phone No.
          </FormControlLabelText>
        </FormControlLabel>
        <Input
          style={{ 
            borderColor: submitAttempted && errors.telephone ? '#EF4444' : '#CBD5E1',
            borderWidth: 1,
            borderRadius: 8,
            backgroundColor: '#F8FAFC',
            height: 40
          }}
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
            style={{ fontSize: 16, color: '#334155', paddingLeft: 12 }}
          />
        </Input>
        {submitAttempted && errors.telephone && (
          <Text style={{ color: '#EF4444', fontSize: 14 }}>{errors.telephone}</Text>
        )}
      </VStack>

      <VStack style={{ flex: 1, gap: 8 }}>
        <FormControlLabel>
          <FormControlLabelText style={{ color: '#334155', fontSize: 16, fontWeight: '600', marginBottom: 2 }}>
            Nationality
          </FormControlLabelText>
        </FormControlLabel>
        <Input
          style={{ 
            borderColor: '#CBD5E1',
            borderWidth: 1,
            borderRadius: 8,
            backgroundColor: '#F1F5F9',
            height: 40
          }}
          isDisabled
        >
          <InputField 
            value={formData.nationality} 
            editable={false}
            style={{ fontSize: 16, color: '#64748B', paddingLeft: 12 }}
          />
        </Input>
      </VStack>
    </HStack>  

    <HStack space="md" style={{ alignItems: 'flex-start' }}>
      <VStack style={{ flex: 1, gap: 8 }}>
        <FormControlLabel>
          <FormControlLabelText style={{ color: '#334155', fontSize: 16, fontWeight: '600', marginBottom: 2 }}>
            ID Type*
          </FormControlLabelText>
        </FormControlLabel>
        <Select
          onValueChange={(value) => {
            setFormData((prev) => ({ ...prev, idType: value }));
          }}
        >
          <SelectTrigger
            style={{ 
              borderColor: submitAttempted && errors.idType ? '#EF4444' : '#CBD5E1',
              borderWidth: 1,
              borderRadius: 8,
              backgroundColor: '#F8FAFC',
              height: 40
            }}
          >
            <SelectInput
              placeholder="Select ID Type"
              value={formData.idType}
              style={{ fontSize: 16, color: '#334155', paddingLeft: 12 }}
            />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectItem label="Ghana Card" value="Ghana Card" />
              <SelectItem label="Passport" value="passport" />
              <SelectItem label="Driver's License" value="Driver's License" />
            </SelectContent>
          </SelectPortal>
        </Select>
        {submitAttempted && errors.idType && (
          <Text style={{ color: '#EF4444', fontSize: 14 }}>{errors.idType}</Text>
        )}
      </VStack>

      <VStack style={{ flex: 1, gap: 8 }}>
        <FormControlLabel>
          <FormControlLabelText style={{ color: '#334155', fontSize: 16, fontWeight: '600', marginBottom: 2 }}>
            ID Number*
          </FormControlLabelText>
        </FormControlLabel>
        <Input
          style={{ 
            borderColor: submitAttempted && errors.idNumber ? '#EF4444' : '#CBD5E1',
            borderWidth: 1,
            borderRadius: 8,
            backgroundColor: '#F8FAFC',
            height: 40
          }}
        >
          <InputField
            placeholder="Enter ID number"
            value={formData.idNumber}
            onChangeText={(value: string) =>
              setFormData((prev) => ({ ...prev, idNumber: value }))
            }
            style={{ fontSize: 16, color: '#334155', paddingLeft: 12 }}
          />
        </Input>
        {submitAttempted && errors.idNumber && (
          <Text style={{ color: '#EF4444', fontSize: 14 }}>{errors.idNumber}</Text>
        )}
      </VStack>
    </HStack>
  </VStack>
</Card>

<Card 
  size="sm" 
  style={{
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 8
  }}
>
  <Heading 
    size="md" 
    style={{ 
      color: '#1E293B',
      marginBottom: 20,
      fontSize: 18,
      fontWeight: '700'
    }}
  >
    Location
  </Heading>

  <VStack space="md">
    <FormControlLabel>
      <FormControlLabelText style={{ color: '#334155', fontSize: 16, fontWeight: '600', marginBottom: 2 }}>
        Electoral Area*
      </FormControlLabelText>
    </FormControlLabel>
    <Select
      selectedValue={formData.electoralArea}
      onValueChange={handleElectoralAreaChange}
    >
      <SelectTrigger 
        style={{ 
          borderColor: '#CBD5E1', 
          borderWidth: 1,
          borderRadius: 8,
          backgroundColor: '#F8FAFC',
          height: 40
        }}
      >
        <SelectInput 
          placeholder="Select Electoral Area"
          style={{ fontSize: 16, color: '#334155', paddingLeft: 12 }}
        />
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent>
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
      <FormControlLabelText style={{ color: '#334155', fontSize: 16, fontWeight: '600', marginBottom: 2 }}>
        Locality*
      </FormControlLabelText>
    </FormControlLabel>
    <Select
      selectedValue={formData.locality}
      onValueChange={(value) => setFormData(prev => ({ ...prev, locality: value }))}
      isDisabled={!formData.electoralArea}
    >
      <SelectTrigger 
        style={{ 
          borderColor: '#CBD5E1', 
          borderWidth: 1,
          borderRadius: 8,
          backgroundColor: !formData.electoralArea ? '#F1F5F9' : '#F8FAFC',
          height: 40
        }}
      >
        <SelectInput 
          placeholder="Select Locality"
          style={{ fontSize: 16, color: '#334155', paddingLeft: 12 }}
        />
        <ChevronDownIcon style={{ marginRight: 12 }} color="#64748B" />
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent>
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

    <VStack space="md">
      <FormControlLabel>
        <FormControlLabelText style={{ color: '#334155', fontSize: 16, fontWeight: '600', marginBottom: 2 }}>
          Geolocation*
        </FormControlLabelText>
      </FormControlLabel>

      <HStack space="md" style={{ alignItems: 'center' }}>
        <Button
          variant="outline"
          size="lg"
          isDisabled={isLocating}
          style={{
            borderColor: '#CBD5E1',
            borderRadius: 8,
            backgroundColor: isLocating ? '#EEF2FF' : '#F8FAFC'
          }}
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
          <FontAwesome5 
            name="map-marker-alt" 
            size={20} 
            color={isLocating ? "#2563EB" : "#64748B"} 
          />
          <ButtonText style={{ color: isLocating ? '#2563EB' : '#64748B', marginLeft: 8 }}>
            {isLocating ? 'Getting location...' : 'Get Location'}
          </ButtonText>
        </Button>

        <Input
          style={{ 
            flex: 1,
            backgroundColor: '#F1F5F9',
            borderColor: '#CBD5E1',
            borderWidth: 1,
            borderRadius: 8,
            height: 40
          }}
          isDisabled
        >
          <InputField
            value={formData.geolocation}
            placeholder="Tap button to get location"
            style={{ color: '#64748B', fontSize: 16, paddingLeft: 12 }}
          />
        </Input>
      </HStack>

      {locationError && (
        <Text style={{ color: '#EF4444', fontSize: 14 }}>{locationError}</Text>
      )}

      {formData.accuracy && (
        <Text
          style={{ 
            color: formData.accuracy <= 4 ? '#10B981' : '#EF4444',
            fontSize: 14
          }}
        >
          Accuracy: {formData.accuracy.toFixed(2)}m
        </Text>
      )}
    </VStack>

    <HStack space="md" style={{ marginTop: 8 }}>
      <VStack style={{ flex: 1 }}>
        <FormControlLabel>
          <FormControlLabelText style={{ color: '#334155', fontSize: 16, fontWeight: '600', marginBottom: 2 }}>
            Street Name*
          </FormControlLabelText>
        </FormControlLabel>
        <Input
          style={{ 
            borderColor: '#CBD5E1',
            borderWidth: 1,
            borderRadius: 8,
            backgroundColor: '#F8FAFC',
            height: 40
          }}
          isInvalid={!!(submitAttempted && errors.streetName)}
        >
          <InputField
            value={formData.streetName}
            onChangeText={(text:string) => setFormData(prev => ({...prev, streetName: text}))}
            style={{ fontSize: 16, color: '#334155', paddingLeft: 12 }}
          />
        </Input>
      </VStack>

      <VStack style={{ flex: 1 }}>
        <FormControlLabel>
          <FormControlLabelText style={{ color: '#334155', fontSize: 16, fontWeight: '600', marginBottom: 2 }}>
            Valuation Number*
          </FormControlLabelText>
        </FormControlLabel>
        <Input
          style={{ 
            borderColor: '#CBD5E1',
            borderWidth: 1,
            borderRadius: 8,
            backgroundColor: '#F8FAFC',
            height: 40
          }}
          isInvalid={!!(submitAttempted && errors.valuationNo)}
        >
          <InputField
            value={formData.valuationNo}
            onChangeText={(text:string) => setFormData(prev => ({...prev, valuationNo: text}))}
            style={{ fontSize: 16, color: '#334155', paddingLeft: 12 }}
          />
        </Input>
      </VStack>
    </HStack>
  </VStack>
</Card>

<Card 
  size="sm" 
  style={{
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 8
  }}
>
  <Heading 
    size="md" 
    style={{ 
      color: '#1E293B',
      marginBottom: 20,
      fontSize: 18,
      fontWeight: '700'
    }}
  >
    Data Information
  </Heading> 
  <HStack space="md" style={{ alignItems: 'flex-start' }}>
    <VStack style={{ flex: 1, gap: 12 }}>
      <FormControlLabel>
        <FormControlLabelText 
          style={{ 
            color: '#334155', 
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 2
          }}
        >
          Data Type*
        </FormControlLabelText>
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
        <SelectTrigger 
          style={{ 
            borderColor: '#CBD5E1', 
            borderWidth: 1,
            borderRadius: 8,
            backgroundColor: '#F8FAFC',
            height: 40
          }}
        >
          <SelectInput 
            placeholder="Select data type"
            style={{ 
              fontSize: 16,
              color: '#334155',
              paddingLeft: 12
            }}
          />
          <ChevronDownIcon style={{ marginRight: 12 }} color="#64748B" />
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

    <VStack style={{ flex: 1, gap: 12 }}>
      <FormControlLabel>
        <FormControlLabelText 
          style={{ 
            color: '#334155', 
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 2
          }}
        >
          Data Particular
        </FormControlLabelText>
      </FormControlLabel>
      {formData.dataType === 'property' ? (
        <Select
          selectedValue={formData.dataParticular}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, dataParticular: value }))
          }
        >
          <SelectTrigger 
            style={{ 
              borderColor: '#CBD5E1', 
              borderWidth: 1,
              borderRadius: 8,
              backgroundColor: '#F8FAFC',
              height: 40
            }}
          >
            <SelectInput 
              placeholder="Select property type"
              style={{ 
                fontSize: 16,
                color: '#334155',
                paddingLeft: 12
              }}
            />
            <ChevronDownIcon style={{ marginRight: 12 }} color="#64748B" />
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
        <Input 
          isDisabled
          style={{ 
            backgroundColor: '#F1F5F9',
            borderRadius: 8,
            height: 40,
            borderColor: '#CBD5E1',
            borderWidth: 1
          }}
        >
          <InputField 
            value="business"
            style={{ 
              color: '#64748B',
              fontSize: 16,
              paddingLeft: 12
            }}
          />
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

<VStack space="md" style={{ marginVertical: 16 }}>
  <TouchableOpacity
    style={{
      backgroundColor: withinRange ? '#2563EB' : '#94A3B8',
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    }}
    onPress={handleSubmit}
    disabled={!withinRange}
    activeOpacity={0.8}
  >
    <HStack space="sm" style={{ alignItems: 'center' }}>
      {withinRange ? (
        <Icon as={SaveIcon} size="md" color="white" />
      ) : (
        <Icon as={MapPinIcon} size="md" color="white" />
      )}
      <Text style={{ 
        color: 'white', 
        fontSize: 16, 
        fontWeight: '600' 
      }}>
        {withinRange ? 'Save Data' : 'Get Location Within 4m Range'}
      </Text>
    </HStack>
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
    marginBottom: 2,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
