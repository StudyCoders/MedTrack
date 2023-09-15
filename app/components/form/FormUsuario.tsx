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
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import maskDataNasc from "../../utilities/masks/maskDataNasc";

import FormHeader from "../../components/form/FormHeader";
import { useAuth } from "../../context/AuthContext";
import maskTelefone from "../../utilities/masks/telefoneMask";
import maskCelular from "../../utilities/masks/celularMask";
import maskCep from "../../utilities/masks/cepMask";
import { ScrollView } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api/axios";
import axios from "axios";

export interface SelectProps {
  label: string;
  value: string;
}

const registerSchema = yup
  .object()
  .shape({
    data_nascimento: yup
      .string()
      .required("A data de nascimento é obrigatório")
      .length(10, "Data de nascimento está incompleto"),
    tp_sexo: yup.string().required("Selecione o gênero"),
    telefone: yup.string().optional(),
    celular: yup
      .string()
      .required("O celular é obrigatório")
      .length(15, "Celular está incompleto"),
    estado: yup.string().required("O estado é obrigatória"),
    cidade: yup.string().required("A cidade é obrigatória"),
    cep: yup
      .string()
      .required("O CEP é obrigatório")
      .length(9, "CEP está incompleto"),
    endereco: yup.string().required("O endereço é obrigatório"),
    numero_endereco: yup
      .string()
      .required("O número da residência é obrigatório"),
    bairro: yup.string().required("O bairro é obrigatório"),
    complemento: yup.string().optional(),
    plano: yup.string().required("Selecione um plano"),
    ds_plano: yup.string().required("Digite um plano"),
    alergia: yup.string().required("Selecione se possui alguma alergia"),
    ds_alergia: yup.string().required("Digite a alergia"),
    medicamento: yup.string().required("Selecione se toma algum medicamento"),
    ds_medicamento: yup.string().required("Digite o medicamento"),
    cirurgia: yup.string().required("Selecione se já realizou alguma cirurgia"),
    ds_cirurgia: yup.string().required("Digite a cirurgia"),
    comorbidade: yup.string().required("Comorbidade é obrigatório"),
    ds_comorbidade: yup.string().required("Digite a comorbidade"),
  })
  .required();

