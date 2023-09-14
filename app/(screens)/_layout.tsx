import { GluestackUIProvider, config } from "@gluestack-ui/themed";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";

export default function ScreenRoutesLayout() {
  return (
    <GluestackUIProvider config={config.theme}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="loginToken" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="userForm" />
        </Stack>
      </AuthProvider>
    </GluestackUIProvider>
  );
}