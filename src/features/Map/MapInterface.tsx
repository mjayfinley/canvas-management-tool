import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { usePolygonContext } from "../../context/PolygonContext";

import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "mapbox-gl/dist/mapbox-gl.css";

const MapInterface = () => {
	const mapRef = useRef<mapboxgl.Map | null>(null);
	const mapContainerRef = useRef<HTMLDivElement | null>(null);
	const drawRef = useRef<MapboxDraw | null>(null);
	const { polygons, addPolygon, removePolygon, updatePolygon } =
		usePolygonContext();

	useEffect(() => {
		mapboxgl.accessToken =
			"pk.eyJ1IjoibWpheWZpbmxleSIsImEiOiJjbTlsZXgyM3owNDR4MmtwcGJia2JkZTlpIn0.KkhM7UhU-vzqCctuirR87w";

		const map = new mapboxgl.Map({
			container: mapContainerRef.current!,
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
			polygons.forEach((polygon) => {
				draw.add(polygon);
			});

			map.on("draw.create", (e: any) => {
				const created = e.features[0];
				if (!created.id) {
					created.id = crypto.randomUUID();
				}
				addPolygon(created);
			});

			map.on("draw.update", (e: any) => {
				const updated = e.features[0];
				updatePolygon(updated);
			});

			map.on("draw.delete", (e: any) => {
				const deleted = e.features[0];
				if (deleted.id) {
					removePolygon(deleted.id.toString());
				}
			});
		});

		return () => map.remove();
	}, []);

	useEffect(() => {
		if (!drawRef.current) return;

		const existing = new Set(
			drawRef.current.getAll().features.map((f) => f.id?.toString())
		);

		polygons.forEach((polygon) => {
			if (!polygon.id || existing.has(polygon.id.toString())) return;
			drawRef.current?.add(polygon);
		});
	}, [polygons]);

	return <Box sx={{ height: "90vh", width: "100%" }} ref={mapContainerRef} />;
};

export default MapInterface;
