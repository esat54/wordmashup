import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
    user: any;
    isTester: boolean;
    isLoggedIn: boolean;
    ready: boolean;
    login: (userData: any, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isTester: false,
    isLoggedIn: false,
    ready: false,
    login: () => { },
    logout: () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        try {
            const token = localStorage.getItem("token");
            const userData = localStorage.getItem("user");
            if (token && userData) {
                setUser(JSON.parse(userData));
            }
        } catch (e) { }
        setReady(true);
    }, []);

    const login = (userData: any, token: string) => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
    };

    const isTester = user?.email === "tester@gmail.com";
    const isLoggedIn = !!user && !isTester;

    return (
        <AuthContext.Provider value={{ user, isTester, isLoggedIn, ready, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
