import { Routes, Route, Outlet, Navigate, BrowserRouter } from "react-router";
import Login from "./features/Auth/Login";
import Register from "./features/Auth/Register";
import { useAuthContext } from "./context/AuthContext";
import MainLayout from "./features/MainLayout";

const PrivateRoutes = () => {
	const { token, isAuthenticated } = useAuthContext();

	return token && isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route element={<PrivateRoutes />}>
					<Route path="/*" element={<MainLayout />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export default App;
