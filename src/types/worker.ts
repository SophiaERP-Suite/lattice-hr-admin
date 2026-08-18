export interface WorkerData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  designation: string;
  email: string;
  phone: string;
  profilePhoto: string;
  joinDate: string;
  countryId: string;
  country: string;
  stateId: string;
  state: string;
  cityId: string;
  city: string;
  dateCreated: string;
  userId: number;
  workerId: number;
  employer: string;
  employerId: number;
  employerLogo: string;
  address: string;
  postCode: string;
}

export interface WorkerRegister {
  FirstName: string
  LastName: string
  Email: string
  Phone: string
  Address: string
  CountryId: string
  StateId: string
  CityId: string
  PostCode: string
  Password: string
  Gender: string
  ProfilePhoto: string
  DateOfBirth: string
  EmployerId: string
  Designation: string
  JoinDate: string
  ConfirmPassword: string;
}

export interface EmployerData {
  employerId: number;
  businessName: string;
}