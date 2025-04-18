import { Autocomplete, TextField, Chip } from "@mui/material";
import { useAssignmentContext } from "../../context/AssignmentContext";
import { useCanvassers } from "../../context/CanvassersContext";
import { useState, useEffect } from "react";
import CustomModal from "../../components/Modal";

interface Props {
	open: boolean;
	onClose: () => void;
	polygonId: string | null;
}

const AssignCanvasserModal = ({ open, onClose, polygonId }: Props) => {
	const { canvassers } = useCanvassers();
	const { getUsersForPolygon, assignUser, unassignUser } =
		useAssignmentContext();

	const [selected, setSelected] = useState<string[]>([]);

	useEffect(() => {
		if (polygonId) {
			setSelected(getUsersForPolygon(polygonId));
		}
	}, [polygonId]);

	const handleSave = async () => {
		if (!polygonId) return;

		const current = getUsersForPolygon(polygonId);
		const toAdd = selected.filter((id) => !current.includes(id));
		const toRemove = current.filter((id) => !selected.includes(id));

		await Promise.all(toAdd.map((id) => assignUser(polygonId, id)));
		await Promise.all(toRemove.map((id) => unassignUser(polygonId, id)));

		onClose();
	};

	return (
		<CustomModal
			open={open}
			onClose={onClose}
			title="Assign Canvassers"
			content={
				<Autocomplete
					sx={{ height: "60px" }}
					multiple
					options={canvassers}
					getOptionLabel={(option) => option.name}
					value={canvassers.filter((c) => selected.includes(c.id))}
					onChange={(_, newVal) =>
						setSelected(newVal.map((v) => v.id))
					}
					renderValue={(value, getTagProps) =>
						value.map((option, index) => (
							<Chip
								label={option.name}
								{...getTagProps({ index })}
								key={option.id}
							/>
						))
					}
					renderInput={(params) => (
						<TextField {...params} placeholder="Canvassers" />
					)}
				/>
			}
			onConfirm={handleSave}
			confirmText="Save"
		/>
	);
};

export default AssignCanvasserModal;
