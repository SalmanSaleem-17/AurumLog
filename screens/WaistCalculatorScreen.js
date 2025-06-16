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

const WaistCalculatorScreen = ({ navigation }) => {
  const [calculationMethod, setCalculationMethod] = useState("grams"); // "grams" or "ratti"
  const [waistData, setWaistData] = useState({
    goldWeight: "",
    waistValue: "",
    rattiValue: "", // Added for ratti calculation
    result: 0,
  });

  // Refs for input fields
  const goldWeightRef = useRef(null);
  const waistValueRef = useRef(null);
  const rattiValueRef = useRef(null);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Format weight with proper decimal places
  const formatWeight = (weight) => {
    if (weight === 0) return "0.0000";
    return weight.toFixed(4);
  };

  // Input validation for gold weight
  const handleGoldWeightChange = (text) => {
    // Allow decimal values (positive numbers only)
    const numericValue = text.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    if (parts.length <= 2) {
      let formattedValue = numericValue;
      // Limit decimal places to 4
      if (parts[1] && parts[1].length > 4) {
        formattedValue = parts[0] + "." + parts[1].substring(0, 4);
      }
      setWaistData((prev) => ({ ...prev, goldWeight: formattedValue }));
    }
  };

  // Input validation for waist value
  const handleWaistValueChange = (text) => {
    // Allow decimal values (positive numbers only)
    const numericValue = text.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    if (parts.length <= 2) {
      let formattedValue = numericValue;
      // Limit decimal places to 4
      if (parts[1] && parts[1].length > 4) {
        formattedValue = parts[0] + "." + parts[1].substring(0, 4);
      }
      setWaistData((prev) => ({ ...prev, waistValue: formattedValue }));
    }
  };

  // Input validation for ratti value
  const handleRattiValueChange = (text) => {
    // Allow decimal values (positive numbers only)
    const numericValue = text.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    if (parts.length <= 2) {
      let formattedValue = numericValue;
      // Limit decimal places to 4
      if (parts[1] && parts[1].length > 4) {
        formattedValue = parts[0] + "." + parts[1].substring(0, 4);
      }
      setWaistData((prev) => ({ ...prev, rattiValue: formattedValue }));
    }
  };

  const calculateWaistWeight = useCallback(() => {
    const goldWeight = parseFloat(waistData.goldWeight) || 0;
    const waistValue = parseFloat(waistData.waistValue) || 0;
    const rattiValue = parseFloat(waistData.rattiValue) || 0;

    if (goldWeight === 0) {
      setWaistData((prev) => ({ ...prev, result: 0 }));
      return;
    }

    let waistWeight = 0;

    if (calculationMethod === "grams") {
      if (waistValue === 0) {
        setWaistData((prev) => ({ ...prev, result: 0 }));
        return;
      }
      // Calculate waist weight using the formula: (Gold Weight * Waist Value) / 11.664
      waistWeight = (goldWeight * waistValue) / 11.664;
    } else if (calculationMethod === "ratti") {
      if (rattiValue === 0) {
        setWaistData((prev) => ({ ...prev, result: 0 }));
        return;
      }
      // Calculate waist weight using the formula: (Gold Weight * Ratti Value) / 96
      waistWeight = (goldWeight * rattiValue) / 96;
    }

    setWaistData((prev) => ({ ...prev, result: waistWeight }));
  }, [
    waistData.goldWeight,
    waistData.waistValue,
    waistData.rattiValue,
    calculationMethod,
  ]);

  const clearAll = () => {
    setWaistData({
      goldWeight: "",
      waistValue: "",
      rattiValue: "",
      result: 0,
    });
  };

  const showFormulaInfo = () => {
    const gramsFormula =
      "Formula: (Gold Weight × Waist Value) ÷ 11.664\n\nWhere:\n• Gold Weight: Weight of gold in grams\n• Waist Value: Waist measurement value\n• 11.664: Standard conversion factor";
    const rattiFormula =
      "Formula: (Gold Weight × Ratti Value) ÷ 96\n\nWhere:\n• Gold Weight: Weight of gold in grams\n• Ratti Value: Ratti measurement value\n• 96: Standard conversion factor for ratti";

    Alert.alert(
      "Waist Calculator Formula",
      calculationMethod === "grams" ? gramsFormula : rattiFormula,
      [{ text: "OK" }]
    );
  };

  const isCalculationReady = () => {
    const goldWeightValid = parseFloat(waistData.goldWeight) > 0;

    if (calculationMethod === "grams") {
      return goldWeightValid && parseFloat(waistData.waistValue) > 0;
    } else {
      return goldWeightValid && parseFloat(waistData.rattiValue) > 0;
    }
  };

  const getCurrentFormula = () => {
    if (calculationMethod === "grams") {
      return "(Gold Weight × Waist Value) ÷ 11.664";
    } else {
      return "(Gold Weight × Ratti Value) ÷ 96";
    }
  };

  const getConversionFactor = () => {
    return calculationMethod === "grams" ? "11.664" : "96";
  };

  const getSecondValue = () => {
    return calculationMethod === "grams"
      ? waistData.waistValue
      : waistData.rattiValue;
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
            Waist Calculator
          </Text>
        </View>

        <TouchableOpacity onPress={showFormulaInfo} style={tw`p-2`}>
          <Ionicons name="information-circle" size={24} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`p-4`}
        keyboardShouldPersistTaps="handled"
      >
        {/* Main Calculator Card */}
        <View style={tw`bg-white rounded-2xl p-6 shadow-sm mb-6`}>
          <View style={tw`flex-row items-center mb-6`}>
            <View
              style={tw`w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-3`}
            >
              <Ionicons name="calculator" size={24} color="#3B82F6" />
            </View>
            <View>
              <Text style={tw`text-xl font-bold text-gray-900`}>
                Waist Weight Calculator
              </Text>
              <Text style={tw`text-sm text-gray-600 mt-1`}>
                Calculate waist weight for gold
              </Text>
            </View>
          </View>

          {/* Calculation Method Toggle */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-base font-semibold text-gray-700 mb-3`}>
              Calculation Method
            </Text>
            <View style={tw`flex-row bg-gray-100 rounded-lg p-1`}>
              <TouchableOpacity
                onPress={() => setCalculationMethod("grams")}
                style={tw`flex-1 py-3 px-4 rounded-md ${
                  calculationMethod === "grams"
                    ? "bg-blue-500"
                    : "bg-transparent"
                }`}
              >
                <Text
                  style={tw`text-center font-medium ${
                    calculationMethod === "grams"
                      ? "text-white"
                      : "text-gray-600"
                  }`}
                >
                  Grams Method
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCalculationMethod("ratti")}
                style={tw`flex-1 py-3 px-4 rounded-md ${
                  calculationMethod === "ratti"
                    ? "bg-blue-500"
                    : "bg-transparent"
                }`}
              >
                <Text
                  style={tw`text-center font-medium ${
                    calculationMethod === "ratti"
                      ? "text-white"
                      : "text-gray-600"
                  }`}
                >
                  Ratti Method
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Input Fields */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-base font-semibold text-gray-700 mb-4`}>
              Enter Values
            </Text>

            {/* Gold Weight Input */}
            <View style={tw`mb-4`}>
              <Text style={tw`text-sm font-medium text-gray-600 mb-2`}>
                Gold Weight
              </Text>
              <View style={tw`relative`}>
                <TextInput
                  ref={goldWeightRef}
                  value={waistData.goldWeight}
                  onChangeText={handleGoldWeightChange}
                  placeholder="0.0000"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="decimal-pad"
                  style={tw`bg-gray-50 border border-gray-200 rounded-lg px-4 py-4 text-gray-900 text-lg pr-12`}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    if (calculationMethod === "grams") {
                      waistValueRef.current?.focus();
                    } else {
                      rattiValueRef.current?.focus();
                    }
                  }}
                />
                <Text
                  style={tw`absolute right-4 top-4 text-gray-500 text-base font-medium`}
                >
                  g
                </Text>
              </View>
            </View>

            {/* Conditional Input Based on Method */}
            {calculationMethod === "grams" ? (
              <View>
                <Text style={tw`text-sm font-medium text-gray-600 mb-2`}>
                  Waist Value
                </Text>
                <View style={tw`relative`}>
                  <TextInput
                    ref={waistValueRef}
                    value={waistData.waistValue}
                    onChangeText={handleWaistValueChange}
                    placeholder="0.0000"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                    style={tw`bg-gray-50 border border-gray-200 rounded-lg px-4 py-4 text-gray-900 text-lg`}
                    returnKeyType="done"
                    onSubmitEditing={dismissKeyboard}
                  />
                </View>
              </View>
            ) : (
              <View>
                <Text style={tw`text-sm font-medium text-gray-600 mb-2`}>
                  Ratti Value
                </Text>
                <View style={tw`relative`}>
                  <TextInput
                    ref={rattiValueRef}
                    value={waistData.rattiValue}
                    onChangeText={handleRattiValueChange}
                    placeholder="0.0000"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                    style={tw`bg-gray-50 border border-gray-200 rounded-lg px-4 py-4 text-gray-900 text-lg pr-20`}
                    returnKeyType="done"
                    onSubmitEditing={dismissKeyboard}
                  />
                  <Text
                    style={tw`absolute right-4 top-4 text-gray-500 text-base font-medium`}
                  >
                    ratti
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Formula Display */}
          <View
            style={tw`bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6`}
          >
            <Text style={tw`text-blue-700 font-medium text-sm mb-2`}>
              Formula Used (
              {calculationMethod === "grams" ? "Grams Method" : "Ratti Method"})
            </Text>
            <Text style={tw`text-blue-900 font-mono text-base`}>
              {getCurrentFormula()}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={tw`flex-row gap-3 mb-6`}>
            <TouchableOpacity
              onPress={() => {
                dismissKeyboard();
                calculateWaistWeight();
              }}
              style={tw`flex-1 ${
                isCalculationReady() ? "bg-blue-500" : "bg-gray-300"
              } rounded-lg py-4 items-center justify-center`}
              disabled={!isCalculationReady()}
            >
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
              style={tw`px-6 bg-gray-200 rounded-lg py-4 items-center justify-center`}
            >
              <Text style={tw`text-gray-700 font-medium text-base`}>Clear</Text>
            </TouchableOpacity>
          </View>

          {/* Result Card */}
          <View style={tw`bg-blue-50 border border-blue-200 rounded-lg p-4`}>
            <Text style={tw`text-blue-700 font-medium text-sm mb-1`}>
              Waist Weight (
              {calculationMethod === "grams" ? "Grams Method" : "Ratti Method"})
            </Text>
            <Text style={tw`text-blue-900 font-bold text-2xl`}>
              {formatWeight(waistData.result)} g
            </Text>
          </View>
        </View>

        {/* Calculation Breakdown */}
        {waistData.result > 0 && (
          <View style={tw`bg-white rounded-2xl p-6 shadow-sm mb-6`}>
            <Text style={tw`text-lg font-bold text-gray-900 mb-4`}>
              Calculation Breakdown
            </Text>

            <View style={tw`space-y-3`}>
              <View
                style={tw`flex-row justify-between items-center py-2 border-b border-gray-100`}
              >
                <Text style={tw`text-gray-600`}>Gold Weight</Text>
                <Text style={tw`text-gray-900 font-medium`}>
                  {waistData.goldWeight || "0"} g
                </Text>
              </View>
              <View
                style={tw`flex-row justify-between items-center py-2 border-b border-gray-100`}
              >
                <Text style={tw`text-gray-600`}>
                  {calculationMethod === "grams"
                    ? "Waist Value"
                    : "Ratti Value"}
                </Text>
                <Text style={tw`text-gray-900 font-medium`}>
                  {getSecondValue() || "0"}{" "}
                  {calculationMethod === "ratti" ? "ratti" : ""}
                </Text>
              </View>
              <View
                style={tw`flex-row justify-between items-center py-2 border-b border-gray-100`}
              >
                <Text style={tw`text-gray-600`}>Conversion Factor</Text>
                <Text style={tw`text-gray-900 font-medium`}>
                  {getConversionFactor()}
                </Text>
              </View>
              <View style={tw`flex-row justify-between items-center py-2`}>
                <Text style={tw`text-gray-600 font-semibold`}>Result</Text>
                <Text style={tw`text-blue-600 font-bold text-lg`}>
                  {formatWeight(waistData.result)} g
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Info Card */}
        <View style={tw`bg-yellow-50 border border-yellow-200 rounded-lg p-4`}>
          <View style={tw`flex-row items-start`}>
            <Ionicons
              name="bulb"
              size={20}
              color="#F59E0B"
              style={tw`mr-3 mt-0.5`}
            />
            <View style={tw`flex-1`}>
              <Text style={tw`text-yellow-900 font-medium text-sm mb-1`}>
                How to Use
              </Text>
              <Text style={tw`text-yellow-800 text-sm leading-5`}>
                1. Select your preferred calculation method (Grams or Ratti)
                {"\n"}
                2. Enter the gold weight in grams{"\n"}
                3. Enter the {calculationMethod === "grams"
                  ? "waist"
                  : "ratti"}{" "}
                value{"\n"}
                4. Tap Calculate to get the waist weight{"\n"}
                5. View the detailed breakdown below
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WaistCalculatorScreen;

// import React, { useState, useCallback, useRef } from "react";
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
// import { Ionicons } from "@expo/vector-icons";
// import tw from "twrnc";

// const WaistCalculatorScreen = ({ navigation }) => {
//   const [waistData, setWaistData] = useState({
//     goldWeight: "",
//     waistValue: "",
//     result: 0,
//   });

//   // Refs for input fields
//   const goldWeightRef = useRef(null);
//   const waistValueRef = useRef(null);

//   const dismissKeyboard = () => {
//     Keyboard.dismiss();
//   };

//   // Format weight with proper decimal places
//   const formatWeight = (weight) => {
//     if (weight === 0) return "0.0000";
//     return weight.toFixed(4);
//   };

//   // Input validation for gold weight
//   const handleGoldWeightChange = (text) => {
//     // Allow decimal values (positive numbers only)
//     const numericValue = text.replace(/[^0-9.]/g, "");
//     const parts = numericValue.split(".");
//     if (parts.length <= 2) {
//       let formattedValue = numericValue;
//       // Limit decimal places to 4
//       if (parts[1] && parts[1].length > 4) {
//         formattedValue = parts[0] + "." + parts[1].substring(0, 4);
//       }
//       setWaistData((prev) => ({ ...prev, goldWeight: formattedValue }));
//     }
//   };

//   // Input validation for waist value
//   const handleWaistValueChange = (text) => {
//     // Allow decimal values (positive numbers only)
//     const numericValue = text.replace(/[^0-9.]/g, "");
//     const parts = numericValue.split(".");
//     if (parts.length <= 2) {
//       let formattedValue = numericValue;
//       // Limit decimal places to 4
//       if (parts[1] && parts[1].length > 4) {
//         formattedValue = parts[0] + "." + parts[1].substring(0, 4);
//       }
//       setWaistData((prev) => ({ ...prev, waistValue: formattedValue }));
//     }
//   };

//   const calculateWaistWeight = useCallback(() => {
//     const goldWeight = parseFloat(waistData.goldWeight) || 0;
//     const waistValue = parseFloat(waistData.waistValue) || 0;

//     if (goldWeight === 0 || waistValue === 0) {
//       setWaistData((prev) => ({ ...prev, result: 0 }));
//       return;
//     }

//     // Calculate waist weight using the formula: (Gold Weight * Waist Value) / 11.664
//     const waistWeight = (goldWeight * waistValue) / 11.664;

//     setWaistData((prev) => ({ ...prev, result: waistWeight }));
//   }, [waistData.goldWeight, waistData.waistValue]);

//   const clearAll = () => {
//     setWaistData({
//       goldWeight: "",
//       waistValue: "",
//       result: 0,
//     });
//   };

//   const showFormulaInfo = () => {
//     Alert.alert(
//       "Waist Calculator Formula",
//       "Formula: (Gold Weight × Waist Value) ÷ 11.664\n\nWhere:\n• Gold Weight: Weight of gold in grams\n• Waist Value: Waist measurement value\n• 11.664: Standard conversion factor\n\nThis calculation helps determine the waist weight based on gold weight and waist value.",
//       [{ text: "OK" }]
//     );
//   };

//   const isCalculationReady = () => {
//     return (
//       parseFloat(waistData.goldWeight) > 0 &&
//       parseFloat(waistData.waistValue) > 0
//     );
//   };

//   return (
//     <SafeAreaView style={tw`flex-1 bg-gray-50`}>
//       {/* Header */}
//       <View
//         style={tw`flex-row items-center justify-between px-4 py-3 bg-white shadow-sm`}
//       >
//         <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2`}>
//           <Ionicons name="arrow-back" size={24} color="#374151" />
//         </TouchableOpacity>

//         <View style={tw`flex-1 items-center`}>
//           <Text style={tw`text-lg font-semibold text-gray-900`}>
//             Waist Calculator
//           </Text>
//         </View>

//         <TouchableOpacity onPress={showFormulaInfo} style={tw`p-2`}>
//           <Ionicons name="information-circle" size={24} color="#3B82F6" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         style={tw`flex-1`}
//         contentContainerStyle={tw`p-4`}
//         keyboardShouldPersistTaps="handled"
//       >
//         {/* Main Calculator Card */}
//         <View style={tw`bg-white rounded-2xl p-6 shadow-sm mb-6`}>
//           <View style={tw`flex-row items-center mb-6`}>
//             <View
//               style={tw`w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-3`}
//             >
//               <Ionicons name="calculator" size={24} color="#3B82F6" />
//             </View>
//             <View>
//               <Text style={tw`text-xl font-bold text-gray-900`}>
//                 Waist Weight Calculator
//               </Text>
//               <Text style={tw`text-sm text-gray-600 mt-1`}>
//                 Calculate waist weight for gold
//               </Text>
//             </View>
//           </View>

//           {/* Input Fields */}
//           <View style={tw`mb-6`}>
//             <Text style={tw`text-base font-semibold text-gray-700 mb-4`}>
//               Enter Values
//             </Text>

//             {/* Gold Weight Input */}
//             <View style={tw`mb-4`}>
//               <Text style={tw`text-sm font-medium text-gray-600 mb-2`}>
//                 Gold Weight
//               </Text>
//               <View style={tw`relative`}>
//                 <TextInput
//                   ref={goldWeightRef}
//                   value={waistData.goldWeight}
//                   onChangeText={handleGoldWeightChange}
//                   placeholder="0.0000"
//                   placeholderTextColor="#9CA3AF"
//                   keyboardType="decimal-pad"
//                   style={tw`bg-gray-50 border border-gray-200 rounded-lg px-4 py-4 text-gray-900 text-lg pr-12`}
//                   returnKeyType="next"
//                   onSubmitEditing={() => waistValueRef.current?.focus()}
//                 />
//                 <Text
//                   style={tw`absolute right-4 top-4 text-gray-500 text-base font-medium`}
//                 >
//                   g
//                 </Text>
//               </View>
//             </View>

//             {/* Waist Value Input */}
//             <View>
//               <Text style={tw`text-sm font-medium text-gray-600 mb-2`}>
//                 Waist Value
//               </Text>
//               <View style={tw`relative`}>
//                 <TextInput
//                   ref={waistValueRef}
//                   value={waistData.waistValue}
//                   onChangeText={handleWaistValueChange}
//                   placeholder="0.0000"
//                   placeholderTextColor="#9CA3AF"
//                   keyboardType="decimal-pad"
//                   style={tw`bg-gray-50 border border-gray-200 rounded-lg px-4 py-4 text-gray-900 text-lg`}
//                   returnKeyType="done"
//                   onSubmitEditing={dismissKeyboard}
//                 />
//               </View>
//             </View>
//           </View>

//           {/* Formula Display */}
//           <View
//             style={tw`bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6`}
//           >
//             <Text style={tw`text-blue-700 font-medium text-sm mb-2`}>
//               Formula Used
//             </Text>
//             <Text style={tw`text-blue-900 font-mono text-base`}>
//               (Gold Weight × Waist Value) ÷ 11.664
//             </Text>
//           </View>

//           {/* Action Buttons */}
//           <View style={tw`flex-row gap-3 mb-6`}>
//             <TouchableOpacity
//               onPress={() => {
//                 dismissKeyboard();
//                 calculateWaistWeight();
//               }}
//               style={tw`flex-1 ${
//                 isCalculationReady() ? "bg-blue-500" : "bg-gray-300"
//               } rounded-lg py-4 items-center justify-center`}
//               disabled={!isCalculationReady()}
//             >
//               <Text
//                 style={tw`${
//                   isCalculationReady() ? "text-white" : "text-gray-500"
//                 } font-semibold text-base`}
//               >
//                 Calculate
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={clearAll}
//               style={tw`px-6 bg-gray-200 rounded-lg py-4 items-center justify-center`}
//             >
//               <Text style={tw`text-gray-700 font-medium text-base`}>Clear</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Result Card */}
//           <View style={tw`bg-blue-50 border border-blue-200 rounded-lg p-4`}>
//             <Text style={tw`text-blue-700 font-medium text-sm mb-1`}>
//               Waist Weight
//             </Text>
//             <Text style={tw`text-blue-900 font-bold text-2xl`}>
//               {formatWeight(waistData.result)} g
//             </Text>
//           </View>
//         </View>

//         {/* Calculation Breakdown */}
//         {waistData.result > 0 && (
//           <View style={tw`bg-white rounded-2xl p-6 shadow-sm mb-6`}>
//             <Text style={tw`text-lg font-bold text-gray-900 mb-4`}>
//               Calculation Breakdown
//             </Text>

//             <View style={tw`space-y-3`}>
//               <View
//                 style={tw`flex-row justify-between items-center py-2 border-b border-gray-100`}
//               >
//                 <Text style={tw`text-gray-600`}>Gold Weight</Text>
//                 <Text style={tw`text-gray-900 font-medium`}>
//                   {waistData.goldWeight || "0"} g
//                 </Text>
//               </View>
//               <View
//                 style={tw`flex-row justify-between items-center py-2 border-b border-gray-100`}
//               >
//                 <Text style={tw`text-gray-600`}>Waist Value</Text>
//                 <Text style={tw`text-gray-900 font-medium`}>
//                   {waistData.waistValue || "0"}
//                 </Text>
//               </View>
//               <View
//                 style={tw`flex-row justify-between items-center py-2 border-b border-gray-100`}
//               >
//                 <Text style={tw`text-gray-600`}>Conversion Factor</Text>
//                 <Text style={tw`text-gray-900 font-medium`}>11.664</Text>
//               </View>
//               <View style={tw`flex-row justify-between items-center py-2`}>
//                 <Text style={tw`text-gray-600 font-semibold`}>Result</Text>
//                 <Text style={tw`text-blue-600 font-bold text-lg`}>
//                   {formatWeight(waistData.result)} g
//                 </Text>
//               </View>
//             </View>
//           </View>
//         )}

//         {/* Info Card */}
//         <View style={tw`bg-yellow-50 border border-yellow-200 rounded-lg p-4`}>
//           <View style={tw`flex-row items-start`}>
//             <Ionicons
//               name="bulb"
//               size={20}
//               color="#F59E0B"
//               style={tw`mr-3 mt-0.5`}
//             />
//             <View style={tw`flex-1`}>
//               <Text style={tw`text-yellow-900 font-medium text-sm mb-1`}>
//                 How to Use
//               </Text>
//               <Text style={tw`text-yellow-800 text-sm leading-5`}>
//                 1. Enter the gold weight in grams{"\n"}
//                 2. Enter the waist value{"\n"}
//                 3. Tap Calculate to get the waist weight{"\n"}
//                 4. View the detailed breakdown below
//               </Text>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default WaistCalculatorScreen;
