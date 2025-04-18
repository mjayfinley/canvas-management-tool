import { Feature } from "geojson";

export interface User {
	id: string;
	name: string;
	email: string;
}

export interface PolygonFeature extends Feature {
	id: string;
	properties: {
		[key: string]: any;
		users?: string[];
	};
}

export interface PolygonUserAssignment {
	polygonId: string;
	userId: string;
}
