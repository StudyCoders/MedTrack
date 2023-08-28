import {
  Box,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  VStack,
  Button,
  ButtonText,
  Text,
  HStack,
} from "@gluestack-ui/themed";
import FormHeader from "../../components/form/FormHeader";
import { Link } from "expo-router";

export default function Login() {
  return (
    <Box
      flex={1}
      justifyContent="center"
      alignItems="center"
      bg="white"
    >
      <VStack space="lg">
        <FormHeader title="Entrar" />
        <Box>
          <FormControl isRequired>
            <FormControlLabel>
              <FormControlLabelText>E-mail</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField type="text" placeholder="Digite seu usuário" />
            </Input>
          </FormControl>
        </Box>
        <Box>
          <FormControl isRequired>
            <FormControlLabel>
              <FormControlLabelText>Senha</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField type="password" placeholder="Digite sua senha" />
            </Input>
          </FormControl>
        </Box>
        <Box>
          <Button>
            <ButtonText>Entrar</ButtonText>
          </Button>
        </Box>
        <Box>
          <HStack justifyContent="center">
            <Text size="xs" mr={3}>
              Não tem uma conta?
            </Text>
            <Link href="/register" asChild>
              <Text size="xs" color="$primary500">
                Crie uma!
              </Text>
            </Link>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
}
