import { MouseEvent, useEffect, useRef, useState } from "react";
import { Box, Popover, MenuItem } from "@mui/material";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import centerOfMass from "@turf/center-of-mass";
import { usePolygonContext } from "../../context/PolygonContext";

import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { Feature } from "geojson";
import { generateRandomNumber } from "../../utils/helperFunctions";
import AssignCanvasserModal from "./AssignCanvasserModal";
import { useAssignmentContext } from "../../context/AssignmentContext";

const MapInterface = () => {
	const mapRef = useRef<mapboxgl.Map | null>(null);
	const mapContainerRef = useRef<HTMLDivElement | null>(null);
	const drawRef = useRef<MapboxDraw | null>(null);
	const markerRefs = useRef<mapboxgl.Marker[]>([]);

	const { polygons, addPolygon, updatePolygon, removePolygon } =
		usePolygonContext();
	const { getUsersForPolygon, getUsersForPolygonFull } =
		useAssignmentContext();

	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const [popoverPosition, setPopoverPosition] = useState<
		[number, number] | null
	>(null);
	const [selectedPolygonId, setSelectedPolygonId] = useState<string | null>(
		null
	);
	const [modalOpen, setModalOpen] = useState(false);
	const [mapLoaded, setMapLoaded] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	const isEditingRef = useRef(isEditing);
	const selectedPolygonIdRef = useRef(selectedPolygonId);

	const setUpMap = () => {
		mapboxgl.accessToken =
			"pk.eyJ1IjoibWpheWZpbmxleSIsImEiOiJjbTlsZXgyM3owNDR4MmtwcGJia2JkZTlpIn0.KkhM7UhU-vzqCctuirR87w";

		const map = new mapboxgl.Map({
			container: mapContainerRef.current!,
			style: "mapbox://styles/mapbox/streets-v11",
			center: [-95.63104, 30.02577],
			zoom: 16,
		});

		mapRef.current = map;
		restoreDrawControls();

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

			map.on("draw.create", (e: any) => {
				const feature: Feature = e.features[0];
				if (!feature) return;

				feature.id = generateRandomNumber();
				feature.properties = {
					...(feature.properties || {}),
					color: "lightblue",
				};

				addPolygon(feature);
				if (drawRef.current) {
					drawRef.current.delete(feature.id.toString());
					restoreDrawControls(false);
				}
			});

			map.on("draw.update", (e: any) => {
				const feature: Feature = e.features[0];
				if (!feature?.id) return;

				updatePolygon(feature);
				if (drawRef.current) {
					drawRef.current.delete(feature.id.toString());
					restoreDrawControls(false);
					setIsEditing(false);
					setSelectedPolygonId(null);
				}
			});

			map.on("draw.delete", (e: any) => {
				const feature: Feature = e.features[0];
				if (!feature?.id) return;

				removePolygon(feature.id.toString());
				if (drawRef.current) {
					drawRef.current.delete(feature.id.toString());
					restoreDrawControls(false);
					setIsEditing(false);
					setSelectedPolygonId(null);
				}
			});

			map.on("click", "polygon-fill", (e) => {
				if (isEditingRef.current) return;
				const feature = e.features?.[0];
				if (!feature?.id || !drawRef.current || !mapRef.current) return;

				const id = feature.id.toString();
				setSelectedPolygonId(id);

				const coordinates = e.lngLat as mapboxgl.LngLatLike;
				const canvas = mapRef.current.getCanvas();
				const rect = canvas.getBoundingClientRect();

				const point = mapRef.current.project(coordinates);
				if (point) {
					setPopoverPosition([
						point.x + rect.left,
						point.y + rect.top,
					]);
					setAnchorEl(canvas);
				}
			});

			map.on("click", (e) => {
				if (
					!mapRef.current ||
					!isEditingRef.current ||
					!selectedPolygonIdRef.current
				)
					return;

				const features = mapRef.current.queryRenderedFeatures(e.point, {
					layers: ["polygon-fill"],
				});

				if (features.length === 0) {
					if (drawRef.current) {
						drawRef.current.deleteAll();
						restoreDrawControls(false);
						setIsEditing(false);
						setSelectedPolygonId(null);
						setAnchorEl(null);
						setPopoverPosition(null);
					}
				}
			});

			map.on("touchstart", "polygon-fill", (e) => {
				if (isEditingRef.current) return;
				const feature = e.features?.[0];
				if (!feature?.id || !drawRef.current || !mapRef.current) return;

				const id = feature.id.toString();
				setSelectedPolygonId(id);

				const coordinates = e.lngLat as mapboxgl.LngLatLike;
				const canvas = mapRef.current.getCanvas();
				const rect = canvas.getBoundingClientRect();

				const point = mapRef.current.project(coordinates);
				if (point) {
					setPopoverPosition([
						point.x + rect.left,
						point.y + rect.top,
					]);
					setAnchorEl(canvas);
				}
			});

			map.on("touchstart", (e) => {
				if (
					!mapRef.current ||
					!isEditingRef.current ||
					!selectedPolygonIdRef.current
				)
					return;

				const features = mapRef.current.queryRenderedFeatures(e.point, {
					layers: ["polygon-fill"],
				});

				if (features.length === 0) {
					if (drawRef.current) {
						drawRef.current.deleteAll();
						restoreDrawControls(false);
						setIsEditing(false);
						setSelectedPolygonId(null);
						setAnchorEl(null);
						setPopoverPosition(null);
					}
				}
			});
		});

		return () => {
			if (mapRef.current && drawRef.current) {
				mapRef.current.removeControl(drawRef.current);
			}

			mapRef.current?.remove();
			mapRef.current = null;
			drawRef.current = null;
		};
	};

	const updateMap = () => {
		if (!mapLoaded || !mapRef.current) return;

		const source = mapRef.current.getSource(
			"polygons"
		) as mapboxgl.GeoJSONSource;

		if (source && polygons) {
			const featuresWithId = polygons.map((feature) => {
				const id = feature.id?.toString() ?? generateRandomNumber();
				const assigned = getUsersForPolygon(id);
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
				const assigned = getUsersForPolygonFull(id);
				const center = centerOfMass(feature as any).geometry
					.coordinates;

				assigned.forEach((user, i, arr) => {
					const angle = (2 * Math.PI * i) / arr.length;
					const radius = 0.00015;
					const offsetLng = center[0] + radius * Math.cos(angle);
					const offsetLat = center[1] + radius * Math.sin(angle);

					const el = document.createElement("div");
					el.style.background = "#007bff";
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
					el.innerText = user.name.charAt(0).toUpperCase();

					const marker = new mapboxgl.Marker({ element: el })
						.setLngLat([offsetLng, offsetLat])
						.addTo(mapRef.current!);

					markerRefs.current.push(marker);
				});
			});
		}
	};

	const restoreDrawControls = (includeTrash = false) => {
		if (!mapRef.current) return;

		if (drawRef.current) {
			mapRef.current.removeControl(drawRef.current);
		}

		drawRef.current = new MapboxDraw({
			displayControlsDefault: false,
			controls: {
				polygon: true,
				trash: includeTrash,
			},
		});

		mapRef.current.addControl(drawRef.current, "top-right");
	};

	const handleEditRegion = (e: MouseEvent<HTMLLIElement>) => {
		e.stopPropagation();
		if (!selectedPolygonId || !drawRef.current) return;

		const polygon = polygons.find(
			(p) => p.id?.toString() === selectedPolygonId
		);
		if (polygon && mapRef.current) {
			restoreDrawControls(true);
			drawRef.current?.add(polygon);
			drawRef.current?.changeMode("simple_select", {
				featureIds: [selectedPolygonId],
			});
			setIsEditing(true);
		}

		setAnchorEl(null);
		setPopoverPosition(null);
	};

	const handleAddCanvassers = (e: MouseEvent<HTMLLIElement>) => {
		e.stopPropagation();
		setAnchorEl(null);
		setPopoverPosition(null);
		setModalOpen(true);
	};

	useEffect(() => {
		const cleanup = setUpMap();
		return cleanup;
	}, []);

	useEffect(() => {
		updateMap();
	}, [polygons, mapLoaded, getUsersForPolygon, getUsersForPolygonFull]);

	useEffect(() => {
		isEditingRef.current = isEditing;
		selectedPolygonIdRef.current = selectedPolygonId;
	}, [isEditing, selectedPolygonId]);

	return (
		<>
			<Box sx={{ height: "90vh", width: "100%" }} ref={mapContainerRef} />
			<Popover
				open={Boolean(anchorEl)}
				anchorReference="anchorPosition"
				anchorPosition={
					popoverPosition
						? { top: popoverPosition[1], left: popoverPosition[0] }
						: undefined
				}
				onClose={() => {
					setAnchorEl(null);
					setPopoverPosition(null);
				}}
			>
				<MenuItem onClick={(e) => handleEditRegion(e)}>
					Edit Region
				</MenuItem>
				<MenuItem onClick={(e) => handleAddCanvassers(e)}>
					Add Canvassers
				</MenuItem>
			</Popover>
			<AssignCanvasserModal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				polygonId={selectedPolygonId}
			/>
		</>
	);
};

export default MapInterface;
