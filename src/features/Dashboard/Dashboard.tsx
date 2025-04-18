import { useCanvasserContext } from "../../context/CanvasserContext";

const Dashboard = () => {
	const { selectedCanvasser } = useCanvasserContext();

	return <div>{selectedCanvasser?.name}</div>;
};

export default Dashboard;
