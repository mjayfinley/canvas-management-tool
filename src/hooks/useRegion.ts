import { useState } from "react";
import { api } from "../utils/constants";
import { Feature } from "geojson";
import useToast from "./useToast";

const useRegion = () => {
	const [regionsLoading, setLoading] = useState(false);

	const showToast = useToast();

	const getRegions = async (): Promise<Feature[]> => {
		setLoading(true);

		try {
			const res = await api.get("/regions");
			return res.data;
		} catch (err: any) {
			showToast("Failed to load Regions", "error");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const saveRegion = async (region: Feature) => {
		setLoading(true);

		try {
			await api.post("/regions", region);
			showToast("Successfully Saved Region", "success");
		} catch (err: any) {
			showToast("Failed to Save Region", "error");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const updateRegion = async (regions: Feature) => {
		setLoading(true);

		try {
			if (!regions.id)
				throw new Error("Region must have an id to update");
			await api.put(`/regions/${regions.id}`, regions);
			showToast("Successfully Updated Region", "success");
		} catch (err: any) {
			showToast("Failed to Update Region", "error");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const deleteRegion = async (id: string) => {
		setLoading(true);

		try {
			await api.delete(`/regions/${id}`);
			showToast("Successfully Deleted Region", "success");
		} catch (err: any) {
			showToast("Failed to Delete Region", "error");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return {
		getRegions,
		saveRegion,
		updateRegion,
		deleteRegion,
		regionsLoading,
	};
};

export default useRegion;
