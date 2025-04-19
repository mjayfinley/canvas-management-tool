import React, { createContext, useContext, useEffect, useState } from "react";
import {
	getPolygons,
	savePolygon,
	deletePolygon,
	updatePolygon as updatePolygonApi,
} from "../hooks/usePolygons";
import { Feature } from "geojson";
import { getAssignments, removeUserFromPolygon } from "../hooks/useAssignments";

interface PolygonContextType {
	polygons: Feature[];
	addPolygon: (polygon: Feature) => void;
	removePolygon: (id: string) => void;
	updatePolygon: (polygon: Feature) => void;
}

const PolygonContext = createContext<PolygonContextType | undefined>(undefined);

export const PolygonProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [polygons, setPolygons] = useState<Feature[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			const data = await getPolygons();
			setPolygons(data);
		};
		fetchData();
	}, []);

	const addPolygon = async (polygon: Feature) => {
		await savePolygon(polygon);
		setPolygons((prev) => [...prev, polygon]);
	};

	const updatePolygon = async (polygon: Feature) => {
		if (!polygon.id) return;
		await updatePolygonApi(polygon);
		setPolygons((prev) =>
			prev.map((p) => (p.id === polygon.id ? polygon : p))
		);
	};

	const removePolygon = async (id: string) => {
		const assignmentData = await getAssignments();
		await deletePolygon(id);

		const polygonAssignment = assignmentData.find(
			(a) => a.polygonId === id
		);
		polygonAssignment && removeUserFromPolygon(polygonAssignment.id);
		setPolygons((prev) => prev.filter((poly) => poly.id !== id));
	};

	return (
		<PolygonContext.Provider
			value={{ polygons, addPolygon, removePolygon, updatePolygon }}
		>
			{children}
		</PolygonContext.Provider>
	);
};

export const usePolygonContext = () => {
	const context = useContext(PolygonContext);
	if (!context)
		throw new Error("usePolygonContext must be used within provider");
	return context;
};
