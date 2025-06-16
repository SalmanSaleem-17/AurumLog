import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  Dimensions,
  Platform,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import tw from "../utils/tw";

const { width, height } = Dimensions.get("window");

const SplashScreen = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-hide splash screen after 3 seconds
    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish, fadeAnim, scaleAnim]);

  return (
    <SafeAreaView style={tw`flex-1`}>
      {/* Simple StatusBar without backgroundColor */}
      <StatusBar style="light" />

      {/* Custom StatusBar background for edge-to-edge */}
      <View
        style={{
          height: Platform.OS === "android" ? 30 : 0,
          backgroundColor: "#F59E0B",
        }}
      />

      <View
        style={[
          tw`flex-1 justify-center items-center`,
          { backgroundColor: "#F59E0B" }, // Inline style instead of gradient
        ]}
      >
        {/* Logo Container */}
        <Animated.View
          style={[
            tw`items-center mb-8`,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Logo Icon */}
          <View
            style={[
              tw`p-6 rounded-full mb-6`,
              {
                backgroundColor: "rgba(255,255,255,0.2)",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              },
            ]}
          >
            <MaterialCommunityIcons name="gold" size={60} color="white" />
          </View>

          {/* App Name */}
          <Text
            style={[
              tw`text-white text-4xl font-bold tracking-wider mb-3`,
              {
                textShadowColor: "rgba(0,0,0,0.3)",
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 3,
              },
            ]}
          >
            AURUMLOG
          </Text>

          {/* Primary Description */}
          <Text
            style={[
              tw`text-white text-lg text-center mb-2`,
              { color: "rgba(255,255,255,0.9)" },
            ]}
          >
            Gold Rate Calculator
          </Text>

          {/* Secondary Description */}
          <Text
            style={[
              tw`text-center text-sm px-8`,
              { color: "rgba(255,255,255,0.8)" },
            ]}
          >
            Track • Calculate • Analyze Gold Rates
          </Text>
        </Animated.View>

        {/* Loading Indicator */}
        <View style={tw`absolute bottom-20 items-center`}>
          <LoadingDots />
          <Text style={[tw`text-xs mt-4`, { color: "rgba(255,255,255,0.7)" }]}>
            Loading your gold insights...
          </Text>
        </View>

        {/* Version or Brand Info */}
        <View style={tw`absolute bottom-8 items-center`}>
          <Text style={[tw`text-xs`, { color: "rgba(255,255,255,0.6)" }]}>
            Version 1.0 • Premium Gold Tracking
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Animated Loading Dots Component
const LoadingDots = () => {
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateSequence = () => {
      Animated.sequence([
        Animated.timing(dot1Anim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot2Anim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot3Anim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot1Anim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot2Anim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot3Anim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => animateSequence());
    };

    animateSequence();
  }, []);

  return (
    <View style={tw`flex-row items-center`}>
      {[dot1Anim, dot2Anim, dot3Anim].map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            {
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: "white",
              marginHorizontal: 4,
              opacity: anim,
            },
          ]}
        />
      ))}
    </View>
  );
};

export default SplashScreen;

// import React, { useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   Image,
//   Animated,
//   Dimensions,
//   Platform,
// } from "react-native";
// import { StatusBar } from "expo-status-bar";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import tw from "../utils/tw";
// import Constants from "expo-constants";

// const { width, height } = Dimensions.get("window");

// const SplashScreen = ({ onFinish }) => {
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const scaleAnim = useRef(new Animated.Value(0.8)).current;

//   useEffect(() => {
//     // Start animations
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 1000,
//         useNativeDriver: true,
//       }),
//       Animated.timing(scaleAnim, {
//         toValue: 1,
//         duration: 1000,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     // Auto-hide splash screen after 3 seconds
//     const timer = setTimeout(() => {
//       if (onFinish) {
//         onFinish();
//       }
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, [onFinish, fadeAnim, scaleAnim]);

