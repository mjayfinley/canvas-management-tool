export const generateRandomNumber = () => {
	const min = 100000000;
	const max = 1000000000;
	const randomNum = Math.floor(Math.random() * (max - min) + min);

	return randomNum.toString();
};
