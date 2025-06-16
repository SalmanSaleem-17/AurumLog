import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

export const useRates = () => {
  const [currentRate, setCurrentRate] = useState(341000); // Default rate
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved rate on app start
  useEffect(() => {
    const loadSavedRate = async () => {
      try {
        const savedRate = await AsyncStorage.getItem("@goldRate");
        const savedDate = await AsyncStorage.getItem("@lastUpdated");

        if (savedRate !== null) {
          setCurrentRate(parseFloat(savedRate));
        }

        if (savedDate !== null) {
          setLastUpdated(moment(savedDate).format("MMM D, YYYY h:mm A"));
        } else {
          setLastUpdated("Never");
        }
      } catch (e) {
        console.error("Failed to load rate", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedRate();
  }, []);

  const updateRate = async (newRate) => {
    try {
      await AsyncStorage.setItem("@goldRate", newRate.toString());
      const now = new Date().toISOString();
      await AsyncStorage.setItem("@lastUpdated", now);

      setCurrentRate(newRate);
      setLastUpdated(moment(now).format("MMM D, YYYY h:mm A"));
      return true;
    } catch (e) {
      console.error("Failed to save rate", e);
      return false;
    }
  };

  return {
    currentRate,
    lastUpdated,
    isLoading,
    updateRate,
  };
};
