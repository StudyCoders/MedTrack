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
  FormControlError,
  FormControlErrorIcon,
  AlertCircleIcon,
  FormControlErrorText,
  Toast,
  ToastDescription,
  useToast,
} from "@gluestack-ui/themed";
import FormHeader from "../../components/form/FormHeader";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const loginSchema = yup
  .object()
  .shape({
    email: yup
      .string()
      .required("O e-mail é obrigatório")
      .email("Digite um e-mail válido"),
    senha: yup
      .string()
      .required("A senha é obrigatória")
      .min(6, "A senha deve conter no mínimo 6 dígitos"),
  })
  .required();

export default function Login() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const router = useRouter();
  const toast = useToast();
  const { onLogin } = useAuth();

  const onSubmit = async (data: any) => {
    if (onLogin) {
      const result: any = await onLogin(data);

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
    } else {
      router.push("profile");
    }
  };

  const { msg, action } = useLocalSearchParams<{
    msg: string;
    action: string;
  }>();

  useEffect(() => {
    if (msg && action) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          return (
            <Toast nativeID={id} action={action} variant="accent">
              <VStack space="xs">
                <ToastDescription>{msg}</ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });
    }
  }, [msg, action]);

  return (
    <Box flex={1} justifyContent="center" alignItems="center" bg="white">
      <VStack space="lg">
        <FormHeader title="Entrar" />
        <Box>
          <FormControl isInvalid={"email" in errors}>
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
          <FormControl isInvalid={"senha" in errors}>
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
          <Button onPress={handleSubmit(onSubmit)}>
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
