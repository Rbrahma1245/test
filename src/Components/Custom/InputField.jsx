import { TextField } from "@mui/material";

function InputField({
  label,
  value,
  onChange,
  type,
  name,
  error,
  helperText,
}) {
  return (
    <TextField
      label={label}
      type={type}
      variant="outlined"
      fullWidth
      name={name}
      error={error}
      value={value}
      onChange={onChange}
      helperText={helperText || ""}
    />
  );
}

export default InputField;