import type { IApi, CreateOrderRequest, ProductsResponse, OrderResponse } from '../../types/index.ts';

export class WebLarekApi {
    constructor(private api: IApi) {
        this.api = api;
    }

    getProducts(): Promise<ProductsResponse> {
        return this.api.get<ProductsResponse>('/product/')
    }

    postOrder(data: CreateOrderRequest) {
        this.api.post<OrderResponse>('/order/', data)
    }
}