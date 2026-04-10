export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
export type TPayment = 'card'|'cash'

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
    id: string;
    description: string;
    title: string;
    image: string;
    category: string;
    price: number|null;
}

export interface IBuyer {   
    payment: TPayment;
    address: string;
    email: string;
    phone: string;
}

export interface ICatalogCard {
    title: string;
    image: string;
    category: string;
    price: number | null;
}

export interface IOpenedCard {
    title: string;
    image: string;
    category: string
    description: string;
    price: number | null;
}

export interface IBasketCard {
    title: string;
    price: number;
}

export interface IPaymentDeliveryForm {
    payment: TPayment;
    deliveryAddress: string;
}

export type ProductsResponse = {
    total: number,
    items: IProduct[]
}

export type CreateOrderRequest = IBuyer & {total: number, items: string[]};

export type OrderResponse = {
    id: string;
    total: number;
}

export type IPaymentDelivery = {
  payment: TPayment;
  address: string;
}

export type IPhoneEmail = {    
    email: string;
    phone: string;
}