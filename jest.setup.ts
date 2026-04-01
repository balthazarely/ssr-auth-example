// Mock Next.js server-only APIs that throw outside the runtime
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
  notFound: jest.fn(),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}));
