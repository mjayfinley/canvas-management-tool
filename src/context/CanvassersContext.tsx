import React, { createContext, useContext, useEffect, useState } from "react";
import { Canvasser } from "../utils/types";
import { useCanvasserStatsContext } from "./CanvasserStatsContext";
import useCanvassers from "../hooks/useCanvassers";
import useAssignments from "../hooks/useAssignments";

interface CanvassersContextType {
	canvassers: Canvasser[];
	canvassersLoading: boolean;
	canvassersError: string | null;
	addCanvasser: (canvasser: Canvasser) => Promise<void>;
	removeCanvasser: (id: string) => Promise<void>;
	refetchCanvassers: () => Promise<void>;
}

const CanvassersContext = createContext<CanvassersContextType | undefined>(
	undefined
);

export const CanvassersProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const { addStat, removeStat } = useCanvasserStatsContext();
	const {
		getCanvassers,
		createCanvasser,
		deleteCanvasser,
		canvassersError,
		canvassersLoading,
	} = useCanvassers();
	const { getAssignments, removeCanvasserFromPolygon } = useAssignments();
	const [canvassers, setCanvassers] = useState<Canvasser[]>([]);

	const refetchCanvassers = async () => {
		const response = await getCanvassers();
		setCanvassers(response);
	};

	const addCanvasser = async (canvasser: Canvasser) => {
		const response = await createCanvasser(canvasser);
		setCanvassers((prev) => [...prev, response]);
		addStat(canvasser.id);
	};

	const removeCanvasser = async (id: string) => {
		const assignmentData = await getAssignments();
		await deleteCanvasser(id);
		const canvaserAssignments = assignmentData.filter(
			(a) => a.userId === id
		);

		await canvaserAssignments.forEach((assignment) => {
			removeCanvasserFromPolygon(assignment.id);
		});
		removeStat(id);
		setCanvassers((prev) => prev.filter((u) => u.id !== id));
	};

	useEffect(() => {
		refetchCanvassers();
	}, []);

	return (
		<CanvassersContext.Provider
			value={{
				canvassers,
				addCanvasser,
				removeCanvasser,
				refetchCanvassers,
				canvassersLoading,
				canvassersError,
			}}
		>
			{children}
		</CanvassersContext.Provider>
	);
};

export const useCanvassersContext = (): CanvassersContextType => {
	const context = useContext(CanvassersContext);
	if (!context)
		throw new Error("useUsers must be used within a UsersProvider");
	return context;
};
