import React, { useState } from "react";
import {
	Box,
	Toolbar,
	Typography,
	IconButton,
	Drawer,
	List,
	Divider,
	ListItemButton,
	AppBar,
	Button,
	useMediaQuery,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Menu } from "@mui/icons-material";
import { useThemeContext } from "../context/ThemeContext";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";

interface LayoutProps {
	children: React.ReactNode;
}

const drawerWidth = 240;

const Layout = ({ children }: LayoutProps) => {
	const [open, setOpen] = useState(false);
	const { toggleTheme } = useThemeContext();
	const theme = useTheme();
	const navigate = useNavigate();
	const { logoutUser } = useAuth();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	const handleDrawerToggle = () => setOpen((prev) => !prev);
	const handleNavClick = (path: string) => {
		setOpen(false);
		navigate(path);
	};

	const handleLogout = () => {
		if (theme.palette.mode === "dark") toggleTheme();
		logoutUser();
	};

	const navItems = [
		{ label: "Map", path: "/map" },
		{ label: "Dashboard", path: "/dashboard" },
	];

	const drawerContent = (
		<Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
			<Toolbar>
				<Typography variant="h6" noWrap>
					Canvasy
				</Typography>
			</Toolbar>
			<Divider />
			<List>
				{navItems.map((item) => (
					<ListItemButton
						key={item.label}
						selected={window.location.pathname === item.path}
						onClick={() => handleNavClick(item.path)}
					>
						{item.label}
					</ListItemButton>
				))}
				<ListItemButton key="logout" onClick={handleLogout}>
					Logout
				</ListItemButton>
			</List>

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

	return (
		<Box sx={{ display: "flex" }}>
			<AppBar position="fixed">
				<Toolbar sx={{ justifyContent: "space-between" }}>
					<Box sx={{ display: "flex", alignItems: "center" }}>
						{isMobile && (
							<IconButton
								color="inherit"
								edge="start"
								onClick={handleDrawerToggle}
								sx={{ mr: 2 }}
							>
								<Menu />
							</IconButton>
						)}
						<Typography variant="h6" noWrap>
							Canvasy
						</Typography>
					</Box>

					{/* Desktop Nav */}
					{!isMobile && (
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 2,
							}}
						>
							{navItems.map((item) => (
								<Button
									key={item.label}
									color="inherit"
									variant="text"
									onClick={() => handleNavClick(item.path)}
									sx={{
										textTransform: "none",
										fontWeight:
											window.location.pathname ===
											item.path
												? "bold"
												: "normal",
										textDecoration:
											window.location.pathname ===
											item.path
												? "underline"
												: "none",
									}}
								>
									{item.label}
								</Button>
							))}
							<Button
								color="inherit"
								sx={{ textTransform: "none" }}
								onClick={handleLogout}
							>
								Logout
							</Button>
							<IconButton color="inherit" onClick={toggleTheme}>
								{theme.palette.mode === "dark" ? (
									<Brightness7Icon />
								) : (
									<Brightness4Icon />
								)}
							</IconButton>
						</Box>
					)}
				</Toolbar>
			</AppBar>

			{/* Mobile Drawer */}
			<Drawer
				variant="temporary"
				open={open}
				onClose={handleDrawerToggle}
				sx={{
					display: { xs: "block", md: "none" },
					"& .MuiDrawer-paper": { width: drawerWidth },
				}}
			>
				{drawerContent}
			</Drawer>

			<Box
				component="main"
				sx={{
					flexGrow: 1,
					p: 2,
					width: "100%",
				}}
			>
				<Toolbar />
				{children}
			</Box>
		</Box>
	);
};

export default Layout;
