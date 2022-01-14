export const EmptyStudent = {
  name: "",
  faculty: "",
  email: "",
  phoneNumber: "",
  photoUrl: "",
  lat: 46.7524289,
  lng: 23.5872008
};


export interface StudentProps {
  id?: string;
  name: string;
  email: string;
  faculty: string;
  phoneNumber: string;
  photoUrl: string;
  lat: number;
  lng: number;
}
