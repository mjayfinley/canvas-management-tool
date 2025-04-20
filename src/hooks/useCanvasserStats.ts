import { useState } from "react";
import { api } from "../utils/constants";
import { CanvasserStat } from "../utils/types";
import useToast from "./useToast";

const useCanvasserStats = () => {
	const [statsLoading, setLoading] = useState(false);

	const showToast = useToast();

	const getStats = async (): Promise<CanvasserStat[]> => {
		setLoading(true);

		try {
			const res = await api.get("/canvasserStats");
			return res.data;
		} catch (err: any) {
			showToast("Failed to Load Stats", "error");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const createStat = async (stat: CanvasserStat): Promise<CanvasserStat> => {
		setLoading(true);

		try {
			const res = await api.post("/canvasserStats", stat);
			return res.data;
		} catch (err: any) {
			showToast("Failed to Create Stats", "error");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const deleteStatByCanvasserId = async (
		canvasserId: string
	): Promise<void> => {
		setLoading(true);

		try {
			const res = await api.get(
				`/canvasserStats?canvasserId=${canvasserId}`
			);
			const entries = res.data;
			for (const entry of entries) {
				await api.delete(`/canvasserStats/${entry.id}`);
			}
		} catch (err: any) {
			showToast("Failed to Delete Canvasser Stats", "error");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return {
		getStats,
		createStat,
		deleteStatByCanvasserId,
		statsLoading,
	};
};

export default useCanvasserStats;
