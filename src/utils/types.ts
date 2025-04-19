export interface PolygonUserAssignment {
	polygonId: string;
	userId: string;
	id: string;
}

export interface Canvasser {
	id: string;
	name: string;
	email: string;
}

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
