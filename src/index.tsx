import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ToastProvider } from "./context/ToastContext.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { CanvassersProvider } from "./context/CanvassersContext.tsx";
import App from "./app.tsx";

createRoot(document.getElementById("root")!).render(
	<AuthProvider>
		<ToastProvider>
			<ThemeProvider>
				<CanvassersProvider>
					<App />
				</CanvassersProvider>
			</ThemeProvider>
		</ToastProvider>
	</AuthProvider>
);
