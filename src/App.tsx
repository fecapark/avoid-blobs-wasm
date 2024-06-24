import { useEffect, useState } from "react";
import styles from "./App.module.css";
import { Unity, useUnityContext } from "react-unity-webgl";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import { FaGithub } from "react-icons/fa";
import { Tooltip } from "react-tooltip";

export default function App() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [score, setScore] = useState(0);
  const { unityProvider, isLoaded, addEventListener, removeEventListener } =
    useUnityContext({
      loaderUrl: "unity/avoidblobs.loader.js",
      dataUrl: "unity/avoidblobs.data.br",
      frameworkUrl: "unity/avoidblobs.framework.js.br",
      codeUrl: "unity/avoidblobs.wasm.br",
    });

  const getDevicePixelRatio = () => {
    return window.devicePixelRatio > 1 ? 2 : 1;
  };

  useEffect(() => {
    const wrapper = document.getElementById("game-container");

    const resize = () => {
      if (!wrapper) return;

      const stageWidth = document.body.clientWidth;
      const stageHeight = document.body.clientHeight;

      let { width, height } = wrapper.getBoundingClientRect();

      if (stageWidth > ((stageHeight * 0.8) / 9) * 16) {
        height = stageHeight * 0.8;
        width = (height / 9) * 16;
      } else {
        width = stageWidth - 48;
        height = (width / 16) * 9;
      }

      setSize({ width, height });

      wrapper.style.width = `${width}px`;
      wrapper.style.height = `${height}px`;
    };

    window.addEventListener("resize", resize);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    if (!unityProvider) return;

    function setScoreFromUnity(score: ReactUnityEventParameter) {
      const scoreValue = Math.floor((score as number) * 100) / 100;
      setScore(scoreValue);
    }

    addEventListener("ReactSetScore", setScoreFromUnity);
    return () => {
      removeEventListener("ReactSetScore", setScoreFromUnity);
    };
  }, [unityProvider, addEventListener, removeEventListener, setScore]);

  return (
    <div className={styles.container}>
      <header>
        <div className={styles["logo-container"]}>
          <div className={styles.logo}>
            <img src="/logo.svg" alt="logo" />
          </div>
          <div>
            <div>Avoid</div>
            <div>Blobs</div>
          </div>
        </div>
        <a
          className={styles.github}
          href="https://github.com/fecapark"
          target="_blank"
          rel="noreferrer noopener"
          data-tooltip-id="my-tooltip"
          data-tooltip-content="Github"
          data-tooltip-offset={4}
          data-tooltip-delay-hide={0}
        >
          <FaGithub />
        </a>
        <Tooltip
          id="my-tooltip"
          place="bottom"
          noArrow
          style={{
            transition: "none",
            backgroundColor: "#323236",
            padding: "5px 10px",
            fontWeight: 600,
            fontSize: 15,
          }}
        />
      </header>
      {/* <div>{Math.floor(score * 100) / 100}</div> */}
      <div id="shadow">
        <div id="game-container">
          <Unity
            unityProvider={unityProvider}
            style={{
              width: size.width,
              height: size.height,
              visibility: isLoaded ? "visible" : "hidden",
            }}
            matchWebGLToCanvasSize={true}
            devicePixelRatio={getDevicePixelRatio()}
          />
        </div>
      </div>
      <footer>
        Copyright &copy; {new Date().getFullYear()}{" "}
        <a
          href="https://github.com/fecapark"
          target="_blank"
          rel="noreferrer noopener"
        >
          Sanghyeok Park
        </a>
        . All rights reserved.
      </footer>
    </div>
  );
}
