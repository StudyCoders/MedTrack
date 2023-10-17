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
  Image
} from "@gluestack-ui/themed";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/axios";
import {
  Orbitron_400Regular,
  Orbitron_500Medium,
  useFonts
} from "@expo-google-fonts/orbitron";

export default function Profile() {
  const [fontsLoaded] = useFonts({
    Orbitron_400Regular,
    Orbitron_500Medium
  });
  const { onLogout } = useAuth();
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const { data } = await api.get<any>("/sessao.php", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setInfos(data.data);
      } catch (error) {
        console.error("Erro ao buscar dados das APIs:", error);
      }
    };

    fetchData();
  }, []);

  const abrirForm = async () => {
    router.push({pathname: "userForm", params: { abrirForm: true }});
  }

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

  const [info, setInfos]: any = useState("");

  return (
    <VStack space="lg" p={15}>
      <Box alignItems="center">
        <Image source={require("../assets/images/logo-md.png")} />
        <Text fontFamily="Orbitron_500Medium" fontSize={"$4xl"}>
          QuickSafe
        </Text>
      </Box>
      <Box mb={15}>
        <Box>
          <Text size="xl" fontWeight="bold">Nome</Text>
          <Text size="xl">{info.nome}</Text>
        </Box>
        <Box>
          <Text size="xl" fontWeight="bold">E-mail</Text>
          <Text size="xl">{info.email}</Text>
        </Box>
        <Box>
          <Text size="xl" fontWeight="bold">CPF</Text>
          <Text size="xl">{info.cpf}</Text>
        </Box>
      </Box>
      <Box>
        <Button onPress={abrirForm} action="primary">
          <ButtonText>Acessar formulário</ButtonText>
        </Button>
      </Box>        
      <Box>
        <Button onPress={encerrarSessao} action="negative">
          <ButtonText>Desconectar</ButtonText>
        </Button>
      </Box>
    </VStack>
  );
}
