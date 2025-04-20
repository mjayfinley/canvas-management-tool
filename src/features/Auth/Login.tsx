import { useForm, Controller } from "react-hook-form";
import { Box, Stack, Typography } from "@mui/material";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router";
import AuthLayout from "./AuthLayout";
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
		<AuthLayout>
			<Box
				component="form"
				onSubmit={handleSubmit(onSubmit)}
				p={4}
				bgcolor="white"
				borderRadius={3}
				boxShadow={4}
				width="100%"
				maxWidth={400}
			>
				<Typography variant="h4" textAlign="center" gutterBottom>
					Login
				</Typography>

				<Stack spacing={2}>
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
					/>

					<Typography variant="body2" textAlign="center">
						New user? <Link to="/register">Register here</Link>
					</Typography>
				</Stack>
			</Box>
		</AuthLayout>
	);
};

export default LoginPage;
