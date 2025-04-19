import { CanvasserStat } from "./types";

export const generateRandomNumber = () => {
	const min = 100000000;
	const max = 1000000000;
	const randomNum = Math.floor(Math.random() * (max - min) + min);

	return randomNum.toString();
};

export const sumArray = (arr: number[]): number => {
	return arr.reduce((total, num) => total + num, 0);
};

export const generateColors = (count: number): string[] => {
	const baseColors = [
		"#FF6384",
		"#36A2EB",
		"#FFCE56",
		"#4BC0C0",
		"#9966FF",
		"#FF9F40",
		"#C9CBCF",
		"#8DD1E1",
		"#F67019",
		"#00A36C",
		"#F7464A",
		"#B2912F",
		"#4D5360",
		"#2E8B57",
		"#FFD700",
		"#DC143C",
	];

	return Array.from(
		{ length: count },
		(_, i) => baseColors[i % baseColors.length]
	);
};

export const createMockStat = (canvasserId: string): CanvasserStat => ({
	canvasserId,
	callbacks: Math.floor(Math.random() * 10),
	doorsKnocked: Math.floor(Math.random() * 100),
	conversations: Math.floor(Math.random() * 60),
	followUpsScheduled: Math.floor(Math.random() * 5),
	surveysCompleted: Math.floor(Math.random() * 50),
	hoursWorked: Math.floor(Math.random() * 20),
});
