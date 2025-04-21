import { MouseEvent, useEffect, useRef, useState } from "react";
import { Box, Popover, MenuItem, useTheme, useMediaQuery } from "@mui/material";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useRegionContext } from "../../context/RegionContext";
import AssignCanvasserModal from "./AssignCanvasserModal";
import { useAssignmentContext } from "../../context/AssignmentContext";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "mapbox-gl/dist/mapbox-gl.css";

import useMapSetup from "./useMapSetup";
import useUpdateMap from "./useUpdateMap";
import Canvassers from "../Canvassers/Canvassers";

const MapInterface = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const mapRef = useRef<mapboxgl.Map | null>(null);
	const mapContainerRef = useRef<HTMLDivElement | null>(null);
	const drawRef = useRef<MapboxDraw | null>(null);

	const { regions } = useRegionContext();
	const { getCanvassersForRegion, getCanvassersForRegionFull } =
		useAssignmentContext();

	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const [popoverPosition, setPopoverPosition] = useState<
		[number, number] | null
	>(null);
	const [selectedRegionId, setSelectedRegionId] = useState<string | null>(
		null
	);
	const [modalOpen, setModalOpen] = useState(false);
	const [mapLoaded, setMapLoaded] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	const isEditingRef = useRef(isEditing);
	const selectedRegionIdRef = useRef(selectedRegionId);

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

	const { setUpMap } = useMapSetup({
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
	});

	const { updateMap } = useUpdateMap({
		mapRef,
		mapLoaded,
	});

	const handleEditRegion = (e: MouseEvent<HTMLLIElement>) => {
		e.stopPropagation();
		if (!selectedRegionId || !drawRef.current) return;

		const region = regions.find(
			(p) => p.id?.toString() === selectedRegionId
		);
		if (region && mapRef.current) {
			restoreDrawControls(true);
			drawRef.current?.add(region);
			drawRef.current?.changeMode("simple_select", {
				featureIds: [selectedRegionId],
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
		setUpMap();
	}, []);

	useEffect(() => {
		updateMap();
	}, [
		regions,
		mapLoaded,
		getCanvassersForRegion,
		getCanvassersForRegionFull,
	]);

	useEffect(() => {
		isEditingRef.current = isEditing;
		selectedRegionIdRef.current = selectedRegionId;
	}, [isEditing, selectedRegionId]);

	return (
		<>
			<Canvassers />
			<Box
				sx={{
					height: "90vh",
					width: "100%",
					ml: !isMobile ? "16px" : "",
				}}
				ref={mapContainerRef}
			/>
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
					Edit Canvassers
				</MenuItem>
			</Popover>
			<AssignCanvasserModal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				regionId={selectedRegionId}
			/>
		</>
	);
};

export default MapInterface;
