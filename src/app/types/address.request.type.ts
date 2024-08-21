export type AddressRequest = {
  id?: number;
  postalCode: string;
  street: string;
  location: string;
  locationType: string;
  neighborhood: string;
  streetType?: number;
  number: string;
  block?: string;
  lot?: string;
  complement?: string;
  cityId: number;
  stateId: number;
  isMainAddress?: boolean;
}
