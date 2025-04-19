import { Route, Routes } from "react-router";
import Layout from "../components/Layout";
import Dashboard from "./Dashboard/Dashboard";
import Canvassers from "./Canvassers/Canvassers";
import { Box } from "@mui/material";
import MapInterface from "./Map/MapInterface";

const MainLayout = () => {
	return (
		<Layout>
			<Box sx={{ display: "flex", height: "90vh", width: "100%", mt: 1 }}>
				<Canvassers />
				<Box flex={1} ml={1} mr={1}>
					<Routes>
						<Route path="/" element={<MapInterface />} />
						<Route path="/map" element={<MapInterface />} />
						<Route path="/dashboard" element={<Dashboard />} />
					</Routes>
				</Box>
			</Box>
		</Layout>
	);
};

export default MainLayout;
