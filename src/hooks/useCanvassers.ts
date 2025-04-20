import { useState } from "react";
import { api } from "../utils/constants";
import { Canvasser } from "../utils/types";
import useToast from "./useToast";

const useCanvassers = () => {
	const [canvassersLoading, setLoading] = useState(false);

	const showToast = useToast();

	const getCanvassers = async (): Promise<Canvasser[]> => {
		setLoading(true);

		try {
			const res = await api.get("/canvassers");
			return res.data;
		} catch (err: any) {
			showToast("Failed to get Canvassers", "error");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const createCanvasser = async (
		canvasser: Canvasser
	): Promise<Canvasser> => {
		setLoading(true);

		try {
			const res = await api.post("/canvassers", canvasser);

			showToast("Successfully Created Canvasser", "success");
			return res.data;
		} catch (err: any) {
			showToast("Failed to Create Canvasser", "error");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const deleteCanvasser = async (id: string) => {
		setLoading(true);

		try {
			await api.delete(`/canvassers/${id}`);
			showToast("Successfully Deleted Canvasser", "success");
		} catch (err: any) {
			showToast("Failed to Delete Canvasser", "error");
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
	};
};

export default useCanvassers;
