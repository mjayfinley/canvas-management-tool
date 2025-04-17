import axios from "axios";
import { PolygonFeature } from "../utils/types";

const api = axios.create({
	baseURL: "http://localhost:3000",
});

export const getPolygons = async (): Promise<PolygonFeature[]> => {
	const res = await api.get("/polygons");
	return res.data;
};

export const savePolygon = async (polygon: PolygonFeature) => {
	await api.post("/polygons", polygon);
};

export const updatePolygon = async (polygon: PolygonFeature) => {
	if (!polygon.id) throw new Error("Polygon must have an id to update");
	await api.put(`/polygons/${polygon.id}`, polygon);
};

export const deletePolygon = async (id: string) => {
	await api.delete(`/polygons/${id}`);
};
