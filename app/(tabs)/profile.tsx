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
import FormHeader from "../components/form/FormHeader";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/axios";

export default function Profile() {
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
    <VStack space="lg" bg="white" p={15}>
      <FormHeader title="QuickSafe" />
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
        <Button action="primary">
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
