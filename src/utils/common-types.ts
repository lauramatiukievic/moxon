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