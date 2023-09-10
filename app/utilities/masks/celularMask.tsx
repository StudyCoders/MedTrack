const maskCelular = (v: string) => {
    v = v.replace(/\D/g, ""); //Remove tudo o que não é dígito
    v = v.replace(/(\d{1})(\d)/, "($1$2) "); //Deixa entre parênteses os dois primeiros dígitos
    v = v.replace(/(\d{5})(\d)/, "$1-$2"); //Coloca um traço entre o quinto e sexto número do celular

    return v;
  };
  
  export default maskCelular;