import { createContext, ReactNode, useContext, useState } from "react";
import { Canvasser } from "../utils/types";

interface CanvasserContextType {
	selectedCanvasser: Canvasser | null;
	setSelectedCanvasser: (canvasser: Canvasser | null) => void;
}

const CanvasserContext = createContext<CanvasserContextType | undefined>(
	undefined
);

export const CanvasserProvider = ({ children }: { children: ReactNode }) => {
	const [selectedCanvasser, setSelectedCanvasser] =
		useState<Canvasser | null>(null);

	return (
		<CanvasserContext.Provider
			value={{ selectedCanvasser, setSelectedCanvasser }}
		>
			{children}
		</CanvasserContext.Provider>
	);
};

export const useCanvasserContext = () => {
	const context = useContext(CanvasserContext);
	if (!context) {
		throw new Error(
			"useCanvasserContext must be used within a CanvasserProvider"
		);
	}
	return context;
};
