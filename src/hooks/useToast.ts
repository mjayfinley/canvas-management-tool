import { useToastContext } from "../context/ToastContext";

const useToast = () => {
	const { showToast } = useToastContext();
	return showToast;
};

export default useToast;
