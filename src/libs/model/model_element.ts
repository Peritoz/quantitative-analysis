export default class ModelElement {
  name: string = 'UNKNOWN';

  constructor(name: string) {
    this.name = name.toUpperCase();
  }

  getName(): string {
    return this.name;
  }
}
