import {
  VStack,
  Box,
  Alert,
  AlertIcon,
  AlertText,
  InfoIcon,
  Image,
  Button,
  ButtonText,
  ButtonIcon,
  PhoneIcon,
} from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { Linking } from "react-native";
import api from "../api/axios";

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
  return (
    <VStack flex={1} alignItems="center" justifyContent="space-around">
      <Box>
        <Box alignItems="center" m={15}>
          <Image source={require("../assets/images/logo-sos.png")} />
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
        <Box>
          <Alert mx="$2.5" action="warning" variant="accent">
            <AlertIcon as={InfoIcon} mr="$3" />
            <AlertText>Ligue somente em caso de emergência</AlertText>
          </Alert>
        </Box>
      </Box>
      <Box position="fixed" bottom={65}>
        <Alert mx="$2.5" action="error" variant="outline" bg="#f8d7da">
          <AlertIcon as={InfoIcon} mr="$3" />
          <AlertText color="#721c24" fontWeight="500">
            No Brasil, passar trotes para ambulância é crime previsto no artigo
            266 do Código Penal, com pena de detenção de um a seis meses ou
            multa. Respeite as leis, seja consciente!
          </AlertText>
        </Alert>
      </Box>
    </VStack>
  );
}
