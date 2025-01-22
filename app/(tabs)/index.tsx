import React, { useEffect, useState } from 'react'
import { Text, View, ScrollView, Dimensions } from 'react-native'
import { BarChart, PieChart } from "react-native-gifted-charts";
import { listAgents } from "@/api/agents"
import { MetricCard } from "@/components/ui/MetricCard"
import {  } from "@/components/ui/icon"
import { Card } from "@/components/ui/card"
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonText } from '@/components/ui/button';
import { DollarSignIcon} from 'lucide-react-native';
import { Heading } from '@/components/ui/heading';

export default function HomeScreen() {
  const [timeFilter, setTimeFilter] = useState('week');
  const screenWidth = Dimensions.get('window').width;

  // useEffect(() => {
  //   listAgents();
  // }
  // , []);

   const barData = [
    {value: 250, label: 'M'},
    {value: 500, label: 'T', frontColor: '#177AD5'},
    {value: 745, label: 'W', frontColor: '#177AD5'},
    {value: 320, label: 'T'},
    {value: 600, label: 'F', frontColor: '#177AD5'},
    {value: 256, label: 'S'},
    {value: 300, label: 'S'},
];

const pieData = [
  {value: 54, color: '#177AD5', text: '54%'},
  {value: 30, color: '#79D2DE', text: '30%'},
  {value: 26, color: '#ED6665', text: '26%'},
  ];


  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <VStack style={{ padding: 16 }}>
        {/* Header */}
        <HStack 
          style={{ 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: 16 
          }}
        >
          <Heading 
            size="xl" 
            style={{ 
              color: '#1E293B',
              fontSize: 24,
              fontWeight: '700'
            }}
          >
            Dashboard
          </Heading>
          <HStack space="sm">
            {['week', 'month', 'year'].map((filter) => (
              <Button
                key={filter}
                size="sm"
                variant={timeFilter === filter ? 'solid' : 'outline'}
                style={{
                  backgroundColor: timeFilter === filter ? '#2563EB' : 'transparent',
                  borderColor: '#CBD5E1',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 6
                }}
                onPress={() => setTimeFilter(filter)}
              >
                <ButtonText 
                  style={{ 
                    color: timeFilter === filter ? 'white' : '#64748B',
                    fontSize: 14,
                    fontWeight: '600'
                  }}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </ButtonText>
              </Button>
            ))}
          </HStack>
        </HStack>

        {/* Metric Cards */}
        <HStack style={{ flexWrap: 'wrap', gap: 12 }}>
          <MetricCard
            title="Total Collections"
            value={2500}
            change={12.5}
            icon={<DollarSignIcon size={24} color="#2563EB" />}
          />
          {/* ... other MetricCards ... */}
        </HStack>

        {/* Charts */}
        <HStack style={{ flexWrap: 'wrap', marginTop: 16 }}>
          <Card 
            style={{
              width: '100%',
              marginBottom: 16,
              backgroundColor: 'white',
              borderRadius: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3
            }}
          >
            <Card style={{ padding: 16 }}>
              <Heading 
                size="md"
                style={{ 
                  color: '#1E293B',
                  fontSize: 18,
                  fontWeight: '600'
                }}
              >
                Daily Collections
              </Heading>
            </Card>
            <Card style={{ padding: 16 }}>
              <BarChart
                barWidth={22}
                noOfSections={3}
                barBorderRadius={4}
                frontColor="#2563EB"
                data={barData}
                yAxisThickness={0}
                xAxisThickness={0}
                height={200}
                width={screenWidth - 64}
              />
            </Card>
          </Card>

          <Card 
            style={{
              width: '100%',
              backgroundColor: 'white',
              borderRadius: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3
            }}
          >
            <Card style={{ padding: 16 }}>
              <Heading 
                size="md"
                style={{ 
                  color: '#1E293B',
                  fontSize: 18,
                  fontWeight: '600'
                }}
              >
                Collection Status
              </Heading>
            </Card>
            <Card style={{ padding: 16, alignItems: 'center' }}>
              <PieChart
                donut
                showText
                textColor="black"
                innerRadius={70}
                showTextBackground
                textBackgroundColor="white"
                textBackgroundRadius={22}
                data={pieData}
                centerLabelComponent={() => (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E293B' }}>
                      78%
                    </Text>
                    <Text style={{ fontSize: 14, color: '#64748B' }}>
                      Success Rate
                    </Text>
                  </View>
                )}
              />
              <HStack 
                style={{ 
                  justifyContent: 'space-around', 
                  width: '100%', 
                  marginTop: 16 
                }}
              >
                {pieData.map((item, index) => (
                  <HStack key={index} style={{ alignItems: 'center' }}>
                    <View 
                      style={{ 
                        backgroundColor: item.color,
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        marginRight: 8
                      }}
                    />
                    <Text style={{ color: '#1E293B', fontSize: 14 }}>
                      {item.text}
                    </Text>
                  </HStack>
                ))}
              </HStack>
            </Card>
          </Card>
        </HStack>
      </VStack>
    </ScrollView>
  );
}