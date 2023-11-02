import { useAuth } from "../context/AuthContext";
import { router, useLocalSearchParams } from "expo-router";
import {
  Box,
  Button,
  ButtonText,
  Text,
  VStack,
  Image,
  Heading,
  Modal,
  ModalContent,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Icon,
  CloseIcon,
  ButtonSpinner,
  Spinner
} from "@gluestack-ui/themed";
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/axios";
import {
  Orbitron_400Regular,
  Orbitron_500Medium,
  useFonts
} from "@expo-google-fonts/orbitron";
import Toast from 'react-native-toast-message';
import * as SplashScreen from "expo-splash-screen";

export default function Profile() {
  const { onLogout } = useAuth();
  const [info, setInfos]: any = useState("");
  const [showModal, setShowModal] = useState(false);
  const [spinner, setSpinner] = useState(false);

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
    setSpinner(true);

    if (onLogout) {
      const result: any = await onLogout();

      if (result.error) {
        Toast.show({
          type: "error",
          text1: result.msg
        });
      } else {
        router.push("login");
        setSpinner(false);

      }
    }
  };

  const apagarUsuario = async () => {
    setShowModal(false);
    setSpinner(true);
    
    try {
      const token = await AsyncStorage.getItem("token");

      const { data } = await api.get<any>(
        "/excluir.php",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      encerrarSessao();
      
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao excluir contato: " + error
      });
    }
  }

  const { msg, action } = useLocalSearchParams<{
    msg: string;
    action: 'error' | 'warning' | 'success' | 'info' | 'attention';
  }>();

  useEffect(() => {
    if (msg && action) {
      Toast.show({
        type: action,
        text1: msg
      });
    }
  }, [msg, action]);

  const [fontsLoaded, fontError] = useFonts({
    Orbitron_400Regular,
    Orbitron_500Medium,
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
    <VStack space="lg" p={15} onLayout={onLayoutRootView}>
      <Box alignItems="center">
        <Image source={require("../assets/images/logo-md.png")} alt="QuickSafe Logo" />
        <Text fontFamily="Orbitron_500Medium" p={'$5'} fontSize={"$4xl"}>
          QuickSafe
        </Text>
      </Box>
      {spinner ? <Spinner size='large' marginTop='50%' /> :
        <VStack space="md">
          <Box mb={15} mt={20}>
            <Box>
              <Text size="xl" fontWeight="bold">Código do usuário</Text>
              <Text size="xl">{info.id_usuario}</Text>
            </Box>
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
            <Button
            action="negative"
            onPress={() => {setShowModal(true)}}>
              <ButtonText>Excluir conta</ButtonText>
            </Button>
          </Box>
          <Box>
            <Button onPress={encerrarSessao} action="secondary">
              <ButtonText>Desconectar</ButtonText>
            </Button>
          </Box>
        </VStack>
      }

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
        }}
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg">Confirmação de exclusão</Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Text>
              Deseja realmente apagar esta conta?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              size="sm"
              action="secondary"
              mr="$3"
              onPress={() => {
                setShowModal(false)
              }}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              size="sm"
              action="positive"
              borderWidth="$0"
              onPress={() => apagarUsuario()}
            >
              {spinner ? <ButtonSpinner mr="$1" /> : ""}
              <ButtonText>Confirmar</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}
