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

	const handleDrawerToggle = () => {
		setOpen((prev) => !prev);
	};

	const handleNavClick = (path: string) => {
		setOpen(false);
		navigate(path);
	};

	const handleLogout = () => {
		theme.palette.mode === "dark" && toggleTheme();
		logoutUser();
	};

	const drawerListItems = [
		{
			label: "Map",
			path: "/map",
		},

		{
			label: "Dashboard",
			path: "/dashboard",
		},
	];

	const drawerContent = (
		<Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
			<Box>
				<Toolbar>
					<Typography variant="h6" noWrap>
						Canvasy
					</Typography>
				</Toolbar>
				<Divider />
				<List>
					<>
						{drawerListItems.map((item) => (
							<ListItemButton
								key={item.label}
								selected={
									window.location.pathname === item.path
								}
								onClick={() => handleNavClick(item.path)}
							>
								{item.label}
							</ListItemButton>
						))}
						<ListItemButton
							key="logout"
							onClick={() => handleLogout()}
						>
							Logout
						</ListItemButton>
					</>
				</List>
			</Box>

			<IconButton
				color="inherit"
				onClick={toggleTheme}
				disableRipple
				sx={{ mt: "auto", mb: "30px" }}
			>
				{theme.palette.mode === "dark" ? (
					<>
						<Brightness7Icon sx={{ mr: "4px" }} />
						Light
					</>
				) : (
					<>
						<Brightness4Icon sx={{ mr: "4px" }} />
						Dark
					</>
				)}
			</IconButton>
		</Box>
	);

	return (
		<Box sx={{ display: "flex" }}>
			<AppBar position="fixed">
				<Toolbar>
					<IconButton
						color="inherit"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{ mr: 2 }}
					>
						<Menu />
					</IconButton>

					<Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
						Canvasy
					</Typography>
				</Toolbar>
			</AppBar>
			<Drawer
				variant="temporary"
				open={open}
				onClose={handleDrawerToggle}
				sx={{
					"& .MuiDrawer-paper": {
						width: drawerWidth,
					},
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
