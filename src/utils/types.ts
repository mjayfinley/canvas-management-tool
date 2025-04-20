export interface RegionUserAssignment {
	regionId: string;
	canvasserId: string;
	id: string;
}

export interface Canvasser {
	id: string;
	firstName: string;
	lastName: string;
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
