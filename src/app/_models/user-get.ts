export class GetUser {
    constructor(
        public id: string,
        public first_name: string,
        public last_name: string,
        public email: string,
        public status: string,
        public phone: string,
    ) {}
}
