import { ReactNode } from "react";
import { ThemeProvider } from "./ThemeContext";
import { AssignmentProvider } from "./AssignmentContext";
import { AuthProvider } from "./AuthContext";
import { CanvasserProvider } from "./CanvasserContext";
import { CanvassersProvider } from "./CanvassersContext";
import { CanvasserStatsProvider } from "./CanvasserStatsContext";
import { RegionProvider } from "./RegionContext";
import { ToastProvider } from "./ToastContext";

const AppProviders = ({ children }: { children: ReactNode }) => (
	<AuthProvider>
		<ToastProvider>
			<ThemeProvider>
				<CanvasserStatsProvider>
					<CanvassersProvider>
						<RegionProvider>
							<AssignmentProvider>
								<CanvasserProvider>
									{children}
								</CanvasserProvider>
							</AssignmentProvider>
						</RegionProvider>
					</CanvassersProvider>
				</CanvasserStatsProvider>
			</ThemeProvider>
		</ToastProvider>
	</AuthProvider>
);

export default AppProviders;
