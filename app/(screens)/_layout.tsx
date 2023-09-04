import { GluestackUIProvider, config } from "@gluestack-ui/themed";
import { Redirect, Stack } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";

export default function ScreenRoutesLayout() {
  return (
    <GluestackUIProvider config={config.theme}>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </GluestackUIProvider>
  );
}

export function Layout() {
  const { authState } = useAuth();

  return authState?.authenticated ? (
    <Redirect href="profile" />
  ) : (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
