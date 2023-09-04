import { API_URL, useAuth } from "../context/AuthContext";
import { Box, Text } from "@gluestack-ui/themed";
import { useEffect } from "react";
import axios from "axios";

export default function Profile() {
  const { authState } = useAuth();

  useEffect(() => {
    const sessionInfo = async () => {
      const res = await axios.get(`${API_URL}/sessao.php`);
      console.log("Dados da sessão: ", res.data)
    }
    sessionInfo()
  }, [authState?.authenticated]);

  return (
    <Box>
      <Text>Perfil</Text>
    </Box>
  );
}
