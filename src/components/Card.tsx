import {
	Card,
	CardProps,
	CardMedia,
	CardContent,
	CardActions,
	Typography,
	Box,
} from "@mui/material";
import { ReactElement } from "react";

type CustomCardProps = {
	title: string;
	description: string;
	content: string;
	imageUrl?: string;
	actionElement?: ReactElement;
	onClick?: () => void;
} & CardProps;

const CustomCard = ({
	title,
	description,
	content,
	imageUrl,
	actionElement,
	onClick,
	sx,
}: CustomCardProps) => {
	return (
		<Card sx={{ ...sx, maxWidth: 375, mt: 2 }} onClick={onClick}>
			{imageUrl && (
				<CardMedia
					component="img"
					height="180"
					image={imageUrl}
					alt={title}
				/>
			)}
			<Box sx={{ display: "flex" }}>
				<CardContent>
					<Typography gutterBottom variant="h6" component="div">
						{title}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						{description}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						{content}
					</Typography>
				</CardContent>

				{actionElement && (
					<CardActions sx={{ width: "100%" }}>
						<Box ml="auto">{actionElement}</Box>
					</CardActions>
				)}
			</Box>
		</Card>
	);
};

export default CustomCard;
