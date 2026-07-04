    export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
    }

    export interface JwtPayload {
        id: string;
        email: string;
    }

    export interface AuthToken {
        accessToken: string;
        refreshToken: string;
    }

