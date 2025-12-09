export interface GoogleMerchantDto {
  context: string;
  type: string;
  name: string;
  url: string;
  image: string;
  category: string;
  offers: OfferDTO;
  brand: LocalBrandDTO;
}

export interface OfferDTO {
  priceCurrency: string;
  price: string;
  sku: string;
  url: string;
}

export interface LocalBrandDTO {
  name: string;
}
