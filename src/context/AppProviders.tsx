import { ReactNode } from "react";
import { ThemeProvider } from "./ThemeContext";
import { AssignmentProvider } from "./AssignmentContext";
import { AuthProvider } from "./AuthContext";
import { CanvassersProvider } from "./CanvassersContext";
import { CanvasserStatsProvider } from "./CanvasserStatsContext";
import { RegionProvider } from "./RegionContext";
import { ToastProvider } from "./ToastContext";

const AppProviders = ({ children }: { children: ReactNode }) => (
	<ThemeProvider>
		<AuthProvider>
			<ToastProvider>
				<CanvasserStatsProvider>
					<CanvassersProvider>
						<RegionProvider>
							<AssignmentProvider>{children}</AssignmentProvider>
						</RegionProvider>
					</CanvassersProvider>
				</CanvasserStatsProvider>
			</ToastProvider>
		</AuthProvider>
	</ThemeProvider>
);

export default AppProviders;
