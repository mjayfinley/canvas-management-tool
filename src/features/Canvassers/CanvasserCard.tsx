import DeleteIcon from "@mui/icons-material/Delete";
import { Canvasser } from "../../context/CanvassersContext";
import CustomCard from "../../components/Card";
import { IconButton } from "@mui/material";

interface CanvasserCardProps {
	canvasser: Canvasser;
	onDelete: (id: string) => void;
}

const CanvasserCard = ({ canvasser, onDelete }: CanvasserCardProps) => {
	return (
		<CustomCard
			title={canvasser.name}
			description={canvasser.email}
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
