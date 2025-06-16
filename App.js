import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { View, Text, Platform, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import tw from "./utils/tw";
import { style } from "twrnc";

import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ConversionTableScreen from "./screens/ConversionTableScreen";
import SaleSlipGeneratorScreen from "./screens/SaleSlipGeneratorScreen";
import SplashScreen from "./screens/SplashScreen";
import GoldKaratInfoScreen from "./screens/GoldKaratInfoScreen";
import GoldConvertersScreen from "./screens/GoldConvertersScreen";
import GoldCalculationsScreen from "./screens/GoldCalculationsScreen";
import TMRToGramsScreen from "./screens/TMRToGramsScreen";
import GramsToTMRScreen from "./screens/GramsToTMRScreen";
import WaistCalculatorScreen from "./screens/WaistCalculatorScreen";
import MoneyToGoldScreen from "./screens/MoneyToGoldScreen";
import GoldToMoneyScreen from "./screens/GoldToMoneyScreen";
import ImpurityCalculatorScreen from "./screens/ImpurityCalculatorScreen ";
import PurityCalculatorScreen from "./screens/PurityCalculatorScreen";
import ConversionReferenceScreen from "./screens/ConversionReferenceScreen";

const Stack = createNativeStackNavigator();

const CustomHeader = ({ navigation, route }) => (
  <View style={tw`flex-row items-center justify-between flex-1 mb-2 `}>
    {/* Logo and Title */}
    <View style={tw`flex-row items-center`}>
      <View style={[tw`p-2 bg-yellow-600 rounded-full mr-3`]}>
        <MaterialCommunityIcons
          name="gold"
          size={20}
          style={[tw`text-yellow-900`]}
        />
      </View>
      <View>
        <Text style={tw`text-yellow-900 text-lg font-bold tracking-wide`}>
          AURUMLOG
        </Text>
        <Text style={[tw`text-xs font-semibold tracking-wide text-yellow-900`]}>
          Gold Rate Calculator
        </Text>
      </View>
    </View>

    {/* Settings Button */}
    {route.name === "Home" && (
      <TouchableOpacity
        onPress={() => navigation.navigate("Settings")}
        style={[tw`p-2 rounded-full bg-yellow-600`]}
      >
        <MaterialCommunityIcons
          name="cog"
          size={20}
          style={[tw`text-yellow-900`]}
        />
      </TouchableOpacity>
    )}
  </View>
);

const AppContent = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[tw`flex-1`, { backgroundColor: "#F59E0B" }]}>
      <StatusBar
        style="dark"
        backgroundColor="#F59E0B"
        translucent={Platform.OS === "android"}
      />

      {/* Status bar background for Android */}
      {Platform.OS === "android" && (
        <View
          style={{
            height: insets.top,
            backgroundColor: "#F59E0B",
          }}
        />
      )}

      <NavigationContainer>
        <Stack.Navigator
          screenOptions={({ navigation, route }) => ({
            headerStyle: {
              backgroundColor: "#F59E0B",
              height: Platform.OS === "ios" ? 100 : 70,
            },
            headerTitle: () => (
              <CustomHeader navigation={navigation} route={route} />
            ),
            headerTitleAlign: "left",
            headerShadowVisible: true,
            contentStyle: {
              backgroundColor: "#FFFBEB", // yellow-50
            },
          })}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="GoldCalculations"
            component={GoldCalculationsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SaleSlipGenerator"
            component={SaleSlipGeneratorScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="GoldConverters"
            component={GoldConvertersScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="GoldKaratInfo"
            component={GoldKaratInfoScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ConversionTable"
            component={ConversionTableScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TMRToGramsScreen"
            component={TMRToGramsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="GramsToTMRScreen"
            component={GramsToTMRScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="WaistCalculatorScreen"
            component={WaistCalculatorScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MoneyToGoldScreen"
            component={MoneyToGoldScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="GoldToMoneyScreen"
            component={GoldToMoneyScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ImpurityCalculatorScreen"
            component={ImpurityCalculatorScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PurityCalculatorScreen"
            component={PurityCalculatorScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ConversionReferenceScreen"
            component={ConversionReferenceScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ headerShown: false }}
          />
          {/* <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              presentation: "modal",
              headerTitle: () => (
                <View style={tw`flex-row items-center`}>
                  <MaterialCommunityIcons name="cog" size={24} color="white" />
                  <Text style={tw`text-white text-lg font-bold ml-2`}>
                    Settings
                  </Text>
                </View>
              ),
              headerStyle: {
                backgroundColor: "#F59E0B",
              },
            }}
          /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleSplashFinish = () => {
    setIsLoading(false);
  };

  // Show splash screen first
  if (isLoading) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}
