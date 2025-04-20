import centerOfMass from "@turf/center-of-mass";
import { Feature } from "geojson";
import mapboxgl from "mapbox-gl";
import {
	stringToColor,
	createInitials,
	generateRandomNumber,
} from "../../utils/helperFunctions";
import { Canvasser } from "../../utils/types";
import { RefObject, useRef } from "react";
import { useRegionContext } from "../../context/RegionContext";
import { useAssignmentContext } from "../../context/AssignmentContext";

interface UpdateMapProps {
	mapRef: RefObject<mapboxgl.Map | null>;
	mapLoaded: boolean;
}

const useUpdateMap = ({ mapRef, mapLoaded }: UpdateMapProps) => {
	const markerRefs = useRef<mapboxgl.Marker[]>([]);

	const { regions } = useRegionContext();
	const { getCanvassersForRegion, getCanvassersForRegionFull } =
		useAssignmentContext();

	const createMarker = (feature: Feature, assigned: Canvasser[]) => {
		const center = centerOfMass(feature as any).geometry.coordinates;

		assigned.forEach((user, i, arr) => {
			const angle = (2 * Math.PI * i) / arr.length;
			const radius = 0.00015;
			const offsetLng = center[0] + radius * Math.cos(angle);
			const offsetLat = center[1] + radius * Math.sin(angle);

			const el = document.createElement("div");
			el.style.background = stringToColor(user.firstName);
			el.style.color = "#fff";
			el.style.borderRadius = "50%";
			el.style.width = "30px";
			el.style.height = "30px";
			el.style.display = "flex";
			el.style.justifyContent = "center";
			el.style.alignItems = "center";
			el.style.fontWeight = "bold";
			el.style.fontSize = "14px";
			el.style.boxShadow = "0 0 4px rgba(0,0,0,0.3)";
			el.style.cursor = "pointer";
			el.title = `${user.firstName} ${user.lastName}`;
			el.innerText = createInitials(user.firstName, user.lastName);

			const marker = new mapboxgl.Marker({ element: el })
				.setLngLat([offsetLng, offsetLat])
				.addTo(mapRef.current!);

			markerRefs.current.push(marker);
		});
	};

	const updateMap = () => {
		if (!mapLoaded || !mapRef.current) return;

		const source = mapRef.current.getSource(
			"polygons"
		) as mapboxgl.GeoJSONSource;

		if (source && regions) {
			const featuresWithId = regions.map((feature) => {
				const id = feature.id?.toString() ?? generateRandomNumber();
				const assigned = getCanvassersForRegion(id);
				const assignedColor =
					assigned.length > 0 ? "#4caf50" : "lightblue";

				return {
					...feature,
					id,
					properties: {
						...feature.properties,
						color: assignedColor,
					},
				};
			});

			source.setData({
				type: "FeatureCollection",
				features: featuresWithId,
			});

			markerRefs.current.forEach((marker) => marker.remove());
			markerRefs.current = [];

			featuresWithId.forEach((feature) => {
				const id = feature.id?.toString() ?? generateRandomNumber();
				const assigned = getCanvassersForRegionFull(id);

				createMarker(feature, assigned);
			});
		}
	};
	return { updateMap };
};

export default useUpdateMap;
