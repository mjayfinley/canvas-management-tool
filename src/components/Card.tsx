import {
	Card,
	CardMedia,
	CardContent,
	CardActions,
	Typography,
	Button,
	Box,
} from "@mui/material";

interface CustomCardProps {
	title: string;
	description: string;
	imageUrl?: string;
	onActionClick?: () => void;
	actionLabel?: string;
}

const CustomCard = ({
	title,
	description,
	imageUrl,
	onActionClick,
	actionLabel = "Learn More",
}: CustomCardProps) => {
	return (
		<Card sx={{ maxWidth: 345, m: 2 }}>
			{imageUrl && (
				<CardMedia
					component="img"
					height="180"
					image={imageUrl}
					alt={title}
				/>
			)}
			<CardContent>
				<Typography gutterBottom variant="h6" component="div">
					{title}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{description}
				</Typography>
			</CardContent>

			{onActionClick && (
				<CardActions>
					<Box ml="auto">
						<Button
							size="small"
							color="primary"
							onClick={onActionClick}
						>
							{actionLabel}
						</Button>
					</Box>
				</CardActions>
			)}
		</Card>
	);
};

export default CustomCard;
