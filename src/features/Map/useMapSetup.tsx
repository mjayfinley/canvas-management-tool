import { Feature, Geometry, GeoJsonProperties } from "geojson";
import mapboxgl, { MapMouseEvent, MapTouchEvent } from "mapbox-gl";
import { generateRandomNumber } from "../../utils/helperFunctions";
import { useRegionContext } from "../../context/RegionContext";
import { Dispatch, RefObject, SetStateAction } from "react";

interface MapSetUpProps {
	mapRef: RefObject<mapboxgl.Map | null>;
	drawRef: RefObject<MapboxDraw | null>;
	isEditingRef: RefObject<boolean>;
	setSelectedRegionId: Dispatch<SetStateAction<string | null>>;
	setPopoverPosition: Dispatch<React.SetStateAction<[number, number] | null>>;
	setAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>;
	selectedRegionIdRef: RefObject<string | null>;
	restoreDrawControls: () => void;
	setIsEditing: Dispatch<SetStateAction<boolean>>;
	mapContainerRef: RefObject<HTMLDivElement | null>;
	setMapLoaded: Dispatch<SetStateAction<boolean>>;
}

const useMapSetup = ({
	mapRef,
	drawRef,
	isEditingRef,
	setSelectedRegionId,
	setPopoverPosition,
	setAnchorEl,
	selectedRegionIdRef,
	restoreDrawControls,
	setIsEditing,
	mapContainerRef,
	setMapLoaded,
}: MapSetUpProps) => {
	const { addRegion, updateSelectedRegion, removeRegion } =
		useRegionContext();
	const handleRegionClick = (e: MapMouseEvent | MapTouchEvent) => {
		if (isEditingRef.current) return;
		const feature = e.features?.[0];
		if (!feature?.id || !drawRef.current || !mapRef.current) return;

		const id = feature.id.toString();
		setSelectedRegionId(id);

		const coordinates = e.lngLat as mapboxgl.LngLatLike;
		const canvas = mapRef.current.getCanvas();
		const rect = canvas.getBoundingClientRect();

		const point = mapRef.current.project(coordinates);
		if (point) {
			setPopoverPosition([point.x + rect.left, point.y + rect.top]);
			setAnchorEl(canvas);
		}
	};

	const handleOutsideRegionClick = (e: MapMouseEvent | MapTouchEvent) => {
		if (
			!mapRef.current ||
			!isEditingRef.current ||
			!selectedRegionIdRef.current
		)
			return;

		const features = mapRef.current.queryRenderedFeatures(e.point, {
			layers: ["polygon-fill"],
		});

		if (features.length === 0) {
			if (drawRef.current) {
				drawRef.current.deleteAll();
				restoreDrawControls();
				setIsEditing(false);
				setSelectedRegionId(null);
				setAnchorEl(null);
				setPopoverPosition(null);
			}
		}
	};

	const mapResetAfterUpdate = (
		feature: Feature<Geometry, GeoJsonProperties>
	) => {
		if (drawRef.current && feature.id) {
			drawRef.current.delete(feature.id.toString());
			restoreDrawControls();
			setIsEditing(false);
			setSelectedRegionId(null);
		}
	};

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

				addRegion(feature);
				if (drawRef.current) {
					drawRef.current.delete(feature.id.toString());
					restoreDrawControls();
				}
			});

			map.on("draw.update", (e: any) => {
				const feature: Feature = e.features[0];
				if (!feature?.id) return;

				updateSelectedRegion(feature);
				mapResetAfterUpdate(feature);
			});

			map.on("draw.delete", (e: any) => {
				const feature: Feature = e.features[0];
				if (!feature?.id) return;

				removeRegion(feature.id.toString());
				mapResetAfterUpdate(feature);
			});

			map.on("mousemove", (e) => {
				const features = map.queryRenderedFeatures(e.point, {
					layers: ["polygon-fill"],
				});
				map.getCanvas().style.cursor = features.length ? "pointer" : "";
			});

			map.on("click", "polygon-fill", (e) => {
				handleRegionClick(e);
			});

			map.on("click", (e) => {
				handleOutsideRegionClick(e);
			});

			map.on("touchstart", "polygon-fill", (e) => {
				handleRegionClick(e);
			});

			map.on("touchstart", (e) => {
				handleOutsideRegionClick(e);
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
	return { setUpMap };
};

export default useMapSetup;
