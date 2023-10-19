import {
  Box,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  Textarea,
  TextareaInput,
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
  Radio,
  RadioLabel,
  RadioGroup,
  RadioIndicator,
  RadioIcon,
  HStack,
  CircleIcon,
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  Icon,
  ChevronDownIcon,
  SelectPortal,
  SelectDragIndicator,
  SelectItem,
  SelectContent,
  SelectDragIndicatorWrapper,
} from "@gluestack-ui/themed";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ScrollView } from "react-native";
import { useRouter } from "expo-router";
import FormHeader from "../../components/form/FormHeader";

import maskDataNasc from "../../utilities/masks/maskDataNasc";
import maskTelefone from "../../utilities/masks/telefoneMask";
import maskCelular from "../../utilities/masks/celularMask";
import maskCep from "../../utilities/masks/cepMask";
import maskCpf from "../../utilities/masks/cpfMask";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import ISelectProps from "../../utilities/interfaces/ISelectProps";

import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api/axios";
import * as Location from "expo-location";

export default function FormUsuario({
  abrirForm,
  id_contato = "",
  formContato = false,
}: any) {
  const registerSchema = yup.object().shape({
    nm_contato: formContato
      ? yup.string().required("Digite um nome para o contato")
      : yup.string(),
    dt_nascimento: yup
      .string()
      .required("A data de nascimento é obrigatória")
      .length(10, "A data de nascimento está incompleta"),
    tp_sexo: yup.string().required("Selecione o gênero"),
    telefone: yup.string().optional(),
    celular: yup
      .string()
      .required("O celular é obrigatório")
      .length(15, "O celular deve ter 11 dígitos com o DDD"),
    estado: yup.string().required("O estado é obrigatório"),
    id_cidade: yup.string().required("A cidade é obrigatória"),
    cep: yup
      .string()
      .required("O CEP é obrigatório")
      .length(9, "O CEP deve ter 9 caracteres"),
    endereco: yup.string().required("O endereço é obrigatório"),
    bairro: yup.string().required("O bairro é obrigatório"),
    complemento: yup.string().optional(),
    id_plano: yup.string().required("Selecione um plano"),
    ds_plano: yup.string().when("plano", {
      is: "8",
      then: (schema) => schema.required("Digite um plano"),
    }),
    alergia: yup.string().required("Selecione se possui alguma alergia"),
    ds_alergia: yup.string().when("alergia", {
      is: "S",
      then: (schema) => schema.required("Digite a alergia"),
    }),
    med_cont: yup.string().required("Selecione se toma algum medicamento"),
    ds_med_cont: yup.string().when("medicamento", {
      is: "S",
      then: (schema) => schema.required("Digite o medicamento"),
    }),
    cirurgia: yup.string().required("Selecione se já realizou alguma cirurgia"),
    ds_cirurgia: yup.string().when("cirurgia", {
      is: "S",
      then: (schema) => schema.required("Digite a cirurgia"),
    }),
    id_comorbidade: yup.string().required("Comorbidade é obrigatória"),
    ds_comorbidade: yup.string().when("comorbidade", {
      is: "21",
      then: (schema) => schema.required("Digite a comorbidade"),
    }),
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: async () => {
      if (abrirForm) {
        const token = await AsyncStorage.getItem("token");

        const { data } = await api.get<any>(
          "/retorno.php?acao=formulario&id_contato=" + id_contato,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.id_plano == "8") {
          setMostraInputPlano(false);
        }
        if (data.alergia == "S") {
          setMostraTextareaAlergia(false);
        }
        if (data.med_cont == "S") {
          setMostraTextareaMed(false);
        }
        if (data.cirurgia == "S") {
          setMostraTextareaCirurgia(false);
        }
        if (data.id_comorbidade == "21") {
          setMostraTextareaComorb(false);
        }

        setlblCidade(data.lbl_cidade);
        setlblComorbidade(data.lbl_comorbidade);
        setTituloForm("Atualização do formulário");
        setTxtBotao("Atualizar formulário");
        setDadosCarregados(true);

        return data;
      }
    },
  });

  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const { data } = await api.get<any>("/retorno.php?acao=select", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { cidade, comorbidade, planoSaude } = data;

        setCidades(cidade);
        setComorbidades(comorbidade);
        setPlanos(planoSaude);
      } catch (error) {
        console.error("Erro ao buscar dados das APIs:", error);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (formData: any) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const { data, status } = await api.post<any>(
        "/formulario.php",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (status == 200) {
        let { status } = await Location.getForegroundPermissionsAsync();

        if (status !== "granted") {
          await Location.requestForegroundPermissionsAsync();
        }

        router.replace("home");
      } else {
        return toast.show({
          placement: "top",
          render: ({ id }) => {
            return (
              <Toast nativeID={id} action="success" variant="accent">
                <VStack space="xs">
                  <ToastDescription>{data.erro}</ToastDescription>
                </VStack>
              </Toast>
            );
          },
        });
      }
    } catch (error) {
      console.error("Erro ao buscar dados das APIs:", error);
    }
  };

  const [tituloForm, setTituloForm] = useState("Criação de formulário");

  const [mostraInputPlano, setMostraInputPlano] = useState(true);
  const [mostraTextareaAlergia, setMostraTextareaAlergia] = useState(true);
  const [mostraTextareaMed, setMostraTextareaMed] = useState(true);
  const [mostraTextareaCirurgia, setMostraTextareaCirurgia] = useState(true);
  const [mostraTextareaComorb, setMostraTextareaComorb] = useState(true);
  const [cidades, setCidades] = useState<ISelectProps[]>([]);
  const [comorbidades, setComorbidades] = useState<ISelectProps[]>([]);
  const [planos, setPlanos] = useState<ISelectProps[]>([]);
  const [dsPlanoValue, setDsPlanoValue] = useState("");
  const [dsAlergiaValue, setDsAlergiaValue] = useState("");
  const [dsMedicamentoValue, setDsMedicamentoValue] = useState("");
  const [dsCirurgiaValue, setDsCirurgiaValue] = useState("");
  const [dsComorbidadeValue, setDsComorbidadeValue] = useState("");

  const [lblCidade, setlblCidade] = useState(undefined);
  const [lblComorbidade, setlblComorbidade] = useState("");
  const [txtBotao, setTxtBotao] = useState("Criar formulário");

  const [dadosCarregados, setDadosCarregados] = useState(false);
  const RenderizarFormulario = (abrirForm && dadosCarregados) || !abrirForm;

  return (
    <ScrollView>
      <VStack
        space="lg"
        h={"$full"}
        flex={1}
        justifyContent="center"
        p={15}
        bgColor="white"
      >
        <FormHeader title={tituloForm} />

        {RenderizarFormulario && formContato ? (
          <Box>
            <Box>
              <FormControl isRequired isInvalid={"nm_contato" in errors}>
                <FormControlLabel>
                  <FormControlLabelText>Nome do contato</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <Controller
                    control={control}
                    name="nm_contato"
                    defaultValue={""}
                    render={({ field: { onChange, value } }) => (
                      <InputField
                        type="text"
                        placeholder="Digite um nome para o contato"
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors.nm_contato?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </Box>
            <Box mt={15}>
              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText>
                    CPF do contato (caso souber)
                  </FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <Controller
                    control={control}
                    name="cpf_contato"
                    defaultValue={""}
                    render={({ field: { onChange, value } }) => (
                      <InputField
                        type="text"
                        placeholder="Digite o CPF do contato"
                        maxLength={14}
                        value={value}
                        onChangeText={(text) => onChange(maskCpf(text))}
                      />
                    )}
                  />
                </Input>
              </FormControl>
            </Box>
          </Box>
        ) : null}
        {RenderizarFormulario ? (
          <Box>
            <Box>
              <FormControl isRequired isInvalid={"dt_nascimento" in errors}>
                <FormControlLabel>
                  <FormControlLabelText>
                    Data de nascimento
                  </FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <Controller
                    control={control}
                    name="dt_nascimento"
                    defaultValue={""}
                    render={({ field: { onChange, value } }) => (
                      <InputField
                        type="text"
                        placeholder="DD/MM/AAAA"
                        maxLength={10}
                        value={value}
                        onChangeText={(text) => onChange(maskDataNasc(text))}
                      />
                    )}
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors.dt_nascimento?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </Box>
            <Box>
              <FormControl isRequired isInvalid={"tp_sexo" in errors}>
                <FormControlLabel>
                  <FormControlLabelText>Gênero</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={control}
                  name="tp_sexo"
                  defaultValue={""}
                  render={({ field: { onChange, value } }) => (
                    <RadioGroup onChange={(v) => onChange(v)} value={value}>
                      <Radio value="M">
                        <RadioIndicator mr="$2">
                          <RadioIcon as={CircleIcon} />
                        </RadioIndicator>
                        <RadioLabel>Masculino</RadioLabel>
                      </Radio>

                      <Radio value="F">
                        <RadioIndicator mr="$2">
                          <RadioIcon as={CircleIcon} />
                        </RadioIndicator>
                        <RadioLabel>Feminino</RadioLabel>
                      </Radio>
                    </RadioGroup>
                  )}
                />

                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors.tp_sexo?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </Box>
            <Box>
              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText>Telefone</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <Controller
                    control={control}
                    name="telefone"
                    defaultValue={""}
                    render={({ field: { onChange, value } }) => (
                      <InputField
                        type="text"
                        placeholder="Digite seu telefone"
                        maxLength={14}
                        value={value}
                        onChangeText={(text) => onChange(maskTelefone(text))}
                      />
                    )}
                  />
                </Input>
              </FormControl>
            </Box>
            <Box>
              <FormControl isRequired isInvalid={"celular" in errors}>
                <FormControlLabel>
                  <FormControlLabelText>Celular</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <Controller
                    control={control}
                    name="celular"
                    defaultValue={""}
                    render={({ field: { onChange, value } }) => (
                      <InputField
                        type="text"
                        placeholder="Digite seu celular"
                        maxLength={15}
                        value={value}
                        onChangeText={(text) => onChange(maskCelular(text))}
                      />
                    )}
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors.celular?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </Box>
            <Box>
              <FormControl isRequired isInvalid={"estado" in errors}>
                <FormControlLabel>
                  <FormControlLabelText>Estado</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={control}
                  name="estado"
                  defaultValue={"SÃO PAULO"}
                  render={({ field: { onChange, value } }) => (
                    <Select onValueChange={onChange} selectedValue={value}>
                      <SelectTrigger>
                        <SelectInput placeholder="Selecione um estado" />
                        <SelectIcon mr="$3">
                          <Icon as={ChevronDownIcon} />
                        </SelectIcon>
                      </SelectTrigger>
                      <SelectPortal>
                        <SelectContent>
                          <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                          </SelectDragIndicatorWrapper>
                          <SelectItem label="SÃO PAULO" value="SP" />
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                  )}
                />
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors.estado?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </Box>
            <Box>
              <FormControl isRequired isInvalid={"id_cidade" in errors}>
                <FormControlLabel>
                  <FormControlLabelText>Cidade</FormControlLabelText>
                </FormControlLabel>

                <Controller
                  control={control}
                  name="id_cidade"
                  defaultValue={""}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      onValueChange={onChange}
                      selectedLabel={lblCidade}
                      {...(abrirForm ? { selectedValue: value } : {})}
                    >
                      <SelectTrigger>
                        <SelectInput placeholder="Selecione uma cidade" />
                        <SelectIcon mr="$3">
                          <Icon as={ChevronDownIcon} />
                        </SelectIcon>
                      </SelectTrigger>
                      <SelectPortal>
                        <SelectContent>
                          <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                          </SelectDragIndicatorWrapper>
                          {cidades.map((option, index) => (
                            <SelectItem
                              key={index}
                              label={option.label}
                              value={option.value}
                            />
                          ))}
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                  )}
                />

                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors.id_cidade?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </Box>
            <Box>
              <FormControl isRequired isInvalid={"cep" in errors}>
                <FormControlLabel>
                  <FormControlLabelText>CEP</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <Controller
                    control={control}
                    name="cep"
                    defaultValue={""}
                    render={({ field: { onChange, value } }) => (
                      <InputField
                        type="text"
                        placeholder="Digite seu CEP"
                        maxLength={9}
                        value={value}
                        onChangeText={(text) => onChange(maskCep(text))}
                      />
                    )}
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors.cep?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </Box>
            <Box>
              <FormControl isRequired isInvalid={"endereco" in errors}>
                <FormControlLabel>
                  <FormControlLabelText>Endereço</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <Controller
                    control={control}
                    name="endereco"
                    defaultValue={""}
                    render={({ field: { onChange, value } }) => (
                      <InputField
                        type="text"
                        placeholder="Digite seu endereço completo com número"
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors.endereco?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </Box>
            <Box>
              <FormControl isRequired isInvalid={"bairro" in errors}>
                <FormControlLabel>
                  <FormControlLabelText>Bairro</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <Controller
                    control={control}
                    name="bairro"
                    defaultValue={""}
                    render={({ field: { onChange, value } }) => (
                      <InputField
                        type="text"
                        placeholder="Digite seu bairro"
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors.bairro?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </Box>
            <Box>
              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText>Complemento</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <Controller
                    control={control}
                    name="complemento"
                    defaultValue={""}
                    render={({ field: { onChange, value } }) => (
                      <InputField
                        type="text"
                        placeholder="Digite um complemento"
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                  />
                </Input>
              </FormControl>
            </Box>
            <Box>
              <FormControl isRequired isInvalid={"id_plano" in errors}>
                <FormControlLabel>
                  <FormControlLabelText>Plano de saúde</FormControlLabelText>
                </FormControlLabel>

                <Controller
                  control={control}
                  name="id_plano"
                  defaultValue={""}
                  render={({ field: { onChange, value } }) => (
                    <RadioGroup
                      onChange={(v) => {
                        onChange(v);
                        if (v == 8) {
                          setMostraInputPlano(false);
                        } else {
                          setMostraInputPlano(true);
                        }
                        setDsPlanoValue("");
                        setValue("ds_plano", "");
                      }}
                      value={value}
                    >
                      {planos.map((option, index) => (
                        <Radio key={index} value={option.value}>
                          <RadioIndicator mr="$2">
                            <RadioIcon as={CircleIcon} />
                          </RadioIndicator>
                          <RadioLabel>{option.label}</RadioLabel>
                        </Radio>
                      ))}
                    </RadioGroup>
                  )}
                />

                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors.id_plano?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </Box>
            <Box>
              <FormControl
                isRequired={!mostraInputPlano}
                isInvalid={!mostraInputPlano ? "ds_plano" in errors : undefined}
              >
                <FormControlLabel>
                  <FormControlLabelText>
                    Preencha caso tenha escolhido a opção 'OUTROS'
                  </FormControlLabelText>
                </FormControlLabel>
                <Input isDisabled={mostraInputPlano}>
                  <Controller
                    control={control}
                    name="ds_plano"
                    defaultValue={""}
                    render={({ field: { onChange, value } }) => (
                      <InputField
                        type="text"
                        onChangeText={onChange}
                        value={value || dsPlanoValue}
                      />
                    )}
                  />
                </Input>

                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors.ds_plano?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </Box>
            <Box>
              <FormControl isRequired isInvalid={"alergia" in errors}>
                <FormControlLabel>
                  <FormControlLabelText>
                    Pussui algum tipo de alergia?
                  </FormControlLabelText>
                </FormControlLabel>

                <Controller
                  control={control}
                  name="alergia"
                  defaultValue={""}
                  render={({ field: { onChange, value } }) => (
                    <RadioGroup onChange={onChange} value={value}>
                      <HStack space="2xl">
                        <Radio
                          value="S"
                          onFocus={(e) => {
                            setMostraTextareaAlergia(false);
                          }}
                        >
                          <RadioIndicator mr="$2">
                            <RadioIcon as={CircleIcon} />
                          </RadioIndicator>
                          <RadioLabel>Sim</RadioLabel>
                        </Radio>
                        <Radio
                          value="N"
                          onFocus={() => {
                            setMostraTextareaAlergia(true);
                            setDsAlergiaValue("");
                            setValue("ds_alergia", "");
                          }}
                        >
                          <RadioIndicator mr="$2">
                            <RadioIcon as={CircleIcon} />
                          </RadioIndicator>
                          <RadioLabel>Não</RadioLabel>
                        </Radio>
                      </HStack>
                    </RadioGroup>
                  )}
                />

                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors.alergia?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </Box>
            <Box>
              <FormControl
                isRequired={!mostraTextareaAlergia}
                isInvalid={
                  !mostraTextareaAlergia ? "ds_alergia" in errors : undefined
                }
              >
                <FormControlLabel>
                  <FormControlLabelText>
                    Preencha caso tenha alguma alergia
                  </FormControlLabelText>
                </FormControlLabel>
                <Textarea isDisabled={mostraTextareaAlergia}>
                  <Controller
                    control={control}
                    name="ds_alergia"
                    defaultValue={""}
                    render={({ field: { onChange, value } }) => (
                      <TextareaInput
                        onChangeText={(value) => {
                          setDsAlergiaValue(value);
                          onChange(value);
                        }}
                        placeholder="Digite sua alergia"
                        value={value || dsAlergiaValue}
                      />
                    )}
                  />
                </Textarea>

                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors.ds_alergia?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </Box>
            <Box>
              <FormControl isRequired isInvalid={"med_cont" in errors}>
                <FormControlLabel>
                  <FormControlLabelText>
                    Toma algum medicamento contínuo?
                  </FormControlLabelText>
                </FormControlLabel>

                <Controller
                  control={control}
                  name="med_cont"
                  defaultValue={""}
                  render={({ field: { onChange, value } }) => (
                    <RadioGroup onChange={onChange} value={value}>
                      <HStack space="2xl">
                        <Radio
                          value="S"
                          onFocus={() => setMostraTextareaMed(false)}
                        >
                          <RadioIndicator mr="$2">
                            <RadioIcon as={CircleIcon} />
                          </RadioIndicator>
                          <RadioLabel>Sim</RadioLabel>
                        </Radio>
                        <Radio
                          value="N"
                          onFocus={() => {
                            setMostraTextareaMed(true);
                            setDsMedicamentoValue("");
                            setValue("ds_med_cont", "");
                          }}
                        >
                          <RadioIndicator mr="$2">
                            <RadioIcon as={CircleIcon} />
                          </RadioIndicator>
                          <RadioLabel>Não</RadioLabel>
                        </Radio>
                      </HStack>
                    </RadioGroup>
                  )}
                />

                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors.med_cont?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </Box>
            <Box>
              <FormControl
                isRequired={!mostraTextareaMed}
                isInvalid={
                  !mostraTextareaMed ? "ds_med_cont" in errors : undefined
                }
              >
                <FormControlLabel>
                  <FormControlLabelText>
                    Preencha caso tome algum medicamento contínuo
                  </FormControlLabelText>
                </FormControlLabel>
                <Textarea isDisabled={mostraTextareaMed}>
                  <Controller
                    control={control}
                    name="ds_med_cont"
                    defaultValue={""}
                    render={({ field: { onChange, value } }) => (
                      <TextareaInput
                        onChangeText={(value) => {
                          setDsMedicamentoValue(value);
                          onChange(value);
                        }}
                        value={value || dsMedicamentoValue}
                        placeholder="Digite seu medicamento"
                      />
                    )}
                  />
                </Textarea>

                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors.ds_med_cont?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </Box>
            <Box>
              <FormControl isRequired isInvalid={"cirurgia" in errors}>
                <FormControlLabel>
                  <FormControlLabelText>
                    Já realizou alguma cirurgia?
                  </FormControlLabelText>
                </FormControlLabel>

                <Controller
                  control={control}
                  name="cirurgia"
                  defaultValue={""}
                  render={({ field: { onChange, value } }) => (
                    <RadioGroup onChange={onChange} value={value}>
                      <HStack space="2xl">
                        <Radio
                          value="S"
                          onFocus={() => {
                            setMostraTextareaCirurgia(false);
                          }}
                        >
                          <RadioIndicator mr="$2">
                            <RadioIcon as={CircleIcon} />
                          </RadioIndicator>
                          <RadioLabel>Sim</RadioLabel>
                        </Radio>
                        <Radio
                          value="N"
                          onFocus={() => {
                            setMostraTextareaCirurgia(true);
                            setDsCirurgiaValue("");
                            setValue("ds_cirurgia", "");
                          }}
                        >
                          <RadioIndicator mr="$2">
                            <RadioIcon as={CircleIcon} />
                          </RadioIndicator>
                          <RadioLabel>Não</RadioLabel>
                        </Radio>
                      </HStack>
                    </RadioGroup>
                  )}
                />

                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors.cirurgia?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </Box>
            <Box>
              <FormControl
                isRequired={!mostraTextareaCirurgia}
                isInvalid={
                  !mostraTextareaCirurgia ? "ds_cirurgia" in errors : undefined
                }
              >
                <FormControlLabel>
                  <FormControlLabelText>
                    Preencha caso já tenha feito alguma cirurgia
                  </FormControlLabelText>
                </FormControlLabel>
                <Textarea isDisabled={mostraTextareaCirurgia}>
                  <Controller
                    control={control}
                    name="ds_cirurgia"
                    defaultValue={""}
                    render={({ field: { onChange, value } }) => (
                      <TextareaInput
                        onChangeText={(value) => {
                          setDsCirurgiaValue(value);
                          onChange(value);
                        }}
                        value={value || dsCirurgiaValue}
                        placeholder="Digite sua cirurgia"
                      />
                    )}
                  />
                </Textarea>

                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors.ds_cirurgia?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </Box>
            <Box>
              <FormControl isRequired isInvalid={"id_comorbidade" in errors}>
                <FormControlLabel>
                  <FormControlLabelText>Comorbidade</FormControlLabelText>
                </FormControlLabel>

                <Controller
                  control={control}
                  name="id_comorbidade"
                  defaultValue={""}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      onValueChange={(v) => {
                        onChange(v);
                        v == "21"
                          ? setMostraTextareaComorb(false)
                          : setMostraTextareaComorb(true);
                        setDsComorbidadeValue("");
                        setValue("ds_comorbidade", "");
                      }}
                      {...(abrirForm ? { selectedValue: value } : {})}
                      selectedLabel={lblComorbidade}
                    >
                      <SelectTrigger>
                        <SelectInput placeholder="Selecione uma comorbidade" />
                        <SelectIcon mr="$3">
                          <Icon as={ChevronDownIcon} />
                        </SelectIcon>
                      </SelectTrigger>
                      <SelectPortal>
                        <SelectContent>
                          <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                          </SelectDragIndicatorWrapper>
                          {comorbidades.map((option, index) => (
                            <SelectItem
                              key={index}
                              label={option.label}
                              value={option.value}
                            />
                          ))}
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                  )}
                />

                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors.id_comorbidade?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </Box>
            <Box>
              <FormControl
                isRequired={!mostraTextareaComorb}
                isInvalid={
                  !mostraTextareaComorb ? "ds_comorbidade" in errors : undefined
                }
              >
                <FormControlLabel>
                  <FormControlLabelText>
                    Preencha caso tenha escolhido a opção 'OUTROS'
                  </FormControlLabelText>
                </FormControlLabel>
                <Textarea isDisabled={mostraTextareaComorb}>
                  <Controller
                    control={control}
                    name="ds_comorbidade"
                    defaultValue={""}
                    render={({ field: { onChange, value } }) => (
                      <TextareaInput
                        onChangeText={(value) => {
                          setDsComorbidadeValue(value);
                          onChange(value);
                        }}
                        value={value || dsComorbidadeValue}
                        placeholder="Digite sua comorbidade"
                      />
                    )}
                  />
                </Textarea>

                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors.ds_comorbidade?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </Box>
            <Box>
              <Button onPress={handleSubmit(onSubmit)}>
                <ButtonText>{txtBotao}</ButtonText>
              </Button>
            </Box>
          </Box>
        ) : null}
      </VStack>
    </ScrollView>
  );
}
