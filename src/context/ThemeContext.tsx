import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "../theme/themes";

interface ThemeContextType {
	toggleTheme: () => void;
	mode: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [mode, setMode] = useState<"light" | "dark">("light");

	useEffect(() => {
		const storedMode = localStorage.getItem("themeMode") as
			| "light"
			| "dark"
			| null;
		if (storedMode === "dark" || storedMode === "light") {
			setMode(storedMode);
		}
	}, []);

	const toggleTheme = () => {
		setMode((prevMode) => {
			const nextMode = prevMode === "light" ? "dark" : "light";
			localStorage.setItem("themeMode", nextMode);
			return nextMode;
		});
	};

	const theme = useMemo(
		() => (mode === "light" ? lightTheme : darkTheme),
		[mode]
	);

	return (
		<ThemeContext.Provider value={{ toggleTheme, mode }}>
			<MuiThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</MuiThemeProvider>
		</ThemeContext.Provider>
	);
};

export const useThemeContext = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useThemeContext must be used within a ThemeProvider");
	}
	return context;
};
