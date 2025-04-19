import { useState } from "react";
import { api } from "../utils/constants";
import { CanvasserStat } from "../utils/types";

const useCanvasserStats = () => {
	const [statsLoading, setLoading] = useState(false);
	const [statsError, setError] = useState<string | null>(null);

	const getStats = async (): Promise<CanvasserStat[]> => {
		setLoading(true);
		setError(null);

		try {
			const res = await api.get("/canvasserStats");
			return res.data;
		} catch (err: any) {
			setError(err.response?.data?.message || "Stats failed to load");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const createStat = async (stat: CanvasserStat): Promise<CanvasserStat> => {
		setLoading(true);
		setError(null);

		try {
			const res = await api.post("/canvasserStats", stat);
			return res.data;
		} catch (err: any) {
			setError(err.response?.data?.message || "Failed to create stats");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const deleteStatByCanvasserId = async (
		canvasserId: string
	): Promise<void> => {
		setLoading(true);
		setError(null);

		try {
			const res = await api.get(
				`/canvasserStats?canvasserId=${canvasserId}`
			);
			const entries = res.data;
			for (const entry of entries) {
				await api.delete(`/canvasserStats/${entry.id}`);
			}
		} catch (err: any) {
			setError(
				err.response?.data?.message ||
					"Failed to delete canvasser stats"
			);
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
		statsError,
	};
};

export default useCanvasserStats;
