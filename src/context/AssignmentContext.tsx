import React, { createContext, useContext, useEffect, useState } from "react";
import { PolygonUserAssignment } from "../utils/types";
import {
	getAssignments,
	assignUserToPolygon,
	removeUserFromPolygon,
} from "../hooks/useAssignments";
import { Canvasser, useCanvassers } from "../context/CanvassersContext";
import { generateRandomNumber } from "../utils/randomIdGenerator";

interface AssignmentContextType {
	assignments: PolygonUserAssignment[];
	assignUser: (polygonId: string, userId: string) => void;
	unassignUser: (polygonId: string, userId: string) => void;
	getUsersForPolygon: (polygonId: string) => string[];
	getUsersForPolygonFull: (polygonId: string) => Canvasser[];
}

const AssignmentContext = createContext<AssignmentContextType | undefined>(
	undefined
);

export const AssignmentProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const { canvassers } = useCanvassers();
	const [assignments, setAssignments] = useState<PolygonUserAssignment[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			const data = await getAssignments();
			setAssignments(data);
		};
		fetchData();
	}, []);

	const assignUser = async (polygonId: string, userId: string) => {
		const newAssignment = { polygonId, userId, id: generateRandomNumber() };
		await assignUserToPolygon(newAssignment);
		setAssignments((prev) => [...prev, newAssignment]);
	};

	const unassignUser = async (polygonId: string, userId: string) => {
		const found = assignments.find(
			(a) => a.polygonId === polygonId && a.userId === userId
		);
		if (!found) return;

		console.log(found);
		await removeUserFromPolygon(found.id);
		setAssignments((prev) =>
			prev.filter(
				(a) => !(a.polygonId === polygonId && a.userId === userId)
			)
		);
	};

	const getUsersForPolygon = (polygonId: string): string[] => {
		return assignments
			.filter((a) => a.polygonId === polygonId)
			.map((a) => a.userId);
	};

	const getUsersForPolygonFull = (polygonId: string): Canvasser[] => {
		const userIds = getUsersForPolygon(polygonId);
		return canvassers.filter((u) => userIds.includes(u.id));
	};

	return (
		<AssignmentContext.Provider
			value={{
				assignments,
				assignUser,
				unassignUser,
				getUsersForPolygon,
				getUsersForPolygonFull,
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
