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
import { useRates } from "../hooks/useRates";

const GoldToMoneyScreen = ({ navigation }) => {
  const { currentRate, lastUpdated, updateRate } = useRates();
  const [inputMode, setInputMode] = useState("tmr"); // 'tmr' or 'grams'
  const [tmrInputs, setTmrInputs] = useState({
    tola: "",
    masha: "",
    ratti: "",
  });
  const [gramsInput, setGramsInput] = useState("");
  const [totalValue, setTotalValue] = useState(0);
  const [totalGrams, setTotalGrams] = useState(0);

  // Refs for input fields
  const tolaRef = useRef(null);
  const mashaRef = useRef(null);
  const rattiRef = useRef(null);
  const gramsRef = useRef(null);

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

  // Convert TMR to grams
  const convertTMRToGrams = (tola, masha, ratti) => {
    // 1 Tola = 11.664 grams
    // 1 Masha = 0.972 grams (11.664/12)
    // 1 Ratti = 0.121 grams (0.972/8)
    const tolaGrams = (parseFloat(tola) || 0) * 11.664;
    const mashaGrams = (parseFloat(masha) || 0) * 0.972;
    const rattiGrams = (parseFloat(ratti) || 0) * 0.121;

    return tolaGrams + mashaGrams + rattiGrams;
  };

  // Convert grams to TMR
  const convertGramsToTMR = (grams) => {
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

  // Handle TMR input changes
  const handleTMRChange = (field, value) => {
    // Allow only numbers and decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    if (parts.length <= 2) {
      let formattedValue = numericValue;
      // Limit decimal places
      if (parts[1] && parts[1].length > 3) {
        formattedValue = parts[0] + "." + parts[1].substring(0, 3);
      }

      setTmrInputs((prev) => ({
        ...prev,
        [field]: formattedValue,
      }));

      // Auto-update grams when TMR changes
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

      // Auto-update TMR when grams changes
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

  // Calculate total value
  const calculateMoneyValue = useCallback(() => {
    let grams = 0;

    if (inputMode === "tmr") {
      grams = convertTMRToGrams(
        tmrInputs.tola,
        tmrInputs.masha,
        tmrInputs.ratti
      );
    } else {
      grams = parseFloat(gramsInput) || 0;
    }

    if (grams === 0 || currentRate === 0) {
      setTotalValue(0);
      setTotalGrams(0);
      return;
    }

    // Calculate money value
    // (Grams / 11.664) * Rate per tola = Money value
    const value = (grams / 11.664) * currentRate;

    setTotalValue(value);
    setTotalGrams(grams);
  }, [tmrInputs, gramsInput, currentRate, inputMode]);

  // Auto-calculate when inputs change
  useEffect(() => {
    calculateMoneyValue();
  }, [calculateMoneyValue]);

  const clearAll = () => {
    setTmrInputs({ tola: "", masha: "", ratti: "" });
    setGramsInput("");
    setTotalValue(0);
    setTotalGrams(0);
  };

  const switchInputMode = (mode) => {
    setInputMode(mode);
    // Clear inputs when switching modes
    if (mode === "tmr") {
      setGramsInput("");
    } else {
      setTmrInputs({ tola: "", masha: "", ratti: "" });
    }
  };

  const showCalculationInfo = () => {
    Alert.alert(
      "Gold to Money Calculator",
      "This calculator converts gold weight to money value.\n\nFormula:\nMoney = (Grams ÷ 11.664) × Gold Rate per Tola\n\nConversion:\n• 1 Tola = 11.664 grams = 96 ratti\n• 1 Masha = 0.972 grams = 8 ratti\n• 1 Ratti = 0.121 grams\n\nYou can enter weight in TMR format or grams.",
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
            Gold to Money
          </Text>
        </View>

        <TouchableOpacity onPress={showCalculationInfo} style={tw`p-2`}>
          <MaterialCommunityIcons
            name="information"
            size={24}
            color="#EF4444"
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
          <View style={[tw`p-6 pb-4`, { backgroundColor: "#FEE2E2" }]}>
            <View style={tw`flex-row items-center justify-between mb-4`}>
              <View style={tw`flex-row items-center flex-1`}>
                <View
                  style={[
                    tw`w-12 h-12 rounded-full items-center justify-center mr-3`,
                    { backgroundColor: "#EF4444" },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="calculator-variant"
                    size={24}
                    color="#FFFFFF"
                  />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={[tw`text-xl font-bold`, { color: "#7F1D1D" }]}>
                    Gold to Money
                  </Text>
                  <Text style={[tw`text-sm`, { color: "#991B1B" }]}>
                    Convert Gold Weight to PKR
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={updateRate}
                style={[
                  tw`px-3 py-2 rounded-lg flex-row items-center`,
                  { backgroundColor: "#EF4444" },
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
                { borderColor: "#FECACA" },
              ]}
            >
              <View style={tw`flex-row items-center justify-between mb-2`}>
                <Text style={[tw`text-sm font-medium`, { color: "#991B1B" }]}>
                  Current Gold Rate
                </Text>
                <View style={tw`flex-row items-center`}>
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={14}
                    color="#991B1B"
                    style={tw`mr-1`}
                  />
                  <Text style={[tw`text-xs`, { color: "#991B1B" }]}>
                    {formatLastUpdated(lastUpdated)}
                  </Text>
                </View>
              </View>
              <Text style={[tw`text-2xl font-bold`, { color: "#7F1D1D" }]}>
                {formatCurrency(currentRate)} / Tola
              </Text>
              <Text style={[tw`text-sm mt-1`, { color: "#991B1B" }]}>
                {formatCurrency(Math.round(currentRate / 11.664))} per gram
              </Text>
            </View>
          </View>

          {/* Input Mode Toggle */}
          <View style={tw`px-6 pb-4`}>
            <View style={tw`flex-row bg-gray-100 rounded-xl p-1`}>
              <TouchableOpacity
                onPress={() => switchInputMode("tmr")}
                style={[
                  tw`flex-1 py-3 rounded-lg items-center`,
                  inputMode === "tmr" ? { backgroundColor: "#EF4444" } : {},
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
                  inputMode === "grams" ? { backgroundColor: "#EF4444" } : {},
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
                  Enter Gold Weight (TMR)
                </Text>

                {/* TMR Labels Row */}
                <View style={tw`flex-row mb-2`}>
                  <View style={tw`flex-1 items-center`}>
                    <Text
                      style={[tw`text-sm font-medium`, { color: "#991B1B" }]}
                    >
                      Tola
                    </Text>
                  </View>
                  <View style={tw`flex-1 items-center`}>
                    <Text
                      style={[tw`text-sm font-medium`, { color: "#991B1B" }]}
                    >
                      Masha
                    </Text>
                  </View>
                  <View style={tw`flex-1 items-center`}>
                    <Text
                      style={[tw`text-sm font-medium`, { color: "#991B1B" }]}
                    >
                      Ratti
                    </Text>
                  </View>
                </View>

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
                          borderColor: tmrInputs.tola ? "#EF4444" : "#E5E7EB",
                        },
                      ]}
                      returnKeyType="next"
                      onSubmitEditing={() => mashaRef.current?.focus()}
                    />
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
                          borderColor: tmrInputs.masha ? "#EF4444" : "#E5E7EB",
                        },
                      ]}
                      returnKeyType="next"
                      onSubmitEditing={() => rattiRef.current?.focus()}
                    />
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
                          borderColor: tmrInputs.ratti ? "#EF4444" : "#E5E7EB",
                        },
                      ]}
                      returnKeyType="done"
                      onSubmitEditing={dismissKeyboard}
                    />
                  </View>
                </View>

                {/* Equivalent Grams Display */}
                {gramsInput && (
                  <View style={tw`mt-3 items-center`}>
                    <Text style={tw`text-sm text-gray-600`}>Equivalent:</Text>
                    <Text style={[tw`text-lg font-bold`, { color: "#EF4444" }]}>
                      {gramsInput} grams
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              // Grams Input Mode
              <View style={tw`mb-6`}>
                <Text style={tw`text-base font-semibold text-gray-700 mb-3`}>
                  Enter Gold Weight (Grams)
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
                        borderColor: gramsInput ? "#EF4444" : "#E5E7EB",
                      },
                    ]}
                    returnKeyType="done"
                    onSubmitEditing={dismissKeyboard}
                  />
                  <View
                    style={[
                      tw`absolute right-4 top-4 px-2 py-1 rounded`,
                      { backgroundColor: "#EF4444" },
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
                      <Text style={[tw`font-bold`, { color: "#EF4444" }]}>
                        {tmrInputs.tola} T
                      </Text>
                      <Text style={[tw`font-bold`, { color: "#EF4444" }]}>
                        {tmrInputs.masha} M
                      </Text>
                      <Text style={[tw`font-bold`, { color: "#EF4444" }]}>
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
                Money = (Grams ÷ 11.664) × Rate/Tola
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
                      ? "#EF4444"
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
            {totalValue > 0 && (
              <View style={tw`space-y-4`}>
                {/* Main Result - Money Value */}
                <View
                  style={[
                    tw`border-2 rounded-xl p-6 text-center`,
                    { backgroundColor: "#ECFDF5", borderColor: "#10B981" },
                  ]}
                >
                  <Text
                    style={[tw`font-medium text-sm mb-2`, { color: "#065F46" }]}
                  >
                    Total Money Value
                  </Text>
                  <Text style={[tw`font-bold text-3xl`, { color: "#047857" }]}>
                    {formatCurrency(totalValue)}
                  </Text>
                  <Text style={[tw`text-sm mt-2`, { color: "#059669" }]}>
                    for {formatWeight(totalGrams)} grams of gold
                  </Text>
                </View>

                {/* Weight Summary */}
                <View
                  style={[
                    tw`border rounded-xl p-4`,
                    { backgroundColor: "#FEE2E2", borderColor: "#FECACA" },
                  ]}
                >
                  <Text
                    style={[
                      tw`font-medium text-sm mb-3 text-center`,
                      { color: "#991B1B" },
                    ]}
                  >
                    Weight Summary
                  </Text>

                  <View style={tw`flex-row justify-between items-center`}>
                    <View style={tw`flex-1 items-center`}>
                      <Text
                        style={[
                          tw`text-xs font-medium mb-1`,
                          { color: "#991B1B" },
                        ]}
                      >
                        TOTAL GRAMS
                      </Text>
                      <Text
                        style={[tw`text-lg font-bold`, { color: "#7F1D1D" }]}
                      >
                        {formatWeight(totalGrams)}
                      </Text>
                    </View>
                    <View
                      style={[tw`w-px h-8`, { backgroundColor: "#FECACA" }]}
                    />
                    <View style={tw`flex-1 items-center`}>
                      <Text
                        style={[
                          tw`text-xs font-medium mb-1`,
                          { color: "#991B1B" },
                        ]}
                      >
                        RATE/GRAM
                      </Text>
                      <Text
                        style={[tw`text-lg font-bold`, { color: "#7F1D1D" }]}
                      >
                        {formatCurrency(Math.round(currentRate / 11.664))}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Calculation Breakdown */}
        {totalValue > 0 && (
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
                <Text style={tw`text-gray-600`}>Gold Weight</Text>
                <Text style={tw`text-gray-900 font-semibold`}>
                  {formatWeight(totalGrams)} grams
                </Text>
              </View>
              <View style={tw`flex-row justify-between items-center py-2`}>
                <Text style={tw`text-gray-600`}>Tola Equivalent</Text>
                <Text style={tw`text-gray-900 font-semibold`}>
                  {formatWeight(totalGrams / 11.664, 4)} tola
                </Text>
              </View>
              <View style={tw`flex-row justify-between items-center py-2`}>
                <Text style={tw`text-gray-600`}>Rate per Tola</Text>
                <Text style={tw`text-gray-900 font-semibold`}>
                  {formatCurrency(currentRate)}
                </Text>
              </View>
              <View
                style={[
                  tw`flex-row justify-between items-center py-3 px-3 rounded-lg`,
                  { backgroundColor: "#ECFDF5" },
                ]}
              >
                <Text style={[tw`font-semibold`, { color: "#065F46" }]}>
                  Total Value
                </Text>
                <Text style={[tw`font-bold text-lg`, { color: "#047857" }]}>
                  {formatCurrency(totalValue)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Conversion Reference Card */}
        <View
          style={[
            tw`border rounded-xl p-4 mb-6`,
            { backgroundColor: "#FFFBEB", borderColor: "#FDE68A" },
          ]}
        >
          <View style={tw`flex-row items-center mb-3`}>
            <MaterialCommunityIcons
              name="scale-balance"
              size={20}
              color="#F59E0B"
              style={tw`mr-2`}
            />
            <Text style={[tw`font-semibold text-sm`, { color: "#92400E" }]}>
              Weight Conversion Reference
            </Text>
          </View>
          <View style={tw`space-y-2`}>
            <Text style={[tw`text-sm`, { color: "#78350F" }]}>
              • 1 Tola = 11.664 grams = 12 Masha = 96 Ratti
            </Text>
            <Text style={[tw`text-sm`, { color: "#78350F" }]}>
              • 1 Masha = 0.972 grams = 8 Ratti
            </Text>
            <Text style={[tw`text-sm`, { color: "#78350F" }]}>
              • 1 Ratti = 0.121 grams
            </Text>
          </View>
        </View>

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
                • Choose TMR for traditional measurements or Grams for precision
              </Text>
              <Text style={[tw`text-sm leading-5`, { color: "#1E3A8A" }]}>
                • Enter weight values and money value will calculate
                automatically
              </Text>
              <Text style={[tw`text-sm leading-5`, { color: "#1E3A8A" }]}>
                • Tap refresh to update gold rates for accurate calculations
              </Text>
              <Text style={[tw`text-sm leading-5`, { color: "#1E3A8A" }]}>
                • All calculations are based on current market rates
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GoldToMoneyScreen;
