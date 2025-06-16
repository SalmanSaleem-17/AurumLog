// Install these packages instead:
// npx expo install expo-print expo-sharing expo-bluetooth
// npm install react-native-thermal-receipt-printer-image-qr

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  SafeAreaView,
  FlatList,
  Modal,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import tw from "twrnc";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import companyImage from "../assets/AurumLogIcon.jpg";

const SaleSlipGeneratorScreen = ({ navigation, route }) => {
  const { currentRate = 341000 } = route.params || {};

  // Existing state variables
  const [calculationType, setCalculationType] = useState("amount");
  const [amount, setAmount] = useState("");
  const [grams, setGrams] = useState("");
  const [tola, setTola] = useState("");
  const [masha, setMasha] = useState("");
  const [ratti, setRatti] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [goldKarat, setGoldKarat] = useState("24");
  const [description, setDescription] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [billNumber, setBillNumber] = useState("");

  // Print state
  const [isPrinting, setIsPrinting] = useState(false);

  // Karat purity multipliers
  const karatPurity = {
    24: 1.0,
    22: 0.9167,
    21: 0.875,
    18: 0.75,
    14: 0.585,
    10: 0.417,
  };

  useEffect(() => {
    // Set current date and time
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const formattedTime = now.toLocaleTimeString("en-PK", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    setCurrentDateTime(`${formattedDate} ${formattedTime}`);

    // Generate bill number
    const billNo = `GS${now.getFullYear()}${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}${String(now.getDate()).padStart(2, "0")}${String(
      now.getHours()
    ).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
    setBillNumber(billNo);
  }, []);

  // Generate HTML for thermal printer
  // Generate HTML for thermal printer - ELEGANT VERSION
  const generateReceiptHTML = () => {
    const goldRate = Math.round(currentRate * karatPurity[goldKarat]);

    return `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Sale Slip</title>
      <style>
          @page {
              size: 58mm auto;
              margin: 0;
          }
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }
          body {
              font-family: Arial, sans-serif;
              font-size: 10px;
              line-height: 1.3;
              width: 58mm;
              padding: 3mm;
              background: white;
              color: #000;
          }
          .header {
              text-align: center;
              margin-bottom: 8px;
              border-bottom: 2px solid #000;
              padding-bottom: 6px;
          }
          .company-name {
              font-size: 20px;
              font-weight: bold;
              letter-spacing: 1.5px;
              margin-bottom: 2px;
              font-family: 'Arial Black', sans-serif;
          }
          .slip-type {
              font-size: 12px;
              font-weight: 600;
              margin-bottom: 3px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
          }
          .datetime {
              font-size: 9px;
              margin-bottom: 1px;
              color: #555;
          }
          .bill-number {
              font-size: 9px;
              font-weight: bold;
              color: #333;
          }
          .section {
              margin: 8px 0;
          }
          .section-title {
              font-weight: bold;
              font-size: 10px;
              text-align: center;
              margin-bottom: 5px;
              text-transform: uppercase;
              letter-spacing: 0.3px;
              border-bottom: 1px solid #ddd;
              padding-bottom: 2px;
          }
          .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 3px;
              font-size: 9px;
              padding: 2px 0;
          }
          .info-row .label {
              font-weight: 500;
              color: #555;
          }
          .info-row .value {
              font-weight: bold;
              color: #000;
          }
          .rate-section {
              background: #f8f8f8;
              padding: 5px;
              border: 1px solid #ddd;
              border-radius: 2px;
              margin: 6px 0;
              text-align: center;
          }
          .rate-display {
              font-size: 12px;
              font-weight: bold;
              margin-bottom: 2px;
          }
          .weight-section {
              margin: 8px 0;
          }
          .weight-main {
              display: flex;
              justify-content: space-between;
              align-items: center;
              background: #f5f5f5;
              padding: 4px 6px;
              border: 1px solid #ddd;
              border-radius: 2px;
              margin-bottom: 5px;
          }
          .weight-main .label {
              font-weight: 600;
              font-size: 14px;
          }
          .weight-main .value {
              font-weight: bold;
              font-size: 14px;
          }
          .tmr-table {
              width: 100%;
              border-collapse: collapse;
              border: 2px solid #333;
              margin: 5px 0;
          }
          .tmr-table th,
          .tmr-table td {
              border: 1px solid #333;
              padding: 6px 4px;
              text-align: center;
              font-weight: bold;
          }
          .tmr-table th {
              background: #f0f0f0;
              font-size: 9px;
              text-transform: uppercase;
              letter-spacing: 0.3px;
              color: #333;
          }
          .tmr-table td {
              font-size: 14px;
              font-weight: bold;
              color: #000;
              background: white;
          }
          .total-section {
              margin: 10px 0;
              text-align: center;
              border-top: 2px solid #000;
              border-bottom: 2px solid #000;
              padding: 6px 0;
          }
          .total-label {
              font-size: 10px;
              margin-bottom: 3px;
              font-weight: 600;
              color: #555;
          }
          .total-amount {
              font-size: 16px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #000;
          }
          .footer {
              text-align: center;
              margin-top: 8px;
              font-size: 9px;
          }
          .footer-thanks {
              font-weight: bold;
              margin-bottom: 3px;
          }
          .divider {
              text-align: center;
              margin: 6px 0;
              font-size: 12px;
              color: #999;
          }
      </style>
  </head>
  <body>
      <div class="header">
          <div class="company-name">AURUMLOG</div>
          <div class="slip-type">Gold Sale Receipt</div>
          <div class="datetime">${currentDateTime}</div>
          <div class="bill-number">Invoice: ${billNumber}</div>
      </div>

      ${
        customerName || customerPhone || description
          ? `
      <div class="section">
          <div class="section-title">Customer Details</div>
          ${
            customerName
              ? `<div class="info-row"><span class="label">Name:</span><span class="value">${customerName}</span></div>`
              : ""
          }
          ${
            customerPhone
              ? `<div class="info-row"><span class="label">Contact:</span><span class="value">${customerPhone}</span></div>`
              : ""
          }
          ${
            description
              ? `<div class="info-row"><span class="label">Description:</span><span class="value">${description}</span></div>`
              : ""
          }
      </div>
      `
          : ""
      }

      <div class="rate-section">
          <div class="rate-display">Gold Rate: Rs. ${goldRate.toLocaleString()}</div>
      </div>

      <div class="weight-section">
          <div class="weight-main">
              <span class="label">Total Weight (${goldKarat}K):</span>
              <span class="value">${parseFloat(grams || 0).toFixed(
                3
              )} grams</span>
          </div>
          
          <table class="tmr-table">
              <thead>
                  <tr>
                      <th>Tola</th>
                      <th>Masha</th>
                      <th>Ratti</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td>${tola || "0"}</td>
                      <td>${masha || "0"}</td>
                      <td>${parseFloat(ratti || 0).toFixed(2)}</td>
                  </tr>
              </tbody>
          </table>
      </div>

      <div class="total-section">
          <div class="total-label">Grand Total</div>
          <div class="total-amount">Rs. ${(
            parseFloat(amount) || 0
          ).toLocaleString()}</div>
      </div>

      <div class="footer">
          <div class="footer-thanks">Thank you for Shopping with Us!</div>
      </div>
  </body>
  </html>
  `;
  };

  // Print using Expo Print
  // Print using Expo Print - UPDATED VERSION
  const printSlip = async () => {
    if (!amount || (!grams && !tola && !masha && !ratti)) {
      Alert.alert(
        "Incomplete Data",
        "Please fill in either amount or weight details"
      );
      return;
    }

    setIsPrinting(true);

    try {
      const html = generateReceiptHTML();

      // Create PDF from HTML with specific thermal printer settings
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
        width: 160, // 58mm in points (58mm * 2.834 points/mm ≈ 164, but using 220 for better compatibility)
        height: 800, // Auto height, will adjust based on content
      });

      // Print the PDF with specific thermal printer options
      await Print.printAsync({
        uri,
        printerUrl: undefined, // Will show printer selection dialog
        orientation: Print.Orientation.portrait,
        useMarkupFormatter: false,
        markupFormatterIOS: "UIMarkupTextPrintFormatter",
      });

      Alert.alert("Success", "Slip sent to printer successfully!");
    } catch (error) {
      console.log("Printing error:", error);

      // Fallback: Share the receipt if direct printing fails
      try {
        const html = generateReceiptHTML();
        const { uri } = await Print.printToFileAsync({
          html,
          base64: false,
          width: 160,
          height: 800,
        });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            mimeType: "application/pdf",
            dialogTitle: "Share Receipt",
          });
        }
      } catch (shareError) {
        Alert.alert("Error", "Failed to generate receipt. Please try again.");
      }
    } finally {
      setIsPrinting(false);
    }
  };

  // Handle print button press - UPDATED VERSION
  const handlePrintSlip = () => {
    Alert.alert("Print Receipt", "Choose how you want to print your receipt:", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Print",
        onPress: printSlip,
      },
      {
        text: "Share PDF",
        onPress: async () => {
          try {
            const html = generateReceiptHTML();
            const { uri } = await Print.printToFileAsync({
              html,
              base64: false,
              width: 220, // Same width for consistency
              height: 800,
            });

            if (await Sharing.isAvailableAsync()) {
              await Sharing.shareAsync(uri, {
                mimeType: "application/pdf",
                dialogTitle: "Share Receipt",
              });
            }
          } catch (error) {
            Alert.alert("Error", "Failed to generate PDF");
          }
        },
      },
    ]);
  };

  // Handle print button press
  // const handlePrintSlip = () => {
  //   Alert.alert("Print Receipt", "Choose how you want to print your receipt:", [
  //     { text: "Cancel", style: "cancel" },
  //     {
  //       text: "Print",
  //       onPress: printSlip,
  //     },
  //     {
  //       text: "Share PDF",
  //       onPress: async () => {
  //         try {
  //           const html = generateReceiptHTML();
  //           const { uri } = await Print.printToFileAsync({
  //             html,
  //             base64: false,
  //           });

  //           if (await Sharing.isAvailableAsync()) {
  //             await Sharing.shareAsync(uri, {
  //               mimeType: "application/pdf",
  //               dialogTitle: "Share Receipt",
  //             });
  //           }
  //         } catch (error) {
  //           Alert.alert("Error", "Failed to generate PDF");
  //         }
  //       },
  //     },
  //   ]);
  // };

  // Convert TMR to grams
  const tmrToGrams = (t, m, r) => {
    const tolaInGrams = parseFloat(t || 0) * 11.664;
    const mashaInGrams = parseFloat(m || 0) * 0.972;
    const rattiInGrams = parseFloat(r || 0) * 0.1215;
    return tolaInGrams + mashaInGrams + rattiInGrams;
  };

  // Convert grams to TMR
  const gramsToTMR = (totalGrams) => {
    const grams = parseFloat(totalGrams);
    const tolaCount = Math.floor(grams / 11.664);
    const remainingAfterTola = grams - tolaCount * 11.664;

    const mashaCount = Math.floor(remainingAfterTola / 0.972);
    const remainingAfterMasha = remainingAfterTola - mashaCount * 0.972;

    const rattiCount = remainingAfterMasha / 0.1215;

    return {
      tola: tolaCount,
      masha: mashaCount,
      ratti: parseFloat(rattiCount.toFixed(2)),
    };
  };

  // Calculate based on amount
  const calculateFromAmount = () => {
    if (!amount || parseFloat(amount) <= 0) return;

    const totalAmount = parseFloat(amount);
    const purity = karatPurity[goldKarat];
    const effectiveRate = currentRate * purity;
    const totalGrams = totalAmount / (effectiveRate / 11.664);

    setGrams(totalGrams.toFixed(3));
    const tmr = gramsToTMR(totalGrams);
    setTola(tmr.tola.toString());
    setMasha(tmr.masha.toString());
    setRatti(tmr.ratti.toString());
  };

  // Calculate based on weight
  const calculateFromWeight = () => {
    let totalGrams = 0;

    if (calculationType === "weight") {
      if (grams) {
        totalGrams = parseFloat(grams);
        const tmr = gramsToTMR(totalGrams);
        setTola(tmr.tola.toString());
        setMasha(tmr.masha.toString());
        setRatti(tmr.ratti.toString());
      } else {
        totalGrams = tmrToGrams(tola, masha, ratti);
        setGrams(totalGrams.toFixed(3));
      }

      const purity = karatPurity[goldKarat];
      const effectiveRate = currentRate * purity;
      const totalAmount = totalGrams * (effectiveRate / 11.664);
      setAmount(Math.round(totalAmount).toString());
    }
  };

  // Handle calculation trigger
  useEffect(() => {
    if (calculationType === "amount" && amount) {
      calculateFromAmount();
    }
  }, [amount, goldKarat, currentRate]);

  useEffect(() => {
    if (calculationType === "weight" && (grams || tola || masha || ratti)) {
      calculateFromWeight();
    }
  }, [grams, tola, masha, ratti, goldKarat, currentRate]);

  const resetForm = () => {
    setAmount("");
    setGrams("");
    setTola("");
    setMasha("");
    setRatti("");
    setCustomerName("");
    setCustomerPhone("");
    setDescription("");
    setGoldKarat("24");
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-yellow-50`}>
      {/* Custom Header */}
      <View style={tw`bg-emerald-500 px-4 py-8 shadow-lg`}>
        <View style={tw`flex-row items-center justify-between`}>
          <View style={tw`flex-row items-center`}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={tw`mr-3 p-2 rounded-full bg-white/20`}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={20}
                color="white"
              />
            </TouchableOpacity>
            <View style={tw`flex-row items-center`}>
              <MaterialCommunityIcons name="receipt" size={24} color="white" />
              <Text style={tw`text-white text-lg font-bold ml-2`}>
                Sale Slip Generator
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={resetForm}
            style={tw`p-2 rounded-full bg-white/20`}
          >
            <MaterialCommunityIcons name="refresh" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={tw`flex-1 p-4`} showsVerticalScrollIndicator={false}>
        {/* Calculation Type Selector */}
        <View style={tw`bg-white rounded-2xl p-4 mb-4 shadow`}>
          <Text style={tw`text-gray-700 font-semibold mb-3`}>
            Calculation Type
          </Text>
          <View style={tw`flex-row bg-gray-100 rounded-xl p-1`}>
            <TouchableOpacity
              style={tw`flex-1 py-3 rounded-lg ${
                calculationType === "amount" ? "bg-emerald-500" : ""
              }`}
              onPress={() => setCalculationType("amount")}
            >
              <Text
                style={tw`text-center font-semibold ${
                  calculationType === "amount" ? "text-white" : "text-gray-600"
                }`}
              >
                Amount Based
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`flex-1 py-3 rounded-lg ${
                calculationType === "weight" ? "bg-emerald-500" : ""
              }`}
              onPress={() => setCalculationType("weight")}
            >
              <Text
                style={tw`text-center font-semibold ${
                  calculationType === "weight" ? "text-white" : "text-gray-600"
                }`}
              >
                Weight Based
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Customer Information */}
        <View style={tw`bg-white rounded-2xl p-4 mb-4 shadow`}>
          <Text style={tw`text-gray-700 font-semibold mb-3`}>
            Customer Information
          </Text>
          <View style={tw`space-y-3`}>
            <View>
              <Text style={tw`text-gray-600 text-sm mb-1`}>Customer Name</Text>
              <TextInput
                style={tw`bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800`}
                value={customerName}
                onChangeText={setCustomerName}
                placeholder="Enter customer name"
              />
            </View>
            <View>
              <Text style={tw`text-gray-600 text-sm mb-1`}>Phone Number</Text>
              <TextInput
                style={tw`bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800`}
                value={customerPhone}
                onChangeText={setCustomerPhone}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        {/* Gold Details */}
        <View style={tw`bg-white rounded-2xl p-4 mb-4 shadow`}>
          <Text style={tw`text-gray-700 font-semibold mb-3`}>Gold Details</Text>

          {/* Karat Selection */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-gray-600 text-sm mb-2`}>Gold Karat</Text>
            <View style={tw`flex-row flex-wrap gap-2`}>
              {Object.keys(karatPurity).map((karat) => (
                <TouchableOpacity
                  key={karat}
                  style={tw`px-4 py-2 rounded-full border ${
                    goldKarat === karat
                      ? "bg-emerald-500 border-emerald-500"
                      : "bg-gray-50 border-gray-200"
                  }`}
                  onPress={() => setGoldKarat(karat)}
                >
                  <Text
                    style={tw`font-semibold ${
                      goldKarat === karat ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {karat}K
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-gray-600 text-sm mb-1`}>Description</Text>
            <TextInput
              style={tw`bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800`}
              value={description}
              onChangeText={setDescription}
              placeholder="e.g., Gold Chain, Ring, Earrings"
              multiline
            />
          </View>

          {/* Amount Input (if amount-based) */}
          {calculationType === "amount" && (
            <View style={tw`mb-4`}>
              <Text style={tw`text-gray-600 text-sm mb-1`}>Amount (PKR)</Text>
              <TextInput
                style={tw`bg-emerald-50 border-2 border-emerald-200 rounded-xl px-4 py-3 text-gray-800 font-semibold text-lg`}
                value={amount}
                onChangeText={setAmount}
                placeholder="Enter amount"
                keyboardType="numeric"
              />
            </View>
          )}

          {/* Weight Input (if weight-based) */}
          {calculationType === "weight" && (
            <View style={tw`space-y-3`}>
              <View>
                <Text style={tw`text-gray-600 text-sm mb-1`}>
                  Weight in Grams
                </Text>
                <TextInput
                  style={tw`bg-blue-50 border-2 border-blue-200 rounded-xl px-4 py-3 text-gray-800 font-semibold`}
                  value={grams}
                  onChangeText={setGrams}
                  placeholder="Enter weight in grams"
                  keyboardType="numeric"
                />
              </View>

              <Text style={tw`text-center text-gray-500 font-medium`}>OR</Text>

              <View>
                <Text style={tw`text-gray-600 text-sm mb-2`}>
                  Weight in Tola-Masha-Ratti
                </Text>
                <View style={tw`flex-row space-x-2`}>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-xs text-gray-500 mb-1`}>Tola</Text>
                    <TextInput
                      style={tw`bg-blue-50 border-2 border-blue-200 rounded-xl px-3 py-2 text-gray-800 text-center font-semibold`}
                      value={tola}
                      onChangeText={setTola}
                      placeholder="0"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-xs text-gray-500 mb-1`}>Masha</Text>
                    <TextInput
                      style={tw`bg-blue-50 border-2 border-blue-200 rounded-xl px-3 py-2 text-gray-800 text-center font-semibold`}
                      value={masha}
                      onChangeText={setMasha}
                      placeholder="0"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-xs text-gray-500 mb-1`}>Ratti</Text>
                    <TextInput
                      style={tw`bg-blue-50 border-2 border-blue-200 rounded-xl px-3 py-2 text-gray-800 text-center font-semibold`}
                      value={ratti}
                      onChangeText={setRatti}
                      placeholder="0.00"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Calculation Results */}
        {(amount || grams || tola || masha || ratti) && (
          <View style={tw`bg-white rounded-2xl p-4 mb-4 shadow`}>
            <Text style={tw`text-gray-700 font-semibold mb-3`}>
              Calculation Results
            </Text>

            <View style={tw`space-y-3`}>
              <View
                style={tw`flex-row justify-between py-2 border-b border-gray-100`}
              >
                <Text style={tw`text-gray-600`}>Gold Rate ({goldKarat}K)</Text>
                <Text style={tw`font-semibold text-gray-800`}>
                  {formatCurrency(
                    Math.round(currentRate * karatPurity[goldKarat])
                  )}
                </Text>
              </View>

              <View
                style={tw`flex-row justify-between py-2 border-b border-gray-100`}
              >
                <Text style={tw`text-gray-600`}>Weight (Grams)</Text>
                <Text style={tw`font-semibold text-gray-800`}>
                  {grams || "0"} g
                </Text>
              </View>

              <View
                style={tw`flex-row justify-between py-2 border-b border-gray-100`}
              >
                <Text style={tw`text-gray-600`}>Weight (T-M-R)</Text>
                <Text style={tw`font-semibold text-gray-800`}>
                  {tola || "0"}-{masha || "0"}-{ratti || "0.00"}
                </Text>
              </View>

              <View
                style={tw`flex-row justify-between py-2 bg-emerald-50 px-3 rounded-lg`}
              >
                <Text style={tw`text-emerald-700 font-semibold`}>
                  Total Amount
                </Text>
                <Text style={tw`font-bold text-emerald-700 text-lg`}>
                  {formatCurrency(parseFloat(amount) || 0)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Sale Slip Preview */}
        {(amount || grams || tola || masha || ratti) && (
          <View style={tw`bg-white rounded-2xl p-4 mb-4 shadow-lg`}>
            <View style={tw`flex-row items-center justify-between mb-3`}>
              <Text style={tw`text-black font-bold text-lg`}>
                Sale Slip Preview
              </Text>
              <MaterialCommunityIcons
                name="receipt"
                size={24}
                color="#000000"
              />
            </View>

            <View
              style={tw`border-2 border-solid border-black rounded-lg p-4 bg-white`}
            >
              {/* Header Section */}
              <View style={tw`items-center mb-4`}>
                <Text style={tw`text-3xl font-black text-black mb-1`}>
                  AURUMLOG
                </Text>
                <Text style={tw`text-xl font-bold text-black mb-2`}>
                  Gold Sale Slip
                </Text>
                <Text style={tw`text-base font-semibold text-black mb-1`}>
                  {currentDateTime}
                </Text>
                <Text style={tw`text-base font-semibold text-black`}>
                  Bill #: {billNumber}
                </Text>
              </View>

              {/* Customer Details Section */}
              <View style={tw`border-t-2 border-b-2 border-black py-3 mb-4`}>
                {customerName && (
                  <Text style={tw`text-base font-bold text-black mb-1`}>
                    Customer: {customerName}
                  </Text>
                )}
                {customerPhone && (
                  <Text style={tw`text-base font-bold text-black mb-1`}>
                    Phone: {customerPhone}
                  </Text>
                )}
                {description && (
                  <Text style={tw`text-base font-bold text-black`}>
                    Item: {description}
                  </Text>
                )}
              </View>

              {/* Transaction Details */}
              <View style={tw`space-y-2 mb-4`}>
                <View style={tw`flex-row justify-between items-center`}>
                  <Text style={tw`text-base font-bold text-black`}>
                    Gold Rate ({goldKarat}K):
                  </Text>
                  <Text style={tw`text-base font-black text-black`}>
                    {formatCurrency(
                      Math.round(currentRate * karatPurity[goldKarat])
                    )}
                  </Text>
                </View>

                <View style={tw`flex-row justify-between items-center`}>
                  <Text style={tw`text-base font-bold text-black`}>
                    Weight:
                  </Text>
                  <Text style={tw`text-base font-black text-black`}>
                    {grams || "0"} g
                  </Text>
                </View>

                <View style={tw`flex-row justify-between items-center`}>
                  <Text style={tw`text-base font-bold text-black`}>T-M-R:</Text>
                  <Text style={tw`text-base font-black text-black`}>
                    {tola || "0"}-{masha || "0"}-{ratti || "0.00"}
                  </Text>
                </View>
              </View>

              {/* Total Amount Section */}
              <View style={tw`border-t-4 border-black pt-3 mb-4`}>
                <View style={tw`flex-row justify-between items-center`}>
                  <Text style={tw`text-xl font-black text-black`}>
                    TOTAL AMOUNT:
                  </Text>
                  <Text style={tw`text-xl font-black text-black`}>
                    {formatCurrency(parseFloat(amount) || 0)}
                  </Text>
                </View>
              </View>

              {/* Footer */}
              <View style={tw`border-t-2 border-black pt-3`}>
                <Text style={tw`text-base font-bold text-black text-center`}>
                  Thank you for your business!
                </Text>
                <Text
                  style={tw`text-sm font-semibold text-black text-center mt-1`}
                >
                  Visit Again
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={tw`flex-row space-x-3 mb-16`}>
          <TouchableOpacity
            style={tw`flex-1 bg-emerald-500 py-4 rounded-2xl flex-row items-center justify-center shadow`}
            onPress={handlePrintSlip}
            disabled={isPrinting}
          >
            <MaterialCommunityIcons
              name={isPrinting ? "loading" : "printer"}
              size={20}
              color="white"
            />
            <Text style={tw`text-white font-bold ml-2`}>
              {isPrinting ? "Processing..." : "Print Slip"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`flex-1 bg-gray-500 py-4 rounded-2xl flex-row items-center justify-center shadow`}
            onPress={resetForm}
          >
            <MaterialCommunityIcons name="refresh" size={20} color="white" />
            <Text style={tw`text-white font-bold ml-2`}>Reset</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SaleSlipGeneratorScreen;
