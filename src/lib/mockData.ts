export type OrderStatus = 'paid' | 'in_transit' | 'delivered';

export const mockOrders = [
  {
    id: 'SP-10234',
    date: '2026-01-10',
    status: 'paid' as OrderStatus,
    total: 129.99,
  },
  {
    id: 'SP-10212',
    date: '2026-01-06',
    status: 'in_transit' as OrderStatus,
    total: 89.5,
  },
  {
    id: 'SP-10198',
    date: '2025-12-28',
    status: 'delivered' as OrderStatus,
    total: 214.0,
  },
  {
    id: 'SP-10177',
    date: '2025-12-18',
    status: 'delivered' as OrderStatus,
    total: 64.99,
  },
];

export const mockFavorites = [
  {
    id: 'fav-1',
    name: 'Zapatillas Urban Motion',
    price: 84.99,
    image: 'https://source.unsplash.com/600x600/?sneakers',
  },
  {
    id: 'fav-2',
    name: 'Camiseta Tecnica Dry-Fit',
    price: 34.99,
    image: 'https://source.unsplash.com/600x600/?sports-shirt',
  },
  {
    id: 'fav-3',
    name: 'Mochila Deportiva 30L',
    price: 39.99,
    image: 'https://source.unsplash.com/600x600/?sports-backpack',
  },
  {
    id: 'fav-4',
    name: 'Gorra Deportiva Ajustable',
    price: 19.99,
    image: 'https://source.unsplash.com/600x600/?sport-cap',
  },
];

export const mockSales = [
  { month: 'Ago', value: 8200 },
  { month: 'Sep', value: 10400 },
  { month: 'Oct', value: 9800 },
  { month: 'Nov', value: 12300 },
  { month: 'Dic', value: 15100 },
  { month: 'Ene', value: 13200 },
];

export const mockAdminOrders = [
  {
    id: 'AD-3021',
    customer: 'Lucia Perez',
    status: 'paid' as OrderStatus,
    total: 189.9,
  },
  {
    id: 'AD-3014',
    customer: 'Mario Silva',
    status: 'in_transit' as OrderStatus,
    total: 259.0,
  },
  {
    id: 'AD-3009',
    customer: 'Agustina Diaz',
    status: 'delivered' as OrderStatus,
    total: 99.5,
  },
];

export const mockLowStock = [
  { id: 'LS-1', name: 'Leggings Training High-Rise', stock: 4 },
  { id: 'LS-2', name: 'Top Deportivo Seamless', stock: 6 },
  { id: 'LS-3', name: 'Zapatillas Trail Xtreme', stock: 3 },
];
