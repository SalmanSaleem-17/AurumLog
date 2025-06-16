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

const TMRToGramsScreen = ({ navigation }) => {
  const [tmrToGrams, setTmrToGrams] = useState({
    tola: "",
    masha: "",
    ratti: "",
    result: 0,
  });

  // Refs for input fields
  const tolaRef = useRef(null);
  const mashaRef = useRef(null);
  const rattiRef = useRef(null);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Format weight with proper decimal places
  const formatWeight = (weight) => {
    if (weight === 0) return "0.00";
    return weight.toFixed(4);
  };

  // Input validation functions
  const handleTolaChange = (text) => {
    // Only allow integers (0 and above)
    const numericValue = text.replace(/[^0-9]/g, "");
    setTmrToGrams((prev) => ({ ...prev, tola: numericValue }));
  };

  const handleMashaChange = (text) => {
    // Only allow integers from 0 to 11
    const numericValue = text.replace(/[^0-9]/g, "");
    const intValue = parseInt(numericValue) || 0;
    if (intValue <= 11) {
      setTmrToGrams((prev) => ({ ...prev, masha: numericValue }));
    }
  };

  const handleRattiChange = (text) => {
    // Allow decimal values from 0 to 7.99
    const numericValue = text.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    if (parts.length <= 2) {
      let formattedValue = numericValue;
      if (parts[1] && parts[1].length > 2) {
        formattedValue = parts[0] + "." + parts[1].substring(0, 2);
      }
      const floatValue = parseFloat(formattedValue) || 0;
      if (floatValue <= 7.99) {
        setTmrToGrams((prev) => ({ ...prev, ratti: formattedValue }));
      }
    }
  };

  const calculateTmrToGrams = useCallback(() => {
    const tola = parseFloat(tmrToGrams.tola) || 0;
    const masha = parseFloat(tmrToGrams.masha) || 0;
    const ratti = parseFloat(tmrToGrams.ratti) || 0;

    const totalGrams =
      tola * TOLA_TO_GRAMS + masha * MASHA_TO_GRAMS + ratti * RATTI_TO_GRAMS;

    setTmrToGrams((prev) => ({ ...prev, result: totalGrams }));
  }, [tmrToGrams.tola, tmrToGrams.masha, tmrToGrams.ratti]);

  const clearAll = () => {
    setTmrToGrams({
      tola: "",
      masha: "",
      ratti: "",
      result: 0,
    });
  };

  const showConversionInfo = () => {
    Alert.alert(
      "Conversion Rates",
      `1 Tola = ${TOLA_TO_GRAMS} grams\n1 Masha = ${MASHA_TO_GRAMS} grams\n1 Ratti = ${RATTI_TO_GRAMS} grams\n\nNote:\n• Tola: Integer values (0+)\n• Masha: Integer values (0-11)\n• Ratti: Decimal values (0-7.99)`,
      [{ text: "OK" }]
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
            TMR to Grams
          </Text>
        </View>

        <TouchableOpacity onPress={showConversionInfo} style={tw`p-2`}>
          <Ionicons name="information-circle" size={24} color="#10B981" />
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
              style={tw`w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-3`}
            >
              <Ionicons name="scale" size={24} color="#10B981" />
            </View>
            <View>
              <Text style={tw`text-xl font-bold text-gray-900`}>
                TMR to Grams Converter
              </Text>
              <Text style={tw`text-sm text-gray-600 mt-1`}>
                Convert traditional units to grams
              </Text>
            </View>
          </View>

          {/* Input Fields */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-base font-semibold text-gray-700 mb-4`}>
              Enter Values
            </Text>

            <View style={tw`flex-row gap-4 mb-4`}>
              {/* Tola Input */}
              <View style={tw`flex-1`}>
                <Text style={tw`text-sm font-medium text-gray-600 mb-2`}>
                  Tola
                </Text>
                <View style={tw`relative`}>
                  <TextInput
                    ref={tolaRef}
                    value={tmrToGrams.tola}
                    onChangeText={handleTolaChange}
                    placeholder="0"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    style={tw`bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-base pr-8`}
                    returnKeyType="next"
                    onSubmitEditing={() => mashaRef.current?.focus()}
                  />
                  <Text
                    style={tw`absolute right-3 top-3 text-gray-500 text-sm font-medium`}
                  >
                    T
                  </Text>
                </View>
              </View>

              {/* Masha Input */}
              <View style={tw`flex-1`}>
                <Text style={tw`text-sm font-medium text-gray-600 mb-2`}>
                  Masha (0-11)
                </Text>
                <View style={tw`relative`}>
                  <TextInput
                    ref={mashaRef}
                    value={tmrToGrams.masha}
                    onChangeText={handleMashaChange}
                    placeholder="0"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    style={tw`bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-base pr-8`}
                    returnKeyType="next"
                    onSubmitEditing={() => rattiRef.current?.focus()}
                  />
                  <Text
                    style={tw`absolute right-3 top-3 text-gray-500 text-sm font-medium`}
                  >
                    M
                  </Text>
                </View>
              </View>

              {/* Ratti Input */}
              <View style={tw`flex-1`}>
                <Text style={tw`text-sm font-medium text-gray-600 mb-2`}>
                  Ratti (0-7.99)
                </Text>
                <View style={tw`relative`}>
                  <TextInput
                    ref={rattiRef}
                    value={tmrToGrams.ratti}
                    onChangeText={handleRattiChange}
                    placeholder="0.00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                    style={tw`bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-base pr-8`}
                    returnKeyType="done"
                    onSubmitEditing={dismissKeyboard}
                  />
                  <Text
                    style={tw`absolute right-3 top-3 text-gray-500 text-sm font-medium`}
                  >
                    R
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={tw`flex-row gap-3 mb-6`}>
            <TouchableOpacity
              onPress={() => {
                dismissKeyboard();
                calculateTmrToGrams();
              }}
              style={tw`flex-1 bg-green-500 rounded-lg py-4 items-center justify-center`}
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

          {/* Result Card */}
          <View style={tw`bg-green-50 border border-green-200 rounded-lg p-4`}>
            <Text style={tw`text-green-700 font-medium text-sm mb-1`}>
              Total Weight
            </Text>
            <Text style={tw`text-green-900 font-bold text-2xl`}>
              {formatWeight(tmrToGrams.result)} g
            </Text>
          </View>
        </View>

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
                Input Guidelines
              </Text>
              <Text style={tw`text-blue-800 text-sm leading-5`}>
                • Tola: Any integer value (0 and above){"\n"}• Masha: Integer
                values only (0 to 11){"\n"}• Ratti: Decimal values allowed (0 to
                7.99)
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TMRToGramsScreen;
