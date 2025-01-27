import { Timestamp } from "firebase/firestore";

export interface UserData {
  uid: string;
  username?: string;
  email: string;
  createdAt?: Date;
}

export interface Journal {
  id?: string;
  userId: string;
  title: string;
  content: string;
  textContent: string;
  createdAt: Timestamp | Date;
}
export interface SignInForm {
  email: string;
  password: string;
}

export interface ProfileUpdationData {
  spotifyAccessToken?: string;
  email?: string;
  username?: string;
}
