import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
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

const TOKEN_KEY = "token";
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
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

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
      const response = await api.post("/logar.php", JSON.stringify(data));

      setAuthState({
        token: response.data.token,
        authenticated: true,
      });

      api.defaults.headers.common[
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
      "Content-Type": "application/json",
    };

    try {
      return await api.post("/cadastrar.php", JSON.stringify(data), {
        headers,
      });
    } catch (e) {
      return { error: true, msg: (e as any).response.data.erro };
    }
  };

  const logout = async () => {
    try {
      const response = await api.get("/logout.php");

      await AsyncStorage.removeItem(TOKEN_KEY);

      api.defaults.headers.common["Authorization"] = "";

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
