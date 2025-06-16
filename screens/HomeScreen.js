import {
  View,
  ScrollView,
  RefreshControl,
  Text,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import tw from "../utils/tw";
import { useRates } from "../hooks/useRates";
import RateDisplay from "../components/RateDisplay";

export default function HomeScreen({ navigation }) {
  const { currentRate, lastUpdated, updateRate, isLoading } = useRates();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Menu options for navigation
  const menuOptions = [
    {
      id: "goldConverters",
      title: "Gold Converters",
      subtitle: "Convert between karats, tola, masha & ratti",
      icon: "calculator",
      color: "#F59E0B",
      screen: "GoldConverters",
      items: [
        "TMR to Grams",
        "Grams to TMR",
        "Money to Grams and TMR",
        "Grams/TMR to Money",
        "Waist Calculator",
        "Purity Calculator",
        "Impurity Calculator",
      ],
    },
    {
      id: "saleSlipGenerator",
      title: "Gold Sale Slip Generator",
      subtitle: "Generate printable sales slips for records",
      icon: "receipt",
      color: "#10B981",
      screen: "SaleSlipGenerator",
      items: ["Gold Details", "Print Slip"],
    },
    {
      id: "goldCalculations",
      title: "Gold Calculator",
      subtitle: "Calculate total weight & value of gold pieces",
      icon: "calculator",
      color: "#10B2F4",
      screen: "GoldCalculations",
      items: ["Weight Calculator", "Value Calculator", "Price Calculator"],
    },
    // {
    //   id: "recordRoom",
    //   title: "Record Room",
    //   subtitle: "Manage customer records & transaction logs",
    //   icon: "folder-multiple",
    //   color: "#8B5CF6",
    //   screen: "RecordRoom",
    //   items: ["Customer Records", "Transaction Logs", "Custom Notes"],
    // },
    {
      id: "goldKaratInfo",
      title: "Gold Karat Info",
      subtitle: "Detailed guide on purity levels 24K to 9K",
      icon: "diamond-stone",
      color: "#F97316",
      screen: "GoldKaratInfo",
      items: [
        "Purity Guide",
        "Price Table",
        "Market Relevance",
        "Identification Tips",
      ],
    },
    {
      id: "conversionTable",
      title: "Tola-Masha-Ratti Table",
      subtitle: "Complete reference table 1 to 96 Ratti",
      icon: "table",
      color: "#06B6D4",
      screen: "ConversionTable",
      items: ["Weight Conversion", "Traditional Units", "Milligram Reference"],
    },
  ];

  const handleMenuPress = (option) => {
    // Navigate to the respective screen
    navigation.navigate(option.screen, {
      title: option.title,
      currentRate: currentRate,
    });
  };

  const MenuCard = ({ option }) => (
    <TouchableOpacity
      style={[
        tw`bg-white rounded-2xl p-4 mb-4 border border-gray-100`,
        {
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3,
        },
      ]}
      onPress={() => handleMenuPress(option)}
      activeOpacity={0.7}
    >
      <View style={tw`flex-row items-start`}>
        {/* Icon */}
        <View
          style={[
            tw`p-3 rounded-full mr-4`,
            { backgroundColor: `${option.color}20` },
          ]}
        >
          <MaterialCommunityIcons
            name={option.icon}
            size={24}
            color={option.color}
          />
        </View>

        {/* Content */}
        <View style={tw`flex-1`}>
          <Text style={tw`text-lg font-bold text-gray-800 mb-1`}>
            {option.title}
          </Text>
          <Text style={tw`text-sm text-gray-600 mb-3`}>{option.subtitle}</Text>

          {/* Feature items */}
          <View style={tw`flex-row flex-wrap`}>
            {option.items.map((item, index) => (
              <View
                key={index}
                style={[
                  tw`px-2 py-1 rounded-full mr-2 mb-1`,
                  { backgroundColor: `${option.color}10` },
                ]}
              >
                <Text
                  style={[tw`text-xs font-medium`, { color: option.color }]}
                >
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Arrow */}
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color="#9CA3AF"
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-yellow-50 `}>
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`p-4 pb-8`}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#F59E0B"]}
            tintColor="#F59E0B"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Rate Display */}
        <RateDisplay
          currentRate={currentRate}
          lastUpdated={lastUpdated}
          onUpdateRate={updateRate}
        />

        {/* Welcome Section */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-2xl font-bold text-gray-800 mb-2`}>
            Welcome to AurumLog
          </Text>
          <Text style={tw`text-gray-600 text-base leading-6`}>
            Your offline jeweler's assistant. Select any tool below to get
            started with your gold business operations.
          </Text>
        </View>

        {/* Menu Options */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>
            Choose Your Tool
          </Text>

          {menuOptions.map((option) => (
            <MenuCard key={option.id} option={option} />
          ))}
        </View>

        {/* Quick Reference Footer */}
        <View
          style={tw`bg-white rounded-2xl p-4 border border-gray-100 shadow-sm`}
        >
          <View style={tw`flex-row items-center mb-3`}>
            <MaterialCommunityIcons
              name="information-outline"
              size={20}
              color="#6B7280"
            />
            <Text style={tw`text-gray-700 font-semibold ml-2`}>
              Quick Reference
            </Text>
          </View>

          <View style={tw`space-y-2`}>
            <View style={tw`flex-row justify-between py-1`}>
              <Text style={tw`text-gray-600 text-sm`}>1 Tola</Text>
              <Text style={tw`text-gray-800 text-sm font-medium`}>
                11,664 mg (11.664g)
              </Text>
            </View>
            <View style={tw`flex-row justify-between py-1`}>
              <Text style={tw`text-gray-600 text-sm`}>1 Masha</Text>
              <Text style={tw`text-gray-800 text-sm font-medium`}>
                972 mg (0.972g)
              </Text>
            </View>
            <View style={tw`flex-row justify-between py-1`}>
              <Text style={tw`text-gray-600 text-sm`}>1 Ratti</Text>
              <Text style={tw`text-gray-800 text-sm font-medium`}>
                121.5 mg (0.1215g)
              </Text>
            </View>
            <View style={tw`h-px bg-gray-200 my-2`} />
            <View style={tw`flex-row justify-between py-1`}>
              <Text style={tw`text-gray-600 text-sm`}>24 Karat</Text>
              <Text style={tw`text-gray-800 text-sm font-medium`}>
                100% Pure Gold
              </Text>
            </View>
            <View style={tw`flex-row justify-between py-1`}>
              <Text style={tw`text-gray-600 text-sm`}>22 Karat</Text>
              <Text style={tw`text-gray-800 text-sm font-medium`}>
                91.67% Pure Gold
              </Text>
            </View>
            <View style={tw`flex-row justify-between py-1`}>
              <Text style={tw`text-gray-600 text-sm`}>18 Karat</Text>
              <Text style={tw`text-gray-800 text-sm font-medium`}>
                75% Pure Gold
              </Text>
            </View>
          </View>
        </View>

        {/* App Info */}
        <View style={tw`mt-4 items-center`}>
          <Text style={tw`text-xs text-gray-500 text-center`}>
            AurumLog v1.0 • Offline Jeweler's Assistant
          </Text>
          <Text style={tw`text-xs text-gray-400 text-center mt-1`}>
            Built for professional jewelers and goldsmiths
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
