export const ValidationUtil = {
    validateName: (text: string) => {
        if (!text.trim()) throw new Error("Name is required");
        if (text.length < 2)
            throw new Error("Name must be at least 2 characters");
        if (text.length > 50)
            throw new Error("Name must be less than 50 characters");
        if (!text.match(/^[a-zA-Z\s'-]+$/))
            throw new Error(
                "Name can only contain letters, spaces, hyphens and apostrophes"
            );
        if (text.match(/\s{4,}/))
            throw new Error("Name cannot contain multiple spaces");
        return true;
    },

    validateUsername: (text: string) => {
        if (text.match(/\s{4,}/))
            throw new Error("Username cannot contain multiple spaces");
        if (text.length < 3)
            throw new Error("Username must be at least 3 characters");
        if (text.length > 20)
            throw new Error("Username must be less than 20 characters");
        if (text.match(/[^a-zA-Z0-9]/))
            throw new Error("Username must contain only letters and numbers");
        return true;
    },

    validateEmail: (text: string) => {
        if (!text.trim()) throw new Error("Email is required");
        if (!text.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
            throw new Error("Please enter a valid email address");
        return true;
    },

    validatePassword: (text: string) => {
        if (!text.trim()) throw new Error("Password is required");
        if (text.length < 8)
            throw new Error("Password must be at least 8 characters");
        if (text.length > 20)
            throw new Error("Password must be less than 20 characters");
        if (text.match(/[^a-zA-Z0-9]/))
            throw new Error("Password must contain only letters and numbers");
        return true;
    },

    validateConfirmPassword: (text: string, password: string) => {
        if (!text) throw new Error("Please confirm your password");
        if (text !== password) throw new Error("Passwords do not match");
        return true;
    },
};
