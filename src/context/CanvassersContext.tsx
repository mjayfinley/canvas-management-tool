import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { getAssignments, removeUserFromPolygon } from "../hooks/useAssignments";
import { Canvasser } from "../utils/types";
import { useCanvasserStatsContext } from "./CanvasserStatsContext";

interface CanvassersContextType {
	canvassers: Canvasser[];
	loading: boolean;
	addCanvasser: (canvasser: Canvasser) => Promise<void>;
	removeCanvasser: (id: string) => Promise<void>;
	refetchCanvassers: () => Promise<void>;
}

const CanvassersContext = createContext<CanvassersContextType | undefined>(
	undefined
);

const API_URL = "http://localhost:3000/canvassers";

export const CanvassersProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const { addStat, removeStat } = useCanvasserStatsContext();
	const [canvassers, setCanvassers] = useState<Canvasser[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const refetchCanvassers = async () => {
		setLoading(true);
		try {
			const response = await axios.get<Canvasser[]>(API_URL);
			setCanvassers(response.data);
		} catch (err) {
			console.error("Failed to fetch users:", err);
		} finally {
			setLoading(false);
		}
	};

	const addCanvasser = async (canvasser: Canvasser) => {
		try {
			const response = await axios.post<Canvasser>(API_URL, {
				id: canvasser.id,
				name: canvasser.name,
				email: canvasser.email,
			});
			setCanvassers((prev) => [...prev, response.data]);
			addStat(canvasser.id);
		} catch (err) {
			console.error("Failed to add user:", err);
		}
	};

	const removeCanvasser = async (id: string) => {
		try {
			const assignmentData = await getAssignments();
			await axios.delete(`${API_URL}/${id}`);
			const canvaserAssignments = assignmentData.filter(
				(a) => a.userId === id
			);

			await canvaserAssignments.forEach((assignment) => {
				removeUserFromPolygon(assignment.id);
			});
			removeStat(id);
			setCanvassers((prev) => prev.filter((u) => u.id !== id));
		} catch (err) {
			console.error("Failed to remove user:", err);
		}
	};

	useEffect(() => {
		refetchCanvassers();
	}, []);

	return (
		<CanvassersContext.Provider
			value={{
				canvassers,
				loading,
				addCanvasser,
				removeCanvasser,
				refetchCanvassers,
			}}
		>
			{children}
		</CanvassersContext.Provider>
	);
};

export const useCanvassers = (): CanvassersContextType => {
	const context = useContext(CanvassersContext);
	if (!context)
		throw new Error("useUsers must be used within a UsersProvider");
	return context;
};
