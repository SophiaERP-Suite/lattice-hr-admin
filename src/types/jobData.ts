export interface JobData {
  jobId: number;
  jobTitle: string;
  jobDescription: string;
  employerId: string;
  employer: string;
  jobSectorId: string;
  jobSector: string;
  jobTypeId: string;
  jobType: string;
  countryId: string;
  country: string;
  stateId: string;
  state: string;
  cityId: string;
  city: string;
  published: boolean
  publishedDate: string;
  dateCreated: string;
  jobExpiration: string;
  jobAmount: string;
  totalApplications: number;
  jobResponsibility: string;
  jobRequirement: string;
  jobCategoryId: string;
  jobCategory: string;
  isPaid: string;
  workModeId: string;
  workMode: string;
  jobViewScope: string;
  grade: string;
  hasInterview: boolean;
  jobPhoto: string;
}

export interface JobFormData {
  JobTitle: string;
  JobDescription: string;
  EmployerId: string;
  JobSectorId: string;
  JobTypeId: string;
  CountryId: string;
  StateId: string;
  CityId: string;
  JobExpiration: string;
  JobAmount: string;
  JobResponsibility: string;
  JobRequirement: string;
  JobCategoryId: string;
  HasInterview: boolean;
  IsPaid: string;
  WorkModeId: string;
  JobViewScope: string;
  Grade: string;
  JobPhoto: string;
}



export interface EmployerData {
  employerId: number;
  businessName: string;
  jobSectorId: string;
  jobSector: string;
  companySize: string;
  registrationNo: string;
  websiteUrl: string;
  employerLogo: string;
  countryId: string;
  country: string;
  packageId: string;
  package: string;
  packageItemReference: string;
  stateId: string;
  state: string;
  cityId: string;
  city: string;
  address: string;
  postCode: string;
  dateCreated: string;
  officers: string;
}

export interface JobSectorData {
  jobSectorId: number;
  name: string;
}

export interface JobTypeData {
  jobTypeId: number;
  typeName: string;
}

export interface JobFilter {
  jobSectorId: number;
  jobTypeId: number;
  jobTitle: string;
}

export interface JobCategoryData {
  jobCategoryId: number;
  jobSector: string;
  jobSectorId: string;
  isEnabled: boolean;
  categoryName: string;
}

export interface WorkModeData {
  workModeId: number;
  isEnabled: boolean;
  modeName: string;
}