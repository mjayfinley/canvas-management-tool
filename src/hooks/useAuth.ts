import { useState } from "react";
import { api } from "../utils/constants";
import { filter, isEmpty, matches } from "lodash-es";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";
import useToast from "./useToast";

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

	const { login: saveToken, logout } = useAuthContext();
	const navigate = useNavigate();
	const showToast = useToast();

	const registerUser = async (formData: RegisterFormData) => {
		setLoading(true);

		try {
			const response = await api.post("/users", formData);
			navigate("/login");
			showToast("Successfully Registered, please login", "success");
			return response.data;
		} catch (err: any) {
			showToast("Registration failed", "error");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const loginUser = async (formData: LoginFormData) => {
		setLoading(true);

		try {
			const response = await api.get("/users");

			const user = filter(response.data, matches(formData));

			if (!isEmpty(user)) {
				const token = user[0].id;
				saveToken(token);
				navigate("/map");
				showToast("Successfully Logged In", "success");
			} else {
				throw new Error();
			}

			return;
		} catch (err: any) {
			showToast("Error Logging In", "error");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const logoutUser = () => {
		logout();
	};

	return { registerUser, loginUser, logoutUser, loading };
};

export default useAuth;
