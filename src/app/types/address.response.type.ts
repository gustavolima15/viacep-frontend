export type AddressResponse = {
  id: number;
  postalCode: string;
  street: string;
  location: string;
  locationType: string;
  neighborhood: string;
  streetType: number;
  number: string;
  block: string;
  lot: string;
  complement: string;
  city: {
    id: number;
    name: string;
  };
  state: {
    id: number;
    name: string;
  };
  isMainAddress: boolean;
};
