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
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";

// Constants for conversion
const TOLA_TO_GRAMS = 11.6638;
const MASHA_TO_GRAMS = 0.972;
const RATTI_TO_GRAMS = 0.1215;

const GramsToTMRScreen = ({ navigation }) => {
  const [gramsToTmr, setGramsToTmr] = useState({
    grams: "",
    result: {
      tola: 0,
      masha: 0,
      ratti: 0,
    },
  });

  // Ref for input field
  const gramsRef = useRef(null);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Format numbers with proper decimal places
  const formatNumber = (num, decimals = 2) => {
    if (num === 0) return "0";
    return num.toFixed(decimals);
  };

  // Input validation for grams
  const handleGramsChange = (text) => {
    // Allow decimal values (positive numbers only)
    const numericValue = text.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    if (parts.length <= 2) {
      let formattedValue = numericValue;
      // Limit decimal places to 4
      if (parts[1] && parts[1].length > 4) {
        formattedValue = parts[0] + "." + parts[1].substring(0, 4);
      }
      setGramsToTmr((prev) => ({ ...prev, grams: formattedValue }));
    }
  };

  const calculateGramsToTmr = useCallback(() => {
    const grams = parseFloat(gramsToTmr.grams) || 0;

    if (grams === 0) {
      setGramsToTmr((prev) => ({
        ...prev,
        result: { tola: 0, masha: 0, ratti: 0 },
      }));
      return;
    }

    // Convert grams to TMR
    let remainingGrams = grams;

    // Calculate Tola (whole number)
    const tola = Math.floor(remainingGrams / TOLA_TO_GRAMS);
    remainingGrams = remainingGrams % TOLA_TO_GRAMS;

    // Calculate Masha (whole number, max 11)
    const masha = Math.floor(remainingGrams / MASHA_TO_GRAMS);
    remainingGrams = remainingGrams % MASHA_TO_GRAMS;

    // Calculate Ratti (can be decimal, max 7.99)
    const ratti = remainingGrams / RATTI_TO_GRAMS;

    setGramsToTmr((prev) => ({
      ...prev,
      result: {
        tola: tola,
        masha: masha,
        ratti: Math.min(ratti, 7.99), // Ensure ratti doesn't exceed 7.99
      },
    }));
  }, [gramsToTmr.grams]);

  const clearAll = () => {
    setGramsToTmr({
      grams: "",
      result: {
        tola: 0,
        masha: 0,
        ratti: 0,
      },
    });
  };

  const showConversionInfo = () => {
    Alert.alert(
      "Conversion Rates",
      `1 Tola = ${TOLA_TO_GRAMS} grams\n1 Masha = ${MASHA_TO_GRAMS} grams\n1 Ratti = ${RATTI_TO_GRAMS} grams\n\nThis converter breaks down grams into the traditional TMR format:\n• Tola (largest unit)\n• Masha (0-11 per Tola)\n• Ratti (0-7.99 per Masha)`,
      [{ text: "OK" }]
    );
  };

  // Calculate total for verification
  const getTotalGrams = () => {
    const { tola, masha, ratti } = gramsToTmr.result;
    return (
      tola * TOLA_TO_GRAMS + masha * MASHA_TO_GRAMS + ratti * RATTI_TO_GRAMS
    );
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      {/* Header */}
      <View
        style={tw`flex-row items-center justify-between px-4 py-3 bg-white shadow-sm`}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2`}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>

        <View style={tw`flex-1 items-center`}>
          <Text style={tw`text-lg font-semibold text-gray-900`}>
            Grams to TMR
          </Text>
        </View>

        <TouchableOpacity onPress={showConversionInfo} style={tw`p-2`}>
          <Ionicons name="information-circle" size={24} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`p-4`}
        keyboardShouldPersistTaps="handled"
      >
        {/* Main Converter Card */}
        <View style={tw`bg-white rounded-2xl p-6 shadow-sm mb-6`}>
          <View style={tw`flex-row items-center mb-6`}>
            <View
              style={tw`w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-3`}
            >
              <Ionicons name="fitness" size={24} color="#8B5CF6" />
            </View>
            <View>
              <Text style={tw`text-xl font-bold text-gray-900`}>
                Grams to TMR Converter
              </Text>
              <Text style={tw`text-sm text-gray-600 mt-1`}>
                Convert grams to traditional units
              </Text>
            </View>
          </View>

          {/* Input Field */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-base font-semibold text-gray-700 mb-4`}>
              Enter Weight in Grams
            </Text>

            <View style={tw`relative`}>
              <TextInput
                ref={gramsRef}
                value={gramsToTmr.grams}
                onChangeText={handleGramsChange}
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
                style={tw`bg-gray-50 border border-gray-200 rounded-lg px-4 py-4 text-gray-900 text-lg pr-12`}
                returnKeyType="done"
                onSubmitEditing={dismissKeyboard}
              />
              <Text
                style={tw`absolute right-4 top-4 text-gray-500 text-base font-medium`}
              >
                g
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={tw`flex-row gap-3 mb-6`}>
            <TouchableOpacity
              onPress={() => {
                dismissKeyboard();
                calculateGramsToTmr();
              }}
              style={tw`flex-1 bg-purple-500 rounded-lg py-4 items-center justify-center`}
            >
              <Text style={tw`text-white font-semibold text-base`}>
                Convert
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={clearAll}
              style={tw`px-6 bg-gray-200 rounded-lg py-4 items-center justify-center`}
            >
              <Text style={tw`text-gray-700 font-medium text-base`}>Clear</Text>
            </TouchableOpacity>
          </View>

          {/* Results Section */}
          <View>
            <Text style={tw`text-base font-semibold text-gray-700 mb-4`}>
              TMR Breakdown
            </Text>

            {/* Table Format Results */}
            <View
              style={tw`bg-purple-50 border border-purple-200 rounded-lg overflow-hidden`}
            >
              {/* Header Row */}
              <View style={tw`flex-row bg-purple-100`}>
                <View style={tw`flex-1 p-4 border-r border-purple-200`}>
                  <Text style={tw`text-purple-700 font-semibold text-center`}>
                    Tola
                  </Text>
                </View>
                <View style={tw`flex-1 p-4 border-r border-purple-200`}>
                  <Text style={tw`text-purple-700 font-semibold text-center`}>
                    Masha
                  </Text>
                </View>
                <View style={tw`flex-1 p-4`}>
                  <Text style={tw`text-purple-700 font-semibold text-center`}>
                    Ratti
                  </Text>
                </View>
              </View>

              {/* Values Row */}
              <View style={tw`flex-row`}>
                <View style={tw`flex-1 p-4 border-r border-purple-200`}>
                  <Text
                    style={tw`text-purple-900 font-bold text-xl text-center`}
                  >
                    {gramsToTmr.result.tola}
                  </Text>
                </View>
                <View style={tw`flex-1 p-4 border-r border-purple-200`}>
                  <Text
                    style={tw`text-purple-900 font-bold text-xl text-center`}
                  >
                    {gramsToTmr.result.masha}
                  </Text>
                </View>
                <View style={tw`flex-1 p-4`}>
                  <Text
                    style={tw`text-purple-900 font-bold text-xl text-center`}
                  >
                    {formatNumber(gramsToTmr.result.ratti, 2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Verification Card */}
        {(gramsToTmr.result.tola > 0 ||
          gramsToTmr.result.masha > 0 ||
          gramsToTmr.result.ratti > 0) && (
          <View style={tw`bg-white rounded-2xl p-6 shadow-sm mb-6`}>
            <Text style={tw`text-lg font-bold text-gray-900 mb-4`}>
              Verification
            </Text>

            <View
              style={tw`bg-green-50 border border-green-200 rounded-lg p-4`}
            >
              <View style={tw`flex-row justify-between items-center`}>
                <Text style={tw`text-green-700 font-medium text-sm`}>
                  Calculated Total
                </Text>
                <Text style={tw`text-green-900 font-bold text-lg`}>
                  {formatNumber(getTotalGrams(), 4)} g
                </Text>
              </View>
              <Text style={tw`text-green-600 text-xs mt-1`}>
                Should match your input weight
              </Text>
            </View>
          </View>
        )}

        {/* Conversion Reference Card */}
        <View style={tw`bg-white rounded-2xl p-6 shadow-sm mb-6`}>
          <Text style={tw`text-lg font-bold text-gray-900 mb-4`}>
            Conversion Reference
          </Text>

          <View style={tw`space-y-3`}>
            <View
              style={tw`flex-row justify-between items-center py-2 border-b border-gray-100`}
            >
              <Text style={tw`text-gray-600`}>1 Tola</Text>
              <Text style={tw`text-gray-900 font-medium`}>
                {TOLA_TO_GRAMS} grams
              </Text>
            </View>
            <View
              style={tw`flex-row justify-between items-center py-2 border-b border-gray-100`}
            >
              <Text style={tw`text-gray-600`}>1 Masha</Text>
              <Text style={tw`text-gray-900 font-medium`}>
                {MASHA_TO_GRAMS} grams
              </Text>
            </View>
            <View style={tw`flex-row justify-between items-center py-2`}>
              <Text style={tw`text-gray-600`}>1 Ratti</Text>
              <Text style={tw`text-gray-900 font-medium`}>
                {RATTI_TO_GRAMS} grams
              </Text>
            </View>
          </View>
        </View>

        {/* Info Card */}
        <View style={tw`bg-blue-50 border border-blue-200 rounded-lg p-4`}>
          <View style={tw`flex-row items-start`}>
            <Ionicons
              name="information-circle"
              size={20}
              color="#3B82F6"
              style={tw`mr-3 mt-0.5`}
            />
            <View style={tw`flex-1`}>
              <Text style={tw`text-blue-900 font-medium text-sm mb-1`}>
                How It Works
              </Text>
              <Text style={tw`text-blue-800 text-sm leading-5`}>
                This converter breaks down your gram weight into the traditional
                TMR format by calculating the largest units first (Tola), then
                medium units (Masha), and finally the smallest units (Ratti) for
                any remainder.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GramsToTMRScreen;
