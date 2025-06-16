import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  FlatList,
  RefreshControl,
  Dimensions,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import tw from "../utils/tw";
import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get("window");

export default function GoldCalculationsScreen({ route, navigation }) {
  const { currentRate = 341000 } = route.params || {};

  // State for calculator
  const [activeTab, setActiveTab] = useState("weight");
  const [goldEntries, setGoldEntries] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Form state
  const [form, setForm] = useState({
    description: "Gold Weight",
    tola: "",
    masha: "",
    ratti: "",
    grams: "",
    karat: "24",
    type: "add", // add or subtract
    price: "",
  });

  // Load saved entries
  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const saved = await AsyncStorage.getItem("@goldCalculations");
      if (saved) {
        setGoldEntries(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading entries:", error);
    }
  };

  const saveEntries = async (entries) => {
    try {
      await AsyncStorage.setItem("@goldCalculations", JSON.stringify(entries));
    } catch (error) {
      console.error("Error saving entries:", error);
    }
  };

  const convertToGrams = (tola, masha, ratti) => {
    const tolaInG = parseFloat(tola || 0) * 11.664;
    const mashaInG = parseFloat(masha || 0) * 0.972;
    const rattiInG = parseFloat(ratti || 0) * 0.1215;
    return tolaInG + mashaInG + rattiInG;
  };

  const convertGramsToTMR = (grams) => {
    const totalRatti = grams / 0.1215;
    const tola = Math.floor(totalRatti / 96);
    const remainingRatti = totalRatti % 96;
    const masha = Math.floor(remainingRatti / 8);
    const ratti = Math.round(remainingRatti % 8);
    return { tola, masha, ratti };
  };

  const getKaratPurity = (karat) => {
    const purities = {
      24: 1.0,
      22: 0.9167,
      21: 0.875,
      20: 0.833,
      18: 0.75,
      14: 0.583,
      10: 0.417,
      9: 0.375,
    };
    return purities[karat] || 1.0;
  };

  const calculateValue = (grams, karat, rate) => {
    const purity = getKaratPurity(karat);
    const pureGold = grams * purity;
    const ratePerGram = rate / 11.664;
    return pureGold * ratePerGram;
  };

  const handleAddEntry = () => {
    if (!form.description.trim()) {
      Alert.alert("Error", "Please enter a description");
      return;
    }

    let totalGrams = 0;

    if (form.grams) {
      totalGrams = parseFloat(form.grams);
    } else {
      totalGrams = convertToGrams(form.tola, form.masha, form.ratti);
    }

    if (totalGrams <= 0) {
      Alert.alert("Error", "Please enter valid weight");
      return;
    }

    const tmr = convertGramsToTMR(totalGrams);
    const value = calculateValue(totalGrams, form.karat, currentRate);
    const customPrice = form.price ? parseFloat(form.price) : value;

    const entry = {
      id: Date.now().toString(),
      description: form.description,
      weight: {
        grams: totalGrams,
        tola: tmr.tola,
        masha: tmr.masha,
        ratti: tmr.ratti,
      },
      karat: form.karat,
      type: form.type,
      calculatedValue: value,
      customPrice: customPrice,
      finalPrice: customPrice,
      date: new Date().toISOString(),
    };

    const newEntries = [...goldEntries, entry];
    setGoldEntries(newEntries);
    saveEntries(newEntries);

    // Reset form
    setForm({
      description: "Gold Weight",
      tola: "",
      masha: "",
      ratti: "",
      grams: "",
      karat: "24",
      type: "add",
      price: "",
    });

    setShowAddModal(false);
  };

  const deleteEntry = (id) => {
    Alert.alert("Delete Entry", "Are you sure you want to delete this entry?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const newEntries = goldEntries.filter((entry) => entry.id !== id);
          setGoldEntries(newEntries);
          saveEntries(newEntries);
        },
      },
    ]);
  };

  const calculateTotals = () => {
    let totalWeight = 0;
    let totalValue = 0;
    let addedWeight = 0;
    let subtractedWeight = 0;
    let addedValue = 0;
    let subtractedValue = 0;

    goldEntries.forEach((entry) => {
      if (entry.type === "add") {
        addedWeight += entry.weight.grams;
        addedValue += entry.finalPrice;
        totalWeight += entry.weight.grams;
        totalValue += entry.finalPrice;
      } else {
        subtractedWeight += entry.weight.grams;
        subtractedValue += entry.finalPrice;
        totalWeight -= entry.weight.grams;
        totalValue -= entry.finalPrice;
      }
    });

    return {
      totalWeight,
      totalValue,
      addedWeight,
      subtractedWeight,
      addedValue,
      subtractedValue,
      balanceWeight: totalWeight,
      balanceValue: totalValue,
    };
  };

  const generatePDF = async () => {
    try {
      const totals = calculateTotals();
      const currentDate = moment().format("MMMM D, YYYY h:mm A");

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Gold Calculation Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              background: #f8f9fa;
            }
            .header {
              text-align: center;
              background: linear-gradient(135deg, #10B2F4, #0891b2);
              color: white;
              padding: 20px;
              border-radius: 10px;
              margin-bottom: 20px;
            }
            .summary {
              background: white;
              padding: 20px;
              border-radius: 10px;
              margin-bottom: 20px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .summary-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
            }
            .summary-item {
              text-align: center;
              padding: 15px;
              border-radius: 8px;
            }
            .add-item { background: #dcfce7; color: #166534; }
            .subtract-item { background: #fef2f2; color: #991b1b; }
            .balance-item { background: #f0f9ff; color: #1e40af; }
            table {
              width: 100%;
              border-collapse: collapse;
              background: white;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            th, td {
              padding: 12px;
              text-align: left;
              border-bottom: 1px solid #e5e7eb;
            }
            th {
              background: #f8fafc;
              font-weight: bold;
              color: #374151;
            }
            .add-row { background: #f0fdf4; }
            .subtract-row { background: #fef2f2; }
            .amount { font-weight: bold; }
            .add-amount { color: #16a34a; }
            .subtract-amount { color: #dc2626; }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #6b7280;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🏆 AurumLog Gold Calculator</h1>
            <p>Professional Gold Calculation Report</p>
            <p>Generated on ${currentDate}</p>
          </div>
          
          <div class="summary">
            <h2>📊 Summary</h2>
            <div class="summary-grid">
              <div class="summary-item add-item">
                <h3>➕ Added Gold</h3>
                <p><strong>${totals.addedWeight.toFixed(3)}g</strong></p>
                <p>PKR ${totals.addedValue.toLocaleString()}</p>
              </div>
              <div class="summary-item subtract-item">
                <h3>➖ Subtracted Gold</h3>
                <p><strong>${totals.subtractedWeight.toFixed(3)}g</strong></p>
                <p>PKR ${totals.subtractedValue.toLocaleString()}</p>
              </div>
            </div>
            <div class="summary-item balance-item" style="margin-top: 20px;">
              <h3>⚖️ Final Balance</h3>
              <p><strong>Weight:</strong> ${totals.balanceWeight.toFixed(
                3
              )}g</p>
              <p><strong>Value:</strong> PKR ${totals.balanceValue.toLocaleString()}</p>
            </div>
          </div>

          <h2>📋 Detailed Entries</h2>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Type</th>
                <th>Weight (g)</th>
                <th>Karat</th>
                <th>Value (PKR)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${goldEntries
                .map(
                  (entry) => `
                <tr class="${entry.type}-row">
                  <td>${entry.description}</td>
                  <td>${entry.type === "add" ? "➕ Add" : "➖ Subtract"}</td>
                  <td>${entry.weight.grams.toFixed(3)}</td>
                  <td>${entry.karat}K</td>
                  <td class="amount ${entry.type}-amount">
                    ${
                      entry.type === "add" ? "+" : "-"
                    }${entry.finalPrice.toLocaleString()}
                  </td>
                  <td>${moment(entry.date).format("MMM D, YYYY")}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="footer">
            <p>Generated by AurumLog - Professional Jeweler's Assistant</p>
            <p>Gold Rate: PKR ${currentRate.toLocaleString()} per Tola</p>
          </div>
        </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Share Gold Calculation Report",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to generate PDF report");
      console.error("PDF Error:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEntries();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const totals = calculateTotals();
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const tabs = [
    { id: "weight", label: "Weight Calculator", icon: "scale-balance" },
    { id: "value", label: "Value Calculator", icon: "currency-usd" },
    { id: "price", label: "Price Calculator", icon: "calculator" },
  ];

  const renderEntry = ({ item }) => (
    <View
      style={[
        tw`bg-white rounded-2xl p-4 mb-3 border-l-4`,
        item.type === "add"
          ? { borderLeftColor: "#10B981" }
          : { borderLeftColor: "#EF4444" },
      ]}
    >
      <View style={tw`flex-row justify-between items-start mb-2`}>
        <View style={tw`flex-1`}>
          <Text style={tw`text-lg font-bold text-gray-800`}>
            {item.description}
          </Text>
          <Text style={tw`text-sm text-gray-600`}>
            {moment(item.date).format("MMM D, YYYY h:mm A")}
          </Text>
        </View>

        <View style={tw`flex-row items-center`}>
          <View
            style={[
              tw`px-2 py-1 rounded-full mr-2`,
              item.type === "add"
                ? { backgroundColor: "#DCFCE7" }
                : { backgroundColor: "#FEE2E2" },
            ]}
          >
            <Text
              style={[
                tw`text-xs font-medium`,
                item.type === "add"
                  ? { color: "#166534" }
                  : { color: "#991B1B" },
              ]}
            >
              {item.type === "add" ? "➕ ADD" : "➖ SUBTRACT"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => deleteEntry(item.id)}
            style={tw`p-2`}
          >
            <MaterialCommunityIcons name="delete" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={tw`flex-row justify-between mb-3`}>
        <View>
          <Text style={tw`text-sm text-gray-600`}>Weight</Text>
          <Text style={tw`text-base font-semibold text-gray-800`}>
            {item.weight.grams.toFixed(3)}g
          </Text>
          <Text style={tw`text-xs text-gray-500`}>
            {item.weight.tola}T {item.weight.masha}M {item.weight.ratti}R
          </Text>
        </View>

        <View>
          <Text style={tw`text-sm text-gray-600`}>Karat</Text>
          <Text style={tw`text-base font-semibold text-gray-800`}>
            {item.karat}K
          </Text>
        </View>

        <View style={tw`text-right`}>
          <Text style={tw`text-sm text-gray-600`}>Value</Text>
          <Text
            style={[
              tw`text-base font-bold`,
              item.type === "add" ? { color: "#10B981" } : { color: "#EF4444" },
            ]}
          >
            {item.type === "add" ? "+" : "-"}
            {formatCurrency(item.finalPrice)}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={tw`flex-1 bg-blue-50`}>
      <StatusBar
        style="dark"
        backgroundColor="#10B2F4"
        translucent={Platform.OS === "android"}
      />
      {/* Header */}
      <View style={[tw`px-4 pt-12 pb-4`, { backgroundColor: "#10B2F4" }]}>
        <View style={tw`flex-row items-center justify-between mb-4`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`p-2 rounded-full bg-white bg-opacity-20`}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
          </TouchableOpacity>

          <Text style={tw`text-xl font-bold text-white`}>Gold Calculator</Text>

          <TouchableOpacity
            onPress={generatePDF}
            style={tw`p-2 rounded-full bg-white bg-opacity-20`}
            disabled={goldEntries.length === 0}
          >
            <MaterialCommunityIcons
              name="file-pdf-box"
              size={24}
              color={
                goldEntries.length === 0 ? "rgba(255,255,255,0.5)" : "white"
              }
            />
          </TouchableOpacity>
        </View>

        {/* Balance Display */}
        <View style={tw`bg-white bg-opacity-15 rounded-2xl p-4 mb-4`}>
          <Text style={tw`text-white text-center text-sm font-medium mb-2`}>
            Current Balance
          </Text>
          <View style={tw`flex-row justify-between`}>
            <View style={tw`items-center flex-1`}>
              <Text style={tw`text-white text-2xl font-bold`}>
                {totals.balanceWeight.toFixed(3)}g
              </Text>
              <Text style={tw`text-white text-opacity-80 text-sm`}>Weight</Text>
            </View>
            <View style={tw`items-center flex-1`}>
              <Text style={tw`text-white text-2xl font-bold`}>
                {formatCurrency(totals.balanceValue)}
              </Text>
              <Text style={tw`text-white text-opacity-80 text-sm`}>Value</Text>
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={tw`flex-row gap-2`}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={[
                  tw`px-4 py-2 rounded-full flex-row items-center`,
                  activeTab === tab.id
                    ? tw`bg-white`
                    : tw`bg-white bg-opacity-20`,
                ]}
              >
                <MaterialCommunityIcons
                  name={tab.icon}
                  size={16}
                  color={activeTab === tab.id ? "#10B2F4" : "white"}
                />
                <Text
                  style={[
                    tw`ml-2 text-sm font-medium`,
                    activeTab === tab.id
                      ? { color: "#10B2F4" }
                      : { color: "white" },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`p-4`}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#10B2F4"]}
            tintColor="#10B2F4"
          />
        }
      >
        {/* Summary Cards */}
        <View style={tw`flex-row gap-3 mb-4`}>
          <View
            style={tw`flex-1 bg-green-50 rounded-2xl p-4 border border-green-200`}
          >
            <View style={tw`flex-row items-center mb-2`}>
              <MaterialCommunityIcons
                name="plus-circle"
                size={20}
                color="#10B981"
              />
              <Text style={tw`text-green-800 font-semibold ml-2`}>Added</Text>
            </View>
            <Text style={tw`text-green-900 text-lg font-bold`}>
              {totals.addedWeight.toFixed(3)}g
            </Text>
            <Text style={tw`text-green-700 text-sm`}>
              {formatCurrency(totals.addedValue)}
            </Text>
          </View>

          <View
            style={tw`flex-1 bg-red-50 rounded-2xl p-4 border border-red-200`}
          >
            <View style={tw`flex-row items-center mb-2`}>
              <MaterialCommunityIcons
                name="minus-circle"
                size={20}
                color="#EF4444"
              />
              <Text style={tw`text-red-800 font-semibold ml-2`}>
                Subtracted
              </Text>
            </View>
            <Text style={tw`text-red-900 text-lg font-bold`}>
              {totals.subtractedWeight.toFixed(3)}g
            </Text>
            <Text style={tw`text-red-700 text-sm`}>
              {formatCurrency(totals.subtractedValue)}
            </Text>
          </View>
        </View>

        {/* Add Entry Button */}
        <TouchableOpacity
          onPress={() => setShowAddModal(true)}
          style={[
            tw`bg-white rounded-2xl p-4 mb-4 flex-row items-center justify-center shadow-sm`,
            { borderColor: "#10B2F4", borderWidth: 2, borderStyle: "dashed" },
          ]}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#10B2F4" />
          <Text style={tw`text-blue-600 text-lg font-semibold ml-2`}>
            Add Gold Entry
          </Text>
        </TouchableOpacity>

        {/* Entries List */}
        {goldEntries.length === 0 ? (
          <View style={tw`bg-white rounded-2xl p-8 items-center`}>
            <MaterialCommunityIcons
              name="calculator"
              size={64}
              color="#D1D5DB"
            />
            <Text style={tw`text-gray-500 text-lg font-medium mt-4 mb-2`}>
              No calculations yet
            </Text>
            <Text style={tw`text-gray-400 text-center`}>
              Start by adding your first gold entry to begin calculating weights
              and values
            </Text>
          </View>
        ) : (
          <FlatList
            data={goldEntries}
            renderItem={renderEntry}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        )}
      </ScrollView>

      {/* Add Entry Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddModal}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View
          style={[
            tw`flex-1 justify-end`,
            { backgroundColor: "rgba(0,0,0,0.5)" },
          ]}
        >
          <View style={tw`bg-white rounded-t-3xl p-6 max-h-5/6`}>
            {/* Modal Header */}
            <View style={tw`flex-row items-center justify-between mb-6`}>
              <Text style={tw`text-2xl font-bold text-gray-800`}>
                Add Gold Entry
              </Text>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={tw`p-2`}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Description */}
              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-700 font-medium mb-2`}>
                  Description
                </Text>
                <TextInput
                  style={tw`bg-gray-50 rounded-xl p-4 text-gray-800 border border-gray-200`}
                  value={form.description}
                  onChangeText={(text) =>
                    setForm({ ...form, description: text })
                  }
                  placeholder="e.g., Gold Ring, Necklace, etc."
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Type Selection */}
              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-700 font-medium mb-2`}>Type</Text>
                <View style={tw`flex-row gap-3`}>
                  <TouchableOpacity
                    onPress={() => setForm({ ...form, type: "add" })}
                    style={[
                      tw`flex-1 p-4 rounded-xl border-2 flex-row items-center justify-center`,
                      form.type === "add"
                        ? { borderColor: "#10B981", backgroundColor: "#DCFCE7" }
                        : {
                            borderColor: "#E5E7EB",
                            backgroundColor: "#F9FAFB",
                          },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="plus-circle"
                      size={20}
                      color={form.type === "add" ? "#10B981" : "#6B7280"}
                    />
                    <Text
                      style={[
                        tw`font-medium ml-2`,
                        form.type === "add"
                          ? tw`text-green-800`
                          : tw`text-gray-600`,
                      ]}
                    >
                      Add Gold
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setForm({ ...form, type: "subtract" })}
                    style={[
                      tw`flex-1 p-4 rounded-xl border-2 flex-row items-center justify-center`,
                      form.type === "subtract"
                        ? { borderColor: "#EF4444", backgroundColor: "#FEE2E2" }
                        : {
                            borderColor: "#E5E7EB",
                            backgroundColor: "#F9FAFB",
                          },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="minus-circle"
                      size={20}
                      color={form.type === "subtract" ? "#EF4444" : "#6B7280"}
                    />
                    <Text
                      style={[
                        tw`font-medium ml-2`,
                        form.type === "subtract"
                          ? tw`text-red-800`
                          : tw`text-gray-600`,
                      ]}
                    >
                      Subtract Gold
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Weight Input */}
              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-700 font-medium mb-3`}>Weight</Text>

                {/* TMR Input */}
                <View
                  style={tw`bg-gray-50 rounded-xl p-4 mb-3 border border-gray-200`}
                >
                  <Text style={tw`text-sm text-gray-600 mb-2`}>
                    Tola - Masha - Ratti
                  </Text>
                  <View style={tw`flex-row gap-2`}>
                    <View style={tw`flex-1`}>
                      <Text style={tw`text-xs text-gray-500 mb-1`}>Tola</Text>
                      <TextInput
                        style={tw`bg-white rounded-lg p-3 text-center border border-gray-200`}
                        value={form.tola}
                        onChangeText={(text) =>
                          setForm({ ...form, tola: text, grams: "" })
                        }
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                    <View style={tw`flex-1`}>
                      <Text style={tw`text-xs text-gray-500 mb-1`}>Masha</Text>
                      <TextInput
                        style={tw`bg-white rounded-lg p-3 text-center border border-gray-200`}
                        value={form.masha}
                        onChangeText={(text) =>
                          setForm({ ...form, masha: text, grams: "" })
                        }
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                    <View style={tw`flex-1`}>
                      <Text style={tw`text-xs text-gray-500 mb-1`}>Ratti</Text>
                      <TextInput
                        style={tw`bg-white rounded-lg p-3 text-center border border-gray-200`}
                        value={form.ratti}
                        onChangeText={(text) =>
                          setForm({ ...form, ratti: text, grams: "" })
                        }
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                  </View>
                </View>

                {/* OR Divider */}
                <View style={tw`flex-row items-center mb-3`}>
                  <View style={tw`flex-1 h-px bg-gray-300`} />
                  <Text style={tw`text-gray-500 text-sm mx-3 font-medium`}>
                    OR
                  </Text>
                  <View style={tw`flex-1 h-px bg-gray-300`} />
                </View>

                {/* Grams Input */}
                <View
                  style={tw`bg-gray-50 rounded-xl p-4 border border-gray-200`}
                >
                  <Text style={tw`text-sm text-gray-600 mb-2`}>
                    Direct Weight in Grams
                  </Text>
                  <TextInput
                    style={tw`bg-white rounded-lg p-3 text-center border border-gray-200`}
                    value={form.grams}
                    onChangeText={(text) =>
                      setForm({
                        ...form,
                        grams: text,
                        tola: "",
                        masha: "",
                        ratti: "",
                      })
                    }
                    keyboardType="numeric"
                    placeholder="0.000"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              {/* Karat Selection */}
              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-700 font-medium mb-3`}>
                  Gold Karat
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={tw`flex-row gap-2`}>
                    {["24", "22", "21", "20", "18", "14", "10", "9"].map(
                      (karat) => (
                        <TouchableOpacity
                          key={karat}
                          onPress={() => setForm({ ...form, karat })}
                          style={[
                            tw`px-4 py-3 rounded-xl border-2`,
                            form.karat === karat
                              ? {
                                  borderColor: "#10B2F4",
                                  backgroundColor: "#EBF8FF",
                                }
                              : {
                                  borderColor: "#E5E7EB",
                                  backgroundColor: "#F9FAFB",
                                },
                          ]}
                        >
                          <Text
                            style={[
                              tw`font-semibold`,
                              form.karat === karat
                                ? tw`text-blue-600`
                                : tw`text-gray-600`,
                            ]}
                          >
                            {karat}K
                          </Text>
                          <Text
                            style={[
                              tw`text-xs`,
                              form.karat === karat
                                ? tw`text-blue-500`
                                : tw`text-gray-500`,
                            ]}
                          >
                            {(getKaratPurity(karat) * 100).toFixed(1)}%
                          </Text>
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                </ScrollView>
              </View>

              {/* Custom Price (Optional) */}
              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-700 font-medium mb-2`}>
                  Custom Price (Optional)
                </Text>
                <Text style={tw`text-gray-500 text-sm mb-2`}>
                  Leave empty to use calculated value based on current rate
                </Text>
                <TextInput
                  style={tw`bg-gray-50 rounded-xl p-4 text-gray-800 border border-gray-200`}
                  value={form.price}
                  onChangeText={(text) => setForm({ ...form, price: text })}
                  keyboardType="numeric"
                  placeholder="Enter custom price in PKR"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Preview */}
              {(form.grams || form.tola || form.masha || form.ratti) && (
                <View
                  style={tw`bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200`}
                >
                  <Text style={tw`text-blue-800 font-semibold mb-2`}>
                    Preview
                  </Text>
                  {(() => {
                    const totalGrams = form.grams
                      ? parseFloat(form.grams || 0)
                      : convertToGrams(form.tola, form.masha, form.ratti);
                    const calculatedValue = calculateValue(
                      totalGrams,
                      form.karat,
                      currentRate
                    );
                    const finalPrice = form.price
                      ? parseFloat(form.price)
                      : calculatedValue;

                    return (
                      <View>
                        <View style={tw`flex-row justify-between mb-1`}>
                          <Text style={tw`text-blue-700 text-sm`}>Weight:</Text>
                          <Text style={tw`text-blue-800 font-medium text-sm`}>
                            {totalGrams.toFixed(3)}g
                          </Text>
                        </View>
                        <View style={tw`flex-row justify-between mb-1`}>
                          <Text style={tw`text-blue-700 text-sm`}>Karat:</Text>
                          <Text style={tw`text-blue-800 font-medium text-sm`}>
                            {form.karat}K (
                            {(getKaratPurity(form.karat) * 100).toFixed(1)}%)
                          </Text>
                        </View>
                        <View style={tw`flex-row justify-between mb-1`}>
                          <Text style={tw`text-blue-700 text-sm`}>
                            Calculated Value:
                          </Text>
                          <Text style={tw`text-blue-800 font-medium text-sm`}>
                            {formatCurrency(calculatedValue)}
                          </Text>
                        </View>
                        {form.price && (
                          <View style={tw`flex-row justify-between`}>
                            <Text style={tw`text-blue-700 text-sm`}>
                              Custom Price:
                            </Text>
                            <Text style={tw`text-blue-800 font-bold text-sm`}>
                              {formatCurrency(finalPrice)}
                            </Text>
                          </View>
                        )}
                      </View>
                    );
                  })()}
                </View>
              )}

              {/* Action Buttons */}
              <View style={tw`flex-row gap-3 mb-4`}>
                <TouchableOpacity
                  style={tw`flex-1 bg-gray-200 py-4 rounded-xl`}
                  onPress={() => setShowAddModal(false)}
                >
                  <Text style={tw`text-center text-gray-700 font-semibold`}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    tw`flex-1 py-4 rounded-xl`,
                    { backgroundColor: "#10B2F4" },
                  ]}
                  onPress={handleAddEntry}
                >
                  <Text style={tw`text-center text-white font-semibold`}>
                    Add Entry
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
