import { faker } from '@faker-js/faker';

export function fakePhone(): string {
  return `0${faker.string.numeric(9)}`;
}
