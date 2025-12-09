export interface ContactDto {
  taxCode: any;
  bankAccount: any;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  tiktok: string;
  tripadvisor: string;
  email: string;
  phone: string;
  address: string;
}

export interface NewContactDto {
  email: string;
  name: string;
  message: string;
}

export interface NewB2BDto {
  CompanyName: string;
  CompanyId: string;
  ContactName: string;
  Email: string;
  Phone: string;
  Country: string;
  OrderVolume: string;
  Message: string;
}

export interface NewMuseumDto {
  ContactPerson: string;
  Email: string;
  PhoneNumber: string;
  PreferredDateTime: string;
  NumberOfPeople: string;
}
