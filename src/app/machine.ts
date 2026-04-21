import { User } from "./user";

export interface Machine {
  id: string;
  name: string;
  description: string;
  owner?: User; 
}