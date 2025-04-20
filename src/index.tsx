import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ToastProvider } from "./context/ToastContext.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { CanvassersProvider } from "./context/CanvassersContext.tsx";
import App from "./app.tsx";
import { RegionProvider } from "./context/RegionContext.tsx";
import { AssignmentProvider } from "./context/AssignmentContext.tsx";
import { CanvasserProvider } from "./context/CanvasserContext.tsx";
import { CanvasserStatsProvider } from "./context/CanvasserStatsContext.tsx";

createRoot(document.getElementById("root")!).render(
	<AuthProvider>
		<ToastProvider>
			<ThemeProvider>
				<CanvasserStatsProvider>
					<CanvassersProvider>
						<RegionProvider>
							<AssignmentProvider>
								<CanvasserProvider>
									<App />
								</CanvasserProvider>
							</AssignmentProvider>
						</RegionProvider>
					</CanvassersProvider>
				</CanvasserStatsProvider>
			</ThemeProvider>
		</ToastProvider>
	</AuthProvider>
);
