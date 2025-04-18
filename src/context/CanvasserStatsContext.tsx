import { createContext, useContext, useEffect, useState } from "react";
import {
	CanvasserStat,
	createMockStat,
	getStats,
	deleteStatByCanvasserId,
	createStat,
} from "../hooks/useCanvasserStats";

interface CanvasserStatsContextType {
	stats: CanvasserStat[];
	fetchStats: () => void;
	addStat: (canvasserId: string) => void;
	removeStat: (canvasserId: string) => void;
}

const CanvasserStatsContext = createContext<
	CanvasserStatsContextType | undefined
>(undefined);

export const CanvasserStatsProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [stats, setStats] = useState<CanvasserStat[]>([]);

	const fetchStats = async () => {
		const data = await getStats();
		setStats(data);
	};

	const addStat = async (canvasserId: string) => {
		const mock = createMockStat(canvasserId);
		const newStat = await createStat(mock);
		setStats((prev) => [...prev, newStat]);
	};

	const removeStat = async (canvasserId: string) => {
		await deleteStatByCanvasserId(canvasserId);
		setStats((prev) =>
			prev.filter((stat) => stat.canvasserId !== canvasserId)
		);
	};

	useEffect(() => {
		fetchStats();
	}, []);

	return (
		<CanvasserStatsContext.Provider
			value={{ stats, fetchStats, addStat, removeStat }}
		>
			{children}
		</CanvasserStatsContext.Provider>
	);
};

export const useCanvasserStatsContext = () => {
	const context = useContext(CanvasserStatsContext);
	if (!context)
		throw new Error(
			"useCanvasserStatsContext must be used within a Provider"
		);
	return context;
};
