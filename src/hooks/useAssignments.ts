import { PolygonUserAssignment } from "../utils/types";
import { api } from "../utils/constants";
import { useState } from "react";

const useAssignments = () => {
	const [assignmentsLoading, setLoading] = useState(false);
	const [assignmentsError, setError] = useState<string | null>(null);

	const getAssignments = async (): Promise<PolygonUserAssignment[]> => {
		setLoading(true);
		setError(null);

		try {
			const res = await api.get("/assignments");
			return res.data;
		} catch (err: any) {
			setError(
				err.response?.data?.message || "Assignments failed to load"
			);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const assignCanvasserToPolygon = async (
		assignment: PolygonUserAssignment
	) => {
		setLoading(true);
		setError(null);

		try {
			await api.post("/assignments", assignment);
		} catch (err: any) {
			setError(
				err.response?.data?.message ||
					"Failed to assign Canvasser to Region"
			);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const removeCanvasserFromPolygon = async (assignmentId: string) => {
		setLoading(true);
		setError(null);

		try {
			await api.delete(`/assignments/${assignmentId}`);
		} catch (err: any) {
			setError(
				err.response?.data?.message ||
					"Failed to delete Canvasser from Region"
			);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return {
		getAssignments,
		assignCanvasserToPolygon,
		removeCanvasserFromPolygon,
		assignmentsLoading,
		assignmentsError,
	};
};

export default useAssignments;
