export type UserType = {
    name: string;
    id: number;
    uid: string;
    email: string;
    emailVerified: "Y" | "N";
    balance?: number;
};

export type AuthResponse = {
    message: string;
    user: UserType;
    authorization: string;
    expiresIn: number;
};
