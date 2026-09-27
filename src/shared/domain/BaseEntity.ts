export abstract class BaseEntity<TId> {
  public readonly id: TId;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(id: TId, createdAt?: Date, updatedAt?: Date) {
    this.id = id;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
  }

  public equals(other?: BaseEntity<TId>): boolean {
    if (other === null || other === undefined) {
      return false;
    }

    if (!(other instanceof BaseEntity)) {
      return false;
    }

    return this.id === other.id;
  }
}
