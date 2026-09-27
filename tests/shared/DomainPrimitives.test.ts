import { describe, it, expect } from "vitest";
import { BaseEntity } from "@/shared/domain/BaseEntity";
import { ValueObject } from "@/shared/domain/ValueObject";

class TestUser extends BaseEntity<string> {
  constructor(id: string, public name: string, createdAt?: Date, updatedAt?: Date) {
    super(id, createdAt, updatedAt);
  }
}

interface AddressProps {
  street: string;
  city: string;
  details?: { zip: string };
}

class Address extends ValueObject<AddressProps> {
  constructor(props: AddressProps) {
    super(props);
  }
}

describe("BaseEntity", () => {
  it("should initialize with id and timestamps", () => {
    const user = new TestUser("user-1", "Kenji");
    expect(user.id).toBe("user-1");
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it("should recognize equality based on id and entity type", () => {
    const user1 = new TestUser("user-1", "Kenji");
    const user2 = new TestUser("user-1", "Different Name");
    const user3 = new TestUser("user-2", "Kenji");

    expect(user1.equals(user2)).toBe(true);
    expect(user1.equals(user3)).toBe(false);
    expect(user1.equals(undefined)).toBe(false);
  });
});

describe("ValueObject", () => {
  it("should recognize deep equality of properties", () => {
    const addr1 = new Address({ street: "Kyoto St", city: "Tokyo", details: { zip: "100-0001" } });
    const addr2 = new Address({ street: "Kyoto St", city: "Tokyo", details: { zip: "100-0001" } });
    const addr3 = new Address({ street: "Osaka St", city: "Tokyo", details: { zip: "100-0001" } });

    expect(addr1.equals(addr2)).toBe(true);
    expect(addr1.equals(addr3)).toBe(false);
    expect(addr1.equals(undefined)).toBe(false);
  });

  it("should freeze or preserve props", () => {
    const props = { street: "Kyoto St", city: "Tokyo" };
    const addr = new Address(props);
    expect(addr.props).toEqual(props);
  });
});
