import { ReactNode } from "react";
import {
	Box,
	IconButton,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useThemeContext } from "../../context/ThemeContext";

interface AuthLayoutProps {
	children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
	const theme = useTheme();
	const { toggleTheme } = useThemeContext();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	return (
		<Box
			display="flex"
			flexDirection={isMobile ? "column" : "row"}
			minHeight="100vh"
			bgcolor={
				isMobile
					? theme.palette.primary.main
					: theme.palette.background.default
			}
		>
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				flex={1}
				py={isMobile ? 2 : 0}
				px={isMobile ? 2 : 4}
				bgcolor={theme.palette.primary.main}
			>
				<Typography
					variant="h5"
					color={theme.palette.primary.contrastText}
					fontWeight="bold"
				>
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
			<IconButton
				color="inherit"
				onClick={toggleTheme}
				disableRipple
				sx={{ mt: "auto", mb: "30px" }}
			>
				{theme.palette.mode === "dark" ? (
					<>
						<Brightness7Icon sx={{ mr: 1 }} />
						Light
					</>
				) : (
					<>
						<Brightness4Icon sx={{ mr: 1 }} />
						Dark
					</>
				)}
			</IconButton>
		</Box>
	);
};

export default AuthLayout;
