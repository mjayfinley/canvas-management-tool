import { Autocomplete, TextField, Box } from "@mui/material";
import { useAssignmentContext } from "../../context/AssignmentContext";
import { useState } from "react";
import { useCanvassers } from "../../context/CanvassersContext";

interface Props {
	polygonId: string;
}

const AssignCanvasserDropdown = ({ polygonId }: Props) => {
	const { assignUser, unassignUser, getUsersForPolygon } =
		useAssignmentContext();
	const { canvassers } = useCanvassers();
	const assigned = getUsersForPolygon(polygonId);
	const [value, setValue] = useState<string[]>(assigned);

	const handleChange = (event: any, newValue: string[]) => {
		event.preventDefault();
		const added = newValue.filter((id) => !value.includes(id));
		const removed = value.filter((id) => !newValue.includes(id));

		added.forEach((id) => assignUser(polygonId, id));
		removed.forEach((id) => unassignUser(polygonId, id));
		setValue(newValue);
	};

	return (
		<Box sx={{ width: 300 }}>
			<Autocomplete
				multiple
				options={canvassers.map((u) => u.id)}
				getOptionLabel={(id) =>
					canvassers.find((u) => u.id === id)?.name || id
				}
				value={value}
				onChange={handleChange}
				renderInput={(params) => (
					<TextField {...params} label="Assign Canvasser" />
				)}
			/>
		</Box>
	);
};

export default AssignCanvasserDropdown;
