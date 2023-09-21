import {VStack,
        Box,
        Alert,
        AlertIcon,
        AlertText,
        InfoIcon,
        Image,
        Button,
        ButtonText,
        ButtonIcon,
        PhoneIcon
} from '@gluestack-ui/themed';
import * as Location from 'expo-location';
import { Linking } from 'react-native';


export async function ligar() {
  const url = 'tel://192';

  let { status, canAskAgain } = await Location.getForegroundPermissionsAsync();

  if (status !== 'granted' && canAskAgain) {
    const newReq = await Location.requestForegroundPermissionsAsync();
    if (newReq.status === 'granted') {
      let location = await Location.getCurrentPositionAsync({});
      console.log("Localização atual: ", location);
      Linking.openURL(url);
    }
  } else if (status !== 'granted' && !canAskAgain) {
    Linking.openSettings();
  } else {
    let location = await Location.getCurrentPositionAsync({});
    console.log("Localização atual: ", location);
    Linking.openURL(url);
  }
}

export default function Home() {
  return (
    <VStack flex={1} alignItems='center' justifyContent='space-around'>
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
            <AlertText>
              Ligue somente em caso de emergência
            </AlertText>
          </Alert>
        </Box>
      </Box>
      <Box position='fixed' bottom={65}>
        <Alert mx="$2.5" action="error" variant="outline" bg='#f8d7da'>
          <AlertIcon as={InfoIcon} mr="$3" />
          <AlertText color='#721c24' fontWeight='500'>
            No Brasil, passar trotes para ambulância é crime previsto no artigo 266 do Código Penal,
            com pena de detenção de um a seis meses ou multa. Respeite as leis, seja consciente!
          </AlertText>
        </Alert>
      </Box>
    </VStack>
  )
}