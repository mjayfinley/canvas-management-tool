import { ReactNode } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";

interface AuthLayoutProps {
	children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	return (
		<Box
			display="flex"
			flexDirection={isMobile ? "column" : "row"}
			minHeight="100vh"
			bgcolor={isMobile ? "primary.main" : "#f0f4f8"}
		>
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				flex={1}
				py={isMobile ? 2 : 0}
				px={isMobile ? 2 : 4}
				bgcolor={"primary.main"}
			>
				<Typography variant="h5" color={"white"} fontWeight="bold">
					CanvasPro
				</Typography>
			</Box>

			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				flex={1}
				px={2}
				py={4}
			>
				{children}
			</Box>
		</Box>
	);
};

export default AuthLayout;
