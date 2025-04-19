import React, { createContext, useContext, useEffect, useState } from "react";

import { Feature } from "geojson";
import useAssignments from "../hooks/useAssignments";
import usePolygons from "../hooks/usePolygons";

interface PolygonContextType {
	polygons: Feature[];
	addPolygon: (polygon: Feature) => void;
	removePolygon: (id: string) => void;
	updateSelectedPolygon: (polygon: Feature) => void;
	polygonsLoading: boolean;
	polygonsError: string | null;
}

const PolygonContext = createContext<PolygonContextType | undefined>(undefined);

export const PolygonProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const { getAssignments, removeCanvasserFromPolygon } = useAssignments();
	const {
		getPolygons,
		savePolygon,
		updatePolygon,
		deletePolygon,
		polygonsLoading,
		polygonsError,
	} = usePolygons();
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

	const updateSelectedPolygon = async (polygon: Feature) => {
		if (!polygon.id) return;
		await updatePolygon(polygon);
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
		polygonAssignment && removeCanvasserFromPolygon(polygonAssignment.id);
		setPolygons((prev) => prev.filter((poly) => poly.id !== id));
	};

	return (
		<PolygonContext.Provider
			value={{
				polygons,
				addPolygon,
				removePolygon,
				updateSelectedPolygon,
				polygonsLoading,
				polygonsError,
			}}
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
