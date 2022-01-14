export const EmptyStudent = {
  name: "",
  faculty: "",
  email: "",
  phoneNumber: "",
  photoUrl: "",
  lat: 45.65003946990994,
  lng: 25.617588820284645
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
