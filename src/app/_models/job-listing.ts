export class Joblisting {
  constructor(
    public id: string,
    public listing_type_id: string,
    public company_id: string,
    public employer_id: string,
    public location_id: string,
    public title: string,
    public summary: string,
    public description: string,
    public expires: string,
    public status: string,
    public deleted_at: string
  ) {}
}

