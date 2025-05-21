export type UserType = {
    name: string;
    id: number;
    username: string;
    email: string;
    emailVerified: "Y" | "N";
    balance?: number;
    status?: string;
};

export type AuthResponse = {
    message: string;
    user: UserType;
    authorization: string;
    expiresIn: number;
    emailVerified: "Y" | "N";
};
