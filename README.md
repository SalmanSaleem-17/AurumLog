# AurumLog

**AurumLog** is a comprehensive gold calculation mobile app built with React Native and Expo. It is designed to assist jewelers, gold traders, and customers with a wide range of gold-related computations and transaction management. The app supports **thermal printer integration** to generate and print gold purchase slips directly from the mobile device.

---

## 🚀 Key Features
- 💰 **Gold to Money Conversion**
- ⚖️ **Weight Calculations and Unit Conversions**
- 🧮 **Purity and Impurity Calculators**
- 📊 **Ratti, Tola, Gram Conversions**
- 📝 **Gold Purchase Slip Generation with Thermal Printer Support**
- 📄 **Karat-wise Gold Pricing**
- 🛠️ **Customizable Templates for Different Use Cases**
- ⚙️ **Settings and User Preferences**

---

## 🖨️ Thermal Printer Integration
- Supports printing **gold purchase slips** directly from the app to **Bluetooth thermal printers.**
- Real-time generation of detailed sale slips for customer transactions.

---

## 📱 Technologies Used
- React Native (Expo)
- JavaScript
- Tailwind CSS (NativeWind or similar setup)
- Context API and Custom Hooks
- Thermal Printer Libraries (e.g., `react-native-thermal-receipt-printer` or compatible)

---

## 📂 Folder Structure
- **/components** – UI components (e.g., `RateDisplay.js`)
- **/screens** – All application screens:
  - Conversion Calculators
  - Purity Calculators
  - Gold-to-Money and Money-to-Gold
  - Sale Slip Generator
  - Karat Information
- **/hooks** – Custom React hooks (e.g., `useRates.js`)
- **/services** – Calculation logic and printer services
- **/utils** – Utility functions

---

## 🛠️ How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/SalmanSaleem-17/AurumLog.git
