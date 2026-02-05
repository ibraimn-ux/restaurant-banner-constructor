
export interface BannerState {
  restaurantName: string;
  expirationDate: string;
  discountPercentage: string;
  discountType: string;
  dishName: string;
  priceWithDiscount: string;
  originalPrice: string;
  bgImage: string;
  bgScale: number;
  bgPosition: { x: number; y: number };
}

export const INITIAL_STATE: BannerState = {
  restaurantName: "Afsona Aktobe",
  expirationDate: "до 21 октября",
  discountPercentage: "-30",
  discountType: "на все меню",
  dishName: "Плов «Праздничный»",
  priceWithDiscount: "3.003₸",
  originalPrice: "4.290₸",
  bgImage: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
  bgScale: 1.2,
  bgPosition: { x: 0, y: 0 }
};
