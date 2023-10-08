import { AddIcon,
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
         Heading} from "@gluestack-ui/themed";
import { ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "../api/axios";

export default function Formulario() {
  useEffect(() => {
    const fetchData = async () => {
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
      }
    };

    fetchData();
  }, []);

  const abrirForm = async () => {
    router.push({pathname: "userForm", params: { formContato: true }});
  }

  const abrirFormContato = async (id_contato :any) => {
    router.push({pathname: "userForm", params: { abrirForm: true, id_contato: id_contato }});
  }

  const generateColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0');
    return `#${randomColor}`;
  };

  const [contatos, setContatos]: any = useState([]);
  
  return (
    <ScrollView>
      <VStack flex={1} space="lg" p={15}>
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

        <VStack space="2xl">
          { contatos == "" ?
              <Text textAlign="center" fontSize={20} mt="80%">
                Nenhum contato encontrado
              </Text> :

              contatos.map( (item :any) => (
                <Box bg="$white" borderRadius="$lg" p={10} shadowRadius={1}>
                  <HStack space="lg">
                    <Avatar bgColor={generateColor()}>
                      <AvatarFallbackText>{item.tipo_contato}</AvatarFallbackText>
                    </Avatar>
                    <VStack>
                      <Heading size="sm">{item.tipo_contato}</Heading>
                      <Text size="sm">{item.cpf}</Text>
                    </VStack>
                  </HStack>
                  <Button
                  action="primary"
                  mt={10}
                  onPress={ () => abrirFormContato(item.id_contato)}>
                    <ButtonText>Visualizar</ButtonText>
                  </Button>
                </Box>
              ))}
        </VStack>

      </VStack>
    </ScrollView>
  );
}