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
    SelectDragIndicatorWrapper
  } from "@gluestack-ui/themed";
  import { yupResolver } from "@hookform/resolvers/yup";
  import * as yup from "yup";
  import { useForm, Controller } from "react-hook-form";
  import axios from "axios";
  import { useRouter } from "expo-router";
  import maskDataNasc from "../../utilities/masks/maskDataNasc";
  
  import FormHeader from "../../components/form/FormHeader";
  import { useAuth } from "../../context/AuthContext";
  import maskTelefone from "../../utilities/masks/telefoneMask";
  import maskCelular from "../../utilities/masks/celularMask";
  import maskCep from "../../utilities/masks/cepMask";
  import { ScrollView } from "react-native";
  
  const registerSchema = yup
    .object()
    .shape({
      data_nascimento: yup.string()
        .required("A data de nascimento é obrigatório")
        .length(10, "Data de nascimento está incompleto"),
      tp_sexo: yup
        .string().required("Selecione o gênero"),
      celular: yup.string()
        .required("O celular é obrigatório")
        .length(15, "Celular está incompleto"),
      estado: yup.string()
        .required("O estado é obrigatória"),
      cidade: yup.string()
        .required("A cidade é obrigatória"),
      cep: yup.string()
        .required("O CEP é obrigatório")
        .length(9, "CEP está incompleto"),
      endereco: yup.string()
        .required("O endereço é obrigatório"),
      numero_endereco: yup.string()
        .required("O número da residência é obrigatório"),
      bairro: yup.string()
        .required("O bairro é obrigatório"),
      plano: yup
        .string().required("Selecione um plano"),
      alergia: yup
        .string().required("Selecione se possui alguma alergia"),
      medicamento: yup
        .string().required("Selecione se toma algum medicamento"),
      cirurgia: yup
        .string().required("Selecione se já realizou alguma cirurgia"),
      comorbidade: yup
        .string().required("Comorbidade é obrigatório"),
    })
    .required();
  
  export default function formulario() {
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
        "https://tecnoatualizados.com/projetos/tcc/api/metodos/formulario.php";
    };
  
    return (
      <Box
        width="100%"
        alignItems="center"
        bg="white"
      >
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
                  <FormControlErrorText>{errors.data_nascimento?.message}</FormControlErrorText>
                </FormControlError>
              </FormControl>
            </Box>
            <Box>
              <FormControl isRequired isInvalid={"tp_sexo" in errors}>
                <FormControlLabel>
                  <FormControlLabelText>Gênero</FormControlLabelText>
                </FormControlLabel>
                <RadioGroup>
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
                  <FormControlErrorText>{errors.celular?.message}</FormControlErrorText>
                </FormControlError>
              </FormControl>
            </Box>
            <Box>
              <FormControl isRequired isInvalid={"estado" in errors}>
                <FormControlLabel>
                  <FormControlLabelText>
                    Estado
                  </FormControlLabelText>
                </FormControlLabel>
                <Select>
                  <SelectTrigger>
                    <SelectInput placeholder="Selecione um estado"/>
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
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>{errors.estado?.message}</FormControlErrorText>
                </FormControlError>
              </FormControl>
            </Box>
            <Box>
              <FormControl isRequired isInvalid={"cidade" in errors}>
                <FormControlLabel>
                  <FormControlLabelText>
                    Cidade
                  </FormControlLabelText>
                </FormControlLabel>
                <Select>
                  <SelectTrigger>
                    <SelectInput placeholder="Selecione uma cidade"/>
                    <SelectIcon mr="$3">
                      <Icon as={ChevronDownIcon} />
                    </SelectIcon>
                  </SelectTrigger>
                  <SelectPortal>

                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <SelectItem label="BAURU" value="1" />
                    </SelectContent>

                  </SelectPortal>
                </Select>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>{errors.cidade?.message}</FormControlErrorText>
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
                  <FormControlErrorText>{errors.cep?.message}</FormControlErrorText>
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
                  <FormControlErrorText>{errors.endereco?.message}</FormControlErrorText>
                </FormControlError>
              </FormControl>
            </Box>
            <Box>
              <FormControl w="80%" isRequired isInvalid={"numero_endereco" in errors}>
                <FormControlLabel>
                  <FormControlLabelText>Número</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <Controller
                    control={control}
                    name="numero_endereco"
                    defaultValue={""}
                    render={({ field: { onChange, value } }) => (
                      <InputField type="text" onChangeText={onChange}/>
                    )}
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>{errors.numero_endereco?.message}</FormControlErrorText>
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
                  <FormControlErrorText>{errors.bairro?.message}</FormControlErrorText>
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
                <RadioGroup>
                    <Radio value="1">
                      <RadioIndicator mr="$2">
                        <RadioIcon as={CircleIcon} />
                      </RadioIndicator>
                      <RadioLabel>AMIL</RadioLabel>
                    </Radio>
                    <Radio value="2" mt="$1">
                      <RadioIndicator mr="$2">
                        <RadioIcon as={CircleIcon} />
                      </RadioIndicator>
                      <RadioLabel>UNIMED</RadioLabel>
                    </Radio>
                    <Radio value="3" mt="$1">
                      <RadioIndicator mr="$2">
                        <RadioIcon as={CircleIcon} />
                      </RadioIndicator>
                      <RadioLabel>GNDI</RadioLabel>
                    </Radio>
                    <Radio value="4" mt="$1">
                      <RadioIndicator mr="$2">
                        <RadioIcon as={CircleIcon} />
                      </RadioIndicator>
                      <RadioLabel>BRADESCO SAÚDE</RadioLabel>
                    </Radio>
                    <Radio value="5" mt="$1">
                      <RadioIndicator mr="$2">
                        <RadioIcon as={CircleIcon} />
                      </RadioIndicator>
                      <RadioLabel>OUTROS</RadioLabel>
                    </Radio>
                    <Radio value="6" mt="$1">
                      <RadioIndicator mr="$2">
                        <RadioIcon as={CircleIcon} />
                      </RadioIndicator>
                      <RadioLabel>NÃO TENHO</RadioLabel>
                    </Radio>
                </RadioGroup>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors.plano?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </Box>
            <Box>
              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText>Preencha caso tenha escolhido a opção 'OUTROS'</FormControlLabelText>
                </FormControlLabel>
                <Input isDisabled={true}>
                  <Controller
                    control={control}
                    name="plano"
                    defaultValue={""}
                    render={({ field: { onChange, value } }) => (
                      <InputField
                        type="text"
                        placeholder="Digite um plano"
                      />
                    )}
                  />
                </Input>
              </FormControl>
            </Box>
            <Box>
              <FormControl isRequired isInvalid={"alergia" in errors}>
                <FormControlLabel>
                  <FormControlLabelText>Pussui algum tipo de alergia?</FormControlLabelText>
                </FormControlLabel>
                <RadioGroup>
                  <HStack space="2xl">
                    <Radio value="S">
                      <RadioIndicator mr="$2">
                        <RadioIcon as={CircleIcon} />
                      </RadioIndicator>
                      <RadioLabel>Sim</RadioLabel>
                    </Radio>
                    <Radio value="N">
                      <RadioIndicator mr="$2">
                        <RadioIcon as={CircleIcon} />
                      </RadioIndicator>
                      <RadioLabel>Não</RadioLabel>
                    </Radio>
                  </HStack>
                </RadioGroup>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors.alergia?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </Box>
            <Box>
              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText>Preencha caso tenha alguma alergia</FormControlLabelText>
                </FormControlLabel>
                <Textarea isDisabled={true}>
                  <Controller
                    control={control}
                    name="alergia"
                    defaultValue={""}
                    render={({ field: { onChange, value } }) => (
                      <TextareaInput
                        placeholder="Digite sua alergia"
                      />
                    )}
                  />
                </Textarea>
              </FormControl>
            </Box>
            <Box>
              <FormControl isRequired isInvalid={"medicamento" in errors}>
                <FormControlLabel>
                  <FormControlLabelText>Toma algum medicamento contínuo?</FormControlLabelText>
                </FormControlLabel>
                <RadioGroup>
                  <HStack space="2xl">
                    <Radio value="S">
                      <RadioIndicator mr="$2">
                        <RadioIcon as={CircleIcon} />
                      </RadioIndicator>
                      <RadioLabel>Sim</RadioLabel>
                    </Radio>
                    <Radio value="N">
                      <RadioIndicator mr="$2">
                        <RadioIcon as={CircleIcon} />
                      </RadioIndicator>
                      <RadioLabel>Não</RadioLabel>
                    </Radio>
                  </HStack>
                </RadioGroup>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors.medicamento?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </Box>
            <Box>
              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText>Preencha caso tome algum medicamento contínuo</FormControlLabelText>
                </FormControlLabel>
                <Textarea isDisabled={true}>
                  <Controller
                    control={control}
                    name="medicamento"
                    defaultValue={""}
                    render={({ field: { onChange, value } }) => (
                      <TextareaInput
                        placeholder="Digite seu medicamento"
                      />
                    )}
                  />
                </Textarea>
              </FormControl>
            </Box>
            <Box>
              <FormControl isRequired isInvalid={"cirurgia" in errors}>
                <FormControlLabel>
                  <FormControlLabelText>Já realizou alguma cirurgia?</FormControlLabelText>
                </FormControlLabel>
                <RadioGroup>
                  <HStack space="2xl">
                    <Radio value="S">
                      <RadioIndicator mr="$2">
                        <RadioIcon as={CircleIcon} />
                      </RadioIndicator>
                      <RadioLabel>Sim</RadioLabel>
                    </Radio>
                    <Radio value="N">
                      <RadioIndicator mr="$2">
                        <RadioIcon as={CircleIcon} />
                      </RadioIndicator>
                      <RadioLabel>Não</RadioLabel>
                    </Radio>
                  </HStack>
                </RadioGroup>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors.cirurgia?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </Box>
            <Box>
              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText>Preencha caso já tenha feito alguma cirurgia</FormControlLabelText>
                </FormControlLabel>
                <Textarea isDisabled={true}>
                  <Controller
                    control={control}
                    name="cirurgia"
                    defaultValue={""}
                    render={({ field: { onChange, value } }) => (
                      <TextareaInput
                        placeholder="Digite sua cirurgia"
                      />
                    )}
                  />
                </Textarea>
              </FormControl>
            </Box>
            <Box>
              <FormControl isRequired isInvalid={"comorbidade" in errors}>
                <FormControlLabel>
                  <FormControlLabelText>
                    Comorbidade
                  </FormControlLabelText>
                </FormControlLabel>
                <Select>
                  <SelectTrigger>
                    <SelectInput placeholder="Selecione uma comorbidade"/>
                    <SelectIcon mr="$3">
                      <Icon as={ChevronDownIcon} />
                    </SelectIcon>
                  </SelectTrigger>
                  <SelectPortal>

                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <SelectItem label="ARRITMIAS CARDÍACAS" value="1" />
                      <SelectItem label="CARDIOPATIA HIPERTENSIVA" value="2" />
                      <SelectItem label="CARDIOPATIAS CONGÊNITAS NO ADULTO" value="3" />
                      <SelectItem label="SÍNDROME DE DOWN" value="20" />
                      <SelectItem label="OUTROS" value="21" />
                      <SelectItem label="NÃO TENHO" value="22" />
                    </SelectContent>

                  </SelectPortal>
                </Select>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>{errors.comorbidade?.message}</FormControlErrorText>
                </FormControlError>
              </FormControl>
            </Box>
            <Box>
              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText>Preencha caso tenha escolhido a opção 'OUTROS'</FormControlLabelText>
                </FormControlLabel>
                <Textarea isDisabled={true}>
                  <Controller
                    control={control}
                    name="comorbidade"
                    defaultValue={""}
                    render={({ field: { onChange, value } }) => (
                      <TextareaInput
                        placeholder="Digite sua comorbidade"
                      />
                    )}
                  />
                </Textarea>
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
  