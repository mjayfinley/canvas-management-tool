import { Route, Routes } from "react-router";
import Layout from "../components/Layout";
import MapInterface from "./Map/Map";
import Dashboard from "./Dashboard/Dashboard";

const MainLayout = () => {
	return (
		<Layout>
			<Routes>
				<Route path="/map" element={<MapInterface />} />
				<Route path="/dashboard" element={<Dashboard />} />
			</Routes>
		</Layout>
	);
};

export default MainLayout;
