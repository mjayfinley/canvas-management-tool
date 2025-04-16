import { useForm, Controller } from "react-hook-form";
import { Box, Typography } from "@mui/material";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router";
import useToast from "../../hooks/useToast";

interface LoginFormInputs {
	username: string;
	password: string;
}

const LoginPage = () => {
	const {
		control,
		handleSubmit,
		formState: { isValid },
	} = useForm<LoginFormInputs>();

	const { loginUser, loading } = useAuth();
	const navigate = useNavigate();
	const showToast = useToast();

	const onSubmit = async (data: LoginFormInputs) => {
		try {
			await loginUser(data);
			navigate("/map");
			showToast("Successfully Logged In", "success");
		} catch (err) {
			showToast("Error Logging In", "error");
		}
	};

	return (
		<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			minHeight="100vh"
			bgcolor="#f5f5f5"
		>
			<Box
				component="form"
				onSubmit={handleSubmit(onSubmit)}
				p={4}
				bgcolor="white"
				borderRadius={2}
				boxShadow={3}
				width={350}
			>
				<Typography variant="h5" textAlign="center" mb={2}>
					Login
				</Typography>
				<Controller
					name="username"
					control={control}
					defaultValue=""
					rules={{ required: true }}
					render={({ field }) => (
						<CustomInput label="Username" {...field} />
					)}
				/>
				<Controller
					name="password"
					control={control}
					defaultValue=""
					rules={{ required: true }}
					render={({ field }) => (
						<CustomInput
							label="Password"
							type="password"
							{...field}
						/>
					)}
				/>
				<CustomButton
					label="Login"
					type="submit"
					disabled={!isValid || loading}
					loading={loading}
					sx={{ mt: 2 }}
				/>
				<Link to="/register">
					<Typography variant="body1" textAlign="center" mt={2}>
						New user? Click to Register
					</Typography>
				</Link>
			</Box>
		</Box>
	);
};

export default LoginPage;
