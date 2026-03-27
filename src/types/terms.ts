export const TermsType = {
  EmploymentOffer: "EmploymentOffer",
  NDA: "NDA",
  ContractorAgreement: "ContractorAgreement",
  PrivacyPolicy: "PrivacyPolicy",
  CodeOfConduct: "CodeOfConduct",
  RemoteWorkPolicy: "RemoteWorkPolicy",
  Other: "Other",
} as const;

export type TermsType = typeof TermsType[keyof typeof TermsType];

export interface Terms {
  termsId: number;
  termsType: TermsType;
  title: string;
  content: string;
  version: number;
  employerId?: number | null;
  isActive: boolean;
  createdByUserId?: number | null;
  createdByName?: string;
  dateCreated: string;
}

export interface CreateTermsDto {
  termsType: TermsType;
  title: string;
  content: string;
  employerId?: number | null;
  createdByUserId?: number | null;
  createdByName?: string;
  isActive: boolean;
}

export interface UpdateTermsDto {
  termsId: number;
  title: string;
  content: string;
  isActive: boolean;
}
