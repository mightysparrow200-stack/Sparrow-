// Simple in-memory shared database for development
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image: string; // Emoji or image URL
  vendorName: string;
}

export let marketplaceProducts: Product[] = [
  {
    id: "PROD-101",
    name: "Cooperative Rice Scheme - 25kg",
    category: "Groceries",
    price: 30000,
    stock: 42,
    description: "Premium parboiled rice distributed directly through the cooperative network.",
    image: "🌾",
    vendorName: "Mighty Sparrow Agribusiness"
  },
  {
    id: "PROD-102",
    name: "Premium Member Polo Shirt (L)",
    category: "Apparel",
    price: 15000,
    stock: 12,
    description: "Official customized high-quality cotton polo shirt for cooperative alumni.",
    image: "👕",
    vendorName: "Alumni Merch Desk"
  }
];

export const addProduct = (product: Omit<Product, 'id'>) => {
  const newProduct = {
    ...product,
    id: `PROD-${Math.floor(1000 + Math.random() * 9000)}`
  };
  marketplaceProducts.unshift(newProduct); // Add to the top of the list
  return newProduct;
};