export default function FormUsuario() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const { data } = await api.get<any>("/retorno-select.php", {
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

  const onSubmit = (data: any) => {
    console.log("Conteúdo do formulário...", data);

    /* Enviar o formulário ... */

    /* Após a conclusão redirecionar para a rota [] */
  };

  const [mostraInputPlano, setMostraInputPlano] = useState(true);
  const [mostraTextareaAlergia, setMostraTextareaAlergia] = useState(true);
  const [mostraTextareaMed, setMostraTextareaMed] = useState(true);
  const [mostraTextareaCirurgia, setMostraTextareaCirurgia] = useState(true);
  const [mostraTextareaComorb, setMostraTextareaComorb] = useState(true);
  const [cidades, setCidades] = useState<SelectProps[]>([]);
  const [comorbidades, setComorbidades] = useState<SelectProps[]>([]);
  const [planos, setPlanos] = useState<SelectProps[]>([]);
  const [dsPlanoValue, setDsPlanoValue] = useState("");
  const [dsAlergiaValue, setDsAlergiaValue] = useState("");
  const [dsMedicamentoValue, setDsMedicamentoValue] = useState("");
  const [dsCirurgiaValue, setDsCirurgiaValue] = useState("");
  const [dsComorbidadeValue, setDsComorbidadeValue] = useState("");

  return (
    <Box width="100%" alignItems="center" bg="white">
      <ScrollView>
        <VStack space="lg">
          <FormHeader title="Criação de formulário" />
          <Box>
            <FormControl isRequired isInvalid={"data_nascimento" in errors}>
              <FormControlLabel>
                <FormControlLabelText>Data de nascimento</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <Controller
                  control={control}
                  name="data_nascimento"
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
                  {errors.data_nascimento?.message}
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
                  <RadioGroup onChange={(v) => onChange(v)}>
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
                defaultValue={""}
                render={({ field: { onChange, value } }) => (
                  <Select onValueChange={onChange}>
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
            <FormControl isRequired isInvalid={"cidade" in errors}>
              <FormControlLabel>
                <FormControlLabelText>Cidade</FormControlLabelText>
              </FormControlLabel>

              <Controller
                control={control}
                name="cidade"
                defaultValue={""}
                render={({ field: { onChange, value } }) => (
                  <Select onValueChange={onChange}>
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
                  {errors.cidade?.message}
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
                      placeholder="Digite seu endereço"
                      onChangeText={onChange}
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
            <FormControl
              w="80%"
              isRequired
              isInvalid={"numero_endereco" in errors}
            >
              <FormControlLabel>
                <FormControlLabelText>Número</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <Controller
                  control={control}
                  name="numero_endereco"
                  defaultValue={""}
                  render={({ field: { onChange, value } }) => (
                    <InputField type="text" onChangeText={onChange} />
                  )}
                />
              </Input>
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  {errors.numero_endereco?.message}
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
                    />
                  )}
                />
              </Input>
            </FormControl>
          </Box>
          <Box>
            <FormControl isRequired isInvalid={"plano" in errors}>
              <FormControlLabel>
                <FormControlLabelText>Plano de saúde</FormControlLabelText>
              </FormControlLabel>

              <Controller
                control={control}
                name="plano"
                defaultValue={""}
                render={({ field: { onChange, value } }) => (
                  <RadioGroup
                    onChange={(v) => {
                      onChange(v);
                      if (v == 8) {
                        setMostraInputPlano(false);
                        setDsPlanoValue("");
                      } else {
                        setMostraInputPlano(true);
                      }
                    }}
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
                  {errors.plano?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          </Box>
          <Box>
            <FormControl
              isRequired={!mostraInputPlano}
              isInvalid={!mostraInputPlano ? "ds_plano" in errors : ""}
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
                      onChangeText={(value) => {
                        setDsPlanoValue(value);
                        onChange(value);
                      }}
                      value={dsPlanoValue}
                      type="text"
                      placeholder="Digite um plano"
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
                  <RadioGroup onChange={onChange}>
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
              isInvalid={!mostraTextareaAlergia ? "ds_alergia" in errors : ""}
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
                      value={dsAlergiaValue}
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
            <FormControl isRequired isInvalid={"medicamento" in errors}>
              <FormControlLabel>
                <FormControlLabelText>
                  Toma algum medicamento contínuo?
                </FormControlLabelText>
              </FormControlLabel>

              <Controller
                control={control}
                name="medicamento"
                defaultValue={""}
                render={({ field: { onChange, value } }) => (
                  <RadioGroup onChange={onChange}>
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
                  {errors.medicamento?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          </Box>
          <Box>
            <FormControl
              isRequired={!mostraTextareaMed}
              isInvalid={!mostraTextareaMed ? "ds_medicamento" in errors : ""}
            >
              <FormControlLabel>
                <FormControlLabelText>
                  Preencha caso tome algum medicamento contínuo
                </FormControlLabelText>
              </FormControlLabel>
              <Textarea isDisabled={mostraTextareaMed}>
                <Controller
                  control={control}
                  name="ds_medicamento"
                  defaultValue={""}
                  render={({ field: { onChange, value } }) => (
                    <TextareaInput
                      onChangeText={(value) => {
                        setDsMedicamentoValue(value);
                        onChange(value);
                      }}
                      value={dsMedicamentoValue}
                      placeholder="Digite seu medicamento"
                    />
                  )}
                />
              </Textarea>

              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  {errors.ds_medicamento?.message}
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
                  <RadioGroup onChange={onChange}>
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
              isInvalid={!mostraTextareaCirurgia ? "ds_cirurgia" in errors : ""}
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
                      value={dsCirurgiaValue}
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
            <FormControl isRequired isInvalid={"comorbidade" in errors}>
              <FormControlLabel>
                <FormControlLabelText>Comorbidade</FormControlLabelText>
              </FormControlLabel>

              <Controller
                control={control}
                name="comorbidade"
                defaultValue={""}
                render={({ field: { onChange, value } }) => (
                  <Select
                    onValueChange={(v) => {
                      onChange(v);
                      v == 21
                        ? setMostraTextareaComorb(false)
                        : setMostraTextareaComorb(true);
                      setDsComorbidadeValue("");
                    }}
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
                  {errors.comorbidade?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          </Box>
          <Box>
            <FormControl
              isRequired={!mostraTextareaComorb}
              isInvalid={
                !mostraTextareaComorb ? "ds_comorbidade" in errors : ""
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
                      value={dsComorbidadeValue}
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
              <ButtonText>Criar formulário</ButtonText>
            </Button>
          </Box>
        </VStack>
      </ScrollView>
    </Box>
  );
}
