import * as SecureStore from "expo-secure-store";
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContextType, UserContextValue } from "../types/user";

export const UserContext = createContext<UserContextValue | undefined>(
  undefined
);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userContext, setUserContext] = useState<UserContextType>({
    email: null,
    token: null,
  });

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const storedData = await AsyncStorage.multiGet(["email"]);

        const userInfo = Object.fromEntries(storedData);

        let storedToken = null;

        if (Platform.OS !== "web") {
          storedToken = await SecureStore.getItemAsync("token");
        }

        console.log("Loaded Token:", storedToken);

        setUserContext((prev) => ({
          ...prev,
          email: userInfo.email || null,
          token: storedToken || prev.token,
        }));
      } catch (error) {
        console.error("Error retrieving user context: ", error);
      }
    };

    loadUserInfo();
  }, []);

  useEffect(() => {
    const saveUserInfo = async () => {
      try {
        const userStorageData: [string, string][] = [
          ["email", userContext.email || ""],
          ["token", userContext.token || ""],
        ];

        await AsyncStorage.multiSet(userStorageData);

        if (Platform.OS !== "web") {
          if (userContext.token) {
            await SecureStore.setItemAsync("token", userContext.token);
          } else {
            await SecureStore.deleteItemAsync("token");
          }
        }
      } catch (error) {
        console.error("Error saving user context: ", error);
      }
    };

    saveUserInfo();
  }, [userContext]);

  return (
    <UserContext.Provider value={{ userContext, setUserContext }}>
      {children}
    </UserContext.Provider>
  );
};
