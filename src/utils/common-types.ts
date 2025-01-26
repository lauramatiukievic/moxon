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
 SIZE = 'pa_size',
 COLOR = 'pa_color'
}


export interface CategoryOption {
  value: number;
  label: string;
  slug: string;
  checked: boolean;
}

export interface Category {
  id: number;
  name: string;
  options: CategoryOption[];
}
export interface AuthUser {
  id: string
  name: string
  token: string
}

export interface LoginResponse {
  login: {
    authToken: string
    user: AuthUser
  }
}

export interface Session {
  accessToken: string
  user: {
    id: string
    name: string
  }
}
