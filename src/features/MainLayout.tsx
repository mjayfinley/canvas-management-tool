import { Route, Routes } from "react-router";
import Layout from "../components/Layout";
import Dashboard from "./Dashboard/Dashboard";
import { Box } from "@mui/material";
import MapInterface from "./Map/MapInterface";

const MainLayout = () => {
	return (
		<Layout>
			<Box display="flex">
				<Routes>
					<Route path="/" element={<MapInterface />} />
					<Route path="/map" element={<MapInterface />} />
					<Route path="/dashboard" element={<Dashboard />} />
				</Routes>
			</Box>
		</Layout>
	);
};

export default MainLayout;
