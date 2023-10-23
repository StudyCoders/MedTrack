import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import Toast from 'react-native-toast-message';

export default function ScreenRoutesLayout() {
  return (
    <GluestackUIProvider config={config}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="loginToken" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="userForm" />
        </Stack>
        <Toast />
      </AuthProvider>
    </GluestackUIProvider>
  );
}