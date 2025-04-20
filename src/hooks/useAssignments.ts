import { RegionUserAssignment } from "../utils/types";
import { api } from "../utils/constants";
import { useState } from "react";
import useToast from "./useToast";

const useAssignments = () => {
	const [assignmentsLoading, setLoading] = useState(false);

	const showToast = useToast();

	const getAssignments = async (): Promise<RegionUserAssignment[]> => {
		setLoading(true);

		try {
			const res = await api.get("/assignments");
			return res.data;
		} catch (err: any) {
			showToast("Failed to get Region Assignments", "error");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const assignCanvasserToRegion = async (
		assignment: RegionUserAssignment
	) => {
		setLoading(true);

		try {
			await api.post("/assignments", assignment);
			showToast("Successfully Assigned Canvassser to Region", "success");
		} catch (err: any) {
			showToast("Failed to assign Canvasser to Region", "error");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const removeCanvasserFromRegion = async (assignmentId: string) => {
		setLoading(true);

		try {
			await api.delete(`/assignments/${assignmentId}`);
			showToast("Successfully Removed Canvassser from Region", "success");
		} catch (err: any) {
			showToast("Failed to delete Canvasser to Region", "error");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return {
		getAssignments,
		assignCanvasserToRegion,
		removeCanvasserFromRegion,
		assignmentsLoading,
	};
};

export default useAssignments;
