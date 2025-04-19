import { useState } from "react";
import { api } from "../utils/constants";
import { Feature } from "geojson";

const usePolygons = () => {
	const [polygonsLoading, setLoading] = useState(false);
	const [polygonsError, setError] = useState<string | null>(null);

	const getPolygons = async (): Promise<Feature[]> => {
		setLoading(true);
		setError(null);

		try {
			const res = await api.get("/polygons");
			return res.data;
		} catch (err: any) {
			setError(err.response?.data?.message || "Regions failed to load");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const savePolygon = async (polygon: Feature) => {
		setLoading(true);
		setError(null);

		try {
			await api.post("/polygons", polygon);
		} catch (err: any) {
			setError(err.response?.data?.message || "Failed to save Region");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const updatePolygon = async (polygon: Feature) => {
		setLoading(true);
		setError(null);

		try {
			if (!polygon.id)
				throw new Error("Region must have an id to update");
			await api.put(`/polygons/${polygon.id}`, polygon);
		} catch (err: any) {
			setError(err.response?.data?.message || "Failed to update Region");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const deletePolygon = async (id: string) => {
		setLoading(true);
		setError(null);

		try {
			await api.delete(`/polygons/${id}`);
		} catch (err: any) {
			setError(err.response?.data?.message || "Failed to delete Region");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return {
		getPolygons,
		savePolygon,
		updatePolygon,
		deletePolygon,
		polygonsLoading,
		polygonsError,
	};
};

export default usePolygons;
