import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import Language from "./Language";

export default function TableContent({ contents, handleTranslate }) {
  const [language, setLanguages] = useState("");
  const handleLanChange = (index, key) => {
    setLanguages(key);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>File Name</TableCell>
            <TableCell align="center">File Size</TableCell>
            <TableCell align="center">Source Langauge</TableCell>
            <TableCell align="center">Target Language</TableCell>
            <TableCell align="center">Translate</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contents?.map((item, index) => (
            <>
              <TableRow>
                <TableCell sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <PermMediaIcon />
                  {item?.name}
                </TableCell>
                <TableCell align="center">{item?.size}B</TableCell>
                <TableCell align="center">English</TableCell>
                <TableCell align="center">
                  <Language handleLanChange={(e) => handleLanChange(index, e)} />
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleTranslate(item, language)}
                  >
                    Translate
                  </Button>
                </TableCell>
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
