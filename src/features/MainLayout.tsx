import { Route, Routes } from "react-router";
import Layout from "../components/Layout";
import MapContainer from "./Map/MapContainer";
import Dashboard from "./Dashboard/Dashboard";

const MainLayout = () => {
	return (
		<Layout>
			<Routes>
				<Route path="/" element={<MapContainer />} />
				<Route path="/map" element={<MapContainer />} />
				<Route path="/dashboard" element={<Dashboard />} />
			</Routes>
		</Layout>
	);
};

export default MainLayout;
