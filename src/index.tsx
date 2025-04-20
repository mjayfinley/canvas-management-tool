"use client";

import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { Box } from "@mui/material";
import App from "./app.tsx";

import AppProviders from "./context/AppProviders.tsx";

createRoot(document.getElementById("root")!).render(
	<AppProviders>
		<ErrorBoundary
			fallback={<Box>Something went wrong, please refresh.</Box>}
		>
			<App />
		</ErrorBoundary>
	</AppProviders>
);
