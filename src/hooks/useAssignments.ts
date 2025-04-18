import axios from "axios";
import { PolygonUserAssignment } from "../utils/types";

const api = axios.create({
	baseURL: "http://localhost:3000",
});

export const getAssignments = async (): Promise<PolygonUserAssignment[]> => {
	const res = await api.get("/assignments");
	return res.data;
};

export const assignUserToPolygon = async (
	assignment: PolygonUserAssignment
) => {
	await api.post("/assignments", assignment);
};

export const removeUserFromPolygon = async (assignmentId: string) => {
	await api.delete(`/assignments/${assignmentId}`);
};
