import { Suspense, useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Fiber } from "./logic/fiber";
import {
  Environment,
  PerspectiveCamera,
  OrbitControls,
  AccumulativeShadows,
  RandomizedLight,
} from "@react-three/drei";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { MyContext } from "./Contextapi";
import FontSelector from "./FontLoader";
import ColorPicker from "./ColorPicker";
import { isMobile } from "react-device-detect";
import gsap from "gsap";
import { FormControl, Box, FormControlLabel, Checkbox } from "@mui/material";
import { ChromePicker } from "react-color";
import customisedDesignService from "../services/customised-design-service";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { clientHost, shareHost } from "../constants";
import Slider from "./slider";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Endpoint() {
  console.log("Rendering Endpoint component...");
  // State variables declaration
  const [loading, setLoading] = useState(false);
  const [showBody, setShowBody] = useState(true);
  const [color, setColor] = useState(0xffffff);
  const [shirtColor, setShirtColor] = useState(0xffffff);
  const [updateFiber, setUpdateFiber] = useState(false);
  const [enableEdit, setEnableEdit] = useState(false);
  const [configMode, setConfigMode] = useState(false);
  const [configPart, setConfigPart] = useState(null);
  const [image, setImage] = useState(null);
  const [r_a_c, setr_a_C] = useState(0xffffff);
  const [l_a_c, setl_a_C] = useState(0xffffff);
  const [f_s_c, setf_s_C] = useState(0xffffff);
  const [b_s_c, setb_s_C] = useState(0xffffff);
  const [r_c_c, setr_c_C] = useState(0xffffff);
  const [l_c_c, setl_c_C] = useState(0xffffff);
  const [b_c_c, setb_c_C] = useState(0xffffff);
  const [showDialog, setShowDialog] = useState(false);
  const [inputText, setInputText] = useState("");
  const [sendText, setSendText] = useState(null);
  const [textcolor, settextcolor] = useState("black");
  const [dropdownfont, setdropdownfont] = useState("almendra-bold");
  const [activecanvas, setactivecanvas] = useState();
  const [canvases, setCanvases] = useState([]);
  const [applytoall, setapplytoall] = useState(false);
  const query = useQuery();
  const userId = query.get("userId");
  const orderItemId = query.get("orderItemId");
  const shareLink = `${shareHost}?userId=${userId}&orderItemId=${orderItemId}`;
  const [showLightControl, setShowLightControl] = useState(false);
  const [lightFactor, setLightFactor] = useState(1)

  let canvasescreenshots = [];

  // Refs declaration
  const textcolorref = useRef();
  const [takescreenshot, settakescreenshot] = useState(false);
  const orbitControlref = useRef();
  const cameraref = useRef();

  // Function to handle toggling of body display
  const handleSwitchToggle = () => {
    setShowBody(!showBody);
  };

  // Function to handle shirt color change
  const handleColorChange = (newColor) => {
    setShirtColor(newColor.hex);
  };

  // Function to handle finishing and continuing
  const handleFinishContinue = async () => {
    setUpdateFiber((prev) => !prev); // Toggle the state to trigger an update

    canvases.forEach((el, i) => {
      canvasescreenshots.push(document.getElementById(el.name).toDataURL());
    });

    if (!userId || !orderItemId) {
      toast.error("Malformed URL. Some data is missing!");
      return;
    }

    const data = {
      userId: userId,
      orderItemId: orderItemId,
      designs: canvasescreenshots,
    };

    setLoading(true);
    const response = await customisedDesignService.addCustomisedDesign(data);
    if (!response) {
      toast.error("Something went wrong. Please try again!");
    } else {
      setTimeout(() => {
        setLoading(false);
        window.location.href = `${clientHost}?orderItem=success`;
      }, 3000);
    }

    if (window.innerWidth < 650) {
      document.querySelector(".ui").style.display = "flex";
    }
  };

  // Function to handle image change
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Function to handle dialog completion
  const handleDialogDone = (text) => {
    // Perform actions with the entered text
    setSendText(text);

    // Close the dialog
    setShowDialog(false);
  };

  // Function to close UI
  function closeui() {
    activecanvas.discardActiveObject().renderAll();

    if (window.innerWidth < 650) {
      document.querySelector(".ui").style.display = "none";
    }
  }

  function OpenEyedropper() {
    const eyeDropper = new EyeDropper();
    eyeDropper
      .open()
      .then((result) => {
        setShirtColor(result.sRGBHex);
        //   resultElement.textContent = result.sRGBHex;
        //   resultElement.style.backgroundColor = result.sRGBHex;
      })
      .catch((e) => {
        // resultElement.textContent = e;
      });
  }

  useEffect(() => {
    // Effect to handle UI display based on window width and config mode
    if (window.innerWidth < 650) {
      if (configMode) {
        document.querySelector(".avatar-ui-container") && (document.querySelector(".avatar-ui-container").style.display = "none");
        document.querySelector(".view-3d-button").style.display = "block";
        document.querySelector(".icons-mobile").style.display = "flex";
      } else {
        document.querySelector(".avatar-ui-container") && (document.querySelector(".avatar-ui-container").style.display = "flex");
        document.querySelector(".view-3d-button").style.display = "none";
        document.querySelector(".icons-mobile").style.display = "none";
      }
    }
  }, [configMode]);

  const copyToClipboard = async () => {
    if (navigator.share) {
      const shareData = {
        title: "Hello!",
        url: shareLink,
      }

      try {
        await navigator.share(shareData);
        resultPara.textContent = "MDN shared successfully";
      } catch (err) {
        console.error(`Error: ${err}`);
      }
    } else {
      navigator.clipboard.writeText(shareLink).then(
        () => {
          toast.success("Link copied to clipboard!");
        },
        () => {
          toast.error("Failed to copy the link.");
        },
      );
    }
  };

  return (
    <>
      <MyContext.Provider
        value={{
          inputText,
          applytoall,
          setapplytoall,
          canvases,
          setCanvases,
          activecanvas,
          setactivecanvas,
          dropdownfont,
          setdropdownfont,
          textcolorref,
          textcolor,
          settextcolor,
          showBody,
          color,
          shirtColor,
          updateFiber,
          configPart,
          image,
          sendText,
          orbitControlref,
          takescreenshot,
        }}
      >
        {loading && (
          <div className="overlay">
            <ClipLoader loading={loading} size={150} />
          </div>
        )}
        {/* Main container */}
        <div className={`main-container ${loading ? "disabled" : ""}`}>
          <div className="color-dialog-box">
            <i
              className="color-dialog-box-popup-close-btn bi bi-x"
              onClick={() =>
                (document.querySelector(".color-dialog-box").style.display =
                  "none")
              }
            ></i>
            <FormControlLabel
              control={
                <Checkbox
                  checked={applytoall}
                  onChange={(e) => setapplytoall(e.target.checked)}
                />
              }
              label="Apply to All"
            />
            <FormControl>
              <Box
                style={{ marginTop: "10px", marginBottom: "5px" }}
                display="flex"
                alignItems="center"
              >
                <ChromePicker color={shirtColor} onChange={handleColorChange} disableAlpha={true} />
                <button className="eyedropper" onClick={() => OpenEyedropper()}>
                  <i className="bi bi-eyedropper"></i>
                </button>
              </Box>
            </FormControl>
          </div>

          {/* User interface */}
          <div className="ui">
            {showDialog && (
              // Dialog box for entering text
              <div id="dialog-box" className="center-dialog-box">
                <i
                  className="popup-close-btn bi bi-x"
                  onClick={() => setShowDialog(false)}
                ></i>
                <TextField
                  label="Enter Text"
                  id="textInput"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
                <FontSelector />
                <ColorPicker />

                {/* Done button */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px",
                    marginBottom: "12px",
                  }}
                >
                  <Button
                    style={{
                      borderRadius: "12px",
                      paddingLeft: "50px",
                      paddingRight: "50px",
                      fontWeight: "400",
                      fontSize: "16px",
                      flex: 1,
                      marginRight: "8px",
                      background: "#204b78",
                    }}
                    variant="contained"
                    color="primary"
                    onClick={() => handleDialogDone(inputText)}
                  >
                    Done
                  </Button>
                </div>
              </div>
            )}

            {/* Button for 3D view */}
            <button
              className="view-3d-button"
              onClick={() =>
                (document.querySelector(".ui").style.display = "none")
              }
            >
              3D VIEW
            </button>

            {/* Back section button */}
            {configMode && <div
              className="back-section-btn"
              style={{
                left: "1rem",
                position: "absolute",
                bottom: "1rem",
                textAlign: "center",
                width: "4rem",
                borderRadius: "10px",
                backgroundColor: "#fff",
                cursor: "pointer",
              }}
              onClick={() => {
                setConfigMode(false);
                setConfigPart(null);
                closeui();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="50"
                viewBox="0 -960 960 960"
                width="50"
              >
                <path
                  fill="#124b7a"
                  d="M280-200v-80h284q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H280Z"
                />
              </svg>
            </div>}

            {/* Mobile icons */}
            <div className="icons-mobile">
              {/* Color picker */}
              <div
                className="icons-box"
                onClick={() =>
                  (document.querySelector(".color-dialog-box").style.display =
                    "flex")
                }
              >
                <img src={"images/icons/color-pallet.png"} />
                {/* <input
                    type="color"
                    id="colorPicker"
                    value={shirtColor}
                    style={{ display: 'block' }}
                    onChange={handleColorChange}
                /> */}
              </div>

              {/* Text input */}
              <div
                className="icons-box"
                onClick={() => {
                  if (configPart != null) {
                    setShowDialog(true);
                  }
                }}
              >
                <img src={"images/icons/text-icon.png"} />
              </div>

              {/* Image input */}
              <div
                className="icons-box"
                onClick={() => {
                  if (configPart != null) {
                    document.getElementById("imageInput").click();
                  }
                }}
              >
                <img src={"images/icons/image-icon.png"} />
              </div>
              <input
                type="file"
                accept="image/*"
                id="imageInput"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />

              {/* Share icon */}
              <div className="icons-box" onClick={copyToClipboard}>
                <i className="bi bi-share"></i>
              </div>
            </div>

            {/* Icons container */}
            <div className="icons-cont">
              {!configMode && (<>
                {/* Avatar UI container */}
                <div className="avatar-ui-container">
                  <div className="avatar-ui-column">
                    <div className="slider-text">
                      <label className="switch">
                        <input
                          type="checkbox"
                          onChange={handleSwitchToggle}
                          checked={showBody}
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  </div>
                  <div className="avatar-ui-column">
                    <span className="pt-sans-narrow-bold avatar-ui-switch-label">AVATAR</span>
                    <div className="skin-config-container">
                      <div
                        className="color-box"
                        style={{
                          display: "flex",
                          flexDirection: "row"
                        }}
                      >
                        {/* Color options */}
                        <div
                          className="color-pallet"
                          style={{ backgroundColor: "#fbd1af" }}
                          onClick={() => {
                            setColor(0xfbd1af);
                          }}
                        ></div>
                        <div
                          className="color-pallet"
                          style={{ backgroundColor: "#db9d77" }}
                          onClick={() => {
                            setColor(0xdb9d77);
                          }}
                        ></div>

                        <div
                          className="color-pallet"
                          style={{ backgroundColor: "#b15b1a" }}
                          onClick={() => {
                            setColor(0xb15b1a);
                          }}
                        ></div>
                        <div
                          className="color-pallet"
                          style={{ backgroundColor: "#401f1c" }}
                          onClick={() => {
                            setColor(0x401f1c);
                          }}
                        ></div>
                      </div>
                      <p className="poppins-bold no-margin">SKIN COLOR</p>
                    </div>
                  </div>
                </div>
              </>)}

              <div className={`icons ${(configMode ? 'justify-content-center' : '')}`}>
                {configMode && (<>
                  {/* Color picker */}
                  <div
                    className="icons-box"
                    onClick={() =>
                      (document.querySelector(".color-dialog-box").style.display =
                        "flex")
                    }
                  >
                    <img src={"images/icons/color-pallet.png"} />
                    {/* <input
                          type="color"
                          id="colorPicker"
                          value={shirtColor}
                          style={{ display: 'block' }}
                          onChange={handleColorChange}
                      /> */}
                  </div>

                  {/* Text input */}
                  <div
                    className="icons-box"
                    onClick={() => {
                      if (configPart != null) {
                        setShowDialog(true);
                      }
                    }}
                  >
                    <img src={"images/icons/text-icon.png"} />
                  </div>

                  {/* Dialog box for entering text */}
                  {showDialog && (
                    <div id="dialog-box" className="center-dialog-box">
                      <i
                        className="popup-close-btn bi bi-x"
                        onClick={() => setShowDialog(false)}
                      ></i>
                      <TextField
                        label="Enter Text"
                        id="textInput"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                      <FontSelector />
                      <ColorPicker />

                      {/* Done button */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: "10px",
                          marginBottom: "12px",
                        }}
                      >
                        <Button
                          style={{
                            borderRadius: "12px",
                            paddingLeft: "50px",
                            paddingRight: "50px",
                            fontWeight: "400",
                            fontSize: "16px",
                            flex: 1,
                            marginRight: "8px",
                            background: "#204b78",
                          }}
                          variant="contained"
                          color="primary"
                          onClick={() => handleDialogDone(inputText)}
                        >
                          Done
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Image input */}
                  <div
                    className="icons-box"
                    onClick={() => {
                      if (configPart != null) {
                        document.getElementById("imageInput").click();
                      }
                    }}
                  >
                    <img src={"images/icons/image-icon.png"} />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    id="imageInput"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />

                  {/* Share icon */}
                  <div className="icons-box" onClick={copyToClipboard}>
                    <i className="bi bi-share"></i>
                  </div>
                </>)}

                {!configMode && (<>
                  {/* Light icon */}
                  <div className="light-control">
                    <div className="icons-box" onClick={() => setShowLightControl(!showLightControl)}>
                      <i className="bi bi-brightness-high"></i>
                    </div>

                    {showLightControl && <Slider onChange={(v) => setLightFactor(v)} value={lightFactor} />}
                  </div>
                </>)}
              </div>
            </div>

            {/* Canvases container */}
            <div
              className="canvases-container"
              style={{
                display: configMode === true ? "block" : "none",
                width: "100%",
                height: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex" }}>
                  {/* Canvas sections */}
                  <div
                    style={{
                      display: configPart === "right-arm" ? "block" : "none",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                      alignItems: "center",
                    }}
                  >
                    <canvas
                      style={{ width: "80%", height: "80%" }}
                      id="right-armC"
                    ></canvas>
                    <div className="right-armC-interface canvas-interface"></div>
                  </div>
                  <div
                    style={{
                      display: configPart === "front-sht" ? "block" : "none",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                      alignItems: "center",
                    }}
                  >
                    <canvas
                      style={{ width: "80%", height: "80%" }}
                      id="front-shtC"
                    ></canvas>
                    <div className="front-shtC-interface canvas-interface"></div>
                  </div>
                  <div
                    style={{
                      display: configPart === "left-arm" ? "block" : "none",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                      alignItems: "center",
                    }}
                  >
                    <canvas
                      style={{ width: "80%", height: "80%" }}
                      id="left-armC"
                    ></canvas>
                    <div className="left-armC-interface canvas-interface"></div>
                  </div>
                  <div
                    style={{
                      display: configPart === "right-col" ? "block" : "none",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                      alignItems: "center",
                    }}
                  >
                    <canvas
                      style={{ width: "80%", height: "80%" }}
                      id="right-colC"
                    ></canvas>
                    <div className="right-colC-interface canvas-interface"></div>
                  </div>
                  <div
                    style={{
                      display: configPart === "back-sht" ? "block" : "none",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                      alignItems: "center",
                    }}
                  >
                    <canvas
                      style={{ width: "80%", height: "80%" }}
                      id="back-shtC"
                    ></canvas>
                    <div className="back-shtC-interface canvas-interface"></div>
                  </div>
                  <div
                    style={{
                      display: configPart === "left-col" ? "block" : "none",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                      alignItems: "center",
                    }}
                  >
                    <canvas
                      style={{ width: "80%", height: "80%" }}
                      id="left-colC"
                    ></canvas>
                    <div className="left-colC-interface canvas-interface"></div>
                  </div>
                  <div
                    style={{
                      display: configPart === "back-col" ? "block" : "none",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                      alignItems: "center",
                    }}
                  >
                    <canvas
                      style={{ width: "80%", height: "80%" }}
                      id="back-colC"
                    ></canvas>
                    <div className="back-colC-interface canvas-interface"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {!configMode && <p className="description-text poppins-regular">Wähle ein Pattern aus und schon kann es los gehen</p>}

            {/* Grids and finish button */}
            {configMode == false && (
              <>
                {/* Grids */}
                <div className="grids">
                  {/* Grid items */}
                  <div
                    id="right-arm"
                    style={{
                      backgroundImage: "url(./images/right.png)",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "100% 100%",
                    }}
                    onClick={() => {
                      setConfigMode(true);
                      setConfigPart("right-arm");
                      setShirtColor(r_a_c);
                    }}
                  ></div>
                  <div
                    id="front-sht"
                    style={{
                      backgroundImage: "url(./images/front.png)",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "100% 100%",
                    }}
                    onClick={() => {
                      setConfigMode(true);
                      setConfigPart("front-sht");
                      setShirtColor(f_s_c);
                    }}
                  ></div>
                  <div
                    id="left-arm"
                    style={{
                      backgroundImage: "url(./images/left.png)",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "100% 100%",
                    }}
                    onClick={() => {
                      setConfigMode(true);
                      setConfigPart("left-arm");
                      setShirtColor(l_a_c);
                    }}
                  ></div>
                  <div
                    id="right-col"
                    style={{
                      backgroundImage: "url(./images/4.png)",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "100% 100%",
                    }}
                    onClick={() => {
                      setConfigMode(true);
                      setConfigPart("right-col");
                      setShirtColor(r_c_c);
                    }}
                  ></div>
                  <div
                    id="back-sht"
                    style={{
                      backgroundImage: "url(./images/back.png)",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "100% 100%",
                    }}
                    onClick={() => {
                      setConfigMode(true);
                      setConfigPart("back-sht");
                      setShirtColor(b_s_c);
                    }}
                  ></div>
                  <div
                    id="left-col"
                    style={{
                      backgroundImage: "url(./images/6.png)",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "100% 100%",
                    }}
                    onClick={() => {
                      setConfigMode(true);
                      setConfigPart("left-col");
                      setShirtColor(l_c_c);
                    }}
                  ></div>
                  <div
                    id="back-col"
                    style={{
                      backgroundImage: "url(./images/7.png)",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "100% 100%",
                    }}
                    onClick={() => {
                      setConfigMode(true);
                      setConfigPart("back-col");
                      setShirtColor(b_c_c);
                    }}
                  ></div>
                  {/* Other grid items */}
                  {/* <div
                    style={{
                      backgroundImage: "url(./images/4.png)",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "100% 100%",
                    }}
                  ></div>
                  <div
                    style={{
                      backgroundImage: "url(./images/4.png)",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "100% 100%",
                    }}
                  ></div>
                  <div
                    style={{
                      backgroundImage: "url(./images/4.png)",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "100% 100%",
                    }}
                  ></div>
                  <div
                    style={{
                      backgroundImage: "url(./images/5.png)",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "100% 100%",
                    }}
                  ></div>
                  <div
                    style={{
                      backgroundImage: "url(./images/6.png)",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "100% 100%",
                    }}
                  ></div> */}
                </div>

                {/* Done button */}
                <div className="done-button poppins-regular" onClick={handleFinishContinue}>
                  finish and continue
                </div>
              </>
            )}
          </div>

          <div
            className="canvas-cont"
            style={{ position: "relative", height: "100%" }}
          >
            {/* Mobile light control */}
            <div className="light-control mobile">
              <div className="icons-box" onClick={() => setShowLightControl(!showLightControl)}>
                <i className="bi bi-brightness-high"></i>
              </div>

              {showLightControl && <Slider onChange={(v) => setLightFactor(v)} value={lightFactor} />}
            </div>

            {/* Button to show configurations */}
            <button
              onClick={() =>
                (document.querySelector(".ui").style.display = "flex")
              }
              className="configurations-edit poppins-semibold"
            >
              EDIT HERE
            </button>

            {/* Done button for mobile */}
            <div
              className="done-button mobile-done-button poppins-regular"
              onClick={handleFinishContinue}
            >
              finish and continue
            </div>

            {/* Icon box for mobile */}
            <div
              className="icons-box mobile-icon-box"
              onClick={copyToClipboard}
            >
              <i className="bi bi-share"></i>
            </div>

            {/* WebGL canvas */}
            <Canvas
              className="webgl"
              gl={{ alpha: false, preserveDrawingBuffer: true }}
              shadows
              camera={{ fov: 50 }}
            >
              {/* Set background color */}
              <color attach="background" args={["#DCDCDC"]} />

              <PerspectiveCamera
                ref={cameraref}
                fov={50}
                position={isMobile ? [1.5, 1.5, 6] : [1.5, 0.5, 6]}
              />

              {/* Ambient light */}
              <ambientLight intensity={2 * lightFactor} />
              <directionalLight intensity={5 * lightFactor} position={[1, 2, 4]} />
              <directionalLight intensity={5 * lightFactor} position={[-1, 2, -4]} />

              {/* Suspense for loading */}
              <Suspense fallback={null}>
                {/* Accumulative shadows */}
                <AccumulativeShadows
                  position={[0, -1, 0]}
                  temporal
                  frames={100}
                  colorBlend={0.7}
                  toneMapped={true}
                  alphaTest={0.75}
                  opacity={0.4}
                  scale={12}
                >
                  {/* Randomized light */}
                  <RandomizedLight
                    intensity={Math.PI}
                    amount={8}
                    radius={4}
                    ambient={0.5}
                    position={[4, 4, -5]}
                    bias={0.001}
                  />
                </AccumulativeShadows>

                <Environment preset="night" />
              </Suspense>

              {/* Environment preset */}

              {/* Orbit controls */}
              <OrbitControls
                ref={orbitControlref}
                enablePan={false}
                maxDistance={7}
                target={isMobile ? [0, 0.6, 0] : [0, 0.8, 0]}
                maxPolarAngle={Math.PI / 2.05}
              />

              {/* Fiber component */}
              <Fiber
                showBody={showBody}
                color={color}
                shirtColor={shirtColor}
                updateFiber={updateFiber}
                configPart={configPart}
                image={image}
                sendText={sendText}
              />
            </Canvas>
          </div>
        </div>
      </MyContext.Provider>
    </>
  );
}
