export class Message {
  public time: Date;

  constructor(public text: string) {
    this.time = new Date();
  }
}
