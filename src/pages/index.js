import Head from "next/head";
import { Box, Button, Unstable_Grid2 as Grid, InputBase, Typography } from "@mui/material";
import Tesseract from "tesseract.js";
import { useState, useRef } from "react";
import DropFileInput from "../components/DropFileInput";

const Page = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [image, setImage] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const canvasRef = useRef(null);

  const onFileChange = (files) => {
    setImage(files);
  };

  const handleTranslate = async (item, language) => {
    setShowCanvas(true);

    if (!item) {
      return;
    }
    try {
      await Tesseract.recognize(item, "eng").then(async (res) => {
        if (res.data) {
          overlayTextOnImage(item, language, res.data)
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const overlayTextOnImage = async (item, language, textLines) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = async () => {
      const canvas = canvasRef.current;
      canvas.width = img.width + 10;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      try {
        const translationPromises = textLines.lines.map(async (line) => {
          if (line.text.trim() !== "") {
            const response = await fetch("/api/translate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                text: line.text,
                target_lang: language,
              }),
            });

            const translationData = await response.json();
            const translatedLine = Array.isArray(translationData.translatedText)
              ? translationData.translatedText[0]
              : translationData.translatedText;

            return translatedLine.trim();
          }

          return null;
        });

        const translatedLines = await Promise.all(translationPromises);

        for (let n = 0; n < textLines.lines.length; n++) {
          const line = textLines.lines[n];
          const fontSize = line.words[0].font_size + 1;

          // Check if the line text is not empty or only contains spaces
          if (
            line.text.trim() !== "" &&
            line.text !== " \n" &&
            line.text !== "  \n" &&
            line.text !== " \n\n" &&
            line.text !== "  \n\n" &&
            line.text !== "   \n\n"
          ) {
            // Get color behind text line's x, y points (getting second line text)
            const mainColor = ctx.getImageData(
              textLines.lines[1].bbox.x0,
              textLines.lines[1].bbox.y0,
              1,
              1
            );
            const isBackgroundWhite =
              mainColor.data[0] + mainColor.data[1] + mainColor.data[2] > 383;
            const r = mainColor.data[0];
            const g = mainColor.data[1];
            const b = mainColor.data[2];

            // Draw rectangle
            ctx.beginPath();
            ctx.rect(
              line.bbox.x0,
              line.bbox.y0,
              line.bbox.x1 - line.bbox.x0,
              line.bbox.y1 - line.bbox.y0 + 10
            );

            // Add text background color dynamically
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fill();

            // Overlay the translated text
            ctx.font = `${fontSize}px Arial`;
            ctx.fillStyle = isBackgroundWhite ? "black" : "white";

            // Use translatedLines[n] instead of translatedText
            if (translatedLines[n] !== undefined) {
              ctx.fillText(translatedLines[n], line.bbox.x0, line.bbox.y0 + fontSize);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    img.src = URL.createObjectURL(item);
  };

  return (
    <>
      <Head>
        <title>Home | AI App</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 5,
        }}
      >
        <Typography sx={{ textAlign: "center", m: 5 }} variant="h4">
          Image Translator AI
        </Typography>
        <DropFileInput
          onFileChange={(files) => onFileChange(files)}
          handleTranslate={handleTranslate}
        />
        {showCanvas && (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                my: 5,
                gap: "20px",
              }}
            >
              <canvas
                ref={canvasRef}
                width={500}
                height={300}
                style={{ border: "1px solid black" }}
              />
              {/* <Box sx={{ width: "30%", border: "1px solid gray", m: 3 }}>
                <Typography sx={{ m: 5 }}>{translatedText}</Typography>
              </Box> */}
            </Box>
            {/* <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", my: 5 }}>
              <Button variant="contained">Download Image</Button>
            </Box> */}
          </>
        )}
      </Box>
    </>
  );
};

Page.getLayout = (page) => <>{page}</>;

export default Page;
