import DeleteIcon from "@mui/icons-material/Delete";
import CustomCard from "../../components/Card";
import { IconButton } from "@mui/material";
import { useAssignmentContext } from "../../context/AssignmentContext";
import { useEffect, useState } from "react";

import { Canvasser } from "../../utils/types";

interface CanvasserCardProps {
	canvasser: Canvasser;
	onDelete: (id: string) => void;
	setOpen: () => void;
}

const CanvasserCard = ({ canvasser, onDelete }: CanvasserCardProps) => {
	const { assignments } = useAssignmentContext();

	const [numberOfAssignments, setNumberOfAssignments] = useState(0);

	useEffect(() => {
		const assignedRegions = assignments.filter(
			(a) => a.canvasserId === canvasser.id
		);
		setNumberOfAssignments(assignedRegions.length);
	}, [assignments]);

	return (
		<CustomCard
			title={`${canvasser.firstName} ${canvasser.lastName}`}
			description={canvasser.email}
			content={`Regions: ${numberOfAssignments}`}
			sx={{ "&:hover": { cursor: "pointer" } }}
			actionElement={
				<IconButton
					color="error"
					onClick={(e) => {
						e.stopPropagation();
						onDelete(canvasser.id);
					}}
				>
					<DeleteIcon />
				</IconButton>
			}
		/>
	);
};

export default CanvasserCard;
