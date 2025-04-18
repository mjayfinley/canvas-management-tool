import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { usePolygonContext } from "../../context/PolygonContext";

import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { Feature, Point } from "geojson";
import { generateRandomNumber } from "../../utils/randomIdGenerator";
import AssignCanvasserModal from "./AssignCanvasserModal";
import { useAssignmentContext } from "../../context/AssignmentContext";

const MapInterface = () => {
	const mapRef = useRef<mapboxgl.Map | null>(null);
	const mapContainerRef = useRef<HTMLDivElement | null>(null);
	const drawRef = useRef<MapboxDraw | null>(null);
	const { polygons, addPolygon, updatePolygon, removePolygon } =
		usePolygonContext();
	const { getUsersForPolygon, getUsersForPolygonFull } =
		useAssignmentContext();

	const [selectedPolygonId, setSelectedPolygonId] = useState<string | null>(
		null
	);
	const [modalOpen, setModalOpen] = useState(false);
	const [mapLoaded, setMapLoaded] = useState(false);

	useEffect(() => {
		mapboxgl.accessToken =
			"pk.eyJ1IjoibWpheWZpbmxleSIsImEiOiJjbTlsZXgyM3owNDR4MmtwcGJia2JkZTlpIn0.KkhM7UhU-vzqCctuirR87w";

		const map = new mapboxgl.Map({
			container: mapContainerRef.current!,
			style: "mapbox://styles/mapbox/streets-v11",
			center: [-95.63104, 30.02577],
			zoom: 16,
		});

		mapRef.current = map;

		const draw = new MapboxDraw({
			displayControlsDefault: false,
			controls: {
				polygon: true,
				trash: true,
			},
		});

		drawRef.current = draw;
		map.addControl(draw);

		map.on("load", () => {
			setMapLoaded(true);

			map.addSource("polygons", {
				type: "geojson",
				data: {
					type: "FeatureCollection",
					features: [],
				},
			});

			map.addLayer({
				id: "polygon-fill",
				type: "fill",
				source: "polygons",
				paint: {
					"fill-color": ["get", "color"],
					"fill-opacity": 0.5,
				},
			});

			map.addLayer({
				id: "polygon-outline",
				type: "line",
				source: "polygons",
				paint: {
					"line-color": "#000",
					"line-width": 2,
				},
			});

			map.addSource("canvasser-labels", {
				type: "geojson",
				data: {
					type: "FeatureCollection",
					features: [],
				},
			});

			map.addLayer({
				id: "canvasser-labels",
				type: "symbol",
				source: "canvasser-labels",
				layout: {
					"text-field": ["get", "label"],
					"text-size": 14,
					"text-offset": [0, 0.6],
					"text-anchor": "top",
				},
				paint: {
					"text-color": "#000000",
				},
			});

			map.on("draw.create", (e: any) => {
				const feature: Feature = e.features[0];
				if (!feature) return;

				feature.id = generateRandomNumber();
				feature.properties = {
					...(feature.properties || {}),
					color: "lightblue",
				};

				addPolygon(feature);
				draw.delete(feature.id);
			});

			map.on("draw.update", (e: any) => {
				const feature: Feature = e.features[0];
				if (!feature?.id) return;

				updatePolygon(feature);
				draw.delete(feature.id.toString());
			});

			map.on("draw.delete", (e: any) => {
				const feature: Feature = e.features[0];
				if (!feature?.id) return;

				removePolygon(feature.id.toString());
			});

			map.on("click", "polygon-fill", (e) => {
				const feature = e.features?.[0];
				if (!feature?.id) return;

				setSelectedPolygonId(feature.id.toString());
				setModalOpen(true);
			});
		});

		return () => {
			map.remove();
		};
	}, []);

	useEffect(() => {
		if (!mapLoaded || !mapRef.current) return;

		const source = mapRef.current.getSource(
			"polygons"
		) as mapboxgl.GeoJSONSource;

		const labelSource = mapRef.current.getSource(
			"canvasser-labels"
		) as mapboxgl.GeoJSONSource;

		if (source && polygons) {
			const featuresWithId = polygons.map((feature) => {
				const id = feature.id?.toString() ?? generateRandomNumber();
				const assigned = getUsersForPolygon(id);
				const assignedColor = assigned.length > 0 ? "#4caf50" : "blue";

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

			// Labels
			const labelFeatures: Feature<Point>[] = featuresWithId.flatMap(
				(feature) => {
					const id = feature.id?.toString() ?? generateRandomNumber();
					const assigned = getUsersForPolygonFull(id);
					const coords = (feature.geometry as any).coordinates?.[0];
					if (!coords || coords.length < 3) return [];

					// Simple centroid
					const centroid = coords.reduce(
						(acc: [number, number], coord: [number, number]) => [
							acc[0] + coord[0] / coords.length,
							acc[1] + coord[1] / coords.length,
						],
						[0, 0]
					);

					return assigned.map((user, i) => ({
						type: "Feature",
						geometry: {
							type: "Point",
							coordinates: [
								centroid[0] + i * 0.0001,
								centroid[1],
							],
						},
						properties: {
							label: user.name.charAt(0).toUpperCase(),
						},
					}));
				}
			);

			labelSource?.setData({
				type: "FeatureCollection",
				features: labelFeatures,
			});
		}
	}, [polygons, mapLoaded, getUsersForPolygon, getUsersForPolygonFull]);

	return (
		<>
			<Box sx={{ height: "90vh", width: "100%" }} ref={mapContainerRef} />
			;
			<AssignCanvasserModal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				polygonId={selectedPolygonId}
			/>
		</>
	);
};

export default MapInterface;
