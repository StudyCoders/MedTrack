import { Box } from "@gluestack-ui/themed";
import { ScrollView } from "react-native";
import React from "react";
import FormUsuario from "../components/form/FormUsuario";

export default function Formulario() {
  return (
    <ScrollView>
      <FormUsuario />
    </ScrollView>
  );
}
