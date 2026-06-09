export interface NewUser {
  name: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobile: string;
}

/**
 * Builds a unique user per run so registration tests are idempotent and never
 * collide with an existing account. Override any field via `overrides`.
 */
export function buildUser(overrides: Partial<NewUser> = {}): NewUser {
  const unique = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return {
    name: 'QA Tester',
    email: `qa.tester+${unique}@example.com`,
    password: 'Sokin#Test123',
    firstName: 'QA',
    lastName: 'Tester',
    birthDay: '15',
    birthMonth: '6',
    birthYear: '1990',
    address: '221B Baker Street',
    country: 'United States',
    state: 'London',
    city: 'London',
    zipcode: 'NW16XE',
    mobile: '5551234567',
    ...overrides,
  };
}
