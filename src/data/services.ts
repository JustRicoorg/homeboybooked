
export type Service = {
  id: number;
  name: string;
  description: string;
  price: number;
}

export const services: Service[] = [
  {
    id: 1,
    name: "Classic Haircut",
    description: "A traditional haircut with clippers and scissors, includes styling.",
    price: 300
  }, 
  {
    id: 2,
    name: "Premium Package",
    description: "Haircut, beard trim, and premium styling with quality products.",
    price: 1000
  }
];
