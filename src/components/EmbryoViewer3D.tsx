import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EmbryoStage, SlicingSettings, ViewSettings, GermLayer } from '../types';

interface EmbryoViewer3DProps {
  stage: EmbryoStage;
  slicing: SlicingSettings;
  viewSettings: ViewSettings;
  selectedStructureId: string | null;
  onSelectStructure: (id: string | null) => void;
  hoveredStructureId: string | null;
  onHoverStructure: (id: string | null) => void;
}

export default function EmbryoViewer3D({
  stage,
  slicing,
  viewSettings,
  selectedStructureId,
  onSelectStructure,
  hoveredStructureId,
  onHoverStructure,
}: EmbryoViewer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Keep references to Three.js objects
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const clipPlaneRef = useRef<THREE.Plane | null>(null);
  const planeHelperRef = useRef<THREE.LineLoop | null>(null);
  
  // Group containing the embryo models
  const embryoGroupRef = useRef<THREE.Group | null>(null);
  // Map of structures to their 3D meshes/groups
  const meshesMapRef = useRef<Map<string, THREE.Object3D>>(new Map());
  
  // State for projected 2D label coordinates
  const [projectedLabels, setProjectedLabels] = useState<
    Array<{ id: string; name: string; x: number; y: number; visible: boolean; color: string }>
  >([]);

  // Sync refs to bypass stale closures in the continuous Three.js animation loop
  const stageRef = useRef<EmbryoStage>(stage);
  const viewSettingsRef = useRef<ViewSettings>(viewSettings);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    viewSettingsRef.current = viewSettings;
  }, [viewSettings]);

  const [sceneInitialized, setSceneInitialized] = useState(false);

  // Update clipping plane whenever slicing settings change
  useEffect(() => {
    if (!clipPlaneRef.current || !rendererRef.current) return;

    const plane = clipPlaneRef.current;
    rendererRef.current.localClippingEnabled = slicing.enabled;

    // Set normal based on selected plane
    switch (slicing.plane) {
      case 'sagittal':
        plane.normal.set(1, 0, 0);
        break;
      case 'transverse':
        plane.normal.set(0, 1, 0);
        break;
      case 'coronal':
        plane.normal.set(0, 0, 1);
        break;
    }

    // Set constant (depth/offset)
    // Slicing depth ranges from -1.5 to 1.5
    plane.constant = -slicing.depth;

    // Show/hide helper plane outline
    if (planeHelperRef.current && sceneRef.current) {
      planeHelperRef.current.visible = slicing.enabled;
      
      // Update helper plane position
      planeHelperRef.current.position.set(0, 0, 0);
      planeHelperRef.current.rotation.set(0, 0, 0);
      if (slicing.plane === 'sagittal') {
        planeHelperRef.current.rotation.y = Math.PI / 2;
        planeHelperRef.current.position.x = slicing.depth;
      } else if (slicing.plane === 'transverse') {
        planeHelperRef.current.rotation.x = Math.PI / 2;
        planeHelperRef.current.position.y = slicing.depth;
      } else if (slicing.plane === 'coronal') {
        planeHelperRef.current.position.z = slicing.depth;
      }
    }
  }, [slicing]);

  // Update controls and auto-rotation
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = viewSettings.autoRotate;
      controlsRef.current.autoRotateSpeed = 1.0;
    }
  }, [viewSettings.autoRotate]);

  // Rebuild the 3D embryo model whenever the stage, transparency, or exploded view changes
  useEffect(() => {
    if (!sceneInitialized || !sceneRef.current || !embryoGroupRef.current) return;

    // Clear previous embryo meshes
    const group = embryoGroupRef.current;
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
    }
    meshesMapRef.current.clear();

    const clipPlane = clipPlaneRef.current!;

    // Helper to create materials with standard settings
    const createMaterial = (
      color: string,
      opacity = 1,
      emissive = '#000000',
      roughness = 0.5,
      metalness = 0.1
    ) => {
      const isTransparent = opacity < 1;
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness: roughness,
        metalness: metalness,
        emissive: new THREE.Color(emissive),
        transparent: isTransparent,
        opacity: opacity,
        side: THREE.DoubleSide,
        clippingPlanes: [clipPlane],
        clipShadows: true,
      });
    };

    // Build stage-specific models
    if (stage.id === 'day1-zygote') {
      // 1. Zona Pellucida (Outer shell)
      const zpOpacity = viewSettings.transparentOuterLayers ? 0.08 : 0.25;
      const zpMat = createMaterial('#e2e8f0', zpOpacity, '#3b4252', 0.1, 0.2);
      zpMat.wireframe = false;
      const zpGeo = new THREE.SphereGeometry(1.2, 40, 40);
      const zpMesh = new THREE.Mesh(zpGeo, zpMat);
      
      // Exploded view offsets outer shell outward
      if (viewSettings.explodedView) {
        zpMesh.scale.set(1.4, 1.4, 1.4);
      }
      group.add(zpMesh);
      meshesMapRef.current.set('zona_pellucida', zpMesh);

      // 2. Cytoplasm (Main cell body)
      const cytoMat = createMaterial('#fed7aa', 0.8, '#431407', 0.6, 0.0);
      const cytoGeo = new THREE.SphereGeometry(0.85, 32, 32);
      const cytoMesh = new THREE.Mesh(cytoGeo, cytoMat);
      group.add(cytoMesh);
      meshesMapRef.current.set('cytoplasm', cytoMesh);

      // 3. Pronuclei (Genetic nuclei inside)
      const malePnMat = createMaterial('#60a5fa', 0.9, '#1d4ed8', 0.2, 0.1);
      const malePnGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const malePnMesh = new THREE.Mesh(malePnGeo, malePnMat);
      malePnMesh.position.set(0.25, 0.1, 0.0);
      group.add(malePnMesh);
      meshesMapRef.current.set('male_pronucleus', malePnMesh);

      const femalePnMat = createMaterial('#f472b6', 0.9, '#be185d', 0.2, 0.1);
      const femalePnGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const femalePnMesh = new THREE.Mesh(femalePnGeo, femalePnMat);
      femalePnMesh.position.set(-0.25, -0.1, 0.1);
      group.add(femalePnMesh);
      meshesMapRef.current.set('female_pronucleus', femalePnMesh);

      // 4. Polar Bodies (Discarded cells wedged inside shell)
      const polarMat = createMaterial('#c084fc', 0.9, '#6b21a8', 0.3, 0.1);
      const polarGeo1 = new THREE.SphereGeometry(0.08, 12, 12);
      const polarMesh1 = new THREE.Mesh(polarGeo1, polarMat);
      polarMesh1.position.set(0.7, -0.55, 0.3);
      group.add(polarMesh1);

      const polarGeo2 = new THREE.SphereGeometry(0.07, 12, 12);
      const polarMesh2 = new THREE.Mesh(polarGeo2, polarMat);
      polarMesh2.position.set(0.62, -0.62, 0.2);
      group.add(polarMesh2);

      // Group polar bodies under same ID
      const polarGroup = new THREE.Group();
      polarGroup.add(polarMesh1);
      polarGroup.add(polarMesh2);
      group.add(polarGroup);
      meshesMapRef.current.set('polar_body', polarGroup);

    } else if (stage.id === 'day3-morula') {
      // 1. Zona Pellucida
      const zpOpacity = viewSettings.transparentOuterLayers ? 0.06 : 0.2;
      const zpMat = createMaterial('#e2e8f0', zpOpacity, '#334155', 0.2, 0.1);
      const zpGeo = new THREE.SphereGeometry(1.2, 32, 32);
      const zpMesh = new THREE.Mesh(zpGeo, zpMat);
      if (viewSettings.explodedView) {
        zpMesh.scale.set(1.4, 1.4, 1.4);
      }
      group.add(zpMesh);
      meshesMapRef.current.set('zona_pellucida', zpMesh);

      // 2. Mulberry tight pack of blastomeres
      const morulaClusterGroup = new THREE.Group();
      
      // We will place 16 spheres tightly packed.
      // 3 inner, 13 outer.
      const cellPositions: [number, number, number][] = [
        [0, 0, 0], // Center
        [0.15, 0.15, -0.15],
        [-0.15, -0.1, 0.1],
        // Outer layer
        [0.45, 0.45, 0.2],
        [-0.45, -0.45, -0.2],
        [0.5, -0.3, 0.3],
        [-0.5, 0.3, -0.3],
        [0.3, 0.5, -0.4],
        [-0.3, -0.5, 0.4],
        [0.2, -0.4, -0.5],
        [-0.2, 0.4, 0.5],
        [0.55, 0.1, -0.2],
        [-0.55, -0.1, 0.2],
        [0.1, 0.55, 0.3],
        [-0.1, -0.55, -0.3],
        [0.3, -0.2, 0.55],
      ];

      const blastomeresList: THREE.Mesh[] = [];
      const outerCellsList: THREE.Mesh[] = [];

      cellPositions.forEach((pos, idx) => {
        const isInner = idx < 3;
        const radius = isInner ? 0.32 : 0.35;
        
        // Color outer slightly darker orange, inner more golden/yellow
        const color = isInner ? '#fdba74' : '#f97316';
        const emissive = isInner ? '#7c2d12' : '#ea580c';
        
        const mat = createMaterial(color, 0.95, emissive, 0.4, 0.0);
        const geo = new THREE.SphereGeometry(radius, 16, 16);
        const cell = new THREE.Mesh(geo, mat);
        cell.position.set(...pos);

        if (viewSettings.explodedView) {
          // Push outer cells further away from center
          if (!isInner) {
            cell.position.multiplyScalar(1.25);
          }
        }

        morulaClusterGroup.add(cell);
        
        if (isInner) {
          blastomeresList.push(cell);
        } else {
          outerCellsList.push(cell);
        }
      });

      group.add(morulaClusterGroup);

      // Create proxy groups in the map so hovering highlights the correct cells
      const innerProxy = new THREE.Group();
      blastomeresList.forEach(c => innerProxy.add(c.clone())); // Note: clone doesn't interfere, just for tracking
      meshesMapRef.current.set('inner_cells', morulaClusterGroup); // Bind entire morula clump for inner click
      meshesMapRef.current.set('blastomeres', morulaClusterGroup);
      meshesMapRef.current.set('outer_cells', morulaClusterGroup);

    } else if (stage.id === 'day5-blastocyst') {
      // 1. Hatching Zona Pellucida
      const zpOpacity = viewSettings.transparentOuterLayers ? 0.05 : 0.15;
      const zpMat = createMaterial('#cbd5e1', zpOpacity, '#334155', 0.2, 0.1);
      // Modeled as a hemisphere representing the cracked capsule being shed
      const zpGeo = new THREE.SphereGeometry(1.2, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.7);
      const zpMesh = new THREE.Mesh(zpGeo, zpMat);
      zpMesh.position.set(-0.4, -0.2, 0.1);
      zpMesh.rotation.z = Math.PI / 4;
      if (viewSettings.explodedView) {
        zpMesh.position.multiplyScalar(1.5);
      }
      group.add(zpMesh);
      meshesMapRef.current.set('hatching_zona', zpMesh);

      // 2. Blastocoele Fluid Cavity (Translucent core)
      const fluidMat = createMaterial('#7dd3fc', 0.4, '#0369a1', 0.1, 0.0);
      const fluidGeo = new THREE.SphereGeometry(0.85, 32, 32);
      const fluidMesh = new THREE.Mesh(fluidGeo, fluidMat);
      fluidMesh.position.set(0.1, -0.05, 0.0);
      group.add(fluidMesh);
      meshesMapRef.current.set('blastocoele', fluidMesh);

      // 3. Trophoblast (Outer flat cell layer)
      const trophoGroup = new THREE.Group();
      const trophoOpacity = viewSettings.transparentOuterLayers ? 0.25 : 0.85;
      
      // Place small spheres all around representing individual outer cells
      const cellsCount = 48;
      const trophoCells: THREE.Mesh[] = [];
      for (let i = 0; i < cellsCount; i++) {
        // Golden spiral on sphere
        const phi = Math.acos(-1 + (2 * i) / cellsCount);
        const theta = Math.sqrt(cellsCount * Math.PI) * phi;

        const x = 0.9 * Math.sin(phi) * Math.cos(theta);
        const y = 0.9 * Math.cos(phi);
        const z = 0.9 * Math.sin(phi) * Math.sin(theta);

        // Don't place cells at the upper-left pole where the ICM sits, to make it visible
        const distToIcm = Math.sqrt((x - -0.4) ** 2 + (y - 0.5) ** 2 + (z - 0.1) ** 2);
        if (distToIcm < 0.45) continue; // Skip to leave ICM visible

        const trophoCellMat = createMaterial('#ea580c', trophoOpacity, '#7c2d12', 0.3, 0.0);
        const trophoCellGeo = new THREE.SphereGeometry(0.15, 12, 12);
        const trophoCell = new THREE.Mesh(trophoCellGeo, trophoCellMat);
        trophoCell.position.set(x, y, z);
        
        if (viewSettings.explodedView) {
          trophoCell.position.multiplyScalar(1.25);
        }

        trophoGroup.add(trophoCell);
        trophoCells.push(trophoCell);
      }
      group.add(trophoGroup);
      meshesMapRef.current.set('trophoblast', trophoGroup);

      // 4. Inner Cell Mass (Embryoblast)
      const icmGroup = new THREE.Group();
      const icmColors = ['#2563eb', '#3b82f6', '#1d4ed8'];
      
      // Dense clump of blue cells clustered at one pole (-0.4, 0.5, 0.1)
      const icmCount = 12;
      for (let i = 0; i < icmCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 0.4; // restricted cap
        const r = 0.25 * Math.random();

        const dx = r * Math.sin(phi) * Math.cos(theta);
        const dy = r * Math.cos(phi);
        const dz = r * Math.sin(phi) * Math.sin(theta);

        const color = icmColors[i % icmColors.length];
        const icmMat = createMaterial(color, 0.95, '#1e3a8a', 0.4, 0.1);
        const icmGeo = new THREE.SphereGeometry(0.14, 12, 12);
        const icmCell = new THREE.Mesh(icmGeo, icmMat);
        // Base center at ICM position
        icmCell.position.set(-0.45 + dx, 0.45 + dy, 0.1 + dz);
        
        if (viewSettings.explodedView) {
          icmCell.position.y += 0.2; // pull apart
        }

        icmGroup.add(icmCell);
      }
      group.add(icmGroup);
      meshesMapRef.current.set('inner_cell_mass', icmGroup);

    } else if (stage.id === 'day8-bilaminar') {
      // 1. Endometrium background (Maternal Womb)
      const endoOpacity = viewSettings.transparentOuterLayers ? 0.05 : 0.18;
      const endoMat = createMaterial('#991b1b', endoOpacity, '#450a0a', 0.8, 0.0);
      const endoGeo = new THREE.BoxGeometry(2.8, 2.8, 2.8);
      const endoMesh = new THREE.Mesh(endoGeo, endoMat);
      endoMesh.position.set(0, 0, -0.5);
      group.add(endoMesh);

      // 2. Syncytiotrophoblast (Red invasive fingers/blobs)
      const syncGroup = new THREE.Group();
      const syncCount = 8;
      for (let i = 0; i < syncCount; i++) {
        const scaleX = 0.3 + Math.random() * 0.4;
        const scaleY = 0.3 + Math.random() * 0.4;
        const scaleZ = 0.3 + Math.random() * 0.4;
        
        const syncMat = createMaterial('#dc2626', 0.7, '#7f1d1d', 0.7, 0.1);
        const syncGeo = new THREE.SphereGeometry(0.3, 12, 12);
        const syncCell = new THREE.Mesh(syncGeo, syncMat);
        
        // Position them invading the maternal endometrium on the right side
        syncCell.position.set(
          0.7 + Math.random() * 0.6,
          -0.6 + Math.random() * 1.2,
          -0.5 + Math.random() * 1.0
        );
        syncCell.scale.set(scaleX, scaleY, scaleZ);
        syncGroup.add(syncCell);
      }
      group.add(syncGroup);
      meshesMapRef.current.set('syncytiotrophoblast', syncGroup);

      // 3. Cytotrophoblast (Inner trophoblast ring)
      const cytoTrophoOpacity = viewSettings.transparentOuterLayers ? 0.15 : 0.4;
      const cytoTrophoMat = createMaterial('#f97316', cytoTrophoOpacity, '#7c2d12', 0.3, 0.0);
      const cytoTrophoGeo = new THREE.SphereGeometry(0.95, 32, 32);
      const cytoTrophoMesh = new THREE.Mesh(cytoTrophoGeo, cytoTrophoMat);
      if (viewSettings.explodedView) {
        cytoTrophoMesh.scale.multiplyScalar(1.2);
      }
      group.add(cytoTrophoMesh);
      meshesMapRef.current.set('cytotrophoblast', cytoTrophoMesh);

      // 4. Amniotic Cavity (Blue fluid dome)
      const amnOpacity = viewSettings.transparentOuterLayers ? 0.2 : 0.5;
      const amnMat = createMaterial('#60a5fa', amnOpacity, '#1e40af', 0.2, 0.0);
      const amnGeo = new THREE.SphereGeometry(0.4, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2);
      const amnMesh = new THREE.Mesh(amnGeo, amnMat);
      amnMesh.position.set(0, 0.1, 0.2);
      amnMesh.scale.set(1.2, 0.8, 1.2);
      if (viewSettings.explodedView) {
        amnMesh.position.y += 0.35;
      }
      group.add(amnMesh);
      meshesMapRef.current.set('amniotic_cavity', amnMesh);

      // 5. Yolk Sac (Yellow fluid dome)
      const yolkOpacity = viewSettings.transparentOuterLayers ? 0.2 : 0.5;
      const yolkMat = createMaterial('#fef08a', yolkOpacity, '#854d0e', 0.2, 0.0);
      const yolkGeo = new THREE.SphereGeometry(0.45, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2);
      const yolkMesh = new THREE.Mesh(yolkGeo, yolkMat);
      yolkMesh.position.set(0, -0.1, 0.2);
      yolkMesh.rotation.x = Math.PI; // Flip downward
      yolkMesh.scale.set(1.2, 0.8, 1.2);
      if (viewSettings.explodedView) {
        yolkMesh.position.y -= 0.35;
      }
      group.add(yolkMesh);
      meshesMapRef.current.set('yolk_sac', yolkMesh);

      // 6. Epiblast (Top plate of disc - blue cylinders)
      const epiGroup = new THREE.Group();
      const epiCellCount = 12;
      for (let i = 0; i < epiCellCount; i++) {
        const radius = 0.45;
        const angle = (i / epiCellCount) * Math.PI * 2;
        const x = Math.cos(angle) * radius * 0.65;
        const z = Math.sin(angle) * radius * 0.65;

        const epiCellMat = createMaterial('#3b82f6', 0.95, '#1e3b8a', 0.4, 0.1);
        const epiCellGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.12, 8);
        const epiCell = new THREE.Mesh(epiCellGeo, epiCellMat);
        epiCell.position.set(x, 0.06, 0.2 + z);
        epiGroup.add(epiCell);
      }
      // Add center cells
      for (let j = 0; j < 4; j++) {
        const x = (Math.random() - 0.5) * 0.2;
        const z = (Math.random() - 0.5) * 0.2;
        const epiCellMat = createMaterial('#1d4ed8', 0.95, '#172554', 0.4, 0.1);
        const epiCellGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.12, 8);
        const epiCell = new THREE.Mesh(epiCellGeo, epiCellMat);
        epiCell.position.set(x, 0.06, 0.2 + z);
        epiGroup.add(epiCell);
      }
      group.add(epiGroup);
      meshesMapRef.current.set('epiblast', epiGroup);

      // 7. Hypoblast (Bottom plate of disc - yellow cubes)
      const hypoGroup = new THREE.Group();
      const hypoCellCount = 12;
      for (let i = 0; i < hypoCellCount; i++) {
        const radius = 0.45;
        const angle = (i / hypoCellCount) * Math.PI * 2;
        const x = Math.cos(angle) * radius * 0.65;
        const z = Math.sin(angle) * radius * 0.65;

        const hypoCellMat = createMaterial('#eab308', 0.95, '#713f12', 0.5, 0.0);
        const hypoCellGeo = new THREE.BoxGeometry(0.1, 0.08, 0.1);
        const hypoCell = new THREE.Mesh(hypoCellGeo, hypoCellMat);
        hypoCell.position.set(x, -0.04, 0.2 + z);
        hypoGroup.add(hypoCell);
      }
      // Center cubes
      for (let j = 0; j < 4; j++) {
        const x = (Math.random() - 0.5) * 0.2;
        const z = (Math.random() - 0.5) * 0.2;
        const hypoCellMat = createMaterial('#ca8a04', 0.95, '#451a03', 0.5, 0.0);
        const hypoCellGeo = new THREE.BoxGeometry(0.1, 0.08, 0.1);
        const hypoCell = new THREE.Mesh(hypoCellGeo, hypoCellMat);
        hypoCell.position.set(x, -0.04, 0.2 + z);
        hypoGroup.add(hypoCell);
      }
      group.add(hypoGroup);
      meshesMapRef.current.set('hypoblast', hypoGroup);

    } else if (stage.id === 'day16-gastrulation') {
      // Model the trilaminar embryonic disc

      // 1. Ectoderm (Top curved blue plate)
      const ectoMat = createMaterial('#1d4ed8', 0.95, '#172554', 0.4, 0.1);
      const ectoGeo = new THREE.CylinderGeometry(0.7, 0.8, 0.1, 32, 1);
      ectoGeo.scale(1.2, 1.0, 1.0); // Make oval
      const ectoMesh = new THREE.Mesh(ectoGeo, ectoMat);
      ectoMesh.position.set(0, 0.15, 0.2);
      if (viewSettings.explodedView) {
        ectoMesh.position.y += 0.35;
      }
      group.add(ectoMesh);
      meshesMapRef.current.set('ectoderm', ectoMesh);

      // 2. Endoderm (Bottom yellow plate)
      const endoMat = createMaterial('#ca8a04', 0.95, '#451a03', 0.5, 0.0);
      const endoGeo = new THREE.CylinderGeometry(0.8, 0.7, 0.1, 32, 1);
      endoGeo.scale(1.2, 1.0, 1.0);
      const endoMesh = new THREE.Mesh(endoGeo, endoMat);
      endoMesh.position.set(0, -0.15, 0.2);
      if (viewSettings.explodedView) {
        endoMesh.position.y -= 0.35;
      }
      group.add(endoMesh);
      meshesMapRef.current.set('endoderm', endoMesh);

      // 3. Mesoderm (Middle layer spreading outwards)
      const mesoGroup = new THREE.Group();
      const mesoCount = 28;
      const mesoColors = ['#dc2626', '#ef4444', '#b91c1c'];
      for (let i = 0; i < mesoCount; i++) {
        const u = Math.random();
        const v = Math.random();
        
        // Cluster them more intensely radiating from the streak (midline, caudal)
        const radiusX = 0.55 + 0.3 * Math.random();
        const radiusZ = 0.65 + 0.3 * Math.random();
        const angle = (Math.random() - 0.5) * Math.PI * 1.5; // Fan out anteriorly

        const x = Math.sin(angle) * radiusX * u;
        const z = -0.2 + Math.cos(angle) * radiusZ * u; // offset caudal
        
        const scaleX = 0.1 + Math.random() * 0.15;
        const scaleY = 0.05 + Math.random() * 0.05;
        const scaleZ = 0.1 + Math.random() * 0.15;

        const color = mesoColors[i % mesoColors.length];
        const mesoMat = createMaterial(color, 0.9, '#7f1d1d', 0.5, 0.1);
        const mesoGeo = new THREE.SphereGeometry(1.0, 10, 10);
        const mesoCell = new THREE.Mesh(mesoGeo, mesoMat);
        mesoCell.position.set(x, 0, 0.2 + z);
        mesoCell.scale.set(scaleX, scaleY, scaleZ);

        if (viewSettings.explodedView) {
          // Push middle cells out slightly
          mesoCell.position.x *= 1.15;
        }

        mesoGroup.add(mesoCell);
      }
      group.add(mesoGroup);
      meshesMapRef.current.set('mesoderm', mesoGroup);

      // 4. Primitive Streak & Groove (caudal furrow)
      const streakMat = createMaterial('#a21caf', 0.95, '#581c87', 0.5, 0.2);
      // Elongated squashed box
      const streakGeo = new THREE.BoxGeometry(0.12, 0.08, 0.6);
      const streakMesh = new THREE.Mesh(streakGeo, streakMat);
      streakMesh.position.set(0, 0.16, 0.4);
      if (viewSettings.explodedView) {
        streakMesh.position.y += 0.35;
      }
      group.add(streakMesh);
      meshesMapRef.current.set('primitive_streak', streakMesh);

      // 5. Primitive Node (elevated head)
      const nodeMat = createMaterial('#c084fc', 0.95, '#4a044e', 0.3, 0.1);
      const nodeGeo = new THREE.TorusGeometry(0.1, 0.04, 8, 24);
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.rotation.x = Math.PI / 2;
      nodeMesh.position.set(0, 0.16, 0.05);
      if (viewSettings.explodedView) {
        nodeMesh.position.y += 0.35;
      }
      group.add(nodeMesh);
      meshesMapRef.current.set('primitive_node', nodeMesh);

    } else if (stage.id === 'day21-neurulation') {
      // Model neurulation folds, somites and neural tube

      // 1. Neural Tube (Pre-spinal cord/brain along Z axis)
      const ntMat = createMaterial('#2563eb', 0.95, '#172554', 0.4, 0.1);
      const ntGeo = new THREE.CylinderGeometry(0.14, 0.1, 1.6, 16);
      ntGeo.rotateX(Math.PI / 2); // align along Z axis
      const ntMesh = new THREE.Mesh(ntGeo, ntMat);
      ntMesh.position.set(0, 0.1, 0);
      if (viewSettings.explodedView) {
        ntMesh.position.y += 0.35;
      }
      group.add(ntMesh);
      meshesMapRef.current.set('neural_tube', ntMesh);

      // 2. Notochord (Inductive rod underneath tube)
      const notoMat = createMaterial('#9333ea', 0.95, '#4a044e', 0.2, 0.1);
      const notoGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.55, 8);
      notoGeo.rotateX(Math.PI / 2);
      const notoMesh = new THREE.Mesh(notoGeo, notoMat);
      notoMesh.position.set(0, -0.06, 0.0);
      group.add(notoMesh);
      meshesMapRef.current.set('notochord', notoMesh);

      // 3. Somites (Paired red paraxial blocks flanking the tube)
      const somitesGroup = new THREE.Group();
      const somiteCount = 6; // pairs
      const zCoords = [-0.65, -0.4, -0.15, 0.1, 0.35, 0.6];
      for (let i = 0; i < somiteCount; i++) {
        const somiteMat = createMaterial('#ef4444', 0.95, '#7f1d1d', 0.5, 0.0);
        const somiteGeoL = new THREE.SphereGeometry(0.14, 12, 12);
        somiteGeoL.scale(1.2, 1.0, 1.0);
        const leftSomite = new THREE.Mesh(somiteGeoL, somiteMat);
        leftSomite.position.set(-0.25, 0.04, zCoords[i]);

        const somiteGeoR = new THREE.SphereGeometry(0.14, 12, 12);
        somiteGeoR.scale(1.2, 1.0, 1.0);
        const rightSomite = new THREE.Mesh(somiteGeoR, somiteMat);
        rightSomite.position.set(0.25, 0.04, zCoords[i]);

        if (viewSettings.explodedView) {
          leftSomite.position.x -= 0.2;
          rightSomite.position.x += 0.2;
        }

        somitesGroup.add(leftSomite);
        somitesGroup.add(rightSomite);
      }
      group.add(somitesGroup);
      meshesMapRef.current.set('somites', somitesGroup);

      // 4. Surface Ectoderm (Flanking protective sheets)
      const surfEctoMat = createMaterial('#3b82f6', 0.4, '#1e3a8a', 0.4, 0.0);
      const surfEctoGeoL = new THREE.BoxGeometry(0.4, 0.05, 1.6);
      const surfEctoL = new THREE.Mesh(surfEctoGeoL, surfEctoMat);
      surfEctoL.position.set(-0.5, 0.16, 0);

      const surfEctoGeoR = new THREE.BoxGeometry(0.4, 0.05, 1.6);
      const surfEctoR = new THREE.Mesh(surfEctoGeoR, surfEctoMat);
      surfEctoR.position.set(0.5, 0.16, 0);

      const surfGroup = new THREE.Group();
      surfGroup.add(surfEctoL);
      surfGroup.add(surfEctoR);
      if (viewSettings.explodedView) {
        surfGroup.position.y += 0.25;
      }
      group.add(surfGroup);
      meshesMapRef.current.set('ectoderm_surface', surfGroup);

      // 5. Ventral Endoderm (Yellow curved gut precursor)
      const endoSheetMat = createMaterial('#eab308', 0.5, '#713f12', 0.5, 0.0);
      const endoSheetGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.6, 16, 1, true, 0, Math.PI);
      endoSheetGeo.rotateX(Math.PI / 2);
      endoSheetGeo.rotateZ(Math.PI); // facing downward
      const endoSheet = new THREE.Mesh(endoSheetGeo, endoSheetMat);
      endoSheet.position.set(0, -0.22, 0);
      if (viewSettings.explodedView) {
        endoSheet.position.y -= 0.35;
      }
      group.add(endoSheet);
      meshesMapRef.current.set('endoderm_gut', endoSheet);

    } else if (stage.id === 'day28-folding') {
      // Model the classic C-shaped Day 28 Embryo

      // We place organic segments along a curved path in a C-shape
      const bodyGroup = new THREE.Group();
      
      // Let's draw the C-shape
      // Math: r = 0.75, angle from -2.0 radians (head) to 1.5 radians (tail)
      const segmentsCount = 18;
      const bodyPoints: THREE.Vector3[] = [];
      const radii: number[] = [];

      for (let i = 0; i < segmentsCount; i++) {
        // Map i to an angle from head to tail
        const progress = i / (segmentsCount - 1);
        const angle = -1.9 + progress * 3.3; // wrap curve
        
        // Radius of C
        const cx = 0.75 * Math.cos(angle);
        const cy = 0.7 * Math.sin(angle);
        
        bodyPoints.push(new THREE.Vector3(cx, cy, 0));

        // Thickness: thickest at head/chest, tapers down towards tail
        let radius = 0.28;
        if (progress < 0.25) {
          // Brain folds: huge head expansion
          radius = 0.25 + (0.25 - progress) * 0.45;
        } else if (progress > 0.6) {
          // Taper to tail
          radius = 0.28 - (progress - 0.6) * 0.4;
        }
        radii.push(radius);
      }

      // 1. Brain vesicles (Head fold)
      const brainMat = createMaterial('#1d4ed8', 0.95, '#1e3a8a', 0.3, 0.1);
      const brainGroup = new THREE.Group();
      // Place overlapping spheres for fore, mid, and hindbrain
      for (let i = 0; i < 4; i++) {
        const geo = new THREE.SphereGeometry(radii[i] * 1.05, 16, 16);
        const mesh = new THREE.Mesh(geo, brainMat);
        mesh.position.copy(bodyPoints[i]);
        brainGroup.add(mesh);
      }
      group.add(brainGroup);
      meshesMapRef.current.set('brain_vesicles', brainGroup);

      // 2. Segmented Somites along back (beaded red chain)
      const somiteGroup = new THREE.Group();
      const somiteMat = createMaterial('#ef4444', 0.95, '#991b1b', 0.5, 0.0);
      
      // Place paired somites on left/right of the back (Z direction is out-of-screen, let's offset in Z)
      for (let i = 2; i < segmentsCount - 2; i++) {
        // Back of the embryo is the outer rim of the C curve
        const angle = -1.9 + (i / (segmentsCount - 1)) * 3.3;
        const normX = Math.cos(angle) * 0.15;
        const normY = Math.sin(angle) * 0.15;

        // Left somite (Z > 0)
        const leftSomite = new THREE.Mesh(
          new THREE.SphereGeometry(radii[i] * 0.38, 12, 12),
          somiteMat
        );
        leftSomite.position.set(
          bodyPoints[i].x + normX,
          bodyPoints[i].y + normY,
          radii[i] * 0.52
        );

        // Right somite (Z < 0)
        const rightSomite = new THREE.Mesh(
          new THREE.SphereGeometry(radii[i] * 0.38, 12, 12),
          somiteMat
        );
        rightSomite.position.set(
          bodyPoints[i].x + normX,
          bodyPoints[i].y + normY,
          -radii[i] * 0.52
        );

        somiteGroup.add(leftSomite);
        somiteGroup.add(rightSomite);
      }
      group.add(somiteGroup);
      meshesMapRef.current.set('somites_segmented', somiteGroup);

      // 3. Pharyngeal Arches (Neck ridges)
      const archMat = createMaterial('#f97316', 0.95, '#7c2d12', 0.4, 0.0);
      const archGroup = new THREE.Group();
      // Place 3 small cylindrical rings below the brain at neck region (index 4, 5, 6)
      const archIndices = [4, 5, 6];
      archIndices.forEach((idx, order) => {
        const pt = bodyPoints[idx];
        const ringGeo = new THREE.TorusGeometry(radii[idx] * 0.8, 0.06, 8, 16, Math.PI);
        const ring = new THREE.Mesh(ringGeo, archMat);
        ring.position.copy(pt);
        ring.rotation.y = Math.PI / 2;
        ring.rotation.z = Math.PI / 1.5 + order * 0.15;
        archGroup.add(ring);
      });
      group.add(archGroup);
      meshesMapRef.current.set('pharyngeal_arches', archGroup);

      // 4. Heart Bulge (Pulsing glowing swelling in chest)
      // Highly prominent chest cavity sits ventrally, around indices 5, 6, 7
      const heartMat = createMaterial('#f43f5e', 0.95, '#be123c', 0.2, 0.1);
      const heartGeo = new THREE.SphereGeometry(0.24, 24, 24);
      const heartMesh = new THREE.Mesh(heartGeo, heartMat);
      // Offset ventrally (inner rim of C)
      const heartPos = new THREE.Vector3(
        bodyPoints[6].x - 0.22,
        bodyPoints[6].y - 0.08,
        0.08
      );
      heartMesh.position.copy(heartPos);
      group.add(heartMesh);
      meshesMapRef.current.set('heart_bulge', heartMesh); // Will animate this!

      // 5. Primitive Gut Tube (Yellow inner core running along the C shape)
      const gutGroup = new THREE.Group();
      const gutMat = createMaterial('#eab308', 0.85, '#713f12', 0.6, 0.0);
      for (let i = 3; i < segmentsCount - 1; i++) {
        const geo = new THREE.SphereGeometry(radii[i] * 0.4, 12, 12);
        const mesh = new THREE.Mesh(geo, gutMat);
        mesh.position.copy(bodyPoints[i]);
        if (viewSettings.explodedView) {
          mesh.position.z += 0.25; // displace gut slightly
        }
        gutGroup.add(mesh);
      }
      group.add(gutGroup);
      meshesMapRef.current.set('gut_tube', gutGroup);

      // 6. Limb Buds (Paddle-like outgrowths)
      const upperLimbMat = createMaterial('#ec4899', 0.95, '#9d174d', 0.4, 0.0);
      const upperLimbGeo = new THREE.BoxGeometry(0.12, 0.18, 0.2);
      const upperLimb = new THREE.Mesh(upperLimbGeo, upperLimbMat);
      // Upper limb bud located near heart/somite index 8
      upperLimb.position.set(bodyPoints[8].x - 0.15, bodyPoints[8].y - 0.15, 0.3);
      upperLimb.rotation.set(0.3, 0.2, -0.4);
      group.add(upperLimb);
      meshesMapRef.current.set('upper_limb_bud', upperLimb);

      // 7. Umbilical Cord Connecting Stalk
      const umbilicalMat = createMaterial('#a78bfa', 0.6, '#4c1d95', 0.2, 0.2);
      const umbilicalGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.75, 12);
      umbilicalGeo.rotateZ(Math.PI / 3);
      const umbilicalMesh = new THREE.Mesh(umbilicalGeo, umbilicalMat);
      // Connecting stalk at abdomen ventral side (index 10, 11)
      umbilicalMesh.position.set(bodyPoints[11].x - 0.12, bodyPoints[11].y - 0.35, 0.1);
      group.add(umbilicalMesh);
      meshesMapRef.current.set('umbilical_cord', umbilicalMesh);

      // Fill in rest of body skin to merge beautifully
      const skinMat = createMaterial('#fecdd3', 0.45, '#4c0519', 0.5, 0.0);
      const skinGroup = new THREE.Group();
      for (let i = 0; i < segmentsCount; i++) {
        const geo = new THREE.SphereGeometry(radii[i], 16, 16);
        const mesh = new THREE.Mesh(geo, skinMat);
        mesh.position.copy(bodyPoints[i]);
        skinGroup.add(mesh);
      }
      group.add(skinGroup);
    }

    // Set interactive materials highlights
    highlightMeshes();

  }, [stage, viewSettings.transparentOuterLayers, viewSettings.explodedView, sceneInitialized]);

  // Hook to handle highlight changes of selected/hovered structures
  const highlightMeshes = () => {
    meshesMapRef.current.forEach((mesh, structId) => {
      const isSelected = structId === selectedStructureId;
      const isHovered = structId === hoveredStructureId;

      mesh.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          const mat = child.material;
          if (isSelected) {
            mat.emissive.setHex(0xeab308); // Golden active glow
            mat.emissiveIntensity = 0.7;
          } else if (isHovered) {
            mat.emissive.setHex(0x3b82f6); // Soft blue hover glow
            mat.emissiveIntensity = 0.4;
          } else {
            // Restore default emissive
            mat.emissiveIntensity = 0.15;
            // Map default emissive color according to clinical context
            const struct = stage.structures.find((s) => s.id === structId);
            if (struct) {
              if (struct.germLayer === GermLayer.Ectoderm) {
                mat.emissive.setHex(0x1e3a8a); // deep blue
              } else if (struct.germLayer === GermLayer.Mesoderm) {
                mat.emissive.setHex(0x7f1d1d); // deep red
              } else if (struct.germLayer === GermLayer.Endoderm) {
                mat.emissive.setHex(0x713f12); // deep yellow
              } else {
                mat.emissive.setHex(0x000000);
              }
            }
          }
        }
      });
    });
  };

  useEffect(() => {
    highlightMeshes();
  }, [selectedStructureId, hoveredStructureId, stage]);

  // Main Three.js Scene Setup
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030712'); // Dark graphite background
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    
    // Enable clipping
    renderer.localClippingEnabled = slicing.enabled;
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight('#ffffff', 1.2);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight('#3b82f6', 0.6); // Cool fill light
    dirLight2.position.set(-5, -5, -3);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight('#fed7aa', 0.8, 10); // Warm glowing core
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // 5. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 12;
    controlsRef.current = controls;

    // 6. Slicing Plane Definition
    const clipPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0); // Sagittal default
    clipPlaneRef.current = clipPlane;

    // Create a visual wire loop showing the slicing plane position
    const planeGeo = new THREE.RingGeometry(1.4, 1.41, 64);
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const planeHelper = new THREE.LineLoop(planeGeo, planeMat);
    planeHelper.visible = false;
    scene.add(planeHelper);
    planeHelperRef.current = planeHelper;

    // 7. Embryo Group
    const embryoGroup = new THREE.Group();
    scene.add(embryoGroup);
    embryoGroupRef.current = embryoGroup;

    // Signal that scene and group are successfully initialized
    setSceneInitialized(true);

    // 8. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const currentStage = stageRef.current;
      const currentViewSettings = viewSettingsRef.current;

      // Slow dynamic float rotation of the embryo group
      if (embryoGroupRef.current) {
        if (!currentViewSettings.autoRotate) {
          // Subtle idle floating if autoRotate is off
          embryoGroupRef.current.rotation.y = Math.sin(elapsedTime * 0.15) * 0.12;
          embryoGroupRef.current.rotation.x = Math.cos(elapsedTime * 0.1) * 0.08;
        } else {
          controls.update();
        }
      } else {
        controls.update();
      }

      // Animate the beating heart (Day 28: Organogenesis)
      if (currentStage.id === 'day28-folding' && meshesMapRef.current.has('heart_bulge')) {
        const heartMesh = meshesMapRef.current.get('heart_bulge')!;
        // 160 BPM embryonic rate (approx 2.6 beats per second)
        const beatScale = 1.0 + Math.sin(elapsedTime * 14.0) * 0.12;
        heartMesh.scale.set(beatScale, beatScale, beatScale);

        // Map beat intensity into material emissive glowing
        heartMesh.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.emissiveIntensity = 0.5 + Math.sin(elapsedTime * 14.0) * 0.4;
          }
        });
      }

      // Day 16: Gastrulation subtle pronuclear/node spin
      if (currentStage.id === 'day1-zygote') {
        const malePN = meshesMapRef.current.get('male_pronucleus');
        const femalePN = meshesMapRef.current.get('female_pronucleus');
        if (malePN) malePN.position.y = 0.1 + Math.sin(elapsedTime * 2) * 0.02;
        if (femalePN) femalePN.position.y = -0.1 + Math.cos(elapsedTime * 1.8) * 0.02;
      }

      // Update projected 2D coordinates for anatomical flags
      if (cameraRef.current && embryoGroupRef.current) {
        const cameraObj = cameraRef.current;
        const tempV = new THREE.Vector3();
        
        const labelsData = currentStage.structures.map((struct) => {
          // Get local coordinates
          tempV.set(struct.position[0], struct.position[1], struct.position[2]);
          
          // Apply model transformation
          tempV.applyMatrix4(embryoGroupRef.current!.matrixWorld);
          
          // Project to NDC
          tempV.project(cameraObj);
          
          // Check if behind camera
          const isBehind = tempV.z > 1;
          
          // Convert to client coordinates (percent)
          const x = (tempV.x * 0.5 + 0.5) * 100;
          const y = (-tempV.y * 0.5 + 0.5) * 100;

          return {
            id: struct.id,
            name: struct.name,
            x: x,
            y: y,
            visible: !isBehind && currentViewSettings.showLabels,
            color: struct.color,
          };
        });

        setProjectedLabels(labelsData);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      }
    });

    resizeObserver.observe(containerRef.current);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      setSceneInitialized(false);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[450px] bg-gray-950 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 flex items-center justify-center select-none"
    >
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

      {/* Interactive 2D Projected Anatomical Flags Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {projectedLabels.map(
          (label) =>
            label.visible && (
              <div
                key={label.id}
                className="absolute transition-all duration-75 ease-out pointer-events-auto cursor-pointer"
                style={{
                  left: `${label.x}%`,
                  top: `${label.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={() => onSelectStructure(label.id)}
                onMouseEnter={() => onHoverStructure(label.id)}
                onMouseLeave={() => onHoverStructure(null)}
              >
                {/* Visual Line Anchor */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-all ${
                      selectedStructureId === label.id
                        ? 'scale-125 bg-amber-400'
                        : hoveredStructureId === label.id
                        ? 'scale-110 bg-blue-400'
                        : 'bg-opacity-80'
                    }`}
                    style={{ backgroundColor: selectedStructureId === label.id ? undefined : hoveredStructureId === label.id ? undefined : label.color }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping absolute opacity-75 pointer-events-none" />
                  </div>
                  
                  {/* Floating Tag Card */}
                  <div
                    className={`mt-1.5 px-2 py-0.5 rounded text-[10px] font-medium border whitespace-nowrap shadow-md transition-all ${
                      selectedStructureId === label.id
                        ? 'bg-amber-950 text-amber-200 border-amber-600 font-bold scale-105'
                        : hoveredStructureId === label.id
                        ? 'bg-blue-950 text-blue-200 border-blue-600 scale-105'
                        : 'bg-gray-900/90 text-gray-200 border-gray-700/80'
                    }`}
                  >
                    {label.name}
                  </div>
                </div>
              </div>
            )
        )}
      </div>

      {/* 3D View Helper Overlay */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 text-xs text-gray-400 font-mono bg-gray-900/80 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-gray-800 pointer-events-none shadow-lg">
        <span className="text-gray-300 font-semibold mb-0.5 border-b border-gray-800 pb-1">3D CONTROLS</span>
        <span>• Left Click + Drag: Orbit Camera</span>
        <span>• Right Click + Drag: Pan Camera</span>
        <span>• Scroll: Zoom In / Out</span>
        <span>• Tap/Hover Flag: Read anatomical detail</span>
      </div>

      {/* Active Beating Icon overlay for Day 28 */}
      {stage.id === 'day28-folding' && (
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-rose-950/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-rose-800 text-rose-200 text-xs font-mono shadow-md animate-pulse">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <span>Active Embryonic Heartbeat (~160 BPM)</span>
        </div>
      )}
    </div>
  );
}
