import { Suspense, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { fabric } from 'fabric';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { useContext } from 'react';
import { MyContext } from '../Contextapi';
import toast from 'react-hot-toast';
import customisedDesignService from '../../services/customised-design-service';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function Fiber() {
  const [canvas, setCanvas] = useState(null);
  const [selectedImage, setSelectedImage] = new useState(null);

  const [part, setPart] = useState(null);
  const { scene, camera } = useThree();
  const parts = [
    'right-arm',
    'left-arm',
    'front-sht',
    'right-col',
    'back-col',
    'left-col',
    'back-sht',
  ];
  const query = useQuery();
  const userId = query.get('userId');
  const orderItemId = query.get('orderItemId');

  const shirt = useGLTF('./shirt2.glb');

  const {
    applytoall,
    setapplytoall,
    checked,
    canvases,
    setCanvases,
    activecanvas,
    setactivecanvas,
    dropdownfont,
    setdropdownfont,
    textcolorref,
    textcolor,
    showBody,
    color,
    shirtColor,
    updateFiber,
    takescreenshot,
    configPart,
    image,
    sendText,
    orbitControlref,
  } = useContext(MyContext);
  const gl = useThree((state) => state.gl);

  const materialB = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    roughness: 0.7,
    side: THREE.DoubleSide,
  });
  const materialS = new THREE.MeshPhysicalMaterial({ side: THREE.DoubleSide });

  function CreateLayer(canvas, layeritem, object, appendto) {
    const mylayer = document.createElement('div');
    mylayer.className = 'layer-interface';

    if (!layeritem.text) {
      mylayer.innerHTML = `
            <i class="close-icon bi bi-x"></i>
    
            <img class="layer-icon-preview" src=${layeritem._element.src} />
            
            <div class="layer-bar" >
              <img src="images/layer-icon-top.png" class="layer-up-btn"/>
              <img src="images/layer-icon-center.png" class="layer-center-btn"/>
              <img src="images/layer-icon-bottom.png" class="layer-down-btn"/>
            </div>
            
            <i class="bi bi-caret-up-fill"></i>`;
    } else {
      mylayer.innerHTML = `
            <i class="close-icon bi bi-x"></i>
    
            <img class="layer-icon-preview" src="images/icons/text-icon.png" />
            
            <div class="layer-bar">
              <img src="images/layer-icon-top.png" class="layer-up-btn"/>
              <img src="images/layer-icon-center.png" class="layer-center-btn"/>
              <img src="images/layer-icon-bottom.png" class="layer-down-btn"/>
            </div>
            
            <i class="bi bi-caret-up-fill"></i>
            
         `;
    }

    appendto.appendChild(mylayer);

    mylayer.querySelector('.close-icon').addEventListener('click', function () {
      // Remove the layer when the close icon is clicked
      mylayer.remove();

      canvas.remove(layeritem);
      object.material.map.needsUpdate = true;
      canvas.renderAll();
    });

    mylayer
      .querySelector('.layer-up-btn')
      .addEventListener('click', function () {
        // Your logic for layer up action here

        layeritem.bringForward();
        object.material.map.needsUpdate = true;
        canvas.renderAll();
      });

    // Add event listener to the layer-down button
    mylayer
      .querySelector('.layer-down-btn')
      .addEventListener('click', function () {
        // Your logic for layer down action here
        layeritem.sendBackwards();
        object.material.map.needsUpdate = true;
        canvas.renderAll();
      });
  }

  useEffect(() => {
    scene.getObjectByName('BODY').material.color.set(materialB.color);
    scene.getObjectByName('BODY').material.roughness = materialB.roughness;
  }, [color]);

  useEffect(() => {
    if (showBody) {
      gsap.to(camera.position, {
        x: 1,
        y: 0.5,
        z: 6.5,
        duration: 0.9,
        ease: 'sine.inOut',
      });

      gsap.to(orbitControlref.current.target, {
        x: 0,
        y: 1.15,
        z: 0,
        duration: 0.9,
        ease: 'sine.inOut',
      });

      gsap.to(scene.getObjectByName('BODY').material, {
        opacity: 1,
        duration: 0.65,
      });
    } else {
      gsap.to(camera.position, {
        x: 0.65,
        y: 1.5,
        z: 2.5,
        duration: 0.9,
        ease: 'sine.inOut',
      });

      gsap.to(orbitControlref.current.target, {
        x: 0,
        y: 1.5,
        z: 0,
        duration: 0.9,
        ease: 'sine.inOut',
      });

      gsap.to(scene.getObjectByName('BODY').material, {
        opacity: 0,
        duration: 0.65,
      });
    }
  }, [showBody]);

  useEffect(() => {
    if (applytoall == true) {
      canvases.forEach((el, i) => {
        el.getObjects()[0].set('fill', shirtColor);

        scene.getObjectByName(el.name).material.map.needsUpdate = true;

        el.renderAll();
      });
    }

    if (activecanvas && applytoall == false) {
      activecanvas.getObjects()[0].set('fill', shirtColor);

      scene.getObjectByName(activecanvas.name).material.map.needsUpdate = true;

      activecanvas.renderAll();
    }
  }, [shirtColor]);

  useEffect(() => {
    canvases.forEach((el, i) => {
      el.getObjects()[0].set('fill', shirtColor);

      scene.getObjectByName(el.name).material.map.needsUpdate = true;

      el.renderAll();
    });
  }, [applytoall]);

  useEffect(() => {
    if (activecanvas) {
      scene.getObjectByName(activecanvas.name).material.map.needsUpdate = true;

      activecanvas.renderAll();
    }
  }, [textcolor]);

  let size = 4;

  if (window.innerWidth < 650) {
    size = 1.3;
  }

  let myarray = [];

  useEffect(() => {
    parts.map((el, i) => {
      let newCanvas = new fabric.Canvas(`${el}C`, {
        width: window.innerWidth / size,
        height: window.innerWidth / size,
        backgroundColor: 'transparent',
        name: `${el}C`,
      });
      fabric.Object.prototype.set({
        borderScaleFactor: 2,
        borderColor: '#009BDA',
        cornerColor: '#009BDA',
        cornerSize: 10,
        cornerStyle: 'circle',
        transparentCorners: false,
        borderRadius: 10,
      });

      fabric.loadSVGFromURL(`images/${el}C.svg`, function (objects, options) {
        var obj = fabric.util.groupSVGElements(objects);

        const canvasWidth = newCanvas.width;
        const canvasHeight = newCanvas.height;
        const imgWidth = obj.width;
        const imgHeight = obj.height;
        const scaleX = canvasWidth / imgWidth;
        const scaleY = canvasHeight / imgHeight;
        const scale = Math.min(scaleX, scaleY);
        obj.set({
          left: 0,
          top: 0,
          scaleX: scale * 0.92,
          scaleY: scale * 0.92,
        });
        obj.selectable = false;

        newCanvas.centerObject(obj);

        // load shapes
        newCanvas.add(obj);

        scene.getObjectByName(newCanvas.name).material.map.needsUpdate = true;

        newCanvas.renderAll();
      });

      myarray.push(newCanvas);

      let obj = scene.getObjectByName(el + 'C');

      let texture = new THREE.CanvasTexture(document.getElementById(`${el}C`));
      texture.flipY = false;
      texture.needsUpdate = true;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
      texture.needsUpdate = true;

      const new_mtl = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });

      obj.material.map = texture;
      obj.material.envMapIntensity = 0.5;
      obj.material.roughness = 0.8;

      scene.getObjectByName(newCanvas.name).material.map.needsUpdate = true;

      newCanvas.renderAll();

      newCanvas.on('mouse:move', function (obj) {
        scene.getObjectByName(newCanvas.name).material.map.needsUpdate = true;
        newCanvas.renderAll();
      });

      setCanvases((prevCanvases) => [...prevCanvases, newCanvas]);
    });
  }, []);

  useEffect(() => {
    if (image) {
      if (selectedImage) {
        // canvas.remove(selectedImage)
      }

      fabric.Image.fromURL(URL.createObjectURL(image), (img) => {
        const canvasWidth = activecanvas.width;
        const canvasHeight = activecanvas.height;
        const imgWidth = img.width;
        const imgHeight = img.height;
        const scaleX = canvasWidth / imgWidth;
        const scaleY = canvasHeight / imgHeight;
        const scale = Math.min(scaleX, scaleY);
        img.set({
          left: 0,
          top: 0,
          scaleX: scaleY / scaleX / 2.5,
          scaleY: scaleY / scaleX / 2.5,
        });
        setSelectedImage(img);
        activecanvas.centerObject(img);

        activecanvas.add(img);
        CreateLayer(
          activecanvas,
          img,
          scene.getObjectByName(activecanvas.name),
          document.querySelector(`.${activecanvas.name}-interface`)
        );

        parts.forEach((el, i) => {
          let newobj = scene.getObjectByName(el + 'C');
          newobj.material.map.needsUpdate = true;
        });

        scene.getObjectByName(
          activecanvas.name
        ).material.map.needsUpdate = true;

        activecanvas.renderAll();
      });
    }
  }, [image]);

  useEffect(() => {
    if (sendText) {
      var text = new fabric.Text(sendText, {
        fill: textcolor,
        fontFamily: dropdownfont,
      });

      activecanvas.centerObject(text);
      activecanvas.bringToFront();

      activecanvas.add(text);

      scene.getObjectByName(activecanvas.name).material.map.needsUpdate = true;
      activecanvas.renderAll();
      CreateLayer(
        activecanvas,
        text,
        scene.getObjectByName(activecanvas.name),
        document.querySelector(`.${activecanvas.name}-interface`)
      );
    }
  }, [sendText]);

  useEffect(() => {
    if (configPart != null) {
      canvases.forEach((el, i) => {
        if (configPart + 'C' == el.name) {
          setactivecanvas(el);
        }
      });

      setCanvas(canvas);
      setPart(configPart + 'C');
    }
  }, [configPart]);

  shirt.scene.traverse((child) => {
    child.receiveShadow = true;
    child.castShadow = true;
    if (child.isObject3D && child.name == 'BODY') {
      if (!showBody) {
        child.material.transparent = true;
      }
    }
  });

  async function ScreenShot() {
    const imageBase64 = gl.domElement.toDataURL('image/png');

    if (!userId || !orderItemId) {
      toast.error('Malformed URL. Some data is missing!');
      return;
    }

    const data = {
      userId: userId,
      orderItemId: orderItemId,
      design: imageBase64,
    };

    const response = await customisedDesignService.addMainDesign(data);
    if (!response) {
      toast.error('Something went wrong. Please try again!');
    } else {
      toast.success('Share link generated successfully');
    }


    const link = document.createElement('a');
    link.setAttribute('download', 'canvas.png');
    link.setAttribute(
      'href',
      gl.domElement
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream')
    );
    link.click();
  }

  useEffect(() => {
    gsap.to(camera.position, {
      x: 0,
      y: 0.5,
      z: 5,
      duration: 0.7,
      ease: 'sine.inOut',
    });

    gsap.to(orbitControlref.current.target, {
      x: 0,
      y: 1.15,
      z: 0,
      duration: 0.7,
      ease: 'sine.inOut',
    });

    if (updateFiber) {
      setTimeout(() => {
        ScreenShot();
      }, 700);
    }
  }, [updateFiber]);

  return (
    <>
      <primitive object={shirt.scene} scale={1} position={[0, -1, 0]} />
    </>
  );
}
