import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const options = [
  {
    key: "es",
    title: "Spanish",
  },
  {
    key: "de",
    title: "French",
  },
  {
    key: "ja",
    title: "Japanese",
  },
  {
    key: "fr",
    title: "German",
  },
  {
    key: "en",
    title: "English",
  },
  {
    key: "bn",
    title: "Bangla",
  },
];

export default function Language({ handleLanChange }) {
  const [language, setLanguage] = React.useState("en");

  const handleChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <Box>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={language}
        onChange={handleChange}
        size="small"
        sx={{ width: "50%" }}
      >
        {options?.map((item) => (
          <MenuItem
            key={item?.key}
            value={item?.key} // Set the value to item.key
            onClick={() => handleLanChange(item?.key)}
          >
            {item?.title}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
