import { ImageResponse } from "next/og";
import foto2 from "../public/images/FOTO_2.jpeg";
import { readFileSync } from "fs";
import { join } from "path";

const imageBuffer = readFileSync(join(process.cwd(), "public/images/FOTO_2.jpeg"));
const base64Image = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        <img
          src={base64Image}
          alt="Icono de Cristian y Valentina"
          width={64}
          height={64}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "18px",
          }}
        />
      </div>
    ),
    size
  );
}
