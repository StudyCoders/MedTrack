import { GluestackUIProvider, VStack, config } from "@gluestack-ui/themed";
import { Stack } from "expo-router";

export default function ScreenRoutesLayout() {
  return (
    <GluestackUIProvider config={config.theme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    </GluestackUIProvider>
  );
}
