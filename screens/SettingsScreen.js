import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
  Share,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import tw from "../utils/tw";
import { useRates } from "../hooks/useRates";

export default function SettingsScreen({ navigation }) {
  const { currentRate, lastUpdated, updateRate } = useRates();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Current Gold Rate: ${formatCurrency(
          currentRate
        )} per Tola\nLast Updated: ${lastUpdated}\n\nCalculated with AurumLog - Gold Rate Calculator`,
        title: "Gold Rate Update",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share gold rate");
    }
  };

  const handleRateHistory = () => {
    Alert.alert(
      "Rate History",
      "Rate history feature will be available in future updates.",
      [{ text: "OK" }]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      "About AurumLog",
      "AurumLog is a comprehensive gold rate calculator for Pakistan.\n\nVersion: 1.0.0\nDeveloped for accurate gold calculations.",
      [{ text: "OK" }]
    );
  };

  const handleFeedback = () => {
    Alert.alert(
      "Feedback",
      "Your feedback helps us improve AurumLog. Would you like to rate us or send feedback?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send Feedback",
          onPress: () => {
            Linking.openURL(
              "mailto:feedback@aurumlog.com?subject=AurumLog Feedback"
            );
          },
        },
      ]
    );
  };

  const settingsSections = [
    {
      title: "Gold Rate",
      icon: "gold",
      gradient: "from-amber-400 to-yellow-500",
      items: [
        {
          title: "Current Rate",
          subtitle: `${formatCurrency(currentRate)} per Tola`,
          icon: "cash-multiple",
          onPress: () => {},
          showArrow: false,
        },
        {
          title: "Last Updated",
          subtitle: lastUpdated || "Never",
          icon: "clock-outline",
          onPress: () => {},
          showArrow: false,
        },
        {
          title: "Rate History",
          subtitle: "View historical rates",
          icon: "chart-line",
          onPress: handleRateHistory,
        },
      ],
    },
    {
      title: "Tools",
      icon: "tools",
      gradient: "from-purple-400 to-indigo-500",
      items: [
        {
          title: "Share Rate",
          subtitle: "Share current gold rate",
          icon: "share-variant",
          onPress: handleShare,
        },
        {
          title: "Calculator Settings",
          subtitle: "Customize calculations",
          icon: "calculator-variant",
          onPress: () =>
            Alert.alert(
              "Coming Soon",
              "Calculator settings will be available soon."
            ),
        },
      ],
    },
    {
      title: "App Info",
      icon: "information",
      gradient: "from-teal-400 to-cyan-500",
      items: [
        {
          title: "About AurumLog",
          subtitle: "Version 1.0.0",
          icon: "information-outline",
          onPress: handleAbout,
        },
        {
          title: "Send Feedback",
          subtitle: "Help us improve",
          icon: "message-text",
          onPress: handleFeedback,
        },
        {
          title: "Privacy Policy",
          subtitle: "How we protect your data",
          icon: "shield-check",
          onPress: () =>
            Alert.alert(
              "Privacy",
              "Your data is stored locally on your device. We do not collect any personal information."
            ),
        },
      ],
    },
  ];

  const SettingItem = ({ item, isLast }) => (
    <TouchableOpacity
      style={tw`flex-row items-center py-4 px-4 ${
        !isLast ? "border-b border-gray-100" : ""
      }`}
      onPress={item.onPress}
      disabled={!item.onPress}
    >
      <View style={tw`bg-gray-100 p-2 rounded-full mr-4`}>
        <MaterialCommunityIcons name={item.icon} size={20} color="#6B7280" />
      </View>

      <View style={tw`flex-1`}>
        <Text style={tw`text-gray-900 font-semibold text-base`}>
          {item.title}
        </Text>
        <Text style={tw`text-gray-500 text-sm mt-1`}>{item.subtitle}</Text>
      </View>

      {item.showArrow !== false && (
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color="#D1D5DB"
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-gradient-to-b from-purple-50 to-white`}>
      <View style={[tw`px-4 pt-12`, { backgroundColor: "#F59E0B" }]}>
        <View style={tw`relative flex-row items-center justify-between mb-4`}>
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`p-2 rounded-full bg-white bg-opacity-20 z-10`}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
          </TouchableOpacity>

          {/* Centered Title (absolute center) */}
          <View style={tw`absolute left-12 items-left`}>
            <Text style={tw`text-xl font-bold text-white`}>Settings</Text>
          </View>

          {/* Invisible spacer to balance the row (same size as the back button) */}
          <View style={tw`p-2`} />
        </View>
      </View>

      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`p-4 pb-8`}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Stats */}
        <View
          style={tw`bg-white rounded-2xl p-6 mb-6 shadow-lg border border-gray-100`}
        >
          <View style={tw`flex-row items-center mb-4`}>
            <View
              style={tw`bg-gradient-to-r from-purple-400 to-indigo-500 p-3 rounded-full mr-4`}
            >
              <MaterialCommunityIcons name="gold" size={24} color="white" />
            </View>
            <View>
              <Text style={tw`text-xl font-bold text-gray-900`}>
                Gold Rate Overview
              </Text>
              <Text style={tw`text-gray-500 text-sm`}>
                Current market information
              </Text>
            </View>
          </View>

          <View
            style={tw`bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200`}
          >
            <View style={tw`flex-row justify-between items-center mb-2`}>
              <Text style={tw`text-amber-800 font-semibold`}>Current Rate</Text>
              <Text style={tw`text-amber-900 text-lg font-bold`}>
                {formatCurrency(currentRate)}
              </Text>
            </View>
            <View style={tw`flex-row justify-between items-center`}>
              <Text style={tw`text-amber-700 text-sm`}>Per Gram</Text>
              <Text style={tw`text-amber-800 font-semibold`}>
                {formatCurrency(Math.round(currentRate / 11.664))}
              </Text>
            </View>
          </View>
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={tw`mb-6`}>
            {/* Section Header */}
            <View style={tw`flex-row items-center mb-3`}>
              <View
                style={tw`bg-gradient-to-r ${section.gradient} p-2 rounded-full mr-3`}
              >
                <MaterialCommunityIcons
                  name={section.icon}
                  size={18}
                  color="white"
                />
              </View>
              <Text style={tw`text-lg font-bold text-gray-800`}>
                {section.title}
              </Text>
            </View>

            {/* Section Items */}
            <View
              style={tw`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden`}
            >
              {section.items.map((item, itemIndex) => (
                <SettingItem
                  key={itemIndex}
                  item={item}
                  isLast={itemIndex === section.items.length - 1}
                />
              ))}
            </View>
          </View>
        ))}

        {/* Footer */}
        <View
          style={tw`bg-white rounded-2xl p-4 border border-gray-100 shadow-sm`}
        >
          <View style={tw`flex-row items-center justify-center`}>
            <MaterialCommunityIcons name="heart" size={16} color="#EF4444" />
            <Text style={tw`text-gray-600 text-sm ml-2`}>
              Made with love for gold traders
            </Text>
          </View>
          <Text style={tw`text-center text-gray-400 text-xs mt-2`}>
            AurumLog v1.0.0 - © 2024
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
