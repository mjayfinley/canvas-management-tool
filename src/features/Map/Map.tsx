import { Box } from "@mui/material";
import Canvassers from "../Canvassers/Canvassers";

const MapInterface = () => {
	return (
		<Box sx={{ display: "flex", height: "90vh" }}>
			<Canvassers />
			<Box flex={1} ml={2}>
				Map
			</Box>
		</Box>
	);
};

export default MapInterface;
