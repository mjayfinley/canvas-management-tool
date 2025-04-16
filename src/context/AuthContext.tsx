import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
	token: string | null;
	login: (token: string) => void;
	logout: () => void;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [token, setToken] = useState<string | null>(() => {
		return localStorage.getItem("token");
	});

	const login = (newToken: string) => {
		localStorage.setItem("token", newToken);
		setToken(newToken);
	};

	const logout = () => {
		localStorage.removeItem("token");
		setToken(null);
	};

	const isAuthenticated = !!token;

	return (
		<AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuthContext = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuthContext must be used within an AuthProvider");
	}
	return context;
};
