import { useForm, Controller } from "react-hook-form";
import { Box, Stack, Typography } from "@mui/material";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";
import { Link } from "react-router";
import useAuth from "../../hooks/useAuth";
import AuthLayout from "./AuthLayout";

interface RegisterFormInputs {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
}

const RegisterPage = () => {
	const {
		control,
		handleSubmit,
		watch,
		formState: { errors, isValid },
	} = useForm<RegisterFormInputs>({
		mode: "all",
	});

	const password = watch("password");

	const { registerUser, loading } = useAuth();

	const onSubmit = async (data: RegisterFormInputs) => {
		await registerUser(data);
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
					Register
				</Typography>

				<Stack spacing={2}>
					<Controller
						name="username"
						control={control}
						defaultValue=""
						rules={{
							required: "Username is required",
							minLength: {
								value: 4,
								message: "Min 4 characters",
							},
						}}
						render={({ field }) => (
							<CustomInput
								label="Username"
								{...field}
								customError={errors.username?.message}
							/>
						)}
					/>

					<Controller
						name="email"
						control={control}
						defaultValue=""
						rules={{
							required: "Email is required",
							pattern: {
								value: /^\S+@\S+$/i,
								message: "Invalid email format",
							},
						}}
						render={({ field }) => (
							<CustomInput
								label="Email"
								type="email"
								{...field}
								customError={errors.email?.message}
							/>
						)}
					/>

					<Controller
						name="password"
						control={control}
						defaultValue=""
						rules={{
							required: "Password is required",
							minLength: {
								value: 6,
								message: "Min 6 characters",
							},
						}}
						render={({ field }) => (
							<CustomInput
								label="Password"
								type="password"
								{...field}
								customError={errors.password?.message}
							/>
						)}
					/>

					<Controller
						name="confirmPassword"
						control={control}
						defaultValue=""
						rules={{
							required: "Please confirm your password",
							validate: (value) =>
								value === password || "Passwords do not match",
						}}
						render={({ field }) => (
							<CustomInput
								label="Confirm Password"
								type="password"
								{...field}
								customError={errors.confirmPassword?.message}
							/>
						)}
					/>
					<CustomButton
						label="Register"
						type="submit"
						disabled={!isValid || loading}
						loading={loading}
					/>

					<Typography variant="body2" textAlign="center">
						Already have an account?{" "}
						<Link to="/login">Login here</Link>
					</Typography>
				</Stack>
			</Box>
		</AuthLayout>
	);
};

export default RegisterPage;
