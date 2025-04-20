import React, { createContext, useContext, useEffect, useState } from "react";
import { Canvasser, RegionUserAssignment } from "../utils/types";

import { useCanvassersContext } from "../context/CanvassersContext";
import { generateRandomNumber } from "../utils/helperFunctions";
import useAssignments from "../hooks/useAssignments";

interface AssignmentContextType {
	assignments: RegionUserAssignment[];
	assignCanvasser: (regionId: string, canvasserId: string) => void;
	unassignCanvasser: (regionId: string, canvasserId: string) => void;
	getCanvassersForRegion: (regionId: string) => string[];
	getCanvassersForRegionFull: (regionId: string) => Canvasser[];
	assignmentsLoading: boolean;
}

const AssignmentContext = createContext<AssignmentContextType | undefined>(
	undefined
);

export const AssignmentProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const { canvassers } = useCanvassersContext();
	const {
		getAssignments,
		assignCanvasserToRegion,
		removeCanvasserFromRegion,
		assignmentsLoading,
	} = useAssignments();
	const [assignments, setAssignments] = useState<RegionUserAssignment[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			const data = await getAssignments();
			setAssignments(data);
		};
		fetchData();
	}, [canvassers]);

	const assignCanvasser = async (regionId: string, canvasserId: string) => {
		const newAssignment = {
			regionId,
			canvasserId,
			id: generateRandomNumber(),
		};
		await assignCanvasserToRegion(newAssignment);
		setAssignments((prev) => [...prev, newAssignment]);
	};

	const unassignCanvasser = async (regionId: string, canvasserId: string) => {
		const found = assignments.find(
			(a) => a.regionId === regionId && a.canvasserId === canvasserId
		);
		if (!found) return;

		await removeCanvasserFromRegion(found.id);
		setAssignments((prev) =>
			prev.filter(
				(a) =>
					!(a.regionId === regionId && a.canvasserId === canvasserId)
			)
		);
	};

	const getCanvassersForRegion = (regionId: string): string[] => {
		return assignments
			.filter((a) => a.regionId === regionId)
			.map((a) => a.canvasserId);
	};

	const getCanvassersForRegionFull = (regionId: string): Canvasser[] => {
		const canvasserIds = getCanvassersForRegion(regionId);
		return canvassers.filter((u) => canvasserIds.includes(u.id));
	};

	return (
		<AssignmentContext.Provider
			value={{
				assignments,
				assignCanvasser,
				unassignCanvasser,
				getCanvassersForRegion,
				getCanvassersForRegionFull,
				assignmentsLoading,
			}}
		>
			{children}
		</AssignmentContext.Provider>
	);
};

export const useAssignmentContext = () => {
	const context = useContext(AssignmentContext);
	if (!context)
		throw new Error("useAssignmentContext must be used within a provider");
	return context;
};
