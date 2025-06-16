import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import tw from "../utils/tw";

export default function ConversionTableScreen({ navigation, route }) {
  const [searchValue, setSearchValue] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("ratti"); // ratti, masha, tola

  // Conversion constants (in milligrams)
  const CONVERSIONS = {
    ratti: 121.5, // 1 Ratti = 121.5 mg
    masha: 972, // 1 Masha = 972 mg = 8 Ratti
    tola: 11664, // 1 Tola = 11,664 mg = 96 Ratti = 12 Masha
  };

  // Generate conversion data for 1-96 Ratti
  const generateConversionData = () => {
    const data = [];
    for (let ratti = 1; ratti <= 96; ratti++) {
      const milligrams = ratti * CONVERSIONS.ratti;
      const grams = milligrams / 1000;
      const masha = ratti / 8;
      const tola = ratti / 96;

      data.push({
        ratti,
        masha: masha >= 1 ? Math.floor(masha) : 0,
        mashaRemainder: ratti % 8,
        tola: tola >= 1 ? Math.floor(tola) : 0,
        tolaRemainder: ratti % 96,
        milligrams,
        grams,
      });
    }
    return data;
  };

  const conversionData = generateConversionData();

  // Filter data based on search
  const filteredData = conversionData.filter((item) => {
    if (!searchValue) return true;
    const search = searchValue.toLowerCase();
    return (
      item.ratti.toString().includes(search) ||
      item.masha.toString().includes(search) ||
      item.tola.toString().includes(search) ||
      item.grams.toFixed(4).includes(search)
    );
  });

  const formatWeight = (value, decimals = 4) => {
    return parseFloat(value).toFixed(decimals);
  };

  const UnitSelector = () => (
    <View style={tw`flex-row bg-white rounded-xl p-1 mb-4 shadow-sm`}>
      {[
        { key: "ratti", label: "Ratti", icon: "weight" },
        { key: "masha", label: "Masha", icon: "scale-balance" },
        { key: "tola", label: "Tola", icon: "gold" },
      ].map((unit) => (
        <TouchableOpacity
          key={unit.key}
          style={[
            tw`flex-1 flex-row items-center justify-center py-3 px-2 rounded-lg`,
            selectedUnit === unit.key && tw`bg-yellow-500`,
          ]}
          onPress={() => setSelectedUnit(unit.key)}
        >
          <MaterialCommunityIcons
            name={unit.icon}
            size={16}
            color={selectedUnit === unit.key ? "white" : "#6B7280"}
          />
          <Text
            style={[
              tw`ml-2 font-medium text-sm`,
              selectedUnit === unit.key ? tw`text-white` : tw`text-gray-600`,
            ]}
          >
            {unit.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const TableHeader = () => (
    <View
      style={[
        tw`flex-row bg-yellow-500 py-3 px-2 rounded-t-xl`,
        {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        },
      ]}
    >
      <Text style={tw`flex-1 text-center text-white font-bold text-sm`}>
        Tola
      </Text>
      <Text style={tw`flex-1 text-center text-white font-bold text-sm`}>
        Masha
      </Text>
      <Text style={tw`flex-1 text-center text-white font-bold text-sm`}>
        Ratti
      </Text>
      <Text style={tw`flex-1 text-center text-white font-bold text-sm`}>
        Grams
      </Text>
    </View>
  );

  const TableRow = ({ item, index }) => (
    <View
      style={[
        tw`flex-row py-3 px-2 border-b border-gray-100`,
        index % 2 === 0 ? tw`bg-white` : tw`bg-gray-50`,
        // Highlight complete units
        (item.ratti === 96 || item.ratti === 8) &&
          tw`bg-yellow-50 border-yellow-200`,
      ]}
    >
      {/* Tola Column */}
      <View style={tw`flex-1 items-center`}>
        {item.tola > 0 ? (
          <View style={tw`items-center`}>
            <Text style={tw`font-bold text-gray-800`}>{item.tola}</Text>
            {item.tolaRemainder > 0 && (
              <Text style={tw`text-xs text-gray-500`}>
                +{item.tolaRemainder}R
              </Text>
            )}
          </View>
        ) : (
          <Text style={tw`text-gray-400 text-sm`}>-</Text>
        )}
      </View>

      {/* Masha Column */}
      <View style={tw`flex-1 items-center`}>
        {item.masha > 0 ? (
          <View style={tw`items-center`}>
            <Text style={tw`font-bold text-gray-800`}>{item.masha}</Text>
            {item.mashaRemainder > 0 && (
              <Text style={tw`text-xs text-gray-500`}>
                +{item.mashaRemainder}R
              </Text>
            )}
          </View>
        ) : (
          <Text style={tw`text-gray-400 text-sm`}>-</Text>
        )}
      </View>

      {/* Ratti Column */}
      <View style={tw`flex-1 items-center`}>
        <Text style={tw`font-bold text-gray-800`}>{item.ratti}</Text>
      </View>

      {/* Grams Column */}
      <View style={tw`flex-1 items-center`}>
        <Text style={tw`text-gray-800 text-sm`}>
          {formatWeight(item.grams)}
        </Text>
      </View>
    </View>
  );

  const QuickReference = () => (
    <View style={tw`bg-white rounded-xl p-4 mb-4 shadow-sm`}>
      <View style={tw`flex-row items-center mb-3`}>
        <MaterialCommunityIcons
          name="information-outline"
          size={20}
          color="#F59E0B"
        />
        <Text style={tw`text-gray-800 font-bold ml-2`}>Quick Reference</Text>
      </View>

      <View style={tw`space-y-2`}>
        <View style={tw`flex-row justify-between items-center py-1`}>
          <Text style={tw`text-gray-600`}>1 Tola</Text>
          <Text style={tw`text-gray-800 font-medium`}>96 Ratti = 12 Masha</Text>
        </View>
        <View style={tw`flex-row justify-between items-center py-1`}>
          <Text style={tw`text-gray-600`}>1 Masha</Text>
          <Text style={tw`text-gray-800 font-medium`}>8 Ratti = 0.972g</Text>
        </View>
        <View style={tw`flex-row justify-between items-center py-1`}>
          <Text style={tw`text-gray-600`}>1 Ratti</Text>
          <Text style={tw`text-gray-800 font-medium`}>121.5 mg = 0.1215g</Text>
        </View>
      </View>
    </View>
  );

  const handleExportTable = () => {
    Alert.alert(
      "Export Table",
      "This feature will allow you to export the conversion table as PDF or share it. Coming soon!",
      [{ text: "OK" }]
    );
  };

  return (
    <View style={tw`flex-1 bg-yellow-50`}>
      {/* Header */}
      <View
        style={tw`bg-white px-4 py-3 pt-10 border-b border-gray-200 bg-yellow-600`}
      >
        <View style={tw`flex-row items-center justify-between mb-3`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`p-2 rounded-full bg-gray-100`}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={20}
              color="#374151"
            />
          </TouchableOpacity>

          <View style={tw`flex-1 items-center`}>
            <Text style={tw`text-lg font-bold text-gray-800`}>
              Conversion Table
            </Text>
            <Text style={tw`text-sm text-gray-600`}>
              Tola • Masha • Ratti Reference
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleExportTable}
            style={tw`p-2 rounded-full bg-yellow-100`}
          >
            <MaterialCommunityIcons name="export" size={20} color="#F59E0B" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View
          style={tw`flex-row items-center bg-gray-100 rounded-xl px-3 py-2`}
        >
          <MaterialCommunityIcons name="magnify" size={20} color="#6B7280" />
          <TextInput
            style={tw`flex-1 ml-2 text-gray-800`}
            placeholder="Search by Ratti, Masha, Tola, or Grams..."
            value={searchValue}
            onChangeText={setSearchValue}
            keyboardType="numeric"
          />
          {searchValue ? (
            <TouchableOpacity onPress={() => setSearchValue("")}>
              <MaterialCommunityIcons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4`}>
        {/* Quick Reference */}
        <QuickReference />

        {/* Unit Selector */}
        <UnitSelector />

        {/* Results Count */}
        <View style={tw`flex-row justify-between items-center mb-3`}>
          <Text style={tw`text-gray-600 text-sm`}>
            Showing {filteredData.length} of {conversionData.length} entries
          </Text>
          <View style={tw`flex-row items-center`}>
            <View style={tw`w-3 h-3 bg-yellow-200 rounded mr-2`} />
            <Text style={tw`text-xs text-gray-500`}>Complete Units</Text>
          </View>
        </View>

        {/* Conversion Table */}
        <View style={tw`bg-white rounded-xl shadow-sm overflow-hidden`}>
          <TableHeader />

          {filteredData.map((item, index) => (
            <TableRow key={item.ratti} item={item} index={index} />
          ))}

          {filteredData.length === 0 && (
            <View style={tw`py-8 items-center`}>
              <MaterialCommunityIcons
                name="table-search"
                size={48}
                color="#D1D5DB"
              />
              <Text style={tw`text-gray-500 mt-2`}>No results found</Text>
              <Text style={tw`text-gray-400 text-sm mt-1`}>
                Try adjusting your search terms
              </Text>
            </View>
          )}
        </View>

        {/* Bottom Spacing */}
        <View style={tw`h-6`} />
      </ScrollView>
    </View>
  );
}
