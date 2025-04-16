import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ToastProvider } from "./context/ToastContext.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import App from "./app.tsx";

createRoot(document.getElementById("root")!).render(
	<AuthProvider>
		<ToastProvider>
			<ThemeProvider>
				<App />
			</ThemeProvider>
		</ToastProvider>
	</AuthProvider>
);
