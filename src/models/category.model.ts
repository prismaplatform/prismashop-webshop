export interface CategoryDto {
  id: number;
  name: string;
  icon: string;
  image?: string;
  description: string;
  slug?: string;
  parentCategory?: CategoryDto;
  childCategories: Array<CategoryDto>;
  selected: boolean;
}

export interface TopCategoryDto {
  id: number;
  name: string;
  icon: string;
  image?: string;
  description: string;
  slug: string;
}
