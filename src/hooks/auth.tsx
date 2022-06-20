import React, { createContext, useContext, useState, ReactNode } from "react";
import { Alert } from "react-native";
import auth from "@react-native-firebase/auth";

type AuthContextData = {
  signIn: (email: string, password: string) => Promise<void>;
  isLogging: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [isLogging, seIsLogging] = useState(false);

  async function signIn(email: string, password: string) {
    if (!email || !password) {
      return Alert.alert("Login", "Informe o e-mail e a senha.");
    }
    seIsLogging(true);

    auth()
      .signInWithEmailAndPassword(email, password)
      .then((account) => {
        console.log(account);
      })
      .catch((error) => {
        const { code } = error;

        if (code === "auth/user_not_found" || code === "auth/wrong_password") {
          return Alert.alert("Login", "E-mail ou senha Inválido.");
        } else {
          return Alert.alert("Login", "Não foi possível realizar o login.");
        }
      })
      .finally(() => seIsLogging(false));
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        isLogging,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
