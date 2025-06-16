import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRates } from "../hooks/useRates";
import tw from "../utils/tw";

const { width } = Dimensions.get("window");

export default function GoldKaratInfoScreen({ navigation, route }) {
  const [activeTab, setActiveTab] = useState("purity");
  const { currentRate } = useRates();

  // Format currency for Pakistani Rupee
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Gold karat data with comprehensive information
  const karatData = [
    {
      karat: "24K",
      purity: 99.999,
      parts: "24/24",
      color: "#FFD700",
      description: "Pure gold, softest and most valuable",
      uses: ["Investment bars", "Coins", "High-end jewelry"],
      pros: ["Highest value", "No allergic reactions", "Never tarnishes"],
      cons: ["Very soft", "Easily scratched", "Most expensive"],
      marketRelevance:
        "Premium pricing, investment grade gold preferred by investors",
      identification: "Bright yellow, very soft, heavy weight, easily bendable",
    },
    {
      karat: "22K",
      purity: 91.667,
      parts: "22/24",
      color: "#FFB000",
      description: "Traditional jewelry gold, perfect balance",
      uses: ["Wedding jewelry", "Traditional ornaments", "Premium pieces"],
      pros: ["Durable yet valuable", "Traditional choice", "Good resale value"],
      cons: ["More expensive", "Still relatively soft"],
      marketRelevance:
        "Most popular in Pakistani and South Asian jewelry markets",
      identification:
        "Rich yellow color, slightly harder than 24K, good weight",
    },
    {
      karat: "21K",
      purity: 87.5,
      parts: "21/24",
      color: "#E6A000",
      description: "High purity with improved durability",
      uses: ["Fine jewelry", "Cultural ornaments", "Special occasions"],
      pros: ["High purity", "Better durability", "Good value retention"],
      cons: ["Less common in Pakistan", "Limited availability"],
      marketRelevance: "Regional preference in Middle Eastern markets",
      identification: "Deep yellow color, good weight, moderate hardness",
    },
    {
      karat: "18K",
      purity: 75.0,
      parts: "18/24",
      color: "#CC8400",
      description: "Perfect for daily wear jewelry",
      uses: ["Engagement rings", "Daily wear", "Designer jewelry"],
      pros: [
        "Very durable",
        "Versatile colors",
        "Perfect for gemstone setting",
      ],
      cons: ["Lower gold content", "May cause skin allergies"],
      marketRelevance: "International standard, widely accepted globally",
      identification: "Lighter yellow, harder texture, excellent durability",
    },
    {
      karat: "14K",
      purity: 58.333,
      parts: "14/24",
      color: "#B8860B",
      description: "Affordable and durable option",
      uses: ["Fashion jewelry", "Everyday wear", "Budget-friendly pieces"],
      pros: ["Very durable", "Affordable", "Available in various colors"],
      cons: ["Lower gold content", "May tarnish slightly over time"],
      marketRelevance: "Popular in Western markets, growing in Pakistan",
      identification: "Pale yellow, very hard, noticeably lighter weight",
    },
    {
      karat: "10K",
      purity: 41.667,
      parts: "10/24",
      color: "#8B7355",
      description: "Minimum gold content for jewelry",
      uses: ["Costume jewelry", "Budget pieces", "Children's jewelry"],
      pros: [
        "Very affordable",
        "Extremely durable",
        "Highly scratch resistant",
      ],
      cons: [
        "Low gold content",
        "May cause skin reactions",
        "Poor resale value",
      ],
      marketRelevance: "Entry-level gold jewelry, mainly for fashion purposes",
      identification: "Very pale color, extremely hard, significantly lighter",
    },
  ];

  const tabs = [
    { id: "purity", label: "Purity Guide", icon: "diamond-stone" },
    { id: "prices", label: "Price Table", icon: "currency-usd" },
    { id: "market", label: "Market Info", icon: "chart-line" },
    { id: "identification", label: "ID Tips", icon: "magnify" },
  ];

  const PriceTable = () => (
    <View style={tw`mb-6`}>
      {/* Header Card */}
      <View
        style={[
          tw`bg-white rounded-2xl p-4 mb-4 border border-orange-200`,
          {
            shadowColor: "#F97316",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.15,
            shadowRadius: 5,
            elevation: 4,
          },
        ]}
      >
        <View style={tw`flex-row items-center mb-3`}>
          <MaterialCommunityIcons name="calculator" size={20} color="#F97316" />
          <Text style={tw`text-orange-600 font-bold ml-2 text-lg`}>
            Live Gold Prices per Tola
          </Text>
        </View>
        <Text style={tw`text-gray-600 text-sm leading-5`}>
          Based on current 24K rate: {formatCurrency(currentRate)} per tola
        </Text>
        <Text style={tw`text-gray-500 text-xs mt-1`}>
          Prices calculated according to purity percentages
        </Text>
      </View>

      {/* Price Cards */}
      {karatData.map((data, index) => {
        const pricePerTola = Math.round(currentRate * (data.purity / 100));
        const pricePerGram = Math.round(pricePerTola / 11.664);
        const pricePer10Gram = Math.round(pricePerGram * 10);

        return (
          <View
            key={index}
            style={[
              tw`bg-white rounded-2xl p-4 mb-3 border border-gray-100`,
              {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
                elevation: 3,
              },
            ]}
          >
            {/* Header */}
            <View style={tw`flex-row items-center justify-between mb-3`}>
              <View style={tw`flex-row items-center`}>
                <View
                  style={[
                    tw`w-10 h-10 rounded-full items-center justify-center mr-3`,
                    { backgroundColor: `${data.color}20` },
                  ]}
                >
                  <Text style={[tw`text-sm font-bold`, { color: data.color }]}>
                    {data.karat}
                  </Text>
                </View>
                <View>
                  <Text style={tw`text-lg font-bold text-gray-800`}>
                    {data.karat} Gold
                  </Text>
                  <Text style={tw`text-sm text-gray-600`}>
                    {data.purity}% Pure
                  </Text>
                </View>
              </View>
              <View style={tw`items-end`}>
                <Text style={[tw`text-xl font-bold`, { color: data.color }]}>
                  {formatCurrency(pricePerTola)}
                </Text>
                <Text style={tw`text-xs text-gray-500`}>per tola</Text>
              </View>
            </View>

            {/* Price Breakdown */}
            <View style={tw`bg-gray-50 rounded-xl p-3 border border-gray-200`}>
              <View style={tw`flex-row justify-between items-center mb-2`}>
                <Text style={tw`text-sm text-gray-600`}>Per Gram:</Text>
                <Text style={tw`text-sm font-semibold text-gray-800`}>
                  {formatCurrency(pricePerGram)}
                </Text>
              </View>
              <View style={tw`flex-row justify-between items-center mb-2`}>
                <Text style={tw`text-sm text-gray-600`}>Per 10 Grams:</Text>
                <Text style={tw`text-sm font-semibold text-gray-800`}>
                  {formatCurrency(pricePer10Gram)}
                </Text>
              </View>
              <View style={tw`h-px bg-gray-300 my-2`} />
              <View style={tw`flex-row justify-between items-center`}>
                <Text style={tw`text-sm text-gray-600`}>Savings vs 24K:</Text>
                <Text
                  style={tw`text-sm font-semibold ${
                    currentRate - pricePerTola > 0
                      ? "text-green-600"
                      : "text-gray-600"
                  }`}
                >
                  {currentRate - pricePerTola > 0
                    ? `${formatCurrency(currentRate - pricePerTola)}`
                    : "Base Rate"}
                </Text>
              </View>
            </View>

            {/* Market Status */}
            <View style={tw`flex-row items-center mt-3`}>
              <MaterialCommunityIcons
                name={
                  data.purity >= 90
                    ? "trending-up"
                    : data.purity >= 75
                    ? "minus"
                    : "trending-down"
                }
                size={16}
                color={
                  data.purity >= 90
                    ? "#10B981"
                    : data.purity >= 75
                    ? "#F59E0B"
                    : "#EF4444"
                }
              />
              <Text
                style={tw`text-xs ml-1 ${
                  data.purity >= 90
                    ? "text-green-600"
                    : data.purity >= 75
                    ? "text-orange-600"
                    : "text-red-600"
                }`}
              >
                {data.purity >= 90
                  ? "Premium Grade"
                  : data.purity >= 75
                  ? "Standard Grade"
                  : "Budget Grade"}
              </Text>
            </View>
          </View>
        );
      })}

      {/* Calculation Info */}
      <View style={tw`bg-blue-50 rounded-2xl p-4 border border-blue-200 mt-4`}>
        <View style={tw`flex-row items-center mb-2`}>
          <MaterialCommunityIcons
            name="information"
            size={20}
            color="#3B82F6"
          />
          <Text style={tw`text-blue-600 font-bold ml-2`}>
            Price Calculation Formula
          </Text>
        </View>
        <Text style={tw`text-blue-700 text-sm leading-5`}>
          Karat Price = 24K Rate × (Purity Percentage ÷ 100)
        </Text>
        <Text style={tw`text-blue-600 text-xs mt-2`}>
          Example: 22K = ₹{currentRate.toLocaleString()} × (91.66 ÷ 100) ={" "}
          {formatCurrency(Math.round(currentRate * 0.9166))}
        </Text>
      </View>
    </View>
  );

  const KaratCard = ({ data }) => (
    <View
      style={[
        tw`bg-white rounded-2xl p-5 mb-4 border border-gray-100`,
        {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 4,
        },
      ]}
    >
      {/* Header */}
      <View style={tw`flex-row items-center justify-between mb-4`}>
        <View style={tw`flex-row items-center`}>
          <View
            style={[
              tw`w-12 h-12 rounded-full items-center justify-center mr-4`,
              { backgroundColor: `${data.color}20` },
            ]}
          >
            <Text style={[tw`text-lg font-bold`, { color: data.color }]}>
              {data.karat}
            </Text>
          </View>
          <View>
            <Text style={tw`text-xl font-bold text-gray-800`}>
              {data.karat} Gold
            </Text>
            <Text style={tw`text-sm text-gray-600`}>{data.purity}% Pure</Text>
          </View>
        </View>
        <View style={tw`items-end`}>
          <Text style={tw`text-sm text-gray-500`}>Parts</Text>
          <Text style={tw`text-lg font-bold text-gray-700`}>{data.parts}</Text>
        </View>
      </View>

      {/* Description */}
      <Text style={tw`text-gray-700 mb-4 leading-6`}>{data.description}</Text>

      {/* Content based on active tab */}
      {activeTab === "purity" && (
        <>
          <View style={tw`mb-4`}>
            <Text style={tw`text-sm font-semibold text-gray-700 mb-2`}>
              Common Uses:
            </Text>
            {data.uses.map((use, index) => (
              <View key={index} style={tw`flex-row items-center mb-1`}>
                <View
                  style={[
                    tw`w-2 h-2 rounded-full mr-3`,
                    { backgroundColor: data.color },
                  ]}
                />
                <Text style={tw`text-sm text-gray-600`}>{use}</Text>
              </View>
            ))}
          </View>

          <View style={tw`flex-row justify-between`}>
            <View style={tw`flex-1 mr-2`}>
              <Text style={tw`text-sm font-semibold text-green-700 mb-2`}>
                Advantages:
              </Text>
              {data.pros.map((pro, index) => (
                <Text key={index} style={tw`text-xs text-green-600 mb-1`}>
                  • {pro}
                </Text>
              ))}
            </View>
            <View style={tw`flex-1 ml-2`}>
              <Text style={tw`text-sm font-semibold text-orange-700 mb-2`}>
                Considerations:
              </Text>
              {data.cons.map((con, index) => (
                <Text key={index} style={tw`text-xs text-orange-600 mb-1`}>
                  • {con}
                </Text>
              ))}
            </View>
          </View>
        </>
      )}

      {activeTab === "market" && (
        <View>
          <View style={tw`mb-4`}>
            <Text style={tw`text-sm font-semibold text-gray-700 mb-2`}>
              Market Relevance:
            </Text>
            <Text style={tw`text-sm text-gray-600 leading-5`}>
              {data.marketRelevance}
            </Text>
          </View>
          <View style={tw`bg-gray-50 rounded-xl p-3 border border-gray-200`}>
            <Text style={tw`text-sm font-semibold text-gray-700 mb-1`}>
              Current Value (per tola):
            </Text>
            <Text style={[tw`text-lg font-bold`, { color: data.color }]}>
              {formatCurrency(Math.round(currentRate * (data.purity / 100)))}
            </Text>
            <Text style={tw`text-xs text-gray-500`}>
              Based on {data.purity}% purity
            </Text>
          </View>
        </View>
      )}

      {activeTab === "identification" && (
        <View>
          <Text style={tw`text-sm font-semibold text-gray-700 mb-2`}>
            Identification Tips:
          </Text>
          <Text style={tw`text-sm text-gray-600 leading-5`}>
            {data.identification}
          </Text>
          <View style={tw`mt-4 flex-row items-center`}>
            <MaterialCommunityIcons
              name="information-outline"
              size={16}
              color="#6B7280"
            />
            <Text style={tw`text-xs text-gray-500 ml-2`}>
              Always verify with hallmark stamps
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  const Header = () => (
    <View
      style={[
        tw`flex-row items-center justify-between px-4 pb-3`,
        {
          backgroundColor: "#F59E0B",
          paddingTop: Platform.OS === "ios" ? 50 : StatusBar.currentHeight,
        },
      ]}
    >
      <View style={tw`flex-row items-center flex-1 pt-3`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`p-2 rounded-full mr-3`}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <View>
          <Text style={tw`text-white text-lg font-bold`}>Gold Karat Info</Text>
          <Text style={tw`text-orange-100 text-sm`}>
            Purity levels & live prices
          </Text>
        </View>
      </View>
      <View
        style={[
          tw`p-2 rounded-full`,
          { backgroundColor: "rgba(255,255,255,0.2)" },
        ]}
      >
        <MaterialCommunityIcons name="diamond-stone" size={20} color="white" />
      </View>
    </View>
  );

  const TabSelector = () => (
    <View style={tw`px-4 py-3 bg-white border-b border-gray-200`}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={tw`flex-row`}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[
                tw`px-4 py-2 mr-3 rounded-full flex-row items-center`,
                activeTab === tab.id
                  ? tw`bg-orange-100 border border-orange-300`
                  : tw`bg-gray-100`,
              ]}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={tab.icon}
                size={16}
                color={activeTab === tab.id ? "#F97316" : "#6B7280"}
              />
              <Text
                style={[
                  tw`ml-2 text-sm font-medium`,
                  activeTab === tab.id
                    ? tw`text-orange-600`
                    : tw`text-gray-600`,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-orange-100`}>
      <StatusBar barStyle="light-content" backgroundColor="#F59E0B" />

      <Header />
      <TabSelector />

      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`p-4 pb-8`}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Rate Banner */}
        <View
          style={[
            tw`bg-white rounded-2xl p-4 mb-6 border border-orange-200`,
            {
              shadowColor: "#F97316",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            },
          ]}
        >
          <View style={tw`flex-row items-center justify-between mb-2`}>
            <View style={tw`flex-row items-center`}>
              <MaterialCommunityIcons name="gold" size={20} color="#F97316" />
              <Text style={tw`text-orange-600 font-bold ml-2`}>
                24K Gold Rate
              </Text>
            </View>
            <Text style={tw`text-2xl font-bold text-orange-600`}>
              {formatCurrency(currentRate)}
            </Text>
          </View>
          <Text style={tw`text-gray-600 text-sm`}>
            Per tola • All karat prices calculated based on this rate
          </Text>
        </View>

        {/* Render content based on active tab */}
        {activeTab === "prices" ? (
          <PriceTable />
        ) : (
          <>
            {/* Info Banner for other tabs */}
            <View
              style={[
                tw`bg-white rounded-2xl p-4 mb-6 border border-orange-200`,
                {
                  shadowColor: "#F97316",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                },
              ]}
            >
              <View style={tw`flex-row items-center mb-3`}>
                <MaterialCommunityIcons name="star" size={20} color="#F97316" />
                <Text style={tw`text-orange-600 font-bold ml-2`}>
                  Professional Guide
                </Text>
              </View>
              <Text style={tw`text-gray-700 text-sm leading-5`}>
                Understanding gold purity is crucial for pricing, quality
                assessment, and customer satisfaction. Each karat level serves
                different market segments and use cases in Pakistan.
              </Text>
            </View>

            {/* Karat Cards */}
            {karatData.map((data, index) => (
              <KaratCard key={index} data={data} />
            ))}
          </>
        )}

        {/* Footer Info */}
        <View style={tw`bg-white rounded-2xl p-4 mt-4 border border-gray-100`}>
          <View style={tw`flex-row items-center mb-3`}>
            <MaterialCommunityIcons
              name="shield-check"
              size={20}
              color="#10B981"
            />
            <Text style={tw`text-green-600 font-bold ml-2`}>
              Hallmark Verification
            </Text>
          </View>
          <Text style={tw`text-gray-700 text-sm leading-5 mb-3`}>
            Always look for official hallmark stamps that indicate purity. In
            Pakistan, look for BIS or local assay office marks for authenticity.
          </Text>
          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`text-xs text-gray-500`}>
              BIS • Assay Office • International Standards
            </Text>
            <MaterialCommunityIcons
              name="certificate"
              size={16}
              color="#10B981"
            />
          </View>
        </View>

        {/* App Info */}
        <View style={tw`mt-6 items-center`}>
          <Text style={tw`text-xs text-gray-500 text-center`}>
            AurumLog • Pakistani Gold Rate Calculator
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// import React, { useState } from "react";
// import {
//   View,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
//   Platform,
//   Dimensions,
// } from "react-native";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import tw from "../utils/tw";

// const { width } = Dimensions.get("window");

// export default function GoldKaratInfoScreen({ navigation, route }) {
//   const [activeTab, setActiveTab] = useState("purity");
//   const { currentRate } = route.params || {};

//   // Gold karat data with comprehensive information
//   const karatData = [
//     {
//       karat: "24K",
//       purity: "99.9%",
//       parts: "24/24",
//       color: "#FFD700",
//       description: "Pure gold, softest and most valuable",
//       uses: ["Investment bars", "Coins", "High-end jewelry"],
//       pros: ["Highest value", "No allergic reactions", "Never tarnishes"],
//       cons: ["Very soft", "Easily scratched", "Expensive"],
//       marketRelevance: "Premium pricing, investment grade",
//       identification: "Bright yellow, very soft, heavy weight",
//     },
//     {
//       karat: "22K",
//       purity: "91.7%",
//       parts: "22/24",
//       color: "#FFB000",
//       description: "Traditional jewelry gold, perfect balance",
//       uses: ["Wedding jewelry", "Traditional ornaments", "Premium pieces"],
//       pros: ["Durable yet valuable", "Traditional choice", "Good resale"],
//       cons: ["More expensive", "Still relatively soft"],
//       marketRelevance: "Most popular in South Asian markets",
//       identification: "Rich yellow, slightly harder than 24K",
//     },
//     {
//       karat: "21K",
//       purity: "87.5%",
//       parts: "21/24",
//       color: "#E6A000",
//       description: "High purity with improved durability",
//       uses: ["Fine jewelry", "Cultural ornaments", "Special occasions"],
//       pros: ["High purity", "Better durability", "Good value"],
//       cons: ["Less common", "Limited availability"],
//       marketRelevance: "Regional preference in Middle East",
//       identification: "Deep yellow, good weight",
//     },
//     {
//       karat: "18K",
//       purity: "75.0%",
//       parts: "18/24",
//       color: "#CC8400",
//       description: "Perfect for daily wear jewelry",
//       uses: ["Engagement rings", "Daily wear", "Designer jewelry"],
//       pros: ["Durable", "Versatile colors", "Good for setting stones"],
//       cons: ["Lower gold content", "May cause allergies"],
//       marketRelevance: "International standard, widely accepted",
//       identification: "Lighter yellow, harder, good durability",
//     },
//     {
//       karat: "14K",
//       purity: "58.3%",
//       parts: "14/24",
//       color: "#B8860B",
//       description: "Affordable and durable option",
//       uses: ["Fashion jewelry", "Everyday wear", "Budget-friendly pieces"],
//       pros: ["Very durable", "Affordable", "Variety of colors"],
//       cons: ["Lower gold content", "May tarnish slightly"],
//       marketRelevance: "Popular in Western markets",
//       identification: "Pale yellow, very hard, lighter weight",
//     },
//     {
//       karat: "10K",
//       purity: "41.7%",
//       parts: "10/24",
//       color: "#8B7355",
//       description: "Minimum gold content for jewelry",
//       uses: ["Costume jewelry", "Budget pieces", "Children's jewelry"],
//       pros: ["Very affordable", "Extremely durable", "Scratch resistant"],
//       cons: ["Low gold content", "May cause skin reactions"],
//       marketRelevance: "Entry-level gold jewelry",
//       identification: "Pale color, very hard, noticeably lighter",
//     },
//   ];

//   const tabs = [
//     { id: "purity", label: "Purity Guide", icon: "diamond-stone" },
//     { id: "market", label: "Market Info", icon: "chart-line" },
//     { id: "identification", label: "ID Tips", icon: "magnify" },
//   ];

//   const KaratCard = ({ data }) => (
//     <View
//       style={[
//         tw`bg-white rounded-2xl p-5 mb-4 border border-gray-100`,
//         {
//           shadowColor: "#000",
//           shadowOffset: { width: 0, height: 4 },
//           shadowOpacity: 0.1,
//           shadowRadius: 6,
//           elevation: 4,
//         },
//       ]}
//     >
//       {/* Header */}
//       <View style={tw`flex-row items-center justify-between mb-4`}>
//         <View style={tw`flex-row items-center`}>
//           <View
//             style={[
//               tw`w-12 h-12 rounded-full items-center justify-center mr-4`,
//               { backgroundColor: `${data.color}20` },
//             ]}
//           >
//             <Text style={[tw`text-lg font-bold`, { color: data.color }]}>
//               {data.karat}
//             </Text>
//           </View>
//           <View>
//             <Text style={tw`text-xl font-bold text-gray-800`}>
//               {data.karat} Gold
//             </Text>
//             <Text style={tw`text-sm text-gray-600`}>{data.purity} Pure</Text>
//           </View>
//         </View>
//         <View style={tw`items-end`}>
//           <Text style={tw`text-sm text-gray-500`}>Parts</Text>
//           <Text style={tw`text-lg font-bold text-gray-700`}>{data.parts}</Text>
//         </View>
//       </View>

//       {/* Description */}
//       <Text style={tw`text-gray-700 mb-4 leading-6`}>{data.description}</Text>

//       {/* Content based on active tab */}
//       {activeTab === "purity" && (
//         <>
//           <View style={tw`mb-4`}>
//             <Text style={tw`text-sm font-semibold text-gray-700 mb-2`}>
//               Common Uses:
//             </Text>
//             {data.uses.map((use, index) => (
//               <View key={index} style={tw`flex-row items-center mb-1`}>
//                 <View
//                   style={[
//                     tw`w-2 h-2 rounded-full mr-3`,
//                     { backgroundColor: data.color },
//                   ]}
//                 />
//                 <Text style={tw`text-sm text-gray-600`}>{use}</Text>
//               </View>
//             ))}
//           </View>

//           <View style={tw`flex-row justify-between`}>
//             <View style={tw`flex-1 mr-2`}>
//               <Text style={tw`text-sm font-semibold text-green-700 mb-2`}>
//                 Advantages:
//               </Text>
//               {data.pros.map((pro, index) => (
//                 <Text key={index} style={tw`text-xs text-green-600 mb-1`}>
//                   • {pro}
//                 </Text>
//               ))}
//             </View>
//             <View style={tw`flex-1 ml-2`}>
//               <Text style={tw`text-sm font-semibold text-orange-700 mb-2`}>
//                 Considerations:
//               </Text>
//               {data.cons.map((con, index) => (
//                 <Text key={index} style={tw`text-xs text-orange-600 mb-1`}>
//                   • {con}
//                 </Text>
//               ))}
//             </View>
//           </View>
//         </>
//       )}

//       {activeTab === "market" && (
//         <View>
//           <View style={tw`mb-4`}>
//             <Text style={tw`text-sm font-semibold text-gray-700 mb-2`}>
//               Market Relevance:
//             </Text>
//             <Text style={tw`text-sm text-gray-600 leading-5`}>
//               {data.marketRelevance}
//             </Text>
//           </View>
//           {currentRate && (
//             <View style={tw`bg-gray-50 rounded-xl p-3 border border-gray-200`}>
//               <Text style={tw`text-sm font-semibold text-gray-700 mb-1`}>
//                 Estimated Value (per gram):
//               </Text>
//               <Text style={[tw`text-lg font-bold`, { color: data.color }]}>
//                 ₹{Math.round(currentRate * (parseFloat(data.purity) / 100))}
//               </Text>
//               <Text style={tw`text-xs text-gray-500`}>
//                 Based on current 24K rate
//               </Text>
//             </View>
//           )}
//         </View>
//       )}

//       {activeTab === "identification" && (
//         <View>
//           <Text style={tw`text-sm font-semibold text-gray-700 mb-2`}>
//             Identification Tips:
//           </Text>
//           <Text style={tw`text-sm text-gray-600 leading-5`}>
//             {data.identification}
//           </Text>
//           <View style={tw`mt-4 flex-row items-center`}>
//             <MaterialCommunityIcons
//               name="information-outline"
//               size={16}
//               color="#6B7280"
//             />
//             <Text style={tw`text-xs text-gray-500 ml-2`}>
//               Always verify with hallmark stamps
//             </Text>
//           </View>
//         </View>
//       )}
//     </View>
//   );

//   const Header = () => (
//     <View
//       style={[
//         tw`flex-row items-center justify-between px-4 py-3`,
//         {
//           backgroundColor: "#F97316",
//           paddingTop: Platform.OS === "ios" ? 50 : StatusBar.currentHeight + 10,
//         },
//       ]}
//     >
//       <View style={tw`flex-row items-center flex-1`}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={tw`p-2 rounded-full mr-3`}
//           activeOpacity={0.7}
//         >
//           <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
//         </TouchableOpacity>
//         <View>
//           <Text style={tw`text-white text-lg font-bold`}>Gold Karat Info</Text>
//           <Text style={tw`text-orange-100 text-sm`}>
//             Purity levels 24K to 10K
//           </Text>
//         </View>
//       </View>
//       <View
//         style={[
//           tw`p-2 rounded-full`,
//           { backgroundColor: "rgba(255,255,255,0.2)" },
//         ]}
//       >
//         <MaterialCommunityIcons name="diamond-stone" size={20} color="white" />
//       </View>
//     </View>
//   );

//   const TabSelector = () => (
//     <View style={tw`px-4 py-3 bg-white border-b border-gray-200`}>
//       <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//         <View style={tw`flex-row`}>
//           {tabs.map((tab) => (
//             <TouchableOpacity
//               key={tab.id}
//               onPress={() => setActiveTab(tab.id)}
//               style={[
//                 tw`px-4 py-2 mr-3 rounded-full flex-row items-center`,
//                 activeTab === tab.id
//                   ? tw`bg-orange-100 border border-orange-300`
//                   : tw`bg-gray-100`,
//               ]}
//               activeOpacity={0.7}
//             >
//               <MaterialCommunityIcons
//                 name={tab.icon}
//                 size={16}
//                 color={activeTab === tab.id ? "#F97316" : "#6B7280"}
//               />
//               <Text
//                 style={[
//                   tw`ml-2 text-sm font-medium`,
//                   activeTab === tab.id
//                     ? tw`text-orange-600`
//                     : tw`text-gray-600`,
//                 ]}
//               >
//                 {tab.label}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );

//   return (
//     <SafeAreaView style={tw`flex-1 bg-orange-50`}>
//       <StatusBar barStyle="light-content" backgroundColor="#F97316" />

//       <Header />
//       <TabSelector />

//       <ScrollView
//         style={tw`flex-1`}
//         contentContainerStyle={tw`p-4 pb-8`}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Info Banner */}
//         <View
//           style={[
//             tw`bg-white rounded-2xl p-4 mb-6 border border-orange-200`,
//             {
//               shadowColor: "#F97316",
//               shadowOffset: { width: 0, height: 2 },
//               shadowOpacity: 0.1,
//               shadowRadius: 4,
//               elevation: 3,
//             },
//           ]}
//         >
//           <View style={tw`flex-row items-center mb-3`}>
//             <MaterialCommunityIcons name="star" size={20} color="#F97316" />
//             <Text style={tw`text-orange-600 font-bold ml-2`}>
//               Professional Guide
//             </Text>
//           </View>
//           <Text style={tw`text-gray-700 text-sm leading-5`}>
//             Understanding gold purity is crucial for pricing, quality
//             assessment, and customer satisfaction. Each karat level serves
//             different market segments and use cases.
//           </Text>
//         </View>

//         {/* Karat Cards */}
//         {karatData.map((data, index) => (
//           <KaratCard key={index} data={data} />
//         ))}

//         {/* Footer Info */}
//         <View style={tw`bg-white rounded-2xl p-4 mt-4 border border-gray-100`}>
//           <View style={tw`flex-row items-center mb-3`}>
//             <MaterialCommunityIcons
//               name="shield-check"
//               size={20}
//               color="#10B981"
//             />
//             <Text style={tw`text-green-600 font-bold ml-2`}>
//               Hallmark Verification
//             </Text>
//           </View>
//           <Text style={tw`text-gray-700 text-sm leading-5 mb-3`}>
//             Always look for official hallmark stamps that indicate purity.
//             Trusted certification ensures authenticity and builds customer
//             confidence.
//           </Text>
//           <View style={tw`flex-row justify-between items-center`}>
//             <Text style={tw`text-xs text-gray-500`}>
//               BIS • Assay Office • International Standards
//             </Text>
//             <MaterialCommunityIcons
//               name="certificate"
//               size={16}
//               color="#10B981"
//             />
//           </View>
//         </View>

//         {/* App Info */}
//         <View style={tw`mt-6 items-center`}>
//           <Text style={tw`text-xs text-gray-500 text-center`}>
//             AurumLog • Professional Jewelry Tools
//           </Text>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }
