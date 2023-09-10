const maskCep = (v: string) => {
    v = v.replace(/\D/g, ""); //Remove tudo o que não é dígito
    v = v.replace(/(\d{5})(\d)/, "$1-$2"); //Coloca um traço entre a quinta e a sexto dígitos

    return v;
  };
  
  export default maskCep;
  