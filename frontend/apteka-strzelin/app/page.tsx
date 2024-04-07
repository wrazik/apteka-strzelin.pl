import Image from "next/image";
import styles from "./page.module.css";
import * as React from "react";
import {NextUIProvider} from "@nextui-org/react";

export default function Home() {
  return (
      <NextUIProvider>
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
            <h1> Home page</h1>
        </div>
      </NextUIProvider>
    )
}
