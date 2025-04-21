import {
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	SelectChangeEvent,
	FormHelperText,
} from "@mui/material";

interface Option {
	label: string;
	value: string;
}

interface CustomSelectProps {
	name: string;
	label?: string;
	value: string;
	onChange: (event: SelectChangeEvent) => void;
	options: Option[];
	error?: string;
	disabled?: boolean;
}

const CustomSelect = ({
	name,
	label,
	value,
	onChange,
	options,
	error,
	disabled = false,
}: CustomSelectProps) => {
	return (
		<FormControl
			fullWidth
			margin="normal"
			error={!!error}
			disabled={disabled}
		>
			{label && <InputLabel id={`${name}-label`}>{label}</InputLabel>}
			<Select
				labelId={`${name}-label`}
				id={name}
				name={name}
				value={value}
				label={label}
				onChange={onChange}
			>
				{options.map((option) => (
					<MenuItem key={option.value} value={option.value}>
						{option.label}
					</MenuItem>
				))}
			</Select>
			{error && <FormHelperText>{error}</FormHelperText>}
		</FormControl>
	);
};

export default CustomSelect;
