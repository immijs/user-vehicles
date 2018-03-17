import { Owner } from "./owner.model";
import { Vehicle } from "./vehicle.model";

export class User {
    public userid: number;
    public owner: Owner;
    public vehicles: Vehicle[];
}