import { useEffect, useRef, useState } from "react";
import { Box, Modal, Typography } from "@mui/material";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { v4 as uuidv4 } from "uuid";
import { usePolygonContext } from "../../context/PolygonContext";
import AssignCanvasserDropdown from "./AssignCanvasserDropdown";

import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { Feature } from "geojson";
import { generateRandomNumber } from "../../utils/randomIdGenerator";

const MapInterface = () => {
	const mapRef = useRef<mapboxgl.Map | null>(null);
	const mapContainerRef = useRef<HTMLDivElement | null>(null);
	const drawRef = useRef<MapboxDraw | null>(null);
	const { polygons, addPolygon, updatePolygon, removePolygon } =
		usePolygonContext();

	const [selectedPolygon, setSelectedPolygon] =
		useState<mapboxgl.GeoJSONFeature | null>(null);

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
					"fill-color": "blue",
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

		if (source && polygons) {
			const featuresWithId = polygons.map((feature) => {
				return {
					...feature,
					id: feature.id || feature.properties?.id || uuidv4(),
				};
			});
			source.setData({
				type: "FeatureCollection",
				features: featuresWithId,
			});
		}
	}, [polygons, mapLoaded]);

	return (
		<>
			<Box sx={{ height: "90vh", width: "100%" }} ref={mapContainerRef} />
			<Modal
				open={!!selectedPolygon}
				onClose={() => setSelectedPolygon(null)}
				aria-labelledby="polygon-info"
			>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						bgcolor: "background.paper",
						boxShadow: 24,
						p: 4,
						width: 400,
						borderRadius: 2,
					}}
				>
					{selectedPolygon && (
						<>
							<Typography
								variant="h6"
								id="polygon-info"
								gutterBottom
							>
								Polygon Info
							</Typography>
							<AssignCanvasserDropdown
								polygonId={selectedPolygon.id?.toString() || ""}
							/>
						</>
					)}
				</Box>
			</Modal>
		</>
	);
};

export default MapInterface;
