import React, { useState, useCallback, useRef, useEffect } from "react";
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

const PurityCalculatorScreen = ({ navigation }) => {
  const [inputMode, setInputMode] = useState("tmr"); // 'tmr' or 'grams'
  const [selectedKarat, setSelectedKarat] = useState(22);
  const [tmrInputs, setTmrInputs] = useState({
    tola: "",
    masha: "",
    ratti: "",
  });
  const [gramsInput, setGramsInput] = useState("");
  const [results, setResults] = useState({
    pureGoldWeight: 0,
    impurityWeight: 0,
    originalWeight: 0,
    purityPercentage: 0,
  });

  // Refs for input fields
  const tolaRef = useRef(null);
  const mashaRef = useRef(null);
  const rattiRef = useRef(null);
  const gramsRef = useRef(null);

  // Karat options with purity percentages
  const karatOptions = [
    { karat: 24, purity: 100, label: "24K (Pure Gold)" },
    { karat: 22, purity: 91.67, label: "22K" },
    { karat: 21, purity: 87.5, label: "21K" },
    { karat: 20, purity: 83.33, label: "20K" },
    { karat: 18, purity: 75, label: "18K" },
    { karat: 16, purity: 66.67, label: "16K" },
    { karat: 14, purity: 58.33, label: "14K" },
    { karat: 12, purity: 50, label: "12K" },
  ];

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Format weight with proper decimal places
  const formatWeight = (weight, decimals = 4) => {
    if (weight === 0) return "0." + "0".repeat(decimals);
    return weight.toFixed(decimals);
  };

  // Convert TMR to grams
  const convertTMRToGrams = (tola, masha, ratti) => {
    const tolaGrams = (parseFloat(tola) || 0) * 11.664;
    const mashaGrams = (parseFloat(masha) || 0) * 0.972;
    const rattiGrams = (parseFloat(ratti) || 0) * 0.121;
    return tolaGrams + mashaGrams + rattiGrams;
  };

  // Convert grams to TMR
  const convertGramsToTMR = (grams) => {
    const totalRattis = grams / 0.121;
    const tola = Math.floor(totalRattis / 96);
    const remainingAfterTola = totalRattis % 96;
    const masha = Math.floor(remainingAfterTola / 8);
    const ratti = remainingAfterTola % 8;
    return {
      tola: tola,
      masha: masha,
      ratti: ratti,
    };
  };

  // Handle TMR input changes
  const handleTMRChange = (field, value) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    if (parts.length <= 2) {
      let formattedValue = numericValue;
      if (parts[1] && parts[1].length > 3) {
        formattedValue = parts[0] + "." + parts[1].substring(0, 3);
      }

      setTmrInputs((prev) => ({
        ...prev,
        [field]: formattedValue,
      }));

      if (inputMode === "tmr") {
        const newTmr = { ...tmrInputs, [field]: formattedValue };
        const grams = convertTMRToGrams(
          newTmr.tola,
          newTmr.masha,
          newTmr.ratti
        );
        setGramsInput(grams > 0 ? formatWeight(grams) : "");
      }
    }
  };

  // Handle grams input change
  const handleGramsChange = (value) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    if (parts.length <= 2) {
      let formattedValue = numericValue;
      if (parts[1] && parts[1].length > 4) {
        formattedValue = parts[0] + "." + parts[1].substring(0, 4);
      }

      setGramsInput(formattedValue);

      if (inputMode === "grams") {
        const grams = parseFloat(formattedValue) || 0;
        if (grams > 0) {
          const tmr = convertGramsToTMR(grams);
          setTmrInputs({
            tola: tmr.tola.toString(),
            masha: tmr.masha.toString(),
            ratti: formatWeight(tmr.ratti, 2),
          });
        } else {
          setTmrInputs({ tola: "", masha: "", ratti: "" });
        }
      }
    }
  };

  // Calculate purity and impurity
  const calculatePurity = useCallback(() => {
    let originalWeightGrams = 0;

    if (inputMode === "tmr") {
      originalWeightGrams = convertTMRToGrams(
        tmrInputs.tola,
        tmrInputs.masha,
        tmrInputs.ratti
      );
    } else {
      originalWeightGrams = parseFloat(gramsInput) || 0;
    }

    if (originalWeightGrams === 0) {
      setResults({
        pureGoldWeight: 0,
        impurityWeight: 0,
        originalWeight: 0,
        purityPercentage: 0,
      });
      return;
    }

    const selectedKaratData = karatOptions.find(
      (k) => k.karat === selectedKarat
    );
    const purityPercentage = selectedKaratData ? selectedKaratData.purity : 100;

    // Calculate pure gold weight: Original Weight × (Purity Percentage / 100)
    const pureGoldWeight = originalWeightGrams * (purityPercentage / 100);

    // Calculate impurity weight
    const impurityWeight = originalWeightGrams - pureGoldWeight;

    setResults({
      pureGoldWeight: pureGoldWeight,
      impurityWeight: impurityWeight,
      originalWeight: originalWeightGrams,
      purityPercentage: purityPercentage,
    });
  }, [tmrInputs, gramsInput, selectedKarat, inputMode]);

  // Auto-calculate when inputs change
  useEffect(() => {
    calculatePurity();
  }, [calculatePurity]);

  const clearAll = () => {
    setTmrInputs({ tola: "", masha: "", ratti: "" });
    setGramsInput("");
    setResults({
      pureGoldWeight: 0,
      impurityWeight: 0,
      originalWeight: 0,
      purityPercentage: 0,
    });
  };

  const switchInputMode = (mode) => {
    setInputMode(mode);
    if (mode === "tmr") {
      setGramsInput("");
    } else {
      setTmrInputs({ tola: "", masha: "", ratti: "" });
    }
  };

  const showCalculationInfo = () => {
    Alert.alert(
      "Purity Calculator",
      "This calculator determines how much pure gold and impurity is present in your gold item.\n\nFormula:\nPure Gold = Total Weight × (Purity% ÷ 100)\nImpurity = Total Weight - Pure Gold\n\nExample: For 10g of 22K gold:\nPure Gold = 10g × (91.67% ÷ 100) = 9.167g\nImpurity = 10g - 9.167g = 0.833g",
      [{ text: "OK" }]
    );
  };

  const isCalculationReady = () => {
    if (inputMode === "tmr") {
      return (
        parseFloat(tmrInputs.tola || 0) > 0 ||
        parseFloat(tmrInputs.masha || 0) > 0 ||
        parseFloat(tmrInputs.ratti || 0) > 0
      );
    } else {
      return parseFloat(gramsInput || 0) > 0;
    }
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
            Purity Calculator
          </Text>
        </View>

        <TouchableOpacity onPress={showCalculationInfo} style={tw`p-2`}>
          <MaterialCommunityIcons
            name="information"
            size={24}
            color="#06B6D4"
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
          {/* Header Section */}
          <View style={[tw`p-6 pb-4`, { backgroundColor: "#ECFEFF" }]}>
            <View style={tw`flex-row items-center justify-between mb-4`}>
              <View style={tw`flex-row items-center flex-1`}>
                <View
                  style={[
                    tw`w-12 h-12 rounded-full items-center justify-center mr-3`,
                    { backgroundColor: "#06B6D4" },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="diamond-stone"
                    size={24}
                    color="#FFFFFF"
                  />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={[tw`text-xl font-bold`, { color: "#0E7490" }]}>
                    Purity Calculator
                  </Text>
                  <Text style={[tw`text-sm`, { color: "#0891B2" }]}>
                    Calculate Pure Gold & Impurity Content
                  </Text>
                </View>
              </View>
            </View>

            {/* Karat Selection */}
            <View
              style={[
                tw`bg-white rounded-xl p-4 border-2`,
                { borderColor: "#A5F3FC" },
              ]}
            >
              <Text
                style={[tw`text-sm font-medium mb-3`, { color: "#0891B2" }]}
              >
                Select Gold Karat
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={tw`flex-row gap-2`}>
                  {karatOptions.map((option) => (
                    <TouchableOpacity
                      key={option.karat}
                      onPress={() => setSelectedKarat(option.karat)}
                      style={[
                        tw`px-4 py-2 rounded-lg border`,
                        selectedKarat === option.karat
                          ? {
                              backgroundColor: "#06B6D4",
                              borderColor: "#06B6D4",
                            }
                          : {
                              backgroundColor: "#F9FAFB",
                              borderColor: "#E5E7EB",
                            },
                      ]}
                    >
                      <Text
                        style={[
                          tw`font-semibold text-sm`,
                          selectedKarat === option.karat
                            ? { color: "#FFFFFF" }
                            : { color: "#374151" },
                        ]}
                      >
                        {option.karat}K
                      </Text>
                      <Text
                        style={[
                          tw`text-xs mt-1`,
                          selectedKarat === option.karat
                            ? { color: "#A5F3FC" }
                            : { color: "#6B7280" },
                        ]}
                      >
                        {option.purity}%
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>

          {/* Input Mode Toggle */}
          <View style={tw`px-6 pb-4`}>
            <View style={tw`flex-row bg-gray-100 rounded-xl p-1`}>
              <TouchableOpacity
                onPress={() => switchInputMode("tmr")}
                style={[
                  tw`flex-1 py-3 rounded-lg items-center`,
                  inputMode === "tmr" ? { backgroundColor: "#06B6D4" } : {},
                ]}
              >
                <Text
                  style={tw`font-semibold ${
                    inputMode === "tmr" ? "text-white" : "text-gray-600"
                  }`}
                >
                  Tola/Masha/Ratti
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => switchInputMode("grams")}
                style={[
                  tw`flex-1 py-3 rounded-lg items-center`,
                  inputMode === "grams" ? { backgroundColor: "#06B6D4" } : {},
                ]}
              >
                <Text
                  style={tw`font-semibold ${
                    inputMode === "grams" ? "text-white" : "text-gray-600"
                  }`}
                >
                  Grams
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Input Section */}
          <View style={tw`p-6 pt-0`}>
            {inputMode === "tmr" ? (
              // TMR Input Mode
              <View style={tw`mb-6`}>
                <Text style={tw`text-base font-semibold text-gray-700 mb-3`}>
                  Enter Impure Gold Weight (TMR)
                </Text>

                {/* TMR Input Row */}
                <View style={tw`flex-row gap-3`}>
                  <View style={tw`flex-1`}>
                    <TextInput
                      ref={tolaRef}
                      value={tmrInputs.tola}
                      onChangeText={(text) => handleTMRChange("tola", text)}
                      placeholder="0"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="decimal-pad"
                      style={[
                        tw`border-2 rounded-xl px-3 py-4 text-gray-900 text-lg font-semibold text-center`,
                        {
                          backgroundColor: "#F9FAFB",
                          borderColor: tmrInputs.tola ? "#06B6D4" : "#E5E7EB",
                        },
                      ]}
                      returnKeyType="next"
                      onSubmitEditing={() => mashaRef.current?.focus()}
                    />
                    <Text
                      style={[
                        tw`text-center mt-1 text-xs`,
                        { color: "#0891B2" },
                      ]}
                    >
                      Tola
                    </Text>
                  </View>
                  <View style={tw`flex-1`}>
                    <TextInput
                      ref={mashaRef}
                      value={tmrInputs.masha}
                      onChangeText={(text) => handleTMRChange("masha", text)}
                      placeholder="0"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="decimal-pad"
                      style={[
                        tw`border-2 rounded-xl px-3 py-4 text-gray-900 text-lg font-semibold text-center`,
                        {
                          backgroundColor: "#F9FAFB",
                          borderColor: tmrInputs.masha ? "#06B6D4" : "#E5E7EB",
                        },
                      ]}
                      returnKeyType="next"
                      onSubmitEditing={() => rattiRef.current?.focus()}
                    />
                    <Text
                      style={[
                        tw`text-center mt-1 text-xs`,
                        { color: "#0891B2" },
                      ]}
                    >
                      Masha
                    </Text>
                  </View>
                  <View style={tw`flex-1`}>
                    <TextInput
                      ref={rattiRef}
                      value={tmrInputs.ratti}
                      onChangeText={(text) => handleTMRChange("ratti", text)}
                      placeholder="0.00"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="decimal-pad"
                      style={[
                        tw`border-2 rounded-xl px-3 py-4 text-gray-900 text-lg font-semibold text-center`,
                        {
                          backgroundColor: "#F9FAFB",
                          borderColor: tmrInputs.ratti ? "#06B6D4" : "#E5E7EB",
                        },
                      ]}
                      returnKeyType="done"
                      onSubmitEditing={dismissKeyboard}
                    />
                    <Text
                      style={[
                        tw`text-center mt-1 text-xs`,
                        { color: "#0891B2" },
                      ]}
                    >
                      Ratti
                    </Text>
                  </View>
                </View>

                {/* Equivalent Grams Display */}
                {gramsInput && (
                  <View style={tw`mt-3 items-center`}>
                    <Text style={tw`text-sm text-gray-600`}>Equivalent:</Text>
                    <Text style={[tw`text-lg font-bold`, { color: "#06B6D4" }]}>
                      {gramsInput} grams
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              // Grams Input Mode
              <View style={tw`mb-6`}>
                <Text style={tw`text-base font-semibold text-gray-700 mb-3`}>
                  Enter Impure Gold Weight (Grams)
                </Text>

                <View style={tw`relative`}>
                  <TextInput
                    ref={gramsRef}
                    value={gramsInput}
                    onChangeText={handleGramsChange}
                    placeholder="0.0000"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                    style={[
                      tw`border-2 rounded-xl px-4 py-4 text-gray-900 text-xl font-semibold pr-16`,
                      {
                        backgroundColor: "#F9FAFB",
                        borderColor: gramsInput ? "#06B6D4" : "#E5E7EB",
                      },
                    ]}
                    returnKeyType="done"
                    onSubmitEditing={dismissKeyboard}
                  />
                  <View
                    style={[
                      tw`absolute right-4 top-4 px-2 py-1 rounded`,
                      { backgroundColor: "#06B6D4" },
                    ]}
                  >
                    <Text style={tw`text-white text-sm font-bold`}>g</Text>
                  </View>
                </View>

                {/* Equivalent TMR Display */}
                {(tmrInputs.tola || tmrInputs.masha || tmrInputs.ratti) && (
                  <View style={tw`mt-4`}>
                    <Text style={tw`text-sm text-gray-600 text-center mb-2`}>
                      Equivalent TMR:
                    </Text>
                    <View style={tw`flex-row justify-center gap-4`}>
                      <Text style={[tw`font-bold`, { color: "#06B6D4" }]}>
                        {tmrInputs.tola} T
                      </Text>
                      <Text style={[tw`font-bold`, { color: "#06B6D4" }]}>
                        {tmrInputs.masha} M
                      </Text>
                      <Text style={[tw`font-bold`, { color: "#06B6D4" }]}>
                        {tmrInputs.ratti} R
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}

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
                Pure Gold = Total Weight × (Purity% ÷ 100)
              </Text>
              <Text style={[tw`font-mono text-sm`, { color: "#1E3A8A" }]}>
                Impurity = Total Weight - Pure Gold
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={tw`flex-row gap-3 mb-6`}>
              <TouchableOpacity
                onPress={dismissKeyboard}
                style={[
                  tw`flex-1 rounded-xl py-4 items-center justify-center flex-row`,
                  {
                    backgroundColor: isCalculationReady()
                      ? "#06B6D4"
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
            {results.originalWeight > 0 && (
              <View style={tw`space-y-4`}>
                {/* Original Weight Summary */}
                <View
                  style={[
                    tw`border-2 rounded-xl p-6`,
                    { backgroundColor: "#ECFEFF", borderColor: "#06B6D4" },
                  ]}
                >
                  <Text
                    style={[
                      tw`font-medium text-sm mb-2 text-center`,
                      { color: "#0E7490" },
                    ]}
                  >
                    Original {selectedKarat}K Gold Weight
                  </Text>
                  <Text
                    style={[
                      tw`font-bold text-2xl text-center`,
                      { color: "#0891B2" },
                    ]}
                  >
                    {formatWeight(results.originalWeight)} grams
                  </Text>
                  <Text
                    style={[tw`text-sm mt-1 text-center`, { color: "#06B6D4" }]}
                  >
                    Total weight including impurities
                  </Text>
                </View>

                {/* Weight Breakdown */}
                <View style={tw`flex-row gap-3`}>
                  {/* Pure Gold */}
                  <View
                    style={[
                      tw`flex-1 border rounded-xl p-4`,
                      { backgroundColor: "#ECFDF5", borderColor: "#6EE7B7" },
                    ]}
                  >
                    <View style={tw`items-center`}>
                      <MaterialCommunityIcons
                        name="gold"
                        size={24}
                        color="#059669"
                        style={tw`mb-2`}
                      />
                      <Text
                        style={[
                          tw`text-xs font-medium mb-1`,
                          { color: "#065F46" },
                        ]}
                      >
                        PURE GOLD CONTENT
                      </Text>
                      <Text
                        style={[tw`text-lg font-bold`, { color: "#047857" }]}
                      >
                        {formatWeight(results.pureGoldWeight)}g
                      </Text>
                      <Text style={[tw`text-xs mt-1`, { color: "#059669" }]}>
                        {formatWeight(
                          convertGramsToTMR(results.pureGoldWeight).tola,
                          2
                        )}{" "}
                        tola
                      </Text>
                    </View>
                  </View>

                  {/* Impurity */}
                  <View
                    style={[
                      tw`flex-1 border rounded-xl p-4`,
                      { backgroundColor: "#FEF2F2", borderColor: "#FCA5A5" },
                    ]}
                  >
                    <View style={tw`items-center`}>
                      <MaterialCommunityIcons
                        name="close"
                        size={24}
                        color="#DC2626"
                        style={tw`mb-2`}
                      />
                      <Text
                        style={[
                          tw`text-xs font-medium mb-1`,
                          { color: "#991B1B" },
                        ]}
                      >
                        IMPURITY CONTENT
                      </Text>
                      <Text
                        style={[tw`text-lg font-bold`, { color: "#B91C1C" }]}
                      >
                        {formatWeight(results.impurityWeight)}g
                      </Text>
                      <Text style={[tw`text-xs mt-1`, { color: "#DC2626" }]}>
                        {formatWeight(
                          convertGramsToTMR(results.impurityWeight).tola,
                          2
                        )}{" "}
                        tola
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Calculation Breakdown */}
        {results.originalWeight > 0 && (
          <View style={tw`bg-white rounded-2xl p-6 shadow-sm mb-6`}>
            <View style={tw`flex-row items-center mb-4`}>
              <MaterialCommunityIcons
                name="chart-pie"
                size={20}
                color="#6366F1"
                style={tw`mr-2`}
              />
              <Text style={tw`text-lg font-bold text-gray-900`}>
                Composition Details
              </Text>
            </View>

            <View style={tw`space-y-3`}>
              <View style={tw`flex-row justify-between items-center py-2`}>
                <Text style={tw`text-gray-600`}>Original Weight</Text>
                <Text style={tw`text-cyan-600 font-semibold`}>
                  {formatWeight(results.originalWeight)} grams
                </Text>
              </View>
              <View style={tw`flex-row justify-between items-center py-2`}>
                <Text style={tw`text-gray-600`}>Pure Gold Content</Text>
                <Text style={tw`text-green-600 font-semibold`}>
                  {formatWeight(results.pureGoldWeight)} grams
                </Text>
              </View>
              <View style={tw`flex-row justify-between items-center py-2`}>
                <Text style={tw`text-gray-600`}>Impurity Content</Text>
                <Text style={tw`text-red-600 font-semibold`}>
                  {formatWeight(results.impurityWeight)} grams
                </Text>
              </View>
              <View
                style={tw`flex-row justify-between items-center py-2 border-t border-gray-200`}
              >
                <Text style={tw`text-gray-900 font-semibold`}>
                  Purity Percentage
                </Text>
                <Text style={tw`text-cyan-600 font-bold text-lg`}>
                  {results.purityPercentage}%
                </Text>
              </View>

              {/* Calculation Steps */}
              <View
                style={[
                  tw`mt-4 p-4 rounded-lg`,
                  { backgroundColor: "#F8FAFC" },
                ]}
              >
                <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>
                  Calculation Steps:
                </Text>
                <Text style={tw`text-xs text-gray-600 mb-1`}>
                  1. Pure Gold = {formatWeight(results.originalWeight)}g × (
                  {results.purityPercentage}% ÷ 100) ={" "}
                  {formatWeight(results.pureGoldWeight)}g
                </Text>
                <Text style={tw`text-xs text-gray-600`}>
                  2. Impurity = {formatWeight(results.originalWeight)}g -{" "}
                  {formatWeight(results.pureGoldWeight)}g ={" "}
                  {formatWeight(results.impurityWeight)}g
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Additional Information */}
        <View style={tw`bg-blue-50 rounded-2xl p-6 mb-6`}>
          <View style={tw`flex-row items-start mb-3`}>
            <MaterialCommunityIcons
              name="information"
              size={20}
              color="#3B82F6"
              style={tw`mr-2 mt-1`}
            />
            <View style={tw`flex-1`}>
              <Text style={tw`text-lg font-bold text-gray-900 mb-2`}>
                About {selectedKarat}K Gold
              </Text>
              <Text style={tw`text-gray-700 mb-3`}>
                {selectedKarat}K gold contains{" "}
                {karatOptions.find((k) => k.karat === selectedKarat)?.purity}%
                pure gold. The remaining{" "}
                {100 -
                  karatOptions.find((k) => k.karat === selectedKarat)?.purity}
                % is alloy metals.
              </Text>
              <Text style={tw`text-gray-700`}>
                Common alloy metals include silver, copper, nickel, and zinc,
                which are added to increase durability and change the color of
                the gold.
              </Text>
            </View>
          </View>
        </View>

        {/* Conversion Reference */}
        <View style={tw`bg-white rounded-2xl p-6 shadow-sm`}>
          <View style={tw`flex-row items-center mb-4`}>
            <MaterialCommunityIcons
              name="scale-balance"
              size={20}
              color="#6366F1"
              style={tw`mr-2`}
            />
            <Text style={tw`text-lg font-bold text-gray-900`}>
              Weight Conversion Reference
            </Text>
          </View>

          <View style={tw`space-y-3`}>
            <View
              style={tw`flex-row justify-between items-center py-2 border-b border-gray-100`}
            >
              <Text style={tw`text-gray-600`}>1 Tola</Text>
              <Text style={tw`text-gray-900 font-semibold`}>11.664 grams</Text>
            </View>
            <View
              style={tw`flex-row justify-between items-center py-2 border-b border-gray-100`}
            >
              <Text style={tw`text-gray-600`}>1 Masha</Text>
              <Text style={tw`text-gray-900 font-semibold`}>0.972 grams</Text>
            </View>
            <View style={tw`flex-row justify-between items-center py-2`}>
              <Text style={tw`text-gray-600`}>1 Ratti</Text>
              <Text style={tw`text-gray-900 font-semibold`}>0.121 grams</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PurityCalculatorScreen;

// import React, { useState, useCallback, useRef, useEffect } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   Keyboard,
//   Alert,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import tw from "../utils/tw";

// const PurityCalculatorScreen = ({ navigation }) => {
//   const [inputMode, setInputMode] = useState("tmr"); // 'tmr' or 'grams'
//   const [selectedKarat, setSelectedKarat] = useState(22);
//   const [tmrInputs, setTmrInputs] = useState({
//     tola: "",
//     masha: "",
//     ratti: "",
//   });
//   const [gramsInput, setGramsInput] = useState("");
//   const [results, setResults] = useState({
//     pureGold: 0,
//     impurity: 0,
//     totalWeight: 0,
//     purityPercentage: 0,
//   });

//   // Refs for input fields
//   const tolaRef = useRef(null);
//   const mashaRef = useRef(null);
//   const rattiRef = useRef(null);
//   const gramsRef = useRef(null);

//   // Karat options with purity percentages
//   const karatOptions = [
//     { karat: 24, purity: 100, label: "24K (Pure Gold)" },
//     { karat: 22, purity: 91.67, label: "22K" },
//     { karat: 21, purity: 87.5, label: "21K" },
//     { karat: 20, purity: 83.33, label: "20K" },
//     { karat: 18, purity: 75, label: "18K" },
//     { karat: 16, purity: 66.67, label: "16K" },
//     { karat: 14, purity: 58.33, label: "14K" },
//     { karat: 12, purity: 50, label: "12K" },
//   ];

//   const dismissKeyboard = () => {
//     Keyboard.dismiss();
//   };

//   // Format weight with proper decimal places
//   const formatWeight = (weight, decimals = 4) => {
//     if (weight === 0) return "0." + "0".repeat(decimals);
//     return weight.toFixed(decimals);
//   };

//   // Convert TMR to grams
//   const convertTMRToGrams = (tola, masha, ratti) => {
//     const tolaGrams = (parseFloat(tola) || 0) * 11.664;
//     const mashaGrams = (parseFloat(masha) || 0) * 0.972;
//     const rattiGrams = (parseFloat(ratti) || 0) * 0.121;

//     return tolaGrams + mashaGrams + rattiGrams;
//   };

//   // Convert grams to TMR
//   const convertGramsToTMR = (grams) => {
//     const totalRattis = grams / 0.121;
//     const tola = Math.floor(totalRattis / 96);
//     const remainingAfterTola = totalRattis % 96;
//     const masha = Math.floor(remainingAfterTola / 8);
//     const ratti = remainingAfterTola % 8;

//     return {
//       tola: tola,
//       masha: masha,
//       ratti: ratti,
//     };
//   };

//   // Handle TMR input changes
//   const handleTMRChange = (field, value) => {
//     const numericValue = value.replace(/[^0-9.]/g, "");
//     const parts = numericValue.split(".");
//     if (parts.length <= 2) {
//       let formattedValue = numericValue;
//       if (parts[1] && parts[1].length > 3) {
//         formattedValue = parts[0] + "." + parts[1].substring(0, 3);
//       }

//       setTmrInputs((prev) => ({
//         ...prev,
//         [field]: formattedValue,
//       }));

//       if (inputMode === "tmr") {
//         const newTmr = { ...tmrInputs, [field]: formattedValue };
//         const grams = convertTMRToGrams(
//           newTmr.tola,
//           newTmr.masha,
//           newTmr.ratti
//         );
//         setGramsInput(grams > 0 ? formatWeight(grams) : "");
//       }
//     }
//   };

//   // Handle grams input change
//   const handleGramsChange = (value) => {
//     const numericValue = value.replace(/[^0-9.]/g, "");
//     const parts = numericValue.split(".");
//     if (parts.length <= 2) {
//       let formattedValue = numericValue;
//       if (parts[1] && parts[1].length > 4) {
//         formattedValue = parts[0] + "." + parts[1].substring(0, 4);
//       }

//       setGramsInput(formattedValue);

//       if (inputMode === "grams") {
//         const grams = parseFloat(formattedValue) || 0;
//         if (grams > 0) {
//           const tmr = convertGramsToTMR(grams);
//           setTmrInputs({
//             tola: tmr.tola.toString(),
//             masha: tmr.masha.toString(),
//             ratti: formatWeight(tmr.ratti, 2),
//           });
//         } else {
//           setTmrInputs({ tola: "", masha: "", ratti: "" });
//         }
//       }
//     }
//   };

//   // Calculate impurity
//   const calculateImpurity = useCallback(() => {
//     let totalGrams = 0;

//     if (inputMode === "tmr") {
//       totalGrams = convertTMRToGrams(
//         tmrInputs.tola,
//         tmrInputs.masha,
//         tmrInputs.ratti
//       );
//     } else {
//       totalGrams = parseFloat(gramsInput) || 0;
//     }

//     if (totalGrams === 0) {
//       setResults({
//         pureGold: 0,
//         impurity: 0,
//         totalWeight: 0,
//         purityPercentage: 0,
//       });
//       return;
//     }

//     const selectedKaratData = karatOptions.find(
//       (k) => k.karat === selectedKarat
//     );
//     const purityPercentage = selectedKaratData ? selectedKaratData.purity : 100;

//     // Calculate pure gold weight
//     const pureGoldWeight = (totalGrams * purityPercentage) / 100;

//     // Calculate impurity weight
//     const impurityWeight = totalGrams - pureGoldWeight;

//     setResults({
//       pureGold: pureGoldWeight,
//       impurity: impurityWeight,
//       totalWeight: totalGrams,
//       purityPercentage: purityPercentage,
//     });
//   }, [tmrInputs, gramsInput, selectedKarat, inputMode]);

//   // Auto-calculate when inputs change
//   useEffect(() => {
//     calculateImpurity();
//   }, [calculateImpurity]);

//   const clearAll = () => {
//     setTmrInputs({ tola: "", masha: "", ratti: "" });
//     setGramsInput("");
//     setResults({
//       pureGold: 0,
//       impurity: 0,
//       totalWeight: 0,
//       purityPercentage: 0,
//     });
//   };

//   const switchInputMode = (mode) => {
//     setInputMode(mode);
//     if (mode === "tmr") {
//       setGramsInput("");
//     } else {
//       setTmrInputs({ tola: "", masha: "", ratti: "" });
//     }
//   };

//   const showCalculationInfo = () => {
//     Alert.alert(
//       "Impurity Calculator",
//       "This calculator determines the impurity content in gold based on karat value.\n\nFormula:\nPure Gold = (Total Weight × Purity%) ÷ 100\nImpurity = Total Weight - Pure Gold\n\nKarat System:\n• 24K = 100% pure gold\n• 22K = 91.67% pure gold\n• 18K = 75% pure gold\n• etc.",
//       [{ text: "OK" }]
//     );
//   };

//   const isCalculationReady = () => {
//     if (inputMode === "tmr") {
//       return (
//         parseFloat(tmrInputs.tola || 0) > 0 ||
//         parseFloat(tmrInputs.masha || 0) > 0 ||
//         parseFloat(tmrInputs.ratti || 0) > 0
//       );
//     } else {
//       return parseFloat(gramsInput || 0) > 0;
//     }
//   };

//   return (
//     <SafeAreaView style={tw`flex-1 bg-gray-50`}>
//       {/* Header */}
//       <View
//         style={tw`flex-row items-center justify-between px-4 py-3 bg-white shadow-sm`}
//       >
//         <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2`}>
//           <MaterialCommunityIcons name="arrow-left" size={24} color="#374151" />
//         </TouchableOpacity>

//         <View style={tw`flex-1 items-center`}>
//           <Text style={tw`text-lg font-semibold text-gray-900`}>
//             Impurity Calculator
//           </Text>
//         </View>

//         <TouchableOpacity onPress={showCalculationInfo} style={tw`p-2`}>
//           <MaterialCommunityIcons
//             name="information"
//             size={24}
//             color="#EC4899"
//           />
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         style={tw`flex-1`}
//         contentContainerStyle={tw`p-4`}
//         keyboardShouldPersistTaps="handled"
//       >
//         {/* Main Calculator Card */}
//         <View style={tw`bg-white rounded-2xl shadow-lg mb-6 overflow-hidden`}>
//           {/* Header Section */}
//           <View style={[tw`p-6 pb-4`, { backgroundColor: "#FCE7F3" }]}>
//             <View style={tw`flex-row items-center justify-between mb-4`}>
//               <View style={tw`flex-row items-center flex-1`}>
//                 <View
//                   style={[
//                     tw`w-12 h-12 rounded-full items-center justify-center mr-3`,
//                     { backgroundColor: "#EC4899" },
//                   ]}
//                 >
//                   <MaterialCommunityIcons
//                     name="test-tube"
//                     size={24}
//                     color="#FFFFFF"
//                   />
//                 </View>
//                 <View style={tw`flex-1`}>
//                   <Text style={[tw`text-xl font-bold`, { color: "#831843" }]}>
//                     Impurity Calculator
//                   </Text>
//                   <Text style={[tw`text-sm`, { color: "#BE185D" }]}>
//                     Calculate Gold Purity & Impurity
//                   </Text>
//                 </View>
//               </View>
//             </View>

//             {/* Karat Selection */}
//             <View
//               style={[
//                 tw`bg-white rounded-xl p-4 border-2`,
//                 { borderColor: "#F9A8D4" },
//               ]}
//             >
//               <Text
//                 style={[tw`text-sm font-medium mb-3`, { color: "#BE185D" }]}
//               >
//                 Select Gold Karat
//               </Text>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                 <View style={tw`flex-row gap-2`}>
//                   {karatOptions.map((option) => (
//                     <TouchableOpacity
//                       key={option.karat}
//                       onPress={() => setSelectedKarat(option.karat)}
//                       style={[
//                         tw`px-4 py-2 rounded-lg border`,
//                         selectedKarat === option.karat
//                           ? {
//                               backgroundColor: "#EC4899",
//                               borderColor: "#EC4899",
//                             }
//                           : {
//                               backgroundColor: "#F9FAFB",
//                               borderColor: "#E5E7EB",
//                             },
//                       ]}
//                     >
//                       <Text
//                         style={[
//                           tw`font-semibold text-sm`,
//                           selectedKarat === option.karat
//                             ? { color: "#FFFFFF" }
//                             : { color: "#374151" },
//                         ]}
//                       >
//                         {option.karat}K
//                       </Text>
//                       <Text
//                         style={[
//                           tw`text-xs mt-1`,
//                           selectedKarat === option.karat
//                             ? { color: "#F9A8D4" }
//                             : { color: "#6B7280" },
//                         ]}
//                       >
//                         {option.purity}%
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </ScrollView>
//             </View>
//           </View>

//           {/* Input Mode Toggle */}
//           <View style={tw`px-6 pb-4`}>
//             <View style={tw`flex-row bg-gray-100 rounded-xl p-1`}>
//               <TouchableOpacity
//                 onPress={() => switchInputMode("tmr")}
//                 style={[
//                   tw`flex-1 py-3 rounded-lg items-center`,
//                   inputMode === "tmr" ? { backgroundColor: "#EC4899" } : {},
//                 ]}
//               >
//                 <Text
//                   style={tw`font-semibold ${
//                     inputMode === "tmr" ? "text-white" : "text-gray-600"
//                   }`}
//                 >
//                   Tola/Masha/Ratti
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => switchInputMode("grams")}
//                 style={[
//                   tw`flex-1 py-3 rounded-lg items-center`,
//                   inputMode === "grams" ? { backgroundColor: "#EC4899" } : {},
//                 ]}
//               >
//                 <Text
//                   style={tw`font-semibold ${
//                     inputMode === "grams" ? "text-white" : "text-gray-600"
//                   }`}
//                 >
//                   Grams
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Input Section */}
//           <View style={tw`p-6 pt-0`}>
//             {inputMode === "tmr" ? (
//               // TMR Input Mode
//               <View style={tw`mb-6`}>
//                 <Text style={tw`text-base font-semibold text-gray-700 mb-3`}>
//                   Enter Total Gold Weight (TMR)
//                 </Text>

//                 {/* TMR Labels Row */}
//                 <View style={tw`flex-row mb-2`}>
//                   <View style={tw`flex-1 items-center`}>
//                     <Text
//                       style={[tw`text-sm font-medium`, { color: "#BE185D" }]}
//                     >
//                       Tola
//                     </Text>
//                   </View>
//                   <View style={tw`flex-1 items-center`}>
//                     <Text
//                       style={[tw`text-sm font-medium`, { color: "#BE185D" }]}
//                     >
//                       Masha
//                     </Text>
//                   </View>
//                   <View style={tw`flex-1 items-center`}>
//                     <Text
//                       style={[tw`text-sm font-medium`, { color: "#BE185D" }]}
//                     >
//                       Ratti
//                     </Text>
//                   </View>
//                 </View>

//                 {/* TMR Input Row */}
//                 <View style={tw`flex-row gap-3`}>
//                   <View style={tw`flex-1`}>
//                     <TextInput
//                       ref={tolaRef}
//                       value={tmrInputs.tola}
//                       onChangeText={(text) => handleTMRChange("tola", text)}
//                       placeholder="0"
//                       placeholderTextColor="#9CA3AF"
//                       keyboardType="decimal-pad"
//                       style={[
//                         tw`border-2 rounded-xl px-3 py-4 text-gray-900 text-lg font-semibold text-center`,
//                         {
//                           backgroundColor: "#F9FAFB",
//                           borderColor: tmrInputs.tola ? "#EC4899" : "#E5E7EB",
//                         },
//                       ]}
//                       returnKeyType="next"
//                       onSubmitEditing={() => mashaRef.current?.focus()}
//                     />
//                   </View>
//                   <View style={tw`flex-1`}>
//                     <TextInput
//                       ref={mashaRef}
//                       value={tmrInputs.masha}
//                       onChangeText={(text) => handleTMRChange("masha", text)}
//                       placeholder="0"
//                       placeholderTextColor="#9CA3AF"
//                       keyboardType="decimal-pad"
//                       style={[
//                         tw`border-2 rounded-xl px-3 py-4 text-gray-900 text-lg font-semibold text-center`,
//                         {
//                           backgroundColor: "#F9FAFB",
//                           borderColor: tmrInputs.masha ? "#EC4899" : "#E5E7EB",
//                         },
//                       ]}
//                       returnKeyType="next"
//                       onSubmitEditing={() => rattiRef.current?.focus()}
//                     />
//                   </View>
//                   <View style={tw`flex-1`}>
//                     <TextInput
//                       ref={rattiRef}
//                       value={tmrInputs.ratti}
//                       onChangeText={(text) => handleTMRChange("ratti", text)}
//                       placeholder="0.00"
//                       placeholderTextColor="#9CA3AF"
//                       keyboardType="decimal-pad"
//                       style={[
//                         tw`border-2 rounded-xl px-3 py-4 text-gray-900 text-lg font-semibold text-center`,
//                         {
//                           backgroundColor: "#F9FAFB",
//                           borderColor: tmrInputs.ratti ? "#EC4899" : "#E5E7EB",
//                         },
//                       ]}
//                       returnKeyType="done"
//                       onSubmitEditing={dismissKeyboard}
//                     />
//                   </View>
//                 </View>

//                 {/* Equivalent Grams Display */}
//                 {gramsInput && (
//                   <View style={tw`mt-3 items-center`}>
//                     <Text style={tw`text-sm text-gray-600`}>Equivalent:</Text>
//                     <Text style={[tw`text-lg font-bold`, { color: "#EC4899" }]}>
//                       {gramsInput} grams
//                     </Text>
//                   </View>
//                 )}
//               </View>
//             ) : (
//               // Grams Input Mode
//               <View style={tw`mb-6`}>
//                 <Text style={tw`text-base font-semibold text-gray-700 mb-3`}>
//                   Enter Total Gold Weight (Grams)
//                 </Text>

//                 <View style={tw`relative`}>
//                   <TextInput
//                     ref={gramsRef}
//                     value={gramsInput}
//                     onChangeText={handleGramsChange}
//                     placeholder="0.0000"
//                     placeholderTextColor="#9CA3AF"
//                     keyboardType="decimal-pad"
//                     style={[
//                       tw`border-2 rounded-xl px-4 py-4 text-gray-900 text-xl font-semibold pr-16`,
//                       {
//                         backgroundColor: "#F9FAFB",
//                         borderColor: gramsInput ? "#EC4899" : "#E5E7EB",
//                       },
//                     ]}
//                     returnKeyType="done"
//                     onSubmitEditing={dismissKeyboard}
//                   />
//                   <View
//                     style={[
//                       tw`absolute right-4 top-4 px-2 py-1 rounded`,
//                       { backgroundColor: "#EC4899" },
//                     ]}
//                   >
//                     <Text style={tw`text-white text-sm font-bold`}>g</Text>
//                   </View>
//                 </View>

//                 {/* Equivalent TMR Display */}
//                 {(tmrInputs.tola || tmrInputs.masha || tmrInputs.ratti) && (
//                   <View style={tw`mt-4`}>
//                     <Text style={tw`text-sm text-gray-600 text-center mb-2`}>
//                       Equivalent TMR:
//                     </Text>
//                     <View style={tw`flex-row justify-center gap-4`}>
//                       <Text style={[tw`font-bold`, { color: "#EC4899" }]}>
//                         {tmrInputs.tola} T
//                       </Text>
//                       <Text style={[tw`font-bold`, { color: "#EC4899" }]}>
//                         {tmrInputs.masha} M
//                       </Text>
//                       <Text style={[tw`font-bold`, { color: "#EC4899" }]}>
//                         {tmrInputs.ratti} R
//                       </Text>
//                     </View>
//                   </View>
//                 )}
//               </View>
//             )}

//             {/* Formula Display */}
//             <View
//               style={[
//                 tw`border rounded-lg p-3 mb-6`,
//                 { backgroundColor: "#F0F9FF", borderColor: "#BFDBFE" },
//               ]}
//             >
//               <Text
//                 style={[tw`font-medium text-xs mb-1`, { color: "#1E40AF" }]}
//               >
//                 FORMULA
//               </Text>
//               <Text style={[tw`font-mono text-sm`, { color: "#1E3A8A" }]}>
//                 Pure Gold = (Total Weight × Purity%) ÷ 100
//               </Text>
//               <Text style={[tw`font-mono text-sm`, { color: "#1E3A8A" }]}>
//                 Impurity = Total Weight - Pure Gold
//               </Text>
//             </View>

//             {/* Action Buttons */}
//             <View style={tw`flex-row gap-3 mb-6`}>
//               <TouchableOpacity
//                 onPress={dismissKeyboard}
//                 style={[
//                   tw`flex-1 rounded-xl py-4 items-center justify-center flex-row`,
//                   {
//                     backgroundColor: isCalculationReady()
//                       ? "#EC4899"
//                       : "#D1D5DB",
//                   },
//                 ]}
//                 disabled={!isCalculationReady()}
//               >
//                 <MaterialCommunityIcons
//                   name="test-tube"
//                   size={20}
//                   color={isCalculationReady() ? "#FFFFFF" : "#6B7280"}
//                   style={tw`mr-2`}
//                 />
//                 <Text
//                   style={tw`${
//                     isCalculationReady() ? "text-white" : "text-gray-500"
//                   } font-semibold text-base`}
//                 >
//                   Calculate
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={clearAll}
//                 style={tw`px-6 bg-gray-200 rounded-xl py-4 items-center justify-center`}
//               >
//                 <MaterialCommunityIcons
//                   name="close"
//                   size={20}
//                   color="#6B7280"
//                 />
//               </TouchableOpacity>
//             </View>

//             {/* Results Display */}
//             {results.totalWeight > 0 && (
//               <View style={tw`space-y-4`}>
//                 {/* Purity Summary */}
//                 <View
//                   style={[
//                     tw`border-2 rounded-xl p-6`,
//                     { backgroundColor: "#ECFDF5", borderColor: "#10B981" },
//                   ]}
//                 >
//                   <Text
//                     style={[
//                       tw`font-medium text-sm mb-2 text-center`,
//                       { color: "#065F46" },
//                     ]}
//                   >
//                     {selectedKarat}K Gold Analysis
//                   </Text>
//                   <Text
//                     style={[
//                       tw`font-bold text-2xl text-center`,
//                       { color: "#047857" },
//                     ]}
//                   >
//                     {results.purityPercentage}% Pure
//                   </Text>
//                   <Text
//                     style={[tw`text-sm mt-1 text-center`, { color: "#059669" }]}
//                   >
//                     for {formatWeight(results.totalWeight)} grams total weight
//                   </Text>
//                 </View>

//                 {/* Weight Breakdown */}
//                 <View style={tw`flex-row gap-3`}>
//                   {/* Pure Gold */}
//                   <View
//                     style={[
//                       tw`flex-1 border rounded-xl p-4`,
//                       { backgroundColor: "#FEF3C7", borderColor: "#FCD34D" },
//                     ]}
//                   >
//                     <View style={tw`items-center`}>
//                       <MaterialCommunityIcons
//                         name="gold"
//                         size={24}
//                         color="#D97706"
//                         style={tw`mb-2`}
//                       />
//                       <Text
//                         style={[
//                           tw`text-xs font-medium mb-1`,
//                           { color: "#92400E" },
//                         ]}
//                       >
//                         PURE GOLD
//                       </Text>
//                       <Text
//                         style={[tw`text-lg font-bold`, { color: "#78350F" }]}
//                       >
//                         {formatWeight(results.pureGold)}g
//                       </Text>
//                       <Text style={[tw`text-xs mt-1`, { color: "#A16207" }]}>
//                         {formatWeight(
//                           convertGramsToTMR(results.pureGold).tola,
//                           2
//                         )}{" "}
//                         tola
//                       </Text>
//                     </View>
//                   </View>

//                   {/* Impurity */}
//                   <View
//                     style={[
//                       tw`flex-1 border rounded-xl p-4`,
//                       { backgroundColor: "#FEE2E2", borderColor: "#FECACA" },
//                     ]}
//                   >
//                     <View style={tw`items-center`}>
//                       <MaterialCommunityIcons
//                         name="chemical-weapon"
//                         size={24}
//                         color="#DC2626"
//                         style={tw`mb-2`}
//                       />
//                       <Text
//                         style={[
//                           tw`text-xs font-medium mb-1`,
//                           { color: "#991B1B" },
//                         ]}
//                       >
//                         IMPURITY
//                       </Text>
//                       <Text
//                         style={[tw`text-lg font-bold`, { color: "#7F1D1D" }]}
//                       >
//                         {formatWeight(results.impurity)}g
//                       </Text>
//                       <Text style={[tw`text-xs mt-1`, { color: "#B91C1C" }]}>
//                         {formatWeight(
//                           convertGramsToTMR(results.impurity).tola,
//                           2
//                         )}{" "}
//                         tola
//                       </Text>
//                     </View>
//                   </View>
//                 </View>
//               </View>
//             )}
//           </View>
//         </View>

//         {/* Calculation Breakdown */}
//         {results.totalWeight > 0 && (
//           <View style={tw`bg-white rounded-2xl p-6 shadow-sm mb-6`}>
//             <View style={tw`flex-row items-center mb-4`}>
//               <MaterialCommunityIcons
//                 name="chart-pie"
//                 size={20}
//                 color="#6366F1"
//                 style={tw`mr-2`}
//               />
//               <Text style={tw`text-lg font-bold text-gray-900`}>
//                 Composition Details
//               </Text>
//             </View>

//             <View style={tw`space-y-3`}>
//               <View style={tw`flex-row justify-between items-center py-2`}>
//                 <Text style={tw`text-gray-600`}>Total Weight</Text>
//                 <Text style={tw`text-gray-900 font-semibold`}>
//                   {formatWeight(results.totalWeight)} grams
//                 </Text>
//               </View>
//               <View style={tw`flex-row justify-between items-center py-2`}>
//                 <Text style={tw`text-gray-600`}>
//                   Gold Purity ({selectedKarat}K)
//                 </Text>
//                 <Text style={tw`text-gray-900 font-semibold`}>
//                   {results.purityPercentage}%
//                 </Text>
//               </View>
//               <View style={tw`flex-row justify-between items-center py-2`}>
//                 <Text style={tw`text-gray-600`}>Pure Gold Weight</Text>
//                 <Text style={tw`text-yellow-600 font-semibold`}>
//                   {formatWeight(results.pureGold)} grams
//                 </Text>
//               </View>
//               <View style={tw`flex-row justify-between items-center py-2`}>
//                 <Text style={tw`text-gray-600`}>Impurity Weight</Text>
//                 <Text style={tw`text-red-600 font-semibold`}>
//                   {formatWeight(results.impurity)} grams
//                 </Text>
//               </View>

//               {/* Calculation Steps */}
//               <View
//                 style={[
//                   tw`mt-4 p-4 rounded-lg`,
//                   { backgroundColor: "#F8FAFC" },
//                 ]}
//               >
//                 <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>
//                   Calculation Steps:
//                 </Text>
//                 <Text style={tw`text-xs text-gray-600 mb-1`}>
//                   1. Pure Gold = {formatWeight(results.totalWeight)} ×{" "}
//                   {results.purityPercentage}% ÷ 100 ={" "}
//                   {formatWeight(results.pureGold)}g
//                 </Text>
//                 <Text style={tw`text-xs text-gray-600`}>
//                   2. Impurity = {formatWeight(results.totalWeight)} -{" "}
//                   {formatWeight(results.pureGold)} ={" "}
//                   {formatWeight(results.impurity)}g
//                 </Text>
//               </View>
//             </View>
//           </View>
//         )}

//         {/* Additional Information */}
//         <View style={tw`bg-blue-50 rounded-2xl p-6 mb-6`}>
//           <View style={tw`flex-row items-start mb-3`}>
//             <MaterialCommunityIcons
//               name="information"
//               size={20}
//               color="#3B82F6"
//               style={tw`mr-2 mt-0.5`}
//             />
//             <Text style={tw`text-base font-semibold text-blue-900 flex-1`}>
//               About Gold Purity
//             </Text>
//           </View>

//           <View style={tw`space-y-2`}>
//             <Text style={tw`text-sm text-blue-800`}>
//               • Higher karat means more pure gold and less impurity
//             </Text>
//             <Text style={tw`text-sm text-blue-800`}>
//               • 24K is pure gold (100% purity)
//             </Text>
//             <Text style={tw`text-sm text-blue-800`}>
//               • 22K contains 91.67% gold, 8.33% other metals
//             </Text>
//             <Text style={tw`text-sm text-blue-800`}>
//               • Impurities include copper, silver, zinc, or other alloy metals
//             </Text>
//           </View>
//         </View>

//         {/* Conversion Reference */}
//         <View style={tw`bg-gray-50 rounded-2xl p-6 mb-6`}>
//           <Text style={tw`text-base font-semibold text-gray-900 mb-4`}>
//             Weight Conversion Reference
//           </Text>

//           <View style={tw`grid grid-cols-2 gap-4`}>
//             <View>
//               <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>
//                 Traditional (TMR)
//               </Text>
//               <Text style={tw`text-xs text-gray-600`}>1 Tola = 12 Masha</Text>
//               <Text style={tw`text-xs text-gray-600`}>1 Masha = 8 Ratti</Text>
//               <Text style={tw`text-xs text-gray-600`}>1 Tola = 96 Ratti</Text>
//             </View>

//             <View>
//               <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>
//                 Metric Conversion
//               </Text>
//               <Text style={tw`text-xs text-gray-600`}>1 Tola = 11.664g</Text>
//               <Text style={tw`text-xs text-gray-600`}>1 Masha = 0.972g</Text>
//               <Text style={tw`text-xs text-gray-600`}>1 Ratti = 0.121g</Text>
//             </View>
//           </View>
//         </View>

//         {/* Bottom spacing for scroll */}
//         <View style={tw`h-20`} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default PurityCalculatorScreen;
