import { useForm, Controller } from "react-hook-form";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router";
import AuthLayout from "./AuthLayout";

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
	const theme = useTheme();
	const { loginUser, loading } = useAuth();

	const onSubmit = async (data: LoginFormInputs) => {
		try {
			await loginUser(data);
		} catch (err) {}
	};

	return (
		<AuthLayout>
			<Box
				component="form"
				onSubmit={handleSubmit(onSubmit)}
				p={4}
				bgcolor={theme.palette.background.default}
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
