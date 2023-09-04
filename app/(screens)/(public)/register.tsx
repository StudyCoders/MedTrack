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
  Toast,
  ToastDescription,
  useToast,
} from "@gluestack-ui/themed";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useRouter } from "expo-router";
import maskCpf from "../../utilities/masks/cpfMask";

import FormHeader from "../../components/form/FormHeader";
import { useAuth } from "../../context/AuthContext";

const registerSchema = yup
  .object()
  .shape({
    nome_completo: yup.string().required("O nome completo é obrigatório"),
    email: yup
      .string()
      .required("O e-mail é obrigatório")
      .email("Digite um e-mail válido"),
    cpf: yup
      .string()
      .required("O CPF é obrigatório")
      .length(14, "O CPF está incompleto"),
    senha: yup
      .string()
      .required("A senha é obrigatória")
      .min(6, "A senha deve conter no mínimo 6 dígitos"),
    senha_confirmacao: yup
      .string()
      .required("A senha de confirmação é obrigatória")
      .oneOf([yup.ref("senha")], "As senhas não conferem"),
  })
  .required();

export default function register() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const toast = useToast();
  const router = useRouter();
  const { onRegister } = useAuth();

  const onSubmit = (data: any) => {
    const url =
      "https://tecnoatualizados.com/projetos/tcc/api/metodos/cadastrar.php";

    const criarUsuario = async () => {
      if (onRegister) {
        const result: any = await onRegister(data);

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
        }

        router.push({
          pathname: "login",
          params: {
            msg: "Conta criada com sucesso!",
            action: "success",
          },
        });
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
          <FormControl isRequired isInvalid={"nome_completo" in errors}>
            <FormControlLabel>
              <FormControlLabelText>Nome Completo</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <Controller
                control={control}
                name="nome_completo"
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
                {errors.nome_completo?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
        </Box>
        <Box>
          <FormControl isRequired isInvalid={"email" in errors}>
            <FormControlLabel>
              <FormControlLabelText>E-mail</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <Controller
                control={control}
                name="email"
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
                {errors.email?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
        </Box>
        <Box>
          <FormControl isRequired isInvalid={"cpf" in errors}>
            <FormControlLabel>
              <FormControlLabelText>CPF</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <Controller
                control={control}
                name="cpf"
                defaultValue={""}
                render={({ field: { onChange, value } }) => (
                  <InputField
                    type="text"
                    placeholder="Digite seu CPF"
                    maxLength={14}
                    value={value}
                    onChangeText={(text) => onChange(maskCpf(text))}
                  />
                )}
              />
            </Input>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{errors.cpf?.message}</FormControlErrorText>
            </FormControlError>
          </FormControl>
        </Box>
        <Box>
          <FormControl isRequired isInvalid={"senha" in errors}>
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
                {errors.senha?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
        </Box>
        <Box>
          <FormControl isInvalid={"senha_confirmacao" in errors}>
            <FormControlLabel>
              <FormControlLabelText>Confirmar senha</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <Controller
                control={control}
                name="senha_confirmacao"
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
                {errors.senha_confirmacao?.message}
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
