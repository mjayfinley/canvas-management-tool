import {
	Autocomplete,
	AutocompleteProps,
	TextField,
	Chip,
} from "@mui/material";
import { SyntheticEvent } from "react";

interface CustomAutocompleteProps<T>
	extends Omit<
		AutocompleteProps<T, true, true, false>,
		"onChange" | "renderInput" | "renderTags"
	> {
	label: string;
	value: T[];
	onChange: (value: T[]) => void;
	getOptionLabel: (option: T) => string;
}

const CustomAutoComplete = <T,>({
	label,
	value,
	onChange,
	options,
	getOptionLabel,
	sx,
	...props
}: CustomAutocompleteProps<T>) => {
	return (
		<Autocomplete
			multiple
			disableCloseOnSelect
			options={options}
			value={value}
			sx={sx}
			getOptionLabel={getOptionLabel}
			onChange={(_event: SyntheticEvent, newValue: T[]) =>
				onChange(newValue)
			}
			renderValue={(selected, getTagProps) =>
				selected.map((option, index) => (
					<Chip
						{...getTagProps({ index })}
						key={index}
						label={getOptionLabel(option)}
					/>
				))
			}
			renderInput={(params) => <TextField {...params} label={label} />}
			{...props}
		/>
	);
};

export default CustomAutoComplete;
