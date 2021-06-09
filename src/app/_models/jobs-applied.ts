export class JobsApplied {
  constructor(
    public id: string,
    public jobId: string,
    public userId: string,
    public jobTitle: string,
    public jobImage: string,
    public firstName: string,
    public lastName: string,
    public guestNumber: number,
    public bookedFrom: Date,
    public bookedTo: Date
  ) {}
}
