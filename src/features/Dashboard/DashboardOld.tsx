import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import {
	Chart as ChartJS,
	ArcElement,
	BarElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	Legend,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { useCanvasserStatsContext } from "../../context/CanvasserStatsContext";
import { useCanvasserContext } from "../../context/CanvasserContext";
import { useAssignmentContext } from "../../context/AssignmentContext";
import { generateColors, sumArray } from "../../utils/helperFunctions";
import { useCanvassersContext } from "../../context/CanvassersContext";
import CustomButton from "../../components/Button";
import { CanvasserStat } from "../../utils/types";

ChartJS.register(
	ArcElement,
	BarElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	Legend
);

const Dashboard = () => {
	const { stats } = useCanvasserStatsContext();
	const { selectedCanvasser, setSelectedCanvasser } = useCanvasserContext();
	const { assignments } = useAssignmentContext();
	const { canvassers } = useCanvassersContext();

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	const getFilteredStats = (): CanvasserStat[] => {
		if (!selectedCanvasser) return stats;
		return stats.filter((c) => c.canvasserId === selectedCanvasser.id);
	};

	const filteredStats = getFilteredStats();

	const assignmentCounts = canvassers.map(
		(c) => assignments.filter((a) => a.canvasserId === c.id).length
	);

	const barData = {
		labels: canvassers.map((c) => c.firstName),
		datasets: [
			{
				label: "Regions Assigned",
				data: assignmentCounts,
				backgroundColor: "rgba(54, 162, 235, 0.6)",
			},
		],
	};

	const pieData = {
		labels: canvassers.map((c) => c.firstName),
		datasets: [
			{
				label: "Assignments",
				data: assignmentCounts,
				backgroundColor: generateColors(assignmentCounts.length),
			},
		],
	};

	const callBackChartData = {
		labels: selectedCanvasser ? [selectedCanvasser.firstName] : [""],
		datasets: [
			{
				label: "Doors Knocked",
				data: [
					sumArray(filteredStats.map((stat) => stat.doorsKnocked)),
				],
				backgroundColor: "red",
			},
			{
				label: "Callbacks",
				data: [sumArray(filteredStats.map((stat) => stat.callbacks))],
				backgroundColor: "blue",
			},
			{
				label: "Follow Ups",
				data: [
					sumArray(
						filteredStats.map((stat) => stat.followUpsScheduled)
					),
				],
				backgroundColor: "orange",
			},
			{
				label: "Surveys Completed",
				data: [
					sumArray(
						filteredStats.map((stat) => stat.surveysCompleted)
					),
				],
				backgroundColor: "purple",
			},
			{
				label: "Hours WOrked",
				data: [sumArray(filteredStats.map((stat) => stat.hoursWorked))],
				backgroundColor: "green",
			},
		],
	};

	return (
		<Box ml={1} mr={1} sx={{ height: "90vh", width: "100%" }}>
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
				}}
			>
				<Typography variant="h4">
					{!selectedCanvasser
						? "All Canvasser's Data"
						: `${selectedCanvasser.firstName} ${selectedCanvasser.lastName}'s Data`}
				</Typography>
				{selectedCanvasser && (
					<CustomButton
						label="All Canvassers"
						onClick={() => setSelectedCanvasser(null)}
					/>
				)}
			</Box>
			{!selectedCanvasser ? (
				<Box
					sx={{
						display: "flex",
						flexDirection: { xs: "column", md: "row" },
						width: "100%",
						height: "48%",
						gap: 2,
					}}
				>
					<Box sx={{ mt: 4, width: { xs: "95%", md: "50%" } }}>
						<Typography variant="h6">
							Regions Per Canvasser
						</Typography>
						<Bar
							data={barData}
							options={{
								responsive: true,
								plugins: {
									legend: { position: "top" },
								},
								animation: false,
							}}
						/>
					</Box>
					<Box sx={{ mt: 4, width: { xs: "95%", md: "50%" } }}>
						<Typography variant="h6">
							Assignment Distribution
						</Typography>
						<Pie
							data={pieData}
							options={{
								responsive: true,
								plugins: {
									legend: { position: "top" },
								},
								animation: false,
							}}
						/>
					</Box>
				</Box>
			) : (
				<Box
					sx={{
						mt: 4,
						width: { xs: "95%", md: "50%" },
						height: "70vh",
					}}
				>
					<Typography variant="h6">Canvasser Stats</Typography>
					<Bar
						data={callBackChartData}
						options={{
							responsive: true,
							maintainAspectRatio: false,
							indexAxis: isMobile ? "y" : "x",
							plugins: {
								legend: { position: "top" },
							},
							animation: false,
						}}
					/>
				</Box>
			)}
		</Box>
	);
};

export default Dashboard;
