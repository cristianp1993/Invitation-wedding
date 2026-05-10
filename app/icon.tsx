import { ImageResponse } from "next/og";

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
          src="/images/FOTO_2.jpeg"
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
