export interface UserDetailsDto {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string | null;
  profilePhoto: string;
  position: string;
  isActive: boolean;
}

export interface EmployerDetailsDto {
  employerId: number;
  businessName: string;
  registrationNo: string;
  websiteUrl: string | null;
  companySize: string;
  employerLogo: string;
  address: string;
  postCode: string;
  vat: string;

  city: string;
  state: string;
  country: string;

  jobSectorId: number;
  jobSectorName: string;

  user: UserDetailsDto;
}
