export interface AboutPageSectionDto {
  id: number;
  name: string;
  priority: string;
  layout: AboutSectionLayoutEnum;
  aboutPageContents: AboutPageContentDto[];
}

export interface AboutPageContentDto {
  id: number;
  title: string;
  lead: string;
  priority: number;
  type: string;
  text: string;
  image: string;
  video: string;
  section: AboutPageSectionDto;
}

export enum AboutSectionLayoutEnum {
  HERO = "HERO",
  GRID = "GRID",
  SINGLE = "SINGLE",
}