//   return (
//     <View
//       style={[
//         tw`flex-1 justify-center items-center`,
//         {
//           backgroundColor: "#F59E0B", // Matching your app's primary color
//           paddingTop: Constants.statusBarHeight,
//         },
//       ]}
//     >
//       {/* Fixed Status Bar */}
//       <StatusBar style="light" backgroundColor="#F59E0B" translucent={true} />

//       {/* Logo Container */}
//       <Animated.View
//         style={[
//           tw`items-center mb-8`,
//           {
//             opacity: fadeAnim,
//             transform: [{ scale: scaleAnim }],
//           },
//         ]}
//       >
//         {/* Logo Icon */}
//         <View
//           style={[
//             tw`p-6 rounded-full mb-6`,
//             {
//               backgroundColor: "rgba(255,255,255,0.2)",
//               shadowColor: "#000",
//               shadowOffset: {
//                 width: 0,
//                 height: 4,
//               },
//               shadowOpacity: 0.3,
//               shadowRadius: 8,
//               elevation: 8,
//             },
//           ]}
//         >
//           {/* <MaterialCommunityIcons name="gold" size={60} color="white" /> */}
//           <Image
//             source={require("../assets/logo-icon.png")}
//             style={{ width: 80, height: 80 }}
//           />
//         </View>

//         {/* App Name */}
//         <Text
//           style={[
//             tw`text-white text-4xl font-bold tracking-wider mb-3`,
//             {
//               textShadowColor: "rgba(0,0,0,0.3)",
//               textShadowOffset: { width: 1, height: 1 },
//               textShadowRadius: 3,
//             },
//           ]}
//         >
//           AURUMLOG
//         </Text>

//         {/* Primary Description */}
//         <Text
//           style={[
//             tw`text-white text-lg text-center mb-2`,
//             { color: "rgba(255,255,255,0.9)" },
//           ]}
//         >
//           Gold Rate Calculator
//         </Text>

//         {/* Secondary Description */}
//         <Text
//           style={[
//             tw`text-center text-sm px-8`,
//             { color: "rgba(255,255,255,0.8)" },
//           ]}
//         >
//           Track • Calculate • Analyze Gold Rates
//         </Text>
//       </Animated.View>

//       {/* Loading Indicator */}
//       <View style={tw`absolute bottom-20 items-center`}>
//         <LoadingDots />
//         <Text style={[tw`text-xs mt-4`, { color: "rgba(255,255,255,0.7)" }]}>
//           Loading your gold insights...
//         </Text>
//       </View>

//       {/* Version or Brand Info */}
//       <View style={tw`absolute bottom-8 items-center`}>
//         <Text style={[tw`text-xs`, { color: "rgba(255,255,255,0.6)" }]}>
//           Version 1.0 • Premium Gold Tracking
//         </Text>
//       </View>
//     </View>
//   );
// };

// // Animated Loading Dots Component
// const LoadingDots = () => {
//   const dot1Anim = useRef(new Animated.Value(0)).current;
//   const dot2Anim = useRef(new Animated.Value(0)).current;
//   const dot3Anim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     const animateSequence = () => {
//       Animated.sequence([
//         Animated.timing(dot1Anim, {
//           toValue: 1,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//         Animated.timing(dot2Anim, {
//           toValue: 1,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//         Animated.timing(dot3Anim, {
//           toValue: 1,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//         Animated.timing(dot1Anim, {
//           toValue: 0,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//         Animated.timing(dot2Anim, {
//           toValue: 0,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//         Animated.timing(dot3Anim, {
//           toValue: 0,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//       ]).start(() => animateSequence());
//     };

//     animateSequence();
//   }, []);

//   return (
//     <View style={tw`flex-row items-center`}>
//       {[dot1Anim, dot2Anim, dot3Anim].map((anim, index) => (
//         <Animated.View
//           key={index}
//           style={[
//             {
//               width: 8,
//               height: 8,
//               borderRadius: 4,
//               backgroundColor: "white",
//               marginHorizontal: 4,
//               opacity: anim,
//             },
//           ]}
//         />
//       ))}
//     </View>
//   );
// };

// export default SplashScreen;
