import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  LinearGradient,
} from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import tw from "../utils/tw";

export default function RateDisplay({
  currentRate,
  lastUpdated,
  onUpdateRate,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [newRate, setNewRate] = useState(currentRate.toString());
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateRate = async () => {
    const rate = parseFloat(newRate);

    if (isNaN(rate) || rate <= 0) {
      Alert.alert("Invalid Rate", "Please enter a valid gold rate");
      return;
    }

    setIsLoading(true);
    const success = await onUpdateRate(rate);
    setIsLoading(false);

    if (success) {
      setModalVisible(false);
      Alert.alert("Success", "Gold rate updated successfully!");
    } else {
      Alert.alert("Error", "Failed to update gold rate");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <View style={tw`relative overflow-hidden rounded-2xl mb-6 shadow-2xl`}>
        {/* Main Container with Background */}
        <View style={[tw`p-6`, { backgroundColor: "#D97706" }]}>
          {/* Decorative Elements */}
          <View
            style={[
              tw`absolute -top-4 -right-4 w-16 h-16 rounded-full`,
              { backgroundColor: "rgba(255,255,255,0.08)" },
            ]}
          />
          <View
            style={[
              tw`absolute -bottom-2 -left-2 w-12 h-12 rounded-full`,
              { backgroundColor: "rgba(255,255,255,0.08)" },
            ]}
          />

          {/* Header */}
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <View style={tw`flex-row items-center`}>
              <MaterialCommunityIcons name="gold" size={24} color="#FFFFFF" />
              <Text style={tw`text-white text-lg font-bold ml-2`}>
                Current Gold Rate
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                setNewRate(currentRate.toString());
                setModalVisible(true);
              }}
              style={[
                tw`px-3 py-1.5 rounded-full flex-row items-center`,
                { backgroundColor: "rgba(255,255,255,0.25)" },
              ]}
            >
              <MaterialCommunityIcons name="pencil" size={16} color="#FFFFFF" />
              <Text style={tw`text-white text-sm font-semibold ml-1`}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>

          {/* Rate Display */}
          <View
            style={[
              tw`rounded-xl p-4 border`,
              {
                backgroundColor: "rgba(0,0,0,0.15)",
                borderColor: "rgba(255,255,255,0.3)",
              },
            ]}
          >
            <Text
              style={[tw`text-sm font-semibold mb-1`, { color: "#F3F4F6" }]}
            >
              Per Tola (11.664g)
            </Text>
            <Text style={tw`text-white text-3xl font-bold tracking-wide`}>
              {formatCurrency(currentRate)}
            </Text>

            {/* Per Gram Rate */}
            <View
              style={[
                tw`flex-row items-center mt-2 pt-2 border-t`,
                { borderColor: "rgba(255,255,255,0.3)" },
              ]}
            >
              <MaterialCommunityIcons
                name="scale-balance"
                size={16}
                color="#FFFFFF"
              />
              <Text
                style={[tw`text-sm font-medium ml-1`, { color: "#F9FAFB" }]}
              >
                Per Gram: {formatCurrency(Math.round(currentRate / 11.664))}
              </Text>
            </View>
          </View>

          {/* Last Updated */}
          <View style={tw`flex-row items-center justify-center mt-4`}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={14}
              color="#FFFFFF"
            />
            <Text style={[tw`text-xs font-medium ml-1`, { color: "#F3F4F6" }]}>
              Last updated: {lastUpdated || "Never"}
            </Text>
          </View>
        </View>
      </View>

      {/* Edit Rate Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={[
            tw`flex-1 justify-center items-center`,
            { backgroundColor: "rgba(0,0,0,0.6)" },
          ]}
        >
          <View style={tw`bg-white rounded-2xl m-4 p-6 shadow-2xl w-80`}>
            {/* Modal Header */}
            <View style={tw`flex-row items-center mb-6`}>
              <MaterialCommunityIcons name="gold" size={24} color="#D97706" />
              <Text style={tw`text-xl font-bold text-gray-900 ml-2`}>
                Update Gold Rate
              </Text>
            </View>

            {/* Input Field */}
            <View style={tw`mb-6`}>
              <Text style={tw`text-gray-700 text-sm font-semibold mb-2`}>
                Rate per Tola (PKR)
              </Text>
              <View style={tw`bg-gray-50 rounded-xl border-2 border-gray-300`}>
                <TextInput
                  style={tw`px-4 py-3 text-lg font-semibold text-gray-900`}
                  value={newRate}
                  onChangeText={setNewRate}
                  keyboardType="numeric"
                  placeholder="Enter gold rate"
                  placeholderTextColor="#6B7280"
                />
              </View>

              {/* Preview */}
              {!isNaN(parseFloat(newRate)) && parseFloat(newRate) > 0 && (
                <View
                  style={tw`mt-3 p-3 bg-amber-50 rounded-lg border border-amber-300`}
                >
                  <Text style={tw`text-amber-900 text-sm font-medium`}>
                    Preview: {formatCurrency(parseFloat(newRate))} per tola
                  </Text>
                  <Text style={tw`text-amber-800 text-xs font-medium mt-1`}>
                    Per gram:{" "}
                    {formatCurrency(Math.round(parseFloat(newRate) / 11.664))}
                  </Text>
                </View>
              )}
            </View>

            {/* Buttons */}
            <View style={tw`flex-row gap-3`}>
              <TouchableOpacity
                style={tw`flex-1 bg-gray-300 py-3 rounded-xl`}
                onPress={() => setModalVisible(false)}
                disabled={isLoading}
              >
                <Text style={tw`text-center text-gray-800 font-bold`}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  tw`flex-1 py-3 rounded-xl ${isLoading ? "opacity-50" : ""}`,
                  { backgroundColor: "#D97706" },
                ]}
                onPress={handleUpdateRate}
                disabled={isLoading}
              >
                <Text style={tw`text-center text-white font-bold`}>
                  {isLoading ? "Updating..." : "Update Rate"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
