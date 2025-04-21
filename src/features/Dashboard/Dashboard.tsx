import { useEffect, useState } from "react";
import {
	Box,
	Typography,
	Card,
	CardContent,
	Paper,
	Stack,
	SelectChangeEvent,
} from "@mui/material";
import {
	Chart,
	CategoryScale,
	LinearScale,
	BarElement,
	PointElement,
	LineElement,
	ArcElement,
	Tooltip,
	Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { useAssignmentContext } from "../../context/AssignmentContext";
import { useCanvassersContext } from "../../context/CanvassersContext";
import { useCanvasserStatsContext } from "../../context/CanvasserStatsContext";
import { Canvasser, CanvasserStat } from "../../utils/types";
import { generateColors, sumArray } from "../../utils/helperFunctions";
import CustomSelect from "../../components/Select";

Chart.register(
	CategoryScale,
	LinearScale,
	BarElement,
	PointElement,
	LineElement,
	ArcElement,
	Tooltip,
	Legend
);

const Dashboard = () => {
	const { stats } = useCanvasserStatsContext();
	const { assignments } = useAssignmentContext();
	const { canvassers } = useCanvassersContext();

	const [canvasser, setCanvasser] = useState<Canvasser | null>(null);
	const [kpiStats, setKpiStats] = useState<
		| {
				label: string;
				value: number;
		  }[]
		| null
	>(null);

	const getFilteredStats = (): CanvasserStat[] => {
		if (!canvasser) return stats;
		return stats.filter((c) => c.canvasserId === canvasser.id);
	};

	const filteredStats = getFilteredStats();

	const assignmentCounts = canvassers.map(
		(c) => assignments.filter((a) => a.canvasserId === c.id).length
	);

	const barChartData = {
		labels: canvassers.map((c) => c.firstName),
		datasets: [
			{
				label: "Regions Assigned",
				data: assignmentCounts,
				backgroundColor: "rgba(54, 162, 235, 0.6)",
			},
		],
	};

	const pieChartData = {
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
		labels: canvasser ? [canvasser.firstName] : [""],
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

	const getStatKPIs = () => {
		const statLabels: Record<string, string> = {
			doorsKnocked: "Doors Knocked",
			callbacks: "Callbacks",
			conversations: "Conversations",
			followUpsScheduled: "Follow-ups Scheduled",
			surveysCompleted: "Surveys Completed",
		};

		const totals: Record<string, number> = {};

		stats.forEach((stat) => {
			Object.keys(statLabels).forEach((key) => {
				const value = stat[key as keyof CanvasserStat];

				if (typeof value === "number") {
					totals[key] = (totals[key] ?? 0) + value;
				}
			});
		});

		const kpiStats = Object.entries(statLabels).map(([key, label]) => ({
			label,
			value: totals[key] ?? 0,
		}));

		setKpiStats(kpiStats);
	};

	const handleCanvasserChange = (e: SelectChangeEvent) => {
		const selectedCanvasser = canvassers.find(
			(c) => c.id === e.target.value
		);
		selectedCanvasser
			? setCanvasser(selectedCanvasser)
			: setCanvasser(null);
	};

	const canvasserOptions = [
		{ label: "All Canvassers", value: "" },
		...canvassers.map((canvasser) => ({
			label: `${canvasser.firstName} ${canvasser.lastName}`,
			value: canvasser.id,
		})),
	];

	useEffect(() => {
		getStatKPIs();
	}, [canvasser]);

	return (
		<Box flex={1} sx={{ p: 4 }}>
			<Typography variant="h4" gutterBottom>
				Canvassing Dashboard
			</Typography>

			<Stack direction="row" flexWrap="wrap" gap={2} mb={4}>
				{kpiStats &&
					kpiStats.map((kpi, idx) => (
						<Card
							key={idx}
							sx={{
								flex: "1 1 200px",
								borderRadius: 3,
								boxShadow: 3,
							}}
						>
							<CardContent>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									{kpi.label}
								</Typography>
								<Typography variant="h5" fontWeight="bold">
									{kpi.value}
								</Typography>
							</CardContent>
						</Card>
					))}
			</Stack>

			<Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={4}>
				<CustomSelect
					name="selected-canvasser"
					value={canvasser ? canvasser.id : ""}
					onChange={(e) => handleCanvasserChange(e)}
					options={canvasserOptions}
				/>
			</Stack>

			<Stack
				direction={{ xs: "column", md: "row" }}
				spacing={4}
				mb={4}
				useFlexGap
				flexWrap="wrap"
			>
				{!canvasser ? (
					<>
						<Paper
							sx={{
								flex: 1,
								p: 3,
								borderRadius: 3,
								minWidth: "300px",
							}}
						>
							<Typography variant="h6" gutterBottom>
								Regions Per Canvasser
							</Typography>
							<Bar
								data={barChartData}
								options={{
									responsive: true,
									plugins: {
										legend: { position: "top" },
									},
									animation: false,
								}}
							/>
						</Paper>

						<Paper
							sx={{
								flex: 1,
								p: 3,
								borderRadius: 3,
								minWidth: "300px",
							}}
						>
							<Typography variant="h6" gutterBottom>
								Assignment Distribution
							</Typography>
							<Box
								sx={{
									width: 400,
									height: 400,
									mx: "auto",
								}}
							>
								<Pie
									data={pieChartData}
									options={{
										responsive: true,
										plugins: {
											legend: { position: "top" },
										},
										animation: false,
									}}
								/>
							</Box>
						</Paper>
					</>
				) : (
					<Paper
						sx={{
							flex: 1,
							p: 3,
							borderRadius: 3,
							minWidth: "300px",
							maxWidth: "1000px",
						}}
					>
						<Typography variant="h6" gutterBottom>
							Canvasser Stats
						</Typography>
						<Bar
							data={callBackChartData}
							options={{
								responsive: true,
								plugins: {
									legend: { position: "top" },
								},
								animation: false,
							}}
						/>
					</Paper>
				)}
			</Stack>
		</Box>
	);
};

export default Dashboard;
