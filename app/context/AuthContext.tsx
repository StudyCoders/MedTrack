import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onLogin?: (data: any) => Promise<any>;
  onRegister?: (data: any) => Promise<any>;
  onLogout?: () => Promise<any>;
}

interface AuthStatePropos {
  token: string | null;
  authenticated: boolean | null;
}

const TOKEN_KEY = "my-jwt";
export const API_URL = "https://tecnoatualizados.com/projetos/tcc/api/metodos";
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<AuthStatePropos>({
    token: null,
    authenticated: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem(TOKEN_KEY);

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        setAuthState({
          token: token,
          authenticated: true,
        });
      }
    };

    loadToken();
  }, []);

  const login = async (data: any) => {
    try {
      const response = await axios.post(
        `${API_URL}/logar.php`,
        JSON.stringify(data)
      );

      setAuthState({
        token: response.data.token,
        authenticated: true,
      });

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      await AsyncStorage.setItem(TOKEN_KEY, response.data.token);

      return response;
    } catch (e) {
      return { error: true, msg: (e as any).response.data.erro };
    }
  };

  const register = async (data: any) => {
    const headers = {
      'Content-Type': 'application/json',
    }

    try {
      return await axios.post(`${API_URL}/cadastrar.php`, JSON.stringify(data), { headers });
    } catch (e) {
      return { error: true, msg: (e as any).response.data.erro };
    }
  };

  const logout = async () => {
    try {
      const response = await axios.get(`${API_URL}/logar.php`);

      await AsyncStorage.removeItem(TOKEN_KEY);

      axios.defaults.headers.common["Authorization"] = "";

      setAuthState({
        token: null,
        authenticated: false,
      });

      return response;
    } catch (e) {
      return { error: true, msg: (e as any).response.data.erro };
    }
  };

  const value = {
    onLogin: login,
    onRegister: register,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
