import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import tw from "../utils/tw";
import { useRates } from "../hooks/useRates";

const MoneyToGoldScreen = ({ navigation }) => {
  const { currentRate, lastUpdated, updateRate } = useRates();
  const [moneyAmount, setMoneyAmount] = useState("");
  const [results, setResults] = useState({
    grams: 0,
    tola: 0,
    masha: 0,
    ratti: 0,
  });

  // Ref for input field
  const moneyInputRef = useRef(null);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format weight with proper decimal places
  const formatWeight = (weight, decimals = 4) => {
    if (weight === 0) return "0." + "0".repeat(decimals);
    return weight.toFixed(decimals);
  };

  // Format last updated time
  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return "Never updated";
    const now = new Date();
    const updated = new Date(timestamp);
    const diffInMinutes = Math.floor((now - updated) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Input validation for money amount
  const handleMoneyAmountChange = (text) => {
    // Allow only numbers and decimal point
    const numericValue = text.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    if (parts.length <= 2) {
      let formattedValue = numericValue;
      // Limit decimal places to 2 for currency
      if (parts[1] && parts[1].length > 2) {
        formattedValue = parts[0] + "." + parts[1].substring(0, 2);
      }
      setMoneyAmount(formattedValue);
    }
  };

  // Convert grams to TMR (Tola, Masha, Ratti)
  const convertGramsToTMR = (grams) => {
    // 1 Tola = 11.664 grams
    // 1 Masha = 0.972 grams (11.664/12)
    // 1 Ratti = 0.121 grams (0.972/8)

    const totalRattis = grams / 0.121;

    const tola = Math.floor(totalRattis / 96); // 96 rattis = 1 tola
    const remainingAfterTola = totalRattis % 96;

    const masha = Math.floor(remainingAfterTola / 8); // 8 rattis = 1 masha
    const ratti = remainingAfterTola % 8;

    return {
      tola: tola,
      masha: masha,
      ratti: ratti,
    };
  };

  const calculateGoldQuantity = useCallback(() => {
    const money = parseFloat(moneyAmount) || 0;

    if (money === 0 || currentRate === 0) {
      setResults({
        grams: 0,
        tola: 0,
        masha: 0,
        ratti: 0,
      });
      return;
    }

    // Calculate grams from money
    // Money / (Rate per tola / 11.664) = grams
    const grams = (money * 11.664) / currentRate;

    // Convert grams to TMR
    const tmr = convertGramsToTMR(grams);

    setResults({
      grams: grams,
      tola: tmr.tola,
      masha: tmr.masha,
      ratti: tmr.ratti,
    });
  }, [moneyAmount, currentRate]);

  const clearAll = () => {
    setMoneyAmount("");
    setResults({
      grams: 0,
      tola: 0,
      masha: 0,
      ratti: 0,
    });
  };

  const showCalculationInfo = () => {
    Alert.alert(
      "Money to Gold Calculator",
      "This calculator converts money amount to gold quantity.\n\nFormula:\nGrams = (Money × 11.664) ÷ Gold Rate per Tola\n\nConversion:\n• 1 Tola = 11.664 grams = 96 ratti\n• 1 Masha = 0.972 grams = 8 ratti\n• 1 Ratti = 0.121 grams\n\nThe result shows both grams and traditional TMR (Tola, Masha, Ratti) format.",
      [{ text: "OK" }]
    );
  };

  const isCalculationReady = () => {
    return parseFloat(moneyAmount) > 0 && currentRate > 0;
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      {/* Header */}
      <View
        style={tw`flex-row items-center justify-between px-4 py-3 bg-white shadow-sm`}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2`}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#374151" />
        </TouchableOpacity>

        <View style={tw`flex-1 items-center`}>
          <Text style={tw`text-lg font-semibold text-gray-900`}>
            Money to Gold
          </Text>
        </View>

        <TouchableOpacity onPress={showCalculationInfo} style={tw`p-2`}>
          <MaterialCommunityIcons
            name="information"
            size={24}
            color="#F59E0B"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`p-4`}
        keyboardShouldPersistTaps="handled"
      >
        {/* Main Calculator Card */}
        <View style={tw`bg-white rounded-2xl shadow-lg mb-6 overflow-hidden`}>
          {/* Header Section with Rate */}
          <View style={[tw`p-6 pb-4`, { backgroundColor: "#FEF3C7" }]}>
            <View style={tw`flex-row items-center justify-between mb-4`}>
              <View style={tw`flex-row items-center flex-1`}>
                <View
                  style={[
                    tw`w-12 h-12 rounded-full items-center justify-center mr-3`,
                    { backgroundColor: "#F59E0B" },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="gold"
                    size={24}
                    color="#FFFFFF"
                  />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={[tw`text-xl font-bold`, { color: "#78350F" }]}>
                    Money to Gold
                  </Text>
                  <Text style={[tw`text-sm`, { color: "#92400E" }]}>
                    Convert PKR to Gold Weight
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={updateRate}
                style={[
                  tw`px-3 py-2 rounded-lg flex-row items-center`,
                  { backgroundColor: "#F59E0B" },
                ]}
              >
                <MaterialCommunityIcons
                  name="refresh"
                  size={16}
                  color="#FFFFFF"
                  style={tw`mr-1`}
                />
                <Text style={tw`text-white text-xs font-medium`}>Update</Text>
              </TouchableOpacity>
            </View>

            {/* Current Rate Display */}
            <View
              style={[
                tw`bg-white rounded-xl p-4 border-2`,
                { borderColor: "#FDE68A" },
              ]}
            >
              <View style={tw`flex-row items-center justify-between mb-2`}>
                <Text style={[tw`text-sm font-medium`, { color: "#92400E" }]}>
                  Current Gold Rate
                </Text>
                <View style={tw`flex-row items-center`}>
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={14}
                    color="#92400E"
                    style={tw`mr-1`}
                  />
                  <Text style={[tw`text-xs`, { color: "#92400E" }]}>
                    {formatLastUpdated(lastUpdated)}
                  </Text>
                </View>
              </View>
              <Text style={[tw`text-2xl font-bold`, { color: "#78350F" }]}>
                {formatCurrency(currentRate)} / Tola
              </Text>
              <Text style={[tw`text-sm mt-1`, { color: "#92400E" }]}>
                {formatCurrency(Math.round(currentRate / 11.664))} per gram
              </Text>
            </View>
          </View>

          {/* Input Section */}
          <View style={tw`p-6 pt-4`}>
            {/* Money Amount Input */}
            <View style={tw`mb-6`}>
              <Text style={tw`text-base font-semibold text-gray-700 mb-3`}>
                Enter Money Amount
              </Text>

              <View style={tw`relative`}>
                <TextInput
                  ref={moneyInputRef}
                  value={moneyAmount}
                  onChangeText={handleMoneyAmountChange}
                  placeholder="0.00"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="decimal-pad"
                  style={[
                    tw`border-2 rounded-xl px-4 py-4 text-gray-900 text-xl font-semibold pr-16`,
                    {
                      backgroundColor: "#F9FAFB",
                      borderColor: isCalculationReady() ? "#F59E0B" : "#E5E7EB",
                    },
                  ]}
                  returnKeyType="done"
                  onSubmitEditing={dismissKeyboard}
                />
                <View
                  style={[
                    tw`absolute right-4 top-4 px-2 py-1 rounded`,
                    { backgroundColor: "#F59E0B" },
                  ]}
                >
                  <Text style={tw`text-white text-sm font-bold`}>PKR</Text>
                </View>
              </View>
            </View>

            {/* Formula Display */}
            <View
              style={[
                tw`border rounded-lg p-3 mb-6`,
                { backgroundColor: "#F0F9FF", borderColor: "#BFDBFE" },
              ]}
            >
              <Text
                style={[tw`font-medium text-xs mb-1`, { color: "#1E40AF" }]}
              >
                FORMULA
              </Text>
              <Text style={[tw`font-mono text-sm`, { color: "#1E3A8A" }]}>
                Gold (g) = (Amount × 11.664) ÷ Rate/Tola
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={tw`flex-row gap-3 mb-6`}>
              <TouchableOpacity
                onPress={() => {
                  dismissKeyboard();
                  calculateGoldQuantity();
                }}
                style={[
                  tw`flex-1 rounded-xl py-4 items-center justify-center flex-row`,
                  {
                    backgroundColor: isCalculationReady()
                      ? "#F59E0B"
                      : "#D1D5DB",
                  },
                ]}
                disabled={!isCalculationReady()}
              >
                <MaterialCommunityIcons
                  name="calculator"
                  size={20}
                  color={isCalculationReady() ? "#FFFFFF" : "#6B7280"}
                  style={tw`mr-2`}
                />
                <Text
                  style={tw`${
                    isCalculationReady() ? "text-white" : "text-gray-500"
                  } font-semibold text-base`}
                >
                  Calculate
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={clearAll}
                style={tw`px-6 bg-gray-200 rounded-xl py-4 items-center justify-center`}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            {/* Results Display */}
            {results.grams > 0 && (
              <View style={tw`space-y-4`}>
                {/* Main Result - Grams */}
                <View
                  style={[
                    tw`border-2 rounded-xl p-4 text-center`,
                    { backgroundColor: "#ECFDF5", borderColor: "#10B981" },
                  ]}
                >
                  <Text
                    style={[tw`font-medium text-sm mb-1`, { color: "#065F46" }]}
                  >
                    Gold Weight
                  </Text>
                  <Text style={[tw`font-bold text-3xl`, { color: "#047857" }]}>
                    {formatWeight(results.grams)} g
                  </Text>
                </View>

                {/* TMR Format Result */}
                <View
                  style={[
                    tw`border rounded-xl p-4`,
                    { backgroundColor: "#FEF3C7", borderColor: "#FDE68A" },
                  ]}
                >
                  <Text
                    style={[
                      tw`font-medium text-sm mb-3 text-center`,
                      { color: "#92400E" },
                    ]}
                  >
                    Traditional Format (TMR)
                  </Text>

                  <View style={tw`flex-row justify-between`}>
                    <View style={tw`flex-1 items-center`}>
                      <Text
                        style={[tw`text-2xl font-bold`, { color: "#78350F" }]}
                      >
                        {results.tola}
                      </Text>
                      <Text
                        style={[
                          tw`text-xs font-medium mt-1`,
                          { color: "#92400E" },
                        ]}
                      >
                        TOLA
                      </Text>
                    </View>
                    <View style={tw`flex-1 items-center`}>
                      <Text
                        style={[tw`text-2xl font-bold`, { color: "#78350F" }]}
                      >
                        {results.masha}
                      </Text>
                      <Text
                        style={[
                          tw`text-xs font-medium mt-1`,
                          { color: "#92400E" },
                        ]}
                      >
                        MASHA
                      </Text>
                    </View>
                    <View style={tw`flex-1 items-center`}>
                      <Text
                        style={[tw`text-2xl font-bold`, { color: "#78350F" }]}
                      >
                        {formatWeight(results.ratti, 2)}
                      </Text>
                      <Text
                        style={[
                          tw`text-xs font-medium mt-1`,
                          { color: "#92400E" },
                        ]}
                      >
                        RATTI
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Calculation Breakdown */}
        {results.grams > 0 && (
          <View style={tw`bg-white rounded-2xl p-6 shadow-sm mb-6`}>
            <View style={tw`flex-row items-center mb-4`}>
              <MaterialCommunityIcons
                name="chart-line"
                size={20}
                color="#6366F1"
                style={tw`mr-2`}
              />
              <Text style={tw`text-lg font-bold text-gray-900`}>
                Calculation Details
              </Text>
            </View>

            <View style={tw`space-y-3`}>
              <View style={tw`flex-row justify-between items-center py-2`}>
                <Text style={tw`text-gray-600`}>Money Amount</Text>
                <Text style={tw`text-gray-900 font-semibold`}>
                  {formatCurrency(parseFloat(moneyAmount) || 0)}
                </Text>
              </View>
              <View style={tw`flex-row justify-between items-center py-2`}>
                <Text style={tw`text-gray-600`}>Rate per Tola</Text>
                <Text style={tw`text-gray-900 font-semibold`}>
                  {formatCurrency(currentRate)}
                </Text>
              </View>
              <View style={tw`flex-row justify-between items-center py-2`}>
                <Text style={tw`text-gray-600`}>Rate per Gram</Text>
                <Text style={tw`text-gray-900 font-semibold`}>
                  {formatCurrency(Math.round(currentRate / 11.664))}
                </Text>
              </View>
              <View
                style={[
                  tw`flex-row justify-between items-center py-3 px-3 rounded-lg`,
                  { backgroundColor: "#ECFDF5" },
                ]}
              >
                <Text style={[tw`font-semibold`, { color: "#065F46" }]}>
                  Gold Quantity
                </Text>
                <Text style={[tw`font-bold text-lg`, { color: "#047857" }]}>
                  {formatWeight(results.grams)} g
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Info Card */}
        <View
          style={[
            tw`border rounded-xl p-4`,
            { backgroundColor: "#EFF6FF", borderColor: "#BFDBFE" },
          ]}
        >
          <View style={tw`flex-row items-start`}>
            <MaterialCommunityIcons
              name="lightbulb-on"
              size={20}
              color="#3B82F6"
              style={tw`mr-3 mt-0.5`}
            />
            <View style={tw`flex-1`}>
              <Text
                style={[tw`font-semibold text-sm mb-2`, { color: "#1E40AF" }]}
              >
                Quick Guide
              </Text>
              <Text style={[tw`text-sm leading-5`, { color: "#1E3A8A" }]}>
                • Enter your budget amount in PKR{"\n"}• Tap Calculate to see
                gold quantity{"\n"}• Results show both grams and TMR format
                {"\n"}• Use Update button to refresh current rates
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MoneyToGoldScreen;
