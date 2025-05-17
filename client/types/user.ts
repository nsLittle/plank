export interface UserContextType {
  email: string | null;
  token: string | null;
}

export interface UserContextValue {
  userContext: UserContextType;
  setUserContext: React.Dispatch<React.SetStateAction<UserContextType>>;
}
