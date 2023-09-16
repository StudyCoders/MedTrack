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
} from '@gluestack-ui/themed'

import { ScrollView } from 'react-native-gesture-handler'

export default function Home() {
  return (
    <ScrollView>
      <Box>
        <VStack>
        <Box>
          <Box alignItems="center" m={15}>
            <Image source={require("../assets/images/logo-sos.png")} />
            <Button
            mt={10}
              size="lg"
              variant="solid"
              action="negative"
              w={200}
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
        <Box flex={1}>
          <Alert mx="$2.5" action="error" variant="outline" bg='#f8d7da'>
            <AlertIcon as={InfoIcon} mr="$3" />
            <AlertText color='#721c24' fontWeight='500'>
              No Brasil, passar trotes para ambulância é crime previsto no artigo 266 do Código Penal,
              com pena de detenção de um a seis meses ou multa. Respeite as leis, seja consciente!
            </AlertText>
          </Alert>
        </Box>
        </VStack>
      </Box>
    </ScrollView>
  )
}