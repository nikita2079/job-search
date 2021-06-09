export class User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    status: string;
    phone?: string;
    access_token?: string;
    user: {
        email: string;
        id: string;
    };
}
