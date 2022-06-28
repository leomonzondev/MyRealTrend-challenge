export interface IProduct {
    id?: number;
    thumbnail?: string;
    img?: string;

    title: string;
    price: number;
}

export interface ICard {
    image?:string;
    title: string;
    description: string;
}