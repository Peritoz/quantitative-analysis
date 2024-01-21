import ModelElement from '@libs/model/model_element';

export default class Resource extends ModelElement {
  capacity: number;

  constructor(data: { name: string; capacity?: number }) {
    super(data.name);

    if (data.capacity !== undefined && data.capacity > 0) {
      this.capacity = data.capacity;
    } else {
      this.capacity = 1;
    }
  }

  getCapacity(): number {
    return this.capacity;
  }

  setCapacity(capacity: number): void {
    if (capacity > 0) {
      this.capacity = capacity;
    } else {
      throw new Error(`Resource ${this.getName()} capacity should be greater than 0`);
    }
  }
}
