import { randomUUID } from 'crypto';
import { Identifier, UUID } from './types';

export type DomainIdentifier<TBrand extends string> = Identifier<UUID> & {
  readonly brand: TBrand;
};

export const createDomainIdentifier = <TBrand extends string>(
  brand: TBrand,
  value?: UUID,
): DomainIdentifier<TBrand> => ({
  value: value ?? randomUUID(),
  brand,
});
