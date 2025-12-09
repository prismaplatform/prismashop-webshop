export interface BlogDto {
  id?: number; // Required for update operations
  title: string;
  slug: string;
  lead: string;
  content: string;
  image: string;
  createDate?: Date;
  modifiedDate?: Date;
  author: string;
}

export interface BlogWrapperDto {
  totalPages: number;
  blogs: BlogDto[];
}
