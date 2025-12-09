export interface LinkItem {
  id: number;
  name: string;
  link: string;
  content: string | null;
  priority: number;
  slug: string | null;
}

export interface PaymentServiceDto {
  serviceName: string;
  link: string;
}
