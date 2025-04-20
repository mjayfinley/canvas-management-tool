import React, { createContext, useContext, useEffect, useState } from "react";

import { Feature } from "geojson";
import useAssignments from "../hooks/useAssignments";
import useRegion from "../hooks/useRegion";

interface RegionContextType {
	regions: Feature[];
	addRegion: (region: Feature) => void;
	removeRegion: (id: string) => void;
	updateSelectedRegion: (region: Feature) => void;
	regionsLoading: boolean;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export const RegionProvider = ({ children }: { children: React.ReactNode }) => {
	const { getAssignments, removeCanvasserFromRegion } = useAssignments();
	const {
		getRegions,
		saveRegion,
		updateRegion,
		deleteRegion,
		regionsLoading,
	} = useRegion();
	const [regions, setRegions] = useState<Feature[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			const data = await getRegions();
			setRegions(data);
		};
		fetchData();
	}, []);

	const addRegion = async (region: Feature) => {
		await saveRegion(region);
		setRegions((prev) => [...prev, region]);
	};

	const updateSelectedRegion = async (region: Feature) => {
		if (!region.id) return;
		await updateRegion(region);
		setRegions((prev) =>
			prev.map((p) => (p.id === region.id ? region : p))
		);
	};

	const removeRegion = async (id: string) => {
		const assignmentData = await getAssignments();
		await deleteRegion(id);

		const regionAssignment = assignmentData.find((a) => a.regionId === id);
		regionAssignment && removeCanvasserFromRegion(regionAssignment.id);
		setRegions((prev) => prev.filter((poly) => poly.id !== id));
	};

	return (
		<RegionContext.Provider
			value={{
				regions,
				addRegion,
				updateSelectedRegion,
				removeRegion,
				regionsLoading,
			}}
		>
			{children}
		</RegionContext.Provider>
	);
};

export const useRegionContext = () => {
	const context = useContext(RegionContext);
	if (!context)
		throw new Error("useRegionContext must be used within provider");
	return context;
};
