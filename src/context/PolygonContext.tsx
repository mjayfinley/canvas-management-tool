import React, { createContext, useContext, useEffect, useState } from "react";
import {
	getPolygons,
	savePolygon,
	deletePolygon,
	updatePolygon as updatePolygonApi,
} from "../hooks/usePolygons";
import { PolygonFeature } from "../utils/types";

interface PolygonContextType {
	polygons: PolygonFeature[];
	addPolygon: (polygon: PolygonFeature) => void;
	removePolygon: (id: string) => void;
	updatePolygon: (polygon: PolygonFeature) => void;
}

const PolygonContext = createContext<PolygonContextType | undefined>(undefined);

export const usePolygonContext = () => {
	const context = useContext(PolygonContext);
	if (!context)
		throw new Error("usePolygonContext must be used within provider");
	return context;
};

export const PolygonProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [polygons, setPolygons] = useState<PolygonFeature[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			const data = await getPolygons();
			setPolygons(data);
		};
		fetchData();
	}, []);

	const addPolygon = async (polygon: PolygonFeature) => {
		await savePolygon(polygon);
		setPolygons((prev) => [...prev, polygon]);
	};

	const updatePolygon = async (polygon: PolygonFeature) => {
		if (!polygon.id) return;
		await updatePolygonApi(polygon);
		setPolygons((prev) =>
			prev.map((p) => (p.id === polygon.id ? polygon : p))
		);
	};

	const removePolygon = async (id: string) => {
		await deletePolygon(id);
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
