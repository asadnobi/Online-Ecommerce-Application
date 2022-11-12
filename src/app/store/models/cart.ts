export interface CartModel {
    product_id: number,
    name: string,
    short_desc?: string,
    brand_id?: number,
    brand_name?: string,
    image?: string,
    regular_price: number,
    discount_price: number,
    quantity: number,
    product_in: number,
    product_type: string,
    colour?: any,
    size?: any
}