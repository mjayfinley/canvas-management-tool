import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ToastProvider } from "./context/ToastContext.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { CanvassersProvider } from "./context/CanvassersContext.tsx";
import App from "./app.tsx";
import { PolygonProvider } from "./context/PolygonContext.tsx";
import { AssignmentProvider } from "./context/AssignmentContext.tsx";

createRoot(document.getElementById("root")!).render(
	<AuthProvider>
		<ToastProvider>
			<ThemeProvider>
				<CanvassersProvider>
					<PolygonProvider>
						<AssignmentProvider>
							<App />
						</AssignmentProvider>
					</PolygonProvider>
				</CanvassersProvider>
			</ThemeProvider>
		</ToastProvider>
	</AuthProvider>
);
