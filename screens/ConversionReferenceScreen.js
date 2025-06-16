import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import tw from "../utils/tw";

const ConversionReferenceScreen = ({ navigation }) => {
  const conversionData = [
    {
      category: "Weight Conversions",
      icon: "scale-balance",
      color: "#10B981",
      conversions: [
        {
          from: "1 Tola",
          to: "11.664 grams",
          note: "Standard Pakistani/Indian tola",
        },
        { from: "1 Masha", to: "0.972 grams", note: "1/12 of a tola" },
        { from: "1 Ratti", to: "0.121 grams", note: "1/8 of a masha" },
        { from: "1 Tola", to: "12 Masha", note: "Traditional subdivision" },
        { from: "1 Masha", to: "8 Ratti", note: "Traditional subdivision" },
        { from: "1 Tola", to: "96 Ratti", note: "12 × 8 = 96" },
      ],
    },
    {
      category: "Gold Purity Standards",
      icon: "diamond-stone",
      color: "#F59E0B",
      conversions: [
        { from: "24 Karat", to: "99.9% Pure", note: "Pure gold standard" },
        { from: "22 Karat", to: "91.7% Pure", note: "Common jewelry gold" },
        { from: "21 Karat", to: "87.5% Pure", note: "High purity jewelry" },
        { from: "20 Karat", to: "83.3% Pure", note: "Medium purity" },
        { from: "18 Karat", to: "75.0% Pure", note: "Standard jewelry gold" },
        { from: "14 Karat", to: "58.3% Pure", note: "Lower purity jewelry" },
      ],
    },
    {
      category: "Common Calculations",
      icon: "calculator-variant",
      color: "#3B82F6",
      conversions: [
        {
          from: "Pure Gold Content",
          to: "(Weight × Karat) ÷ 24",
          note: "Formula for pure gold",
        },
        {
          from: "Impurity Weight",
          to: "Total Weight - Pure Gold",
          note: "Calculate impurities",
        },
        {
          from: "Gold Value",
          to: "Pure Gold × Rate per gram",
          note: "Market value calculation",
        },
        {
          from: "Waist Percentage",
          to: "(Waist Weight ÷ Total) × 100",
          note: "Waist calculation",
        },
      ],
    },
    {
      category: "Quick Reference",
      icon: "information-outline",
      color: "#6B7280",
      conversions: [
        { from: "1 Gram", to: "0.0857 Tola", note: "Reverse conversion" },
        { from: "10 Grams", to: "0.857 Tola", note: "Common weight" },
        { from: "100 Grams", to: "8.57 Tola", note: "Larger quantity" },
        { from: "1 Kg", to: "85.7 Tola", note: "Bulk conversion" },
      ],
    },
  ];

  const renderConversionCard = (item) => (
    <View key={item.category} style={tw`mb-6 bg-white rounded-xl shadow-sm`}>
      {/* Header */}
      <View
        style={[
          tw`p-4 rounded-t-xl flex-row items-center`,
          { backgroundColor: item.color + "15" },
        ]}
      >
        <View
          style={[
            tw`w-10 h-10 rounded-full items-center justify-center mr-3`,
            { backgroundColor: item.color },
          ]}
        >
          <MaterialCommunityIcons name={item.icon} size={20} color="white" />
        </View>
        <Text style={tw`text-lg font-bold text-gray-800`}>{item.category}</Text>
      </View>

      {/* Conversions */}
      <View style={tw`p-4`}>
        {item.conversions.map((conversion, index) => (
          <View
            key={index}
            style={tw`${index !== item.conversions.length - 1 ? "mb-4" : ""}`}
          >
            <View style={tw`flex-row items-center justify-between mb-1`}>
              <Text style={tw`text-base font-semibold text-gray-800`}>
                {conversion.from}
              </Text>
              <MaterialCommunityIcons
                name="arrow-right"
                size={16}
                color="#6B7280"
              />
              <Text style={tw`text-base font-semibold text-gray-800`}>
                {conversion.to}
              </Text>
            </View>
            <Text style={tw`text-sm text-gray-600 text-center`}>
              {conversion.note}
            </Text>
            {index !== item.conversions.length - 1 && (
              <View style={tw`mt-3 h-px bg-gray-200`} />
            )}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Header */}
      <View style={tw`bg-white px-4 py-3 border-b border-gray-200`}>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`mr-3 p-2 -ml-2`}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="#374151"
            />
          </TouchableOpacity>
          <View style={tw`flex-1`}>
            <Text style={tw`text-xl font-bold text-gray-800`}>
              Conversion Reference
            </Text>
            <Text style={tw`text-sm text-gray-600`}>
              Quick reference for conversion rates
            </Text>
          </View>
          <MaterialCommunityIcons
            name="information-outline"
            size={24}
            color="#6B7280"
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`p-4 pb-8`}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Card */}
        <View style={tw`bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6`}>
          <View style={tw`flex-row items-center mb-2`}>
            <MaterialCommunityIcons
              name="lightbulb-outline"
              size={20}
              color="#3B82F6"
            />
            <Text style={tw`text-base font-semibold text-blue-800 ml-2`}>
              How to Use
            </Text>
          </View>
          <Text style={tw`text-sm text-blue-700 leading-5`}>
            Use these reference values for quick conversions. All rates are
            based on standard measurements used in Pakistan and India for gold
            trading.
          </Text>
        </View>

        {/* Conversion Cards */}
        {conversionData.map(renderConversionCard)}

        {/* Footer Note */}
        <View
          style={tw`bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-2`}
        >
          <View style={tw`flex-row items-center mb-2`}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={18}
              color="#F59E0B"
            />
            <Text style={tw`text-sm font-semibold text-yellow-800 ml-2`}>
              Important Note
            </Text>
          </View>
          <Text style={tw`text-xs text-yellow-700 leading-4`}>
            Gold rates fluctuate daily based on market conditions. Always verify
            current rates with your local dealer before making transactions.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ConversionReferenceScreen;
