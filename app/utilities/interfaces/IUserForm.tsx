export default interface IUserForm {
  id_formulario?:           number;
  id_usuario?:              number;
  id_contato?:              null;
  dt_nascimento?:           string;
  tp_sexo?:                 string;
  cep?:                     string;
  endereco?:                string;
  bairro?:                  string;
  complemento?:             string;
  id_cidade?:               number;
  telefone?:                string;
  celular?:                 string;
  id_plano?:                number;
  ds_plano?:                string;
  alergia?:                 string;
  ds_alergia?:              string;
  id_comorbidade?:          number;
  ds_comorbidade?:          string;
  medicamento_continuo?:    string;
  ds_medicamento_continuo?: string;
  cirurgia?:                string;
  ds_cirurgia?:             string;
}