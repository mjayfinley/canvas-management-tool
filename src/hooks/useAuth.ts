import { useState } from "react";
import { api } from "../utils/constants";
import { filter, isEmpty, matches } from "lodash-es";
import { useAuthContext } from "../context/AuthContext";

export interface LoginFormData {
	username: string;
	password: string;
}

export interface RegisterFormData {
	username: string;
	email: string;
	password: string;
}

const useAuth = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { login: saveToken, logout } = useAuthContext();

	const registerUser = async (formData: RegisterFormData) => {
		setLoading(true);
		setError(null);

		try {
			const response = await api.post("/users", formData);
			return response.data;
		} catch (err: any) {
			setError(err.response?.data?.message || "Registration failed");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const loginUser = async (formData: LoginFormData) => {
		setLoading(true);
		setError(null);

		try {
			const response = await api.get("/users");

			const user = filter(response.data, matches(formData));

			if (!isEmpty(user)) {
				const token = user[0].id;
				saveToken(token);
			} else {
				setError("Login failed");
				throw new Error("Login failed");
			}

			return;
		} catch (err: any) {
			setError(err.response?.data?.message || "Login failed");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const logoutUser = () => {
		logout();
	};

	return { registerUser, loginUser, logoutUser, loading, error };
};

export default useAuth;
