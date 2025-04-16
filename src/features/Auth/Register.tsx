import { useForm, Controller } from "react-hook-form";
import { Box, Typography } from "@mui/material";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";
import { Link, useNavigate } from "react-router";
import useToast from "../../hooks/useToast";
import useAuth from "../../hooks/useAuth";

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
	const navigate = useNavigate();
	const showToast = useToast();

	const onSubmit = async (data: RegisterFormInputs) => {
		try {
			await registerUser(data);
			navigate("/login");
			showToast("Successfully Registered, please login", "success");
		} catch (err) {
			showToast("User already exists", "error");
		}
	};

	return (
		<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			minHeight="100vh"
			bgcolor="#eef1f5"
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
					Register
				</Typography>

				<Controller
					name="username"
					control={control}
					defaultValue=""
					rules={{
						required: "Username is required",
						minLength: {
							value: 4,
							message: "Username must be at least 4 characters",
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
							message: "Password must be at least 6 characters",
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
					sx={{ mt: 2 }}
				/>
				<Link to="/login">
					<Typography variant="body1" textAlign="center" mt={2}>
						Back to Login
					</Typography>
				</Link>
			</Box>
		</Box>
	);
};

export default RegisterPage;
