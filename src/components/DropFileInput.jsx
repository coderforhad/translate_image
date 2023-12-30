import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import style from "../styles/drop-file-input.module.css";
import { Grid, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import TableContent from "./TableContent";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const DropFileInput = (props) => {
  const wrapperRef = useRef(null);

  const [fileList, setFileList] = useState([]);

  const onDragEnter = () => wrapperRef.current.classList.add("dragover");

  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");

  const onDrop = () => wrapperRef.current.classList.remove("dragover");

  const onFileDrop = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      const updatedList = [...fileList, newFile];
      setFileList(updatedList);
      props.onFileChange(updatedList);
    }
  };

  const fileRemove = (file) => {
    const updatedList = [...fileList];
    updatedList.splice(fileList.indexOf(file), 1);
    setFileList(updatedList);
    props.onFileChange(updatedList);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          ref={wrapperRef}
          className={style.dropFileInput}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <div className={style.dropFileInputLabel}>
            <CloudUploadIcon sx={{ width: "100px", height: "100px" }} />
            <p>Drag & Drop your files here</p>
          </div>
          <input type="file" value="" onChange={onFileDrop} />
        </div>
      </Box>
      {fileList.length > 0 && (
        <Grid
          sx={{
            display: "flex",
            my: 5,
            mx: 10,
          }}
        >
          <TableContent
            contents={fileList}
            handleTranslate={props.handleTranslate}
          />
        </Grid>
      )}
    </>
  );
};

DropFileInput.propTypes = {
  onFileChange: PropTypes.func,
};

export default DropFileInput;
