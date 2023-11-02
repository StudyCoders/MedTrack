import {
  AddIcon,
  Avatar,
  AvatarFallbackText,
  Box,
  Button,
  ButtonIcon,
  ButtonText,
  Divider,
  VStack,
  Text,
  HStack,
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
  Spinner,
  ButtonSpinner
} from "@gluestack-ui/themed";
import { ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-toast-message';
import api from "../api/axios";

export default function Formulario() {
  const [showModal, setShowModal] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [idContato, setIdContato] = useState(null);
  
  useEffect(() => {
    fetchData();
}, [])

  async function fetchData() {
    try {
      const token = await AsyncStorage.getItem("token");
      const { data } = await api.get<any>("/retorno.php?acao=contatos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setContatos(data);
    } catch (error) {
      console.error("Erro ao buscar dados das APIs:", error);
    }finally{
      setSpinner(false);
      setShowModal(false);
    }
  };

  const apagarContato = async () => {
    setSpinner(true);
    
    try {
      const token = await AsyncStorage.getItem("token");

      const { data } = await api.get<any>(
        "/excluir.php?id_contato=" + idContato,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchData()

      router.push({
        pathname: 'contatos',
        params: {
          msg: data.msg,
          action: 'success',
        },
      });
      
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao excluir contato: " + error
      });
    } finally{
      setIdContato(null);
    }
  }

  const abrirForm = async () => {
    router.push({ pathname: "userForm", params: { formContato: true } });
  }

  const abrirFormContato = async (id_contato: any) => {
    router.push({ pathname: "userForm", params: { abrirForm: true, id_contato: id_contato, formContato: true } });
  }

  const generateColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0');
    return `#${randomColor}`;
  };

  const [contatos, setContatos]: any = useState([]);

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

  return (
    <ScrollView>
      <VStack
      flex={1}
      space="lg"
      p={15}>
        <Box mt="8%" mb="8%">
          <Button
            size="xl"
            variant="outline"
            action="positive"
            isDisabled={false}
            isFocusVisible={false}
            onPress={abrirForm}>
            <ButtonText>Adicionar </ButtonText>
            <ButtonIcon as={AddIcon} />
          </Button>
        </Box>
        <Divider
          sx={{
            bg: "$gray500",
            _dark: {
              bg: "$red400",
            },
          }} />
        
        {spinner ? <Spinner size='large' marginTop='50%' /> :
          <VStack space="2xl" {...(spinner ? {opacity: 0.3} : {} )}>
            {contatos == "" ?
              <Text textAlign="center" fontSize={20} mt="80%">
                Nenhum contato encontrado
              </Text> :

              contatos.map((item: any) => (
                <Box bg="$white" borderRadius="$lg" p={15} shadowRadius={1} key={item.id_contato}>
                  <HStack space="lg">
                    <Avatar bgColor={generateColor()}>
                      <AvatarFallbackText>{item.tipo_contato}</AvatarFallbackText>
                    </Avatar>
                    <VStack>
                      <Heading size="sm">{item.tipo_contato}
                      </Heading>
                      <Text size="sm">{item.cpf}</Text>
                      <Text size="sm" fontWeight="bold">Código do contato: {item.id_contato}</Text>
                    </VStack>
                  </HStack>
                  <HStack space="md" p={8} mt={8}>
                    <Button
                      action="primary"
                      w="50%"
                      onPress={() => abrirFormContato(item.id_contato)}>
                      <ButtonText>Visualizar</ButtonText>
                    </Button>
                    <Button
                      action="negative"
                      w="50%">
                      <ButtonText
                      onPress={() => {setShowModal(true); setIdContato(item.id_contato)}}>
                        Apagar
                      </ButtonText>
                    </Button>
                  </HStack>
                </Box>
              ))}
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
                Deseja realmente apagar esse contato?
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
                isDisabled={spinner}
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                size="sm"
                action="positive"
                borderWidth="$0"
                onPress={() => apagarContato()}
                isDisabled={spinner}
              >
                {spinner ? <ButtonSpinner mr="$1" /> : ""}
                <ButtonText>Confirmar</ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </ScrollView>
  );
}