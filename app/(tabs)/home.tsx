import {
  Text,
  VStack,
  Box,
  Alert,
  AlertIcon,
  AlertText,
  InfoIcon,
  Button,
  ButtonText,
  ButtonIcon,
  PhoneIcon,
  Center,
} from "@gluestack-ui/themed";
import { useFonts } from "expo-font";
import {
  Orbitron_400Regular,
  Orbitron_500Medium,
  Orbitron_600SemiBold,
  Orbitron_700Bold,
} from "@expo-google-fonts/orbitron";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { Linking, Image } from "react-native";
import api from "../api/axios";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";

export async function salvarLocalidade(coords: Location.LocationObjectCoords) {
  try {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      const { data, status } = await api.post<any>("/localidade.php", coords, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return status === 200;
    } else {
      throw new Error("Token não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao salvar localidade:", error);
    return false;
  }
}

export async function ligar() {
  const url = "tel://192";
  let { status, canAskAgain } = await Location.getForegroundPermissionsAsync();

  if (status !== "granted") {
    if (canAskAgain) {
      const newReq = await Location.requestForegroundPermissionsAsync();
      if (newReq.status !== "granted") {
        Linking.openSettings();
        return;
      }
    } else {
      Linking.openSettings();
      return;
    }
  }

  let location = await Location.getCurrentPositionAsync({});
  let registrarLocalidade = await salvarLocalidade(location.coords);

  if (registrarLocalidade) {
    Linking.openURL(url);
  } else {
    console.error("Falha ao salvar localidade.");
  }
}

export default function Home() {
  const [fontsLoaded, fontError] = useFonts({
    Orbitron_400Regular,
    Orbitron_500Medium,
    Orbitron_600SemiBold,
    Orbitron_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <VStack flex={1} justifyContent="space-between" onLayout={onLayoutRootView}>
      <Text textAlign="center" fontFamily="Orbitron_500Medium" fontSize={'$4xl'} p={"$11"}>
        QuickSafe
      </Text>
      <Center>
        <Box alignItems="center" m={15}>
          <Image
            source={require("../assets/images/logo-sos.png")}
            alt="Samu Logotipo"
          />
          <Button
            mt={10}
            size="lg"
            variant="solid"
            action="negative"
            w={200}
            onPress={ligar}
          >
            <ButtonText>Ligar </ButtonText>
            <ButtonIcon as={PhoneIcon} />
          </Button>
        </Box>
        <Alert mx="$4" action="warning" variant="accent">
          <AlertIcon as={InfoIcon} mr="$3" />
          <AlertText>Ligue somente em caso de emergência</AlertText>
        </Alert>
      </Center>
      <Alert m={'$4'} action="error" variant="outline" bg="#f8d7da">
        <AlertIcon as={InfoIcon} mr="$3" />
        <AlertText color="#721c24" fontWeight="500">
          No Brasil, passar trotes para ambulância é crime previsto no artigo
          266 do Código Penal, com pena de detenção de um a seis meses ou
          multa. Respeite as leis, seja consciente!
        </AlertText>
      </Alert>
    </VStack>
  );
}
