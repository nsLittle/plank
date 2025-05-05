export interface UserContextType {
  userName: string | null;
  userId: string | null;
  habitId: string | null;
  habitinput: string | null;
  descriptioninput: string | null;
  teamMemberId: string | null;
  teammemberFirstName: string | null;
  teammemberProfilePic: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  profilePic: string | null;
  token: string | null;
}

export interface UserContextValue {
  userContext: UserContextType;
  setUserContext: React.Dispatch<React.SetStateAction<UserContextType>>;
}
