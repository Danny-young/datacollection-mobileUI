import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { BarChart, PieChart } from "react-native-gifted-charts";
import { listAgents } from "@/api/agents"




export default function HomeScreen() {


  useEffect(() => {
    listAgents();
  }
  , []);

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



<View>
<Text>
add collection
</Text>
<BarChart
            barWidth={22}
            noOfSections={3}
            barBorderRadius={4}
            frontColor="lightgray"
            data={barData}
            yAxisThickness={0}
            xAxisThickness={0}
        />

<PieChart
    donut
    showText
    textColor="black"
    innerRadius={70}
    showTextBackground
    textBackgroundColor="white"
    textBackgroundRadius={22}
    data={pieData}
    />
</View>
     
  );
}