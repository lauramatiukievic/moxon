export interface Product {
    id: number;
    name: string;
    price: string;
    rating: number;
    reviewCount: number;
    image: Image;
  }

 export interface Image {
    src: string;
    alt: string;
  }

export enum ProductAttributes {
 SIZE = 'pa_size'
}

export interface CategoryOption {
  value: string;
  label: string;
  checked: boolean;
}

export interface Category {
  id: string;
  name: string;
  options: CategoryOption[];
}