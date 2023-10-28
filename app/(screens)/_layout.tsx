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
          <Stack.Screen name="(public)/loginToken" />
          <Stack.Screen name="(public)/login" />
          <Stack.Screen name="(public)/register" />
          <Stack.Screen name="(private)/userForm" />
        </Stack>
        <Toast />
      </AuthProvider>
    </GluestackUIProvider>
  );
}