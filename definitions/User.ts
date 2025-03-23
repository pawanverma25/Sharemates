export type User = {
    name: string;
    id: string;
    uid: string;
    email: string;
    emailVerified: "Y" | "N";
};

export type AuthResponse = {
    message: string;
    user: User;
    authorization: string;
    expiresIn: number;
};
