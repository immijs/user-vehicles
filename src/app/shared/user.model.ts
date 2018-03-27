import { Owner } from "./owner.model";
import { Vehicle } from "./vehicle.model";

export class User {
  public userid: number;
  public owner: Owner;
  public vehicles: Vehicle[];

  public vehicleCount() {
    if (this.vehicles == null || this.vehicles.length == 0)
      return 'no vehicles';
    else if (this.vehicles.length == 1)
      return `1 vehicle`;
    else
      return `${this.vehicles.length} vehicles`;
  }

  public vehicleDescription(): string {
    if (this.vehicles == null || this.vehicles.length == 0)
      return '-';
    else
      return this.vehicles.map(v => `${v.make} ${v.model} (${v.year})`).join(', ');
  }
}
