import DeleteIcon from "@mui/icons-material/Delete";
import { Canvasser } from "../../context/CanvassersContext";
import CustomCard from "../../components/Card";
import { IconButton, Typography } from "@mui/material";
import { useAssignmentContext } from "../../context/AssignmentContext";
import { useEffect, useState } from "react";

interface CanvasserCardProps {
	canvasser: Canvasser;
	onDelete: (id: string) => void;
}

const CanvasserCard = ({ canvasser, onDelete }: CanvasserCardProps) => {
	const { assignments } = useAssignmentContext();
	const [numberOfAssignments, setNumberOfAssignments] = useState(0);

	useEffect(() => {
		const assignedRegions = assignments.filter(
			(a) => a.userId === canvasser.id
		);
		setNumberOfAssignments(assignedRegions.length);
	}, []);

	console.log(numberOfAssignments);

	return (
		<CustomCard
			title={canvasser.name}
			description={canvasser.email}
			content={`Regions: ${numberOfAssignments}`}
			actionElement={
				<IconButton
					color="error"
					onClick={() => onDelete(canvasser.id)}
				>
					<DeleteIcon />
				</IconButton>
			}
		/>
	);
};

export default CanvasserCard;
