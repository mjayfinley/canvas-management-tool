import React, { createContext, useContext, useEffect, useState } from "react";
import { Canvasser, PolygonUserAssignment } from "../utils/types";

import { useCanvassersContext } from "../context/CanvassersContext";
import { generateRandomNumber } from "../utils/helperFunctions";
import useAssignments from "../hooks/useAssignments";

interface AssignmentContextType {
	assignments: PolygonUserAssignment[];
	assignCanvasser: (polygonId: string, userId: string) => void;
	unassignCanvasser: (polygonId: string, userId: string) => void;
	getCanvassersForRegion: (polygonId: string) => string[];
	getCanvassersForRegionFull: (polygonId: string) => Canvasser[];
	assignmentsError: string | null;
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
		assignCanvasserToPolygon,
		removeCanvasserFromPolygon,
		assignmentsLoading,
		assignmentsError,
	} = useAssignments();
	const [assignments, setAssignments] = useState<PolygonUserAssignment[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			const data = await getAssignments();
			setAssignments(data);
		};
		fetchData();
	}, [canvassers]);

	const assignCanvasser = async (polygonId: string, userId: string) => {
		const newAssignment = { polygonId, userId, id: generateRandomNumber() };
		await assignCanvasserToPolygon(newAssignment);
		setAssignments((prev) => [...prev, newAssignment]);
	};

	const unassignCanvasser = async (polygonId: string, userId: string) => {
		const found = assignments.find(
			(a) => a.polygonId === polygonId && a.userId === userId
		);
		if (!found) return;

		await removeCanvasserFromPolygon(found.id);
		setAssignments((prev) =>
			prev.filter(
				(a) => !(a.polygonId === polygonId && a.userId === userId)
			)
		);
	};

	const getCanvassersForRegion = (polygonId: string): string[] => {
		return assignments
			.filter((a) => a.polygonId === polygonId)
			.map((a) => a.userId);
	};

	const getCanvassersForRegionFull = (polygonId: string): Canvasser[] => {
		const userIds = getCanvassersForRegion(polygonId);
		return canvassers.filter((u) => userIds.includes(u.id));
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
				assignmentsError,
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
