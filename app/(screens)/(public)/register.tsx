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
  FormControlError,
  FormControlErrorIcon,
  AlertCircleIcon,
  FormControlErrorText,
} from "@gluestack-ui/themed";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

import FormHeader from "../../components/form/FormHeader";

interface RegisterProps {
  nome_completo: string;
  email: string;
  cpf: string;
  senha: string;
  senha_confirmacao: string;
}

export default function register() {
  const {
    handleSubmit,
    getFieldState,
    getValues,
    control,
    formState: { errors },
  } = useForm<RegisterProps>();

  const onSubmit = (data: RegisterProps) => {
    const url = "https://tecnoatualizados.com/projetos/tcc/api/metodos/cadastrar.php";

    const criarUsuario = async () => {
      try {
        const response = await axios.post(url, JSON.stringify(data));
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    criarUsuario();
  };

  return (
    <Box
      width="100%"
      flex={1}
      justifyContent="center"
      alignItems="center"
      bg="white"
    >
      <VStack space="lg">
        <FormHeader title="Criar conta" />
        <Box>
          <FormControl isInvalid={getFieldState("nome_completo").invalid}>
            <FormControlLabel>
              <FormControlLabelText>Nome Completo</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <Controller
                control={control}
                name="nome_completo"
                rules={{
                  required: "O nome completo é obrigatório",
                }}
                render={({ field: { onChange, onBlur } }) => (
                  <InputField
                    type="text"
                    placeholder="Digite seu nome completo"
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </Input>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                {getFieldState("nome_completo").error?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
        </Box>
        <Box>
          <FormControl isInvalid={getFieldState("email").invalid}>
            <FormControlLabel>
              <FormControlLabelText>E-mail</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <Controller
                control={control}
                name="email"
                rules={{
                  required: "O e-mail é obrigatório",
                }}
                render={({ field: { onChange, onBlur } }) => (
                  <InputField
                    type="text"
                    placeholder="Digite seu e-mail"
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </Input>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                {getFieldState("email").error?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
        </Box>
        <Box>
          <FormControl isInvalid={getFieldState("cpf").invalid}>
            <FormControlLabel>
              <FormControlLabelText>CPF</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <Controller
                control={control}
                name="cpf"
                rules={{
                  required: "O CPF é obrigatório",
                }}
                render={({ field: { onChange, onBlur } }) => (
                  <InputField
                    type="text"
                    placeholder="Digite seu CPF"
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </Input>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                {getFieldState("cpf").error?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
        </Box>
        <Box>
          <FormControl isInvalid={getFieldState("senha").invalid}>
            <FormControlLabel>
              <FormControlLabelText>Senha</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <Controller
                control={control}
                name="senha"
                rules={{
                  required: "A senha é obrigatória",
                  minLength: {
                    value: 6,
                    message: "A senha deve conter no mínimo 6 dígitos",
                  },
                }}
                render={({ field: { onChange, onBlur } }) => (
                  <InputField
                    type="password"
                    placeholder="Digite sua senha"
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </Input>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                {getFieldState("senha").error?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
        </Box>
        <Box>
          <FormControl isInvalid={getFieldState("senha_confirmacao").invalid}>
            <FormControlLabel>
              <FormControlLabelText>Confirmar senha</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <Controller
                control={control}
                name="senha_confirmacao"
                rules={{
                  required: "Digite a senha de confirmação",
                  validate: (value) => {
                    return (
                      value === getValues("senha") || "As senhas não conferem"
                    );
                  },
                }}
                render={({ field: { onChange, onBlur } }) => (
                  <InputField
                    type="password"
                    placeholder="Confirme sua senha"
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </Input>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                {getFieldState("senha_confirmacao").error?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
        </Box>
        <Box>
          <Button onPress={handleSubmit(onSubmit)}>
            <ButtonText>Criar conta</ButtonText>
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}
