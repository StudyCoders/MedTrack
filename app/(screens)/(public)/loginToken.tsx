import { Box } from "@gluestack-ui/themed";
import { Spinner } from "@gluestack-ui/themed";
import api from "../../api/axios";
import { useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginToken() {
  useEffect(() => {
    const singInToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        try {
          const response = await api.get("/sessao.php", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const existeForm = response["data"].data.existe_form;

          if (existeForm) {
            router.replace("home");
          } else {
            router.push({
              pathname: 'userForm',
              params: {
                formularioPendente: true,
              },
            });
          }
        } catch (e) {
          router.replace("login");
        }
      } else {
        router.replace("login");
      }
    };

    singInToken();
  }, []);

  return (
    <Box flex={1} justifyContent="center" alignItems="center" bg="white">
      <Spinner size="large" />
    </Box>
  );
}
