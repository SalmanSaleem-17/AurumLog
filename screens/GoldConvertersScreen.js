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

export default function GoldConvertersListScreen({ navigation, route }) {
  const { currentRate = 341000 } = route.params || {};

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const converters = [
    {
      id: "tmr-to-grams",
      title: "TMR to Grams",
      description: "Convert Tola, Masha, Ratti to Grams",
      icon: "scale-balance",
      color: "#10B981",
      screen: "TMRToGramsScreen",
    },
    {
      id: "grams-to-tmr",
      title: "Grams to TMR",
      description: "Convert Grams to Tola, Masha, Ratti",
      icon: "weight-gram",
      color: "#8B5CF6",
      screen: "GramsToTMRScreen",
    },
    {
      id: "money-to-gold",
      title: "Money to Gold",
      description: "Calculate gold quantity from money",
      icon: "cash-multiple",
      color: "#F59E0B",
      screen: "MoneyToGoldScreen",
    },
    {
      id: "gold-to-money",
      title: "Gold to Money",
      description: "Calculate money value from gold weight",
      icon: "calculator-variant",
      color: "#EF4444",
      screen: "GoldToMoneyScreen",
    },
    {
      id: "waist-calculator",
      title: "Waist Calculator",
      description: "Calculate waist value for gold weight",
      icon: "tape-measure",
      color: "#3B82F6",
      screen: "WaistCalculatorScreen",
    },
    {
      id: "impurity-calculator",
      title: "Impurity Calculator",
      description: "Calculate impurity for gold karat wise",
      icon: "test-tube",
      color: "#EC4899",
      screen: "ImpurityCalculatorScreen",
    },
    {
      id: "purity-calculator",
      title: "Purity Calculator",
      description: "Calculate gold purity from weight & impurity",
      icon: "diamond-stone",
      color: "#06B6D4",
      screen: "PurityCalculatorScreen",
    },
    {
      id: "conversion-reference",
      title: "Conversion Reference",
      description: "Quick reference for conversion rates",
      icon: "information-outline",
      color: "#6B7280",
      screen: "ConversionReferenceScreen",
    },
  ];

  const CustomHeader = () => (
    <SafeAreaView style={{ backgroundColor: "#F59E0B" }}>
      <StatusBar barStyle="light-content" backgroundColor="#F59E0B" />
      <View style={[tw`flex-row items-center justify-between px-4 py-3`]}>
        <View style={tw`flex-row items-center flex-1`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[
              tw`p-2 rounded-full mr-3`,
              { backgroundColor: "rgba(255,255,255,0.2)" },
            ]}
          >
            <MaterialCommunityIcons name="arrow-left" size={20} color="white" />
          </TouchableOpacity>
          <View style={tw`flex-1 pt-5 flex-column`}>
            <Text style={tw`text-white text-lg font-bold`}>
              Gold Converters
            </Text>
            <Text
              style={[
                tw`text-xs text-[#F59E0B] font-semibold mt-1`,
                { color: "rgba(255,255,255,0.8)" },
              ]}
            >
              Choose a converter tool
            </Text>
          </View>
        </View>
        <View
          style={[
            tw`px-3 py-1 rounded-full`,
            { backgroundColor: "rgba(255,255,255,0.2)" },
          ]}
        >
          <Text style={tw`text-white text-xs font-medium`}>
            Rate: {formatCurrency(currentRate)}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );

  const ConverterItem = ({ converter }) => (
    <TouchableOpacity
      style={[
        tw`bg-white rounded-3xl p-6 mb-4 mx-1`,
        {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
          elevation: 8,
          borderWidth: 1,
          borderColor: "#f3f4f6",
        },
      ]}
      onPress={() => navigation.navigate(converter.screen, { currentRate })}
      activeOpacity={0.8}
    >
      <View style={tw`flex-row items-center`}>
        <View
          style={[
            tw`p-4 rounded-2xl mr-4`,
            { backgroundColor: `${converter.color}15` },
          ]}
        >
          <MaterialCommunityIcons
            name={converter.icon}
            size={28}
            color={converter.color}
          />
        </View>
        <View style={tw`flex-1`}>
          <Text style={tw`text-xl font-bold text-gray-900 mb-1`}>
            {converter.title}
          </Text>
          <Text style={tw`text-gray-600 text-sm leading-5`}>
            {converter.description}
          </Text>
        </View>
        <View
          style={[
            tw`p-2 rounded-full`,
            { backgroundColor: `${converter.color}15` },
          ]}
        >
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={converter.color}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-gradient-to-b from-yellow-50 to-orange-50`}>
      <CustomHeader />

      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`p-4 pb-10`}
        showsVerticalScrollIndicator={false}
      >
        <View style={tw`mb-6`}>
          <Text style={tw`text-2xl font-bold text-gray-900 mb-2`}>
            Available Converters
          </Text>
          <Text style={tw`text-gray-600 text-base leading-6`}>
            Select any converter below to start calculating gold conversions
          </Text>
        </View>

        {converters.map((converter) => (
          <ConverterItem key={converter.id} converter={converter} />
        ))}

        {/* Quick Stats Card */}
        <View
          style={[
            tw`bg-white rounded-3xl p-6 mt-4 mx-1`,
            {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.12,
              shadowRadius: 16,
              elevation: 8,
              borderWidth: 1,
              borderColor: "#f3f4f6",
            },
          ]}
        >
          <View style={tw`flex-row items-center mb-4`}>
            <View
              style={[
                tw`p-3 rounded-2xl mr-3`,
                { backgroundColor: "#F59E0B15" },
              ]}
            >
              <MaterialCommunityIcons
                name="chart-line"
                size={24}
                color="#F59E0B"
              />
            </View>
            <Text style={tw`text-lg font-bold text-gray-900`}>
              Today's Rate
            </Text>
          </View>

          <View style={tw`flex-row justify-between items-center`}>
            <View>
              <Text style={tw`text-3xl font-bold text-[#F59E0B]`}>
                {formatCurrency(currentRate)}
              </Text>
              <Text style={tw`text-gray-600 text-sm mt-1`}>
                Per Tola (24K Gold)
              </Text>
            </View>
            <View
              style={[
                tw`px-4 py-2 rounded-full`,
                { backgroundColor: "#10B98115" },
              ]}
            >
              <Text style={tw`text-[#10B981] font-bold text-sm`}>
                Live Rate
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// import {
//   View,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
//   KeyboardAvoidingView,
//   Platform,
//   Keyboard,
// } from "react-native";
// import { useState, useRef, useCallback } from "react";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import tw from "../utils/tw";
// export default function GoldConvertersScreen({ navigation, route }) {
//   const { currentRate = 341000 } = route.params || {};
//   const [waistValue, setWaistValue] = useState("0"); // Default waist value per tola

//   // State for each converter
//   const [tmrToGrams, setTmrToGrams] = useState({
//     tola: "",
//     masha: "",
//     ratti: "",
//     result: 0,
//   });

//   const [gramsToTmr, setGramsToTmr] = useState({
//     grams: "",
//     result: { tola: 0, masha: 0, ratti: 0 },
//   });

//   const [moneyToGold, setMoneyToGold] = useState({
//     amount: "",
//     karat: "24",
//     result: { grams: 0, tola: 0, masha: 0, ratti: 0 },
//   });

//   const [goldToMoney, setGoldToMoney] = useState({
//     weight: "",
//     tola: "",
//     masha: "",
//     ratti: "",
//     unit: "grams",
//     karat: "24",
//     result: 0,
//   });

//   // Conversion constants
//   const TOLA_TO_GRAMS = 11.664;
//   const MASHA_TO_GRAMS = 0.972;
//   const RATTI_TO_GRAMS = 0.1215;

//   // Karat purity percentages
//   const karatPurity = {
//     24: 1.0,
//     22: 0.9167,
//     21: 0.875,
//     18: 0.75,
//     14: 0.585,
//     10: 0.417,
//   };

//   const formatCurrency = useCallback((amount) => {
//     return new Intl.NumberFormat("en-PK", {
//       style: "currency",
//       currency: "PKR",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(amount);
//   }, []);

//   const formatWeight = useCallback((weight) => {
//     return parseFloat(weight || 0).toFixed(3);
//   }, []);

//   // TMR to Grams Converter
//   const calculateTmrToGrams = useCallback(() => {
//     const tola = parseFloat(tmrToGrams.tola) || 0;
//     const masha = parseFloat(tmrToGrams.masha) || 0;
//     const ratti = parseFloat(tmrToGrams.ratti) || 0;

//     const totalGrams =
//       tola * TOLA_TO_GRAMS + masha * MASHA_TO_GRAMS + ratti * RATTI_TO_GRAMS;

//     setTmrToGrams((prev) => ({ ...prev, result: totalGrams }));
//   }, [tmrToGrams.tola, tmrToGrams.masha, tmrToGrams.ratti]);

//   // Grams to TMR Converter
//   const calculateGramsToTmr = useCallback(() => {
//     const grams = parseFloat(gramsToTmr.grams) || 0;

//     const tola = Math.floor(grams / TOLA_TO_GRAMS);
//     const remainingAfterTola = grams - tola * TOLA_TO_GRAMS;

//     const masha = Math.floor(remainingAfterTola / MASHA_TO_GRAMS);
//     const remainingAfterMasha = remainingAfterTola - masha * MASHA_TO_GRAMS;

//     const ratti = Math.round(remainingAfterMasha / RATTI_TO_GRAMS);

//     setGramsToTmr((prev) => ({
//       ...prev,
//       result: { tola, masha, ratti },
//     }));
//   }, [gramsToTmr.grams]);

//   // Money to Gold Converter
//   const calculateMoneyToGold = useCallback(() => {
//     const amount = parseFloat(moneyToGold.amount) || 0;
//     const purity = karatPurity[moneyToGold.karat];
//     const effectiveRate = currentRate * purity;

//     const grams = (amount / effectiveRate) * TOLA_TO_GRAMS;
//     const tola = grams / TOLA_TO_GRAMS;

//     const tolaWhole = Math.floor(tola);
//     const remainingGrams = grams - tolaWhole * TOLA_TO_GRAMS;
//     const masha = Math.floor(remainingGrams / MASHA_TO_GRAMS);
//     const ratti = Math.round(
//       (remainingGrams - masha * MASHA_TO_GRAMS) / RATTI_TO_GRAMS
//     );

//     setMoneyToGold((prev) => ({
//       ...prev,
//       result: { grams, tola, masha, ratti },
//     }));
//   }, [moneyToGold.amount, moneyToGold.karat, currentRate]);

//   // Gold to Money Converter
//   const calculateGoldToMoney = useCallback(() => {
//     const purity = karatPurity[goldToMoney.karat];
//     let weightInGrams = 0;

//     if (goldToMoney.unit === "grams") {
//       weightInGrams = parseFloat(goldToMoney.weight) || 0;
//     } else if (goldToMoney.unit === "tmr") {
//       const tola = parseFloat(goldToMoney.tola) || 0;
//       const masha = parseFloat(goldToMoney.masha) || 0;
//       const ratti = parseFloat(goldToMoney.ratti) || 0;

//       weightInGrams =
//         tola * TOLA_TO_GRAMS + masha * MASHA_TO_GRAMS + ratti * RATTI_TO_GRAMS;
//     }

//     const tolaEquivalent = weightInGrams / TOLA_TO_GRAMS;
//     const effectiveRate = currentRate * purity;
//     const totalValue = tolaEquivalent * effectiveRate;

//     setGoldToMoney((prev) => ({ ...prev, result: totalValue }));
//   }, [
//     goldToMoney.weight,
//     goldToMoney.tola,
//     goldToMoney.masha,
//     goldToMoney.ratti,
//     goldToMoney.unit,
//     goldToMoney.karat,
//     currentRate,
//   ]);

//   // Calculate waist value
//   const calculateWaist = useCallback(
//     (grams) => {
//       const weightInGrams = parseFloat(grams) || 0;
//       const waistPerTola = parseFloat(waistValue) || 100;
//       const waist = (weightInGrams * waistPerTola) / TOLA_TO_GRAMS;
//       return waist.toFixed(2);
//     },
//     [waistValue]
//   );

//   const CustomHeader = () => (
//     <SafeAreaView style={{ backgroundColor: "#F59E0B" }}>
//       <StatusBar barStyle="light-content" backgroundColor="#F59E0B" />
//       <View style={[tw`flex-row items-center justify-between px-4 py-3`]}>
//         <View style={tw`flex-row items-center flex-1`}>
//           <TouchableOpacity
//             onPress={() => navigation.goBack()}
//             style={[
//               tw`p-2 rounded-full mr-3`,
//               { backgroundColor: "rgba(255,255,255,0.2)" },
//             ]}
//           >
//             <MaterialCommunityIcons name="arrow-left" size={20} color="white" />
//           </TouchableOpacity>
//           <View style={tw`flex-1 pt-5 flex-column`}>
//             <Text style={tw`text-white text-lg font-bold`}>
//               Gold Converters
//             </Text>
//             <Text
//               style={[
//                 tw`text-xs text-[#F59E0B] font-semibold mt-1`,
//                 { color: "rgba(255,255,255,0.8)" },
//               ]}
//             >
//               Convert between karats, tola, masha & ratti
//             </Text>
//           </View>
//         </View>
//         <View
//           style={[
//             tw`px-3 py-1 rounded-full`,
//             { backgroundColor: "rgba(255,255,255,0.2)" },
//           ]}
//         >
//           <Text style={tw`text-white text-xs font-medium`}>
//             Rate: {formatCurrency(currentRate)}
//           </Text>
//         </View>
//       </View>
//     </SafeAreaView>
//   );

//   const ConverterCard = ({ title, icon, color, children }) => (
//     <View
//       style={[
//         tw`bg-white rounded-3xl p-6 mb-5 mx-1`,
//         {
//           shadowColor: "#000",
//           shadowOffset: { width: 0, height: 8 },
//           shadowOpacity: 0.12,
//           shadowRadius: 16,
//           elevation: 8,
//           borderWidth: 1,
//           borderColor: "#f3f4f6",
//         },
//       ]}
//     >
//       <View style={tw`flex-row items-center mb-5`}>
//         <View
//           style={[tw`p-4 rounded-2xl mr-4`, { backgroundColor: `${color}15` }]}
//         >
//           <MaterialCommunityIcons name={icon} size={28} color={color} />
//         </View>
//         <Text style={tw`text-xl font-bold text-gray-900`}>{title}</Text>
//       </View>
//       {children}
//     </View>
//   );

//   const InputField = ({
//     label,
//     value,
//     onChangeText,
//     placeholder,
//     unit,
//     inputRef,
//   }) => (
//     <View style={tw`mb-4`}>
//       <Text style={tw`text-yellow-700 text-sm font-semibold mb-2`}>
//         {label}
//       </Text>
//       <View
//         style={[
//           tw`flex-row items-center bg-gray-50 rounded-2xl border-2 border-gray-100`,
//           {
//             shadowColor: "#000",
//             shadowOffset: { width: 0, height: 2 },
//             shadowOpacity: 0.05,
//             shadowRadius: 4,
//             elevation: 2,
//           },
//         ]}
//       >
//         <TextInput
//           ref={inputRef}
//           style={tw`flex-1 px-5 py-4 text-lg text-gray-900 font-medium`}
//           value={value}
//           onChangeText={onChangeText}
//           placeholder={placeholder}
//           placeholderTextColor="#9CA3AF"
//           keyboardType="numeric"
//           returnKeyType="next"
//           autoCorrect={false}
//           autoCapitalize="none"
//           selectTextOnFocus={true}
//           blurOnSubmit={false}
//           onSubmitEditing={() => Keyboard.dismiss()}
//         />
//         {unit && (
//           <View
//             style={[
//               tw`px-4 py-2 mr-2 rounded-xl`,
//               { backgroundColor: "#e5e7eb" },
//             ]}
//           >
//             <Text style={tw`text-gray-700 text-sm font-bold`}>{unit}</Text>
//           </View>
//         )}
//       </View>
//     </View>
//   );

//   const KaratSelector = ({ value, onValueChange }) => (
//     <View style={tw`mb-4`}>
//       <Text style={tw`text-gray-700 text-sm font-semibold mb-3`}>
//         Karat Purity
//       </Text>
//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         style={tw`-mx-1`}
//         contentContainerStyle={tw`px-1`}
//       >
//         <View style={tw`flex-row gap-3`}>
//           {Object.keys(karatPurity).map((karat) => (
//             <TouchableOpacity
//               key={karat}
//               onPress={() => onValueChange(karat)}
//               style={[
//                 tw`px-6 py-4 rounded-2xl border-2 min-w-20`,
//                 value === karat
//                   ? { backgroundColor: "#F59E0B", borderColor: "#F59E0B" }
//                   : { backgroundColor: "white", borderColor: "#E5E7EB" },
//                 {
//                   shadowColor: "#000",
//                   shadowOffset: { width: 0, height: 2 },
//                   shadowOpacity: value === karat ? 0.15 : 0.05,
//                   shadowRadius: 4,
//                   elevation: value === karat ? 4 : 2,
//                 },
//               ]}
//               activeOpacity={0.8}
//             >
//               <Text
//                 style={[
//                   tw`font-bold text-base text-center`,
//                   value === karat ? tw`text-white` : tw`text-gray-700`,
//                 ]}
//               >
//                 {karat}K
//               </Text>
//               <Text
//                 style={[
//                   tw`font-medium text-xs mt-1 text-center`,
//                   value === karat
//                     ? tw`text-white opacity-90`
//                     : tw`text-gray-500`,
//                 ]}
//               >
//                 {Math.round(karatPurity[karat] * 100)}%
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );

//   const TMRResultTable = ({
//     tola,
//     masha,
//     ratti,
//     color,
//     showGrams = false,
//     grams = 0,
//   }) => (
//     <View
//       style={[
//         tw`rounded-2xl border-2 overflow-hidden`,
//         { borderColor: `${color}30` },
//       ]}
//     >
//       {/* Header Row */}
//       <View style={[tw`flex-row`, { backgroundColor: `${color}20` }]}>
//         <View
//           style={[
//             tw`flex-1 py-4 px-3 border-r-2`,
//             { borderColor: `${color}30` },
//           ]}
//         >
//           <Text
//             style={[tw`text-center font-bold text-sm`, { color: `${color}` }]}
//           >
//             TOLA
//           </Text>
//         </View>
//         <View
//           style={[
//             tw`flex-1 py-4 px-3 border-r-2`,
//             { borderColor: `${color}30` },
//           ]}
//         >
//           <Text
//             style={[tw`text-center font-bold text-sm`, { color: `${color}` }]}
//           >
//             MASHA
//           </Text>
//         </View>
//         <View style={tw`flex-1 py-4 px-3`}>
//           <Text
//             style={[tw`text-center font-bold text-sm`, { color: `${color}` }]}
//           >
//             RATTI
//           </Text>
//         </View>
//       </View>

//       {/* Values Row */}
//       <View
//         style={[
//           tw`flex-row bg-white border-t-2`,
//           { borderColor: `${color}30` },
//         ]}
//       >
//         <View
//           style={[
//             tw`flex-1 py-4 px-3 border-r-2`,
//             { borderColor: `${color}30` },
//           ]}
//         >
//           <Text style={tw`text-center font-bold text-lg text-gray-900`}>
//             {tola}
//           </Text>
//         </View>
//         <View
//           style={[
//             tw`flex-1 py-4 px-3 border-r-2`,
//             { borderColor: `${color}30` },
//           ]}
//         >
//           <Text style={tw`text-center font-bold text-lg text-gray-900`}>
//             {masha}
//           </Text>
//         </View>
//         <View style={tw`flex-1 py-4 px-3`}>
//           <Text style={tw`text-center font-bold text-lg text-gray-900`}>
//             {ratti}
//           </Text>
//         </View>
//       </View>

//       {/* Grams Row (if needed) */}
//       {showGrams && (
//         <View
//           style={[tw`bg-white border-t-2 py-3`, { borderColor: `${color}30` }]}
//         >
//           <Text
//             style={[tw`text-center font-bold text-lg`, { color: `${color}` }]}
//           >
//             Total: {formatWeight(grams)} grams
//           </Text>
//         </View>
//       )}
//     </View>
//   );

//   const ConvertButton = ({ onPress, color, title = "Convert" }) => (
//     <TouchableOpacity
//       style={[
//         tw`py-4 rounded-2xl mb-5`,
//         {
//           backgroundColor: color,
//           shadowColor: color,
//           shadowOffset: { width: 0, height: 4 },
//           shadowOpacity: 0.3,
//           shadowRadius: 8,
//           elevation: 6,
//         },
//       ]}
//       onPress={onPress}
//       activeOpacity={0.8}
//     >
//       <Text style={tw`text-center text-white font-bold text-lg`}>{title}</Text>
//     </TouchableOpacity>
//   );

//   const ResultCard = ({ value, label, color }) => (
//     <View
//       style={[
//         tw`p-5 rounded-2xl border-2`,
//         {
//           backgroundColor: `${color}10`,
//           borderColor: `${color}30`,
//           shadowColor: "#000",
//           shadowOffset: { width: 0, height: 2 },
//           shadowOpacity: 0.05,
//           shadowRadius: 4,
//           elevation: 2,
//         },
//       ]}
//     >
//       <Text
//         style={[tw`text-center font-bold text-2xl mb-1`, { color: `${color}` }]}
//       >
//         {value}
//       </Text>
//       <Text
//         style={[tw`text-center font-medium text-sm`, { color: `${color}AA` }]}
//       >
//         {label}
//       </Text>
//     </View>
//   );

//   // Create refs for all text inputs
//   const tolaRef = useRef();
//   const mashaRef = useRef();
//   const rattiRef = useRef();
//   const gramsRef = useRef();
//   const amountRef = useRef();
//   const weightRef = useRef();
//   const waistValueRef = useRef();

//   const dismissKeyboard = () => {
//     Keyboard.dismiss();
//   };

//   return (
//     <View style={tw`flex-1 bg-gradient-to-b from-yellow-50 to-orange-50`}>
//       <CustomHeader />

//       <KeyboardAvoidingView
//         style={tw`flex-1`}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
//       >
//         <ScrollView
//           style={tw`flex-1`}
//           contentContainerStyle={tw`p-4 pb-10`}
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//           keyboardDismissMode="on-drag"
//           nestedScrollEnabled={true}
//         >
//           {/* TMR to Grams Converter */}
//           <ConverterCard
//             title="TMR to Grams"
//             icon="scale-balance"
//             color="#10B981"
//           >
//             <View style={tw`flex-row gap-4 mb-4`}>
//               <View style={tw`flex-1`}>
//                 <InputField
//                   label="Tola"
//                   value={tmrToGrams.tola}
//                   onChangeText={(text) =>
//                     setTmrToGrams((prev) => ({ ...prev, tola: text }))
//                   }
//                   placeholder="0"
//                   unit="T"
//                   inputRef={tolaRef}
//                 />
//               </View>
//               <View style={tw`flex-1`}>
//                 <InputField
//                   label="Masha"
//                   style={tw`text-[#10B981]`}
//                   value={tmrToGrams.masha}
//                   onChangeText={(text) =>
//                     setTmrToGrams((prev) => ({ ...prev, masha: text }))
//                   }
//                   placeholder="0"
//                   unit="M"
//                   inputRef={mashaRef}
//                 />
//               </View>
//               <View style={tw`flex-1`}>
//                 <InputField
//                   label="Ratti"
//                   value={tmrToGrams.ratti}
//                   onChangeText={(text) =>
//                     setTmrToGrams((prev) => ({ ...prev, ratti: text }))
//                   }
//                   placeholder="0"
//                   unit="R"
//                   inputRef={rattiRef}
//                 />
//               </View>
//             </View>

//             <ConvertButton
//               onPress={() => {
//                 dismissKeyboard();
//                 calculateTmrToGrams();
//               }}
//               color="#10B981"
//             />

//             <ResultCard
//               value={formatWeight(tmrToGrams.result)}
//               label="Total Grams"
//               color="#10B981"
//             />
//           </ConverterCard>

//           {/* Grams to TMR Converter */}
//           <ConverterCard
//             title="Grams to TMR"
//             icon="weight-gram"
//             color="#8B5CF6"
//           >
//             <InputField
//               label="Weight in Grams"
//               value={gramsToTmr.grams}
//               onChangeText={(text) =>
//                 setGramsToTmr((prev) => ({ ...prev, grams: text }))
//               }
//               placeholder="Enter weight"
//               unit="g"
//               inputRef={gramsRef}
//             />

//             <ConvertButton
//               onPress={() => {
//                 dismissKeyboard();
//                 calculateGramsToTmr();
//               }}
//               color="#8B5CF6"
//             />

//             <TMRResultTable
//               tola={gramsToTmr.result.tola}
//               masha={gramsToTmr.result.masha}
//               ratti={gramsToTmr.result.ratti}
//               color="#8B5CF6"
//             />
//           </ConverterCard>

//           {/* Money to Gold Converter */}
//           <ConverterCard
//             title="Money to Gold"
//             icon="cash-multiple"
//             color="#F59E0B"
//           >
//             <InputField
//               label="Amount"
//               value={moneyToGold.amount}
//               onChangeText={(text) =>
//                 setMoneyToGold((prev) => ({ ...prev, amount: text }))
//               }
//               placeholder="Enter amount"
//               unit="PKR"
//               inputRef={amountRef}
//             />

//             <KaratSelector
//               value={moneyToGold.karat}
//               onValueChange={(karat) =>
//                 setMoneyToGold((prev) => ({ ...prev, karat }))
//               }
//             />

//             <ConvertButton
//               onPress={() => {
//                 dismissKeyboard();
//                 calculateMoneyToGold();
//               }}
//               color="#F59E0B"
//             />

//             <TMRResultTable
//               tola={Math.floor(moneyToGold.result.tola)}
//               masha={moneyToGold.result.masha}
//               ratti={moneyToGold.result.ratti}
//               color="#F59E0B"
//               showGrams={true}
//               grams={moneyToGold.result.grams}
//             />
//           </ConverterCard>

//           {/* Gold to Money Converter */}
//           <ConverterCard
//             title="Gold to Money"
//             icon="calculator-variant"
//             color="#EF4444"
//           >
//             {/* Unit Selection */}
//             <View style={tw`mb-4`}>
//               <Text style={tw`text-gray-700 text-sm font-semibold mb-3`}>
//                 Input Type
//               </Text>
//               <View style={tw`flex-row gap-3`}>
//                 <TouchableOpacity
//                   onPress={() =>
//                     setGoldToMoney((prev) => ({ ...prev, unit: "grams" }))
//                   }
//                   style={[
//                     tw`flex-1 py-4 rounded-2xl border-2`,
//                     goldToMoney.unit === "grams"
//                       ? { backgroundColor: "#EF4444", borderColor: "#EF4444" }
//                       : { backgroundColor: "white", borderColor: "#E5E7EB" },
//                     {
//                       shadowColor: "#000",
//                       shadowOffset: { width: 0, height: 2 },
//                       shadowOpacity: goldToMoney.unit === "grams" ? 0.15 : 0.05,
//                       shadowRadius: 4,
//                       elevation: goldToMoney.unit === "grams" ? 4 : 2,
//                     },
//                   ]}
//                   activeOpacity={0.8}
//                 >
//                   <Text
//                     style={[
//                       tw`text-center font-bold text-base`,
//                       goldToMoney.unit === "grams"
//                         ? tw`text-white`
//                         : tw`text-gray-700`,
//                     ]}
//                   >
//                     Grams
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() =>
//                     setGoldToMoney((prev) => ({ ...prev, unit: "tmr" }))
//                   }
//                   style={[
//                     tw`flex-1 py-4 rounded-2xl border-2`,
//                     goldToMoney.unit === "tmr"
//                       ? { backgroundColor: "#EF4444", borderColor: "#EF4444" }
//                       : { backgroundColor: "white", borderColor: "#E5E7EB" },
//                     {
//                       shadowColor: "#000",
//                       shadowOffset: { width: 0, height: 2 },
//                       shadowOpacity: goldToMoney.unit === "tmr" ? 0.15 : 0.05,
//                       shadowRadius: 4,
//                       elevation: goldToMoney.unit === "tmr" ? 4 : 2,
//                     },
//                   ]}
//                   activeOpacity={0.8}
//                 >
//                   <Text
//                     style={[
//                       tw`text-center font-bold text-base`,
//                       goldToMoney.unit === "tmr"
//                         ? tw`text-white`
//                         : tw`text-gray-700`,
//                     ]}
//                   >
//                     TMR
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {/* Weight Input based on selected unit */}
//             {goldToMoney.unit === "grams" ? (
//               <InputField
//                 label="Weight in Grams"
//                 value={goldToMoney.weight}
//                 onChangeText={(text) =>
//                   setGoldToMoney((prev) => ({ ...prev, weight: text }))
//                 }
//                 placeholder="Enter weight"
//                 unit="g"
//                 inputRef={weightRef}
//               />
//             ) : (
//               <View style={tw`flex-row gap-4 mb-4`}>
//                 <View style={tw`flex-1`}>
//                   <InputField
//                     label="Tola"
//                     value={goldToMoney.tola}
//                     onChangeText={(text) =>
//                       setGoldToMoney((prev) => ({ ...prev, tola: text }))
//                     }
//                     placeholder="0"
//                     unit="T"
//                     inputRef={tolaRef}
//                   />
//                 </View>
//                 <View style={tw`flex-1`}>
//                   <InputField
//                     label="Masha"
//                     value={goldToMoney.masha}
//                     onChangeText={(text) =>
//                       setGoldToMoney((prev) => ({ ...prev, masha: text }))
//                     }
//                     placeholder="0"
//                     unit="M"
//                     inputRef={mashaRef}
//                   />
//                 </View>
//                 <View style={tw`flex-1`}>
//                   <InputField
//                     label="Ratti"
//                     value={goldToMoney.ratti}
//                     onChangeText={(text) =>
//                       setGoldToMoney((prev) => ({ ...prev, ratti: text }))
//                     }
//                     placeholder="0"
//                     unit="R"
//                     inputRef={rattiRef}
//                   />
//                 </View>
//               </View>
//             )}

//             <KaratSelector
//               value={goldToMoney.karat}
//               onValueChange={(karat) =>
//                 setGoldToMoney((prev) => ({ ...prev, karat }))
//               }
//             />

//             <ConvertButton
//               onPress={() => {
//                 dismissKeyboard();
//                 calculateGoldToMoney();
//               }}
//               color="#EF4444"
//             />

//             <ResultCard
//               value={formatCurrency(goldToMoney.result)}
//               label={`Total Value (${goldToMoney.karat}K Gold)`}
//               color="#EF4444"
//             />
//           </ConverterCard>

//           {/* Waist Calculator */}
//           <ConverterCard
//             title="Waist Calculator"
//             icon="tape-measure"
//             color="#3B82F6"
//           >
//             <InputField
//               label="Waist Value per Tola"
//               value={waistValue}
//               onChangeText={(text) => setWaistValue(text)}
//               placeholder="100"
//               unit="PKR"
//               inputRef={waistValueRef}
//             />

//             <InputField
//               label="Gold Weight in Grams"
//               value={goldToMoney.unit === "grams" ? goldToMoney.weight : ""}
//               onChangeText={(text) =>
//                 setGoldToMoney((prev) => ({ ...prev, weight: text }))
//               }
//               placeholder="Enter weight"
//               unit="g"
//               inputRef={weightRef}
//             />

//             <ConvertButton
//               onPress={dismissKeyboard}
//               color="#3B82F6"
//               title="Calculate Waist"
//             />

//             <ResultCard
//               value={`${calculateWaist(goldToMoney.weight)} Grams`}
//               label="Waist Value"
//               color="#3B82F6"
//             />
//           </ConverterCard>

//           {/* Quick Reference Table */}
//           <ConverterCard
//             title="Conversion Reference"
//             icon="information-outline"
//             color="#6B7280"
//           >
//             <View
//               style={[
//                 tw`rounded-2xl border-2 overflow-hidden`,
//                 { borderColor: "#E5E7EB" },
//               ]}
//             >
//               {/* Header */}
//               <View
//                 style={[
//                   tw`flex-row bg-gray-100 border-b-2`,
//                   { borderColor: "#E5E7EB" },
//                 ]}
//               >
//                 <View
//                   style={[
//                     tw`flex-1 py-4 px-4 border-r-2`,
//                     { borderColor: "#E5E7EB" },
//                   ]}
//                 >
//                   <Text style={tw`text-center font-bold text-sm text-gray-700`}>
//                     UNIT
//                   </Text>
//                 </View>
//                 <View style={tw`flex-1 py-4 px-4`}>
//                   <Text style={tw`text-center font-bold text-sm text-gray-700`}>
//                     VALUE
//                   </Text>
//                 </View>
//               </View>

//               {/* Reference Data */}
//               {[
//                 { unit: "1 Tola", value: "11.664 grams" },
//                 { unit: "1 Masha", value: "0.972 grams" },
//                 { unit: "1 Ratti", value: "0.1215 grams" },
//                 {
//                   unit: "Current Rate",
//                   value: `${formatCurrency(currentRate)}/tola`,
//                 },
//               ].map((item, index) => (
//                 <View
//                   key={`reference-${index}`}
//                   style={[
//                     tw`flex-row bg-white`,
//                     index < 3 && {
//                       borderBottomWidth: 1,
//                       borderColor: "#E5E7EB",
//                     },
//                   ]}
//                 >
//                   <View
//                     style={[
//                       tw`flex-1 py-4 px-4 border-r-2`,
//                       { borderColor: "#E5E7EB" },
//                     ]}
//                   >
//                     <Text style={tw`text-center font-medium text-gray-700`}>
//                       {item.unit}
//                     </Text>
//                   </View>
//                   <View style={tw`flex-1 py-4 px-4`}>
//                     <Text style={tw`text-center font-bold text-gray-900`}>
//                       {item.value}
//                     </Text>
//                   </View>
//                 </View>
//               ))}
//             </View>
//           </ConverterCard>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </View>
//   );
// }
