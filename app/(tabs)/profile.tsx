import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";
import {
  Box,
  Button,
  ButtonText,
  Text,
  Toast,
  ToastDescription,
  VStack,
  useToast,
} from "@gluestack-ui/themed";

export default function Profile() {
  const { onLogout } = useAuth();
  const toast = useToast();

  const encerrarSessao = async () => {
    if (onLogout) {
      const result: any = await onLogout();

      if (result.error) {
        return toast.show({
          placement: "top",
          render: ({ id }) => {
            return (
              <Toast nativeID={id} action="error" variant="accent">
                <VStack space="xs">
                  <ToastDescription>{result.msg}</ToastDescription>
                </VStack>
              </Toast>
            );
          },
        });
      } else {
        router.push("login");
      }
    }
  };

  return (
    <Box padding={5}>
      <Text>Perfil</Text>
      <Box>
        <Button onPress={encerrarSessao}>
          <ButtonText>Desconectar</ButtonText>
        </Button>
      </Box>
    </Box>
  );
}
