import axios from "axios";

export interface CanvasserStat {
	id?: string;
	canvasserId: string;
	callbacks: number;
	doorsKnocked: number;
	conversations: number;
	followUpsScheduled: number;
	surveysCompleted: number;
	hoursWorked: number;
}

const BASE_URL = "http://localhost:3000/canvasserStats";

export const getStats = async (): Promise<CanvasserStat[]> => {
	const res = await axios.get(BASE_URL);
	return res.data;
};

export const createStat = async (
	stat: CanvasserStat
): Promise<CanvasserStat> => {
	const res = await axios.post(BASE_URL, stat);
	return res.data;
};

export const deleteStatByCanvasserId = async (
	canvasserId: string
): Promise<void> => {
	const res = await axios.get(`${BASE_URL}?canvasserId=${canvasserId}`);
	const entries = res.data;
	for (const entry of entries) {
		await axios.delete(`${BASE_URL}/${entry.id}`);
	}
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
