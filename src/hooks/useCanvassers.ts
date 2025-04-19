import { useState } from "react";
import { api } from "../utils/constants";
import { Canvasser } from "../utils/types";

const useCanvassers = () => {
	const [canvassersLoading, setLoading] = useState(false);
	const [canvassersError, setError] = useState<string | null>(null);

	const getCanvassers = async (): Promise<Canvasser[]> => {
		setLoading(true);
		setError(null);

		try {
			const res = await api.get("/canvassers");
			return res.data;
		} catch (err: any) {
			setError(
				err.response?.data?.message || "Canvassers failed to load"
			);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const createCanvasser = async (
		canvasser: Canvasser
	): Promise<Canvasser> => {
		setLoading(true);
		setError(null);

		try {
			const res = await api.post("/canvasser", canvasser);
			return res.data;
		} catch (err: any) {
			setError(
				err.response?.data?.message || "Could not create canvasser"
			);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const deleteCanvasser = async (id: string) => {
		setLoading(true);
		setError(null);

		try {
			await api.delete(`/canvasser/${id}`);
		} catch (err: any) {
			setError(
				err.response?.data?.message || "Could not delete canvasser"
			);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return {
		getCanvassers,
		createCanvasser,
		deleteCanvasser,
		canvassersLoading,
		canvassersError,
	};
};

export default useCanvassers;
