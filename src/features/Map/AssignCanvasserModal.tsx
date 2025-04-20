import { useAssignmentContext } from "../../context/AssignmentContext";
import { useCanvassersContext } from "../../context/CanvassersContext";
import { useState, useEffect } from "react";
import CustomModal from "../../components/Modal";
import CustomSelect from "../../components/Select";

interface Props {
	open: boolean;
	onClose: () => void;
	regionId: string | null;
}

const AssignCanvasserModal = ({ open, onClose, regionId }: Props) => {
	const { canvassers } = useCanvassersContext();
	const { getCanvassersForRegion, assignCanvasser, unassignCanvasser } =
		useAssignmentContext();

	const [selected, setSelected] = useState<string[]>([]);

	useEffect(() => {
		if (regionId) {
			setSelected(getCanvassersForRegion(regionId));
		}
	}, [regionId]);

	const handleSave = async () => {
		if (!regionId) return;

		const current = getCanvassersForRegion(regionId);
		const toAdd = selected.filter((id) => !current.includes(id));
		const toRemove = current.filter((id) => !selected.includes(id));

		await Promise.all(toAdd.map((id) => assignCanvasser(regionId, id)));
		await Promise.all(
			toRemove.map((id) => unassignCanvasser(regionId, id))
		);

		onClose();
	};

	return (
		<CustomModal
			open={open}
			onClose={onClose}
			title="Assign Canvassers"
			content={
				<CustomSelect
					label="Canvassers"
					options={canvassers}
					sx={{ pt: 1 }}
					value={canvassers.filter((c) => selected.includes(c.id))}
					onChange={(newSelected) =>
						setSelected(newSelected.map((v) => v.id))
					}
					getOptionLabel={(option) =>
						`${option.firstName} ${option.lastName}`
					}
				/>
			}
			onConfirm={handleSave}
			confirmText="Save"
		/>
	);
};

export default AssignCanvasserModal;
