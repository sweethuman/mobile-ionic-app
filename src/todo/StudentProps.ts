export const EmptyStudent = {
  name: "",
  faculty: "",
  email: "",
  phoneNumber: "",
  photoUrl: ""
};


export interface StudentProps {
  id?: string;
  name: string;
  email: string;
  faculty: string;
  phoneNumber: string;
  photoUrl: string;
}
