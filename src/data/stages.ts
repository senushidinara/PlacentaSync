import { EmbryoStage, GermLayer } from '../types';

export const EMBRYO_STAGES: EmbryoStage[] = [
  {
    id: 'day1-zygote',
    week: 1,
    day: 1,
    title: 'Day 1: The Zygote',
    subtitle: 'Fertilization & Genetic Unification',
    overview: 'The sperm penetrates the protective glycoprotein shell of the oocyte, initiating the cortical reaction. The male and female pronuclei migrate towards each other, fusing their haploid genomes to establish a unique diploid human blueprint.',
    educationalInsight: 'At this moment, the sex, eye color, and fundamental genetic makeup of the individual are determined. Although it is a single cell, it is totipotent, possessing the capability to divide and specialize into every tissue in the body, plus the supporting placenta.',
    keyPoints: [
      {
        title: 'Polyspermy Block',
        description: 'As soon as the first sperm contacts the oocyte membrane, cortical granules release enzymes to harden the outer glycoprotein shell (Zona Pellucida), preventing additional sperm entry.',
        type: 'milestone'
      },
      {
        title: 'Pronuclear Migration',
        description: 'Maternal and paternal chromosomes decondense inside separate pronuclei, which migrate towards each other guided by microtubules.',
        type: 'cellular'
      },
      {
        title: 'Karyogamy (Fusion)',
        description: 'The pronuclear membranes dissolve, and the chromosomes align on a single mitotic spindle. This fusion restores the diploid chromosome number of 46.',
        type: 'morphological'
      }
    ],
    structures: [
      {
        id: 'zona_pellucida',
        name: 'Zona Pellucida',
        color: '#e2e8f0',
        description: 'A thick, semi-transparent glycoprotein membrane surrounding the zygote. It protects the dividing cells and prevents the embryo from adhering premature to the fallopian tube.',
        germLayer: GermLayer.Extraembryonic,
        position: [0, 0, 1.2]
      },
      {
        id: 'male_pronucleus',
        name: 'Male Pronucleus',
        color: '#60a5fa',
        description: 'The swollen haploid nucleus of the fertilizing sperm containing 23 paternal chromosomes.',
        germLayer: GermLayer.None,
        position: [0.3, 0.1, 0]
      },
      {
        id: 'female_pronucleus',
        name: 'Female Pronucleus',
        color: '#f472b6',
        description: 'The haploid nucleus of the oocyte containing 23 maternal chromosomes, completing its second meiotic division upon sperm entry.',
        germLayer: GermLayer.None,
        position: [-0.2, -0.1, 0.1]
      },
      {
        id: 'polar_body',
        name: 'Polar Bodies',
        color: '#a78bfa',
        description: 'Small, non-functional cells produced during oocyte meiosis, containing discarded genetic material and squeezed into the perivitelline space.',
        germLayer: GermLayer.None,
        position: [0.7, -0.6, 0.3]
      },
      {
        id: 'cytoplasm',
        name: 'Zygotic Cytoplasm',
        color: '#fed7aa',
        description: 'The nutrient-rich egg cytoplasm, which contains maternal mRNA, proteins, and organelles needed to power the initial cleavage divisions.',
        germLayer: GermLayer.None,
        position: [0, -0.4, -0.2]
      }
    ]
  },
  {
    id: 'day3-morula',
    week: 1,
    day: 3,
    title: 'Day 3: The Morula',
    subtitle: 'Cleavage & Compaction',
    overview: 'As the embryo travels down the fallopian tube towards the uterus, it undergoes rapid mitotic cell divisions called cleavage. It forms a solid ball of 16 highly compacted cells, resembling a mulberry—thus its name, the Morula.',
    educationalInsight: 'Up to the 8-cell stage, blastomeres are loose and spherical. At Day 3, they undergo "compaction": the outer cells flatten, form tight junctions, and maximize contact with one another. This divides the embryo into internal and external microenvironments, initiating the very first differentiation event.',
    keyPoints: [
      {
        title: 'Mitotic Cleavage',
        description: 'Divisions occur without cell growth. The overall size of the embryo remains unchanged, confined inside the rigid Zona Pellucida, so cells (blastomeres) get progressively smaller.',
        type: 'cellular'
      },
      {
        title: 'Compaction Process',
        description: 'Cell adhesion molecules (E-cadherins) pull the outer blastomeres extremely close together, sealing the outer boundary and forming tight cellular junctions.',
        type: 'morphological'
      },
      {
        title: 'Mulberry Topology',
        description: 'The solid sphere reaches a density of 12 to 16 cells. The inner cells will form the embryo proper, while outer cells are destined to form the placenta.',
        type: 'milestone'
      }
    ],
    structures: [
      {
        id: 'blastomeres',
        name: 'Blastomeres',
        color: '#fdba74',
        description: 'The individual cells produced by cleavage divisions. They are totipotent or pluripotent, packed tightly together.',
        germLayer: GermLayer.None,
        position: [0.4, 0.3, 0.3]
      },
      {
        id: 'outer_cells',
        name: 'Outer Compacting Layer',
        color: '#f97316',
        description: 'The external layer of cells undergoing compaction. They express E-cadherin and establish cellular polarity.',
        germLayer: GermLayer.Trophoblast,
        position: [-0.6, 0.4, 0.4]
      },
      {
        id: 'inner_cells',
        name: 'Inner Cell Cluster',
        color: '#3b82f6',
        description: 'The central cells insulated from the exterior. They are shielded by the outer layer and will become the inner cell mass of the blastocyst.',
        germLayer: GermLayer.None,
        position: [0.1, -0.1, 0]
      },
      {
        id: 'zona_pellucida',
        name: 'Zona Pellucida',
        color: '#e2e8f0',
        description: 'The protective glycoprotein capsule, still intact, maintaining structural boundaries as the morula moves toward the uterus.',
        germLayer: GermLayer.Extraembryonic,
        position: [0, 0, 1.2]
      }
    ]
  },
  {
    id: 'day5-blastocyst',
    week: 1,
    day: 5,
    title: 'Day 5: The Blastocyst',
    subtitle: 'The First Differentiation & Hatching',
    overview: 'Active fluid pumping creates a cavity inside the morula. The cells undergo clear differentiation, sorting into two distinct lineages: the outer Trophoblast shell (placenta precursor) and the localized Inner Cell Mass (embryo precursor). The blastocyst expands and hatches from the Zona Pellucida.',
    educationalInsight: 'This stage represents the first lineage commitment in human life. Trophoblast cells become specialized for implantation, while the Inner Cell Mass (pluripotent embryonic stem cells) retains the potential to form all three germ layers of the human body.',
    keyPoints: [
      {
        title: 'Lineage Commitment',
        description: 'Differential gene expression (Oct4 in inner cells, Cdx2 in outer cells) locks in the cells\' respective fates as embryo or placenta.',
        type: 'cellular'
      },
      {
        title: 'Cavitation',
        description: 'Sodium-potassium ATPase pumps in trophoblast cells actively drive sodium into the center. Water follows osmotically, blowing up a fluid cavity (blastocoele).',
        type: 'morphological'
      },
      {
        title: 'Hatching',
        description: 'Enzymes from the trophoblast digest a small opening in the Zona Pellucida, allowing the expanding blastocyst to squeeze out and expose its surface for implantation.',
        type: 'milestone'
      }
    ],
    structures: [
      {
        id: 'inner_cell_mass',
        name: 'Inner Cell Mass (Embryoblast)',
        color: '#2563eb',
        description: 'The compact dome of pluripotent cells attached to one side of the cavity. These are the cells that will form the actual human body.',
        germLayer: GermLayer.None,
        position: [-0.4, 0.5, 0.1]
      },
      {
        id: 'trophoblast',
        name: 'Trophoblast',
        color: '#ea580c',
        description: 'The single outer layer of cells. It will form the fetal portion of the placenta and secrete hCG (human chorionic gonadotropin) to signal pregnancy.',
        germLayer: GermLayer.Trophoblast,
        position: [0.7, -0.4, 0.4]
      },
      {
        id: 'blastocoele',
        name: 'Blastocoele Cavity',
        color: '#7dd3fc',
        description: 'The fluid-filled hollow center of the blastocyst. It provides room for cellular movement, expanding the embryo.',
        germLayer: GermLayer.Extraembryonic,
        position: [0.2, -0.1, -0.1]
      },
      {
        id: 'hatching_zona',
        name: 'Hatching Zona Pellucida',
        color: '#cbd5e1',
        description: 'The thinned and dissolving glycoprotein shell being shed by the expanding blastocyst.',
        germLayer: GermLayer.Extraembryonic,
        position: [-1.0, -0.2, 0.5]
      }
    ]
  },
  {
    id: 'day8-bilaminar',
    week: 2,
    day: 8,
    title: 'Day 8: Bilaminar Disc',
    subtitle: 'The Double-Layered Origin',
    overview: 'As the blastocyst implants into the vascularized uterine lining, the Inner Cell Mass organizes into a flat, double-layered plate (the Bilaminar Disc) consisting of the dorsal Epiblast (ectoderm precursor) and ventral Hypoblast (endoderm precursor), sandwiched between the amniotic cavity and the yolk sac.',
    educationalInsight: 'In Week 2, the "Rule of Twos" dominates: the embryoblast splits into two layers (Epiblast and Hypoblast), two cavities form (Amniotic Cavity and Yolk Sac), and the trophoblast differentiates into two layers (Cytotrophoblast and Syncytiotrophoblast) to invade the endometrium.',
    keyPoints: [
      {
        title: 'Implantation Invasion',
        description: 'The syncytiotrophoblast behaves like an aggressive, multi-nucleated tissue mass, digesting uterine lining to sink the embryo into maternal tissue.',
        type: 'milestone'
      },
      {
        title: 'Bilaminar Organization',
        description: 'Cells organize into Epiblast (tall columnar, blue) and Hypoblast (small cuboidal, yellow) layers.',
        type: 'cellular'
      },
      {
        title: 'Amniotic Cavity Formation',
        description: 'A new fluid-filled cavity opens within the Epiblast, establishing the dorsal (back) boundary of the developing embryo.',
        type: 'morphological'
      }
    ],
    structures: [
      {
        id: 'epiblast',
        name: 'Epiblast',
        color: '#3b82f6',
        description: 'The upper dorsal layer of blue columnar cells. It forms the floor of the amniotic cavity and is the source of all three future germ layers of the human body.',
        germLayer: GermLayer.Ectoderm,
        position: [0, 0.1, 0.3]
      },
      {
        id: 'hypoblast',
        name: 'Hypoblast',
        color: '#eab308',
        description: 'The lower ventral layer of yellow cuboidal cells. It forms the roof of the primitive yolk sac and guides early germ layer axis signaling.',
        germLayer: GermLayer.Endoderm,
        position: [0, -0.1, 0.3]
      },
      {
        id: 'amniotic_cavity',
        name: 'Amniotic Cavity',
        color: '#60a5fa',
        description: 'The dorsal fluid cavity lined by amnion membrane. It will expand to surround the entire embryo, cushioning it throughout gestation.',
        germLayer: GermLayer.Extraembryonic,
        position: [0, 0.5, 0.2]
      },
      {
        id: 'yolk_sac',
        name: 'Primitive Yolk Sac',
        color: '#fef08a',
        description: 'The ventral cavity lined by hypoblast cells. It provides early nutrient transport and is the site of first blood cell formation.',
        germLayer: GermLayer.Extraembryonic,
        position: [0, -0.5, 0.2]
      },
      {
        id: 'syncytiotrophoblast',
        name: 'Syncytiotrophoblast',
        color: '#dc2626',
        description: 'The outer invasive layer of the trophoblast. This is a multinucleated protoplasmic mass without cell boundaries, erosion-digesting endometrial blood vessels.',
        germLayer: GermLayer.Trophoblast,
        position: [0.8, 0.8, -0.5]
      },
      {
        id: 'cytotrophoblast',
        name: 'Cytotrophoblast',
        color: '#f97316',
        description: 'The inner, mitotic layer of single trophoblast cells feeding cells into the expanding syncytiotrophoblast.',
        germLayer: GermLayer.Trophoblast,
        position: [0.6, 0.2, 0.1]
      }
    ]
  },
  {
    id: 'day16-gastrulation',
    week: 3,
    day: 16,
    title: 'Day 16: Gastrulation',
    subtitle: 'Establishing the Three Germ Layers',
    overview: 'A watershed milestone of human development. Epiblast cells migrate toward and plunge through a longitudinal furrow called the Primitive Streak. They displace the hypoblast to form the Endoderm, fill the middle to create the Mesoderm, and remain on top to form the Ectoderm.',
    educationalInsight: 'Gastrulation is the defining process of Week 3. As pioneering developmental biologist Lewis Wolpert famously stated: "It is not birth, marriage, or death, but gastrulation, which is truly the most important time in your life." This process establishes the definitive 3D body axes (head/tail, front/back, left/right).',
    keyPoints: [
      {
        title: 'Primitive Streak',
        description: 'A linear groove forms on the dorsal epiblast surface at the caudal (tail) end, defining the symmetry axis of the human body.',
        type: 'morphological'
      },
      {
        title: 'Epithelial-Mesenchymal Transition',
        description: 'Epiblast cells downregulate adhesion proteins (E-cadherin), detach, squeeze into a flask-like shape, and migrate inward through the streak.',
        type: 'cellular'
      },
      {
        title: 'Trilaminar Germ Layers',
        description: 'All three definitive germ layers—Ectoderm (blue), Mesoderm (red), and Endoderm (yellow)—are created, laying out the cellular blueprint for all organs.',
        type: 'milestone'
      }
    ],
    structures: [
      {
        id: 'ectoderm',
        name: 'Ectoderm',
        color: '#1d4ed8',
        description: 'The dorsal layer remaining on the outside. It will form the entire central and peripheral nervous system, sensory epithelium (eyes, ears), epidermis of the skin, and hair.',
        germLayer: GermLayer.Ectoderm,
        position: [0, 0.3, 0.2]
      },
      {
        id: 'mesoderm',
        name: 'Mesoderm',
        color: '#dc2626',
        description: 'The middle germ layer formed by invaginating cells. It will form bones, skeletal muscle, heart, cardiovascular system, blood, kidneys, and gonads.',
        germLayer: GermLayer.Mesoderm,
        position: [0, 0, 0.3]
      },
      {
        id: 'endoderm',
        name: 'Endoderm',
        color: '#ca8a04',
        description: 'The ventral germ layer formed by displacing the hypoblast. It will form the lining of the gastrointestinal tract, liver, gallbladder, pancreas, and respiratory tree.',
        germLayer: GermLayer.Endoderm,
        position: [0, -0.3, 0.2]
      },
      {
        id: 'primitive_streak',
        name: 'Primitive Streak & Groove',
        color: '#a21caf',
        description: 'The linear crack at the midline of the caudal epiblast. It serves as the gateway where cells migrate inward.',
        germLayer: GermLayer.None,
        position: [0.3, 0.4, -0.3]
      },
      {
        id: 'primitive_node',
        name: 'Primitive Node (Hensen Node)',
        color: '#c084fc',
        description: 'The elevated organizer node at the cranial tip of the primitive streak. It coordinates axial patterning and contains ciliated cells that determine left-right organ symmetry.',
        germLayer: GermLayer.None,
        position: [-0.1, 0.3, -0.1]
      }
    ]
  },
  {
    id: 'day21-neurulation',
    week: 3,
    day: 21,
    title: 'Day 21: Neurulation',
    subtitle: 'Foundations of the Nervous System',
    overview: 'The solid mesodermal rod called the Notochord signals the overlying ectoderm to thicken into the Neural Plate. The margins elevate to form neural folds, which meet and fuse in the midline to form the Neural Tube—the precursor of the brain and spinal cord. Flanking blocks of mesoderm called somites segment on either side.',
    educationalInsight: 'During neurulation, ectodermal cells fold in on themselves to seal off a tube inside the body. If the tube fails to close properly at the cranial end, anencephaly occurs; if it fails to close at the caudal end, spina bifida occurs. Thus, folic acid intake is crucial during this active period of Week 3.',
    keyPoints: [
      {
        title: 'Neural Tube Closure',
        description: 'The neural plate curves upward and zips closed in both directions, leaving open anterior and posterior neuropores that close later in Week 4.',
        type: 'morphological'
      },
      {
        title: 'Somitogenesis',
        description: 'Mesoderm flanking the neural tube condenses into segmented, paired blocks called Somites, resembling beads. They appear sequentially.',
        type: 'cellular'
      },
      {
        title: 'Neural Crest Delamination',
        description: 'Highly migratory cells at the crest of the folding neural tube detach and migrate throughout the body, forming peripheral nerves, facial skeleton, and heart structures.',
        type: 'milestone'
      }
    ],
    structures: [
      {
        id: 'neural_tube',
        name: 'Neural Tube',
        color: '#2563eb',
        description: 'The central cylindrical tube formed from fused neural folds. It represents the primitive brain (cranial) and spinal cord (caudal).',
        germLayer: GermLayer.Ectoderm,
        position: [0, 0.2, 0.1]
      },
      {
        id: 'notochord',
        name: 'Notochord',
        color: '#9333ea',
        description: 'The rigid axial rod of mesoderm running beneath the neural tube. It serves as the primary inductive signaling center of the embryo.',
        germLayer: GermLayer.Mesoderm,
        position: [0, -0.05, 0.05]
      },
      {
        id: 'somites',
        name: 'Somites',
        color: '#ef4444',
        description: 'Paired, bead-like blocks of paraxial mesoderm flanking the neural tube. They differentiate into sclerotome (vertebrae), myotome (skeletal muscle), and dermatome (dermis).',
        germLayer: GermLayer.Mesoderm,
        position: [0.35, 0.1, -0.1]
      },
      {
        id: 'ectoderm_surface',
        name: 'Surface Ectoderm',
        color: '#3b82f6',
        description: 'The skin precursor layer, now pulled flat over the dorsal surface of the embryo as the neural tube pinches off underneath.',
        germLayer: GermLayer.Ectoderm,
        position: [0.6, 0.3, 0.2]
      },
      {
        id: 'endoderm_gut',
        name: 'Endoderm Gut Precursor',
        color: '#eab308',
        description: 'The ventral endoderm layer, preparing to fold into a tube that will form the lining of the stomach, esophagus, and intestine.',
        germLayer: GermLayer.Endoderm,
        position: [0, -0.4, 0]
      }
    ]
  },
  {
    id: 'day28-folding',
    week: 4,
    day: 28,
    title: 'Day 28: Organogenesis & Folding',
    subtitle: 'The 3D Human Blueprint',
    overview: 'The flat trilaminar embryonic disc undergoes dramatic lateral and head-to-tail folding, rolling into a 3D C-shaped cylinder. It internalizes the endoderm to create the primitive gut tube, seals the body cavity, and exposes early anatomical structures: a beating heart bulge, limb buds, and pharyngeal arches.',
    educationalInsight: 'By the end of Week 4, the flat plate has transformed into a recognizable, three-dimensional vertebrate embryo. The heart is now a looping tube that actively pumps blood, and the foundations of nearly all major organ systems—including limbs, eyes, brain, and gastrointestinal tract—are firmly established.',
    keyPoints: [
      {
        title: 'Embryonic Folding',
        description: 'Lateral folds wrap ventrally to seal the body wall, while cranial and caudal folds curl the embryo into its classic C-shaped fetal position.',
        type: 'morphological'
      },
      {
        title: 'Cardiac Looping & Beat',
        description: 'The simple heart tube loops into an S-shape and begins beating dynamically around Day 22. By Day 28, it drives blood through early aortic arches.',
        type: 'milestone'
      },
      {
        title: 'Pharyngeal & Limb Buds',
        description: 'Pharyngeal arches (neck ridges) appear on the head fold, while tiny, paddle-like upper and lower limb buds begin to emerge from the body walls.',
        type: 'cellular'
      }
    ],
    structures: [
      {
        id: 'brain_vesicles',
        name: 'Brain Vesicles (Head Fold)',
        color: '#1d4ed8',
        description: 'The expanded cranial end of the neural tube, segmenting into three primary brain regions: forebrain, midbrain, and hindbrain.',
        germLayer: GermLayer.Ectoderm,
        position: [-0.6, 0.7, 0.2]
      },
      {
        id: 'heart_bulge',
        name: 'Heart Bulge (Beating Heart)',
        color: '#f43f5e',
        description: 'A large swelling on the ventral chest surface housing the early heart tube. It contracts rhythmically to pump primitive blood cells.',
        germLayer: GermLayer.Mesoderm,
        position: [-0.4, 0.1, 0.4]
      },
      {
        id: 'somites_segmented',
        name: 'Segmented Somites',
        color: '#ef4444',
        description: 'Over 30 pairs of visible somites running along the back, forming a beaded column that organizes the spine and back musculature.',
        germLayer: GermLayer.Mesoderm,
        position: [0.1, 0.3, -0.3]
      },
      {
        id: 'gut_tube',
        name: 'Primitive Gut Tube',
        color: '#eab308',
        description: 'An internal tube of endoderm running from mouth to anus, pinched off from the yolk sac and suspended by mesodermal membranes.',
        germLayer: GermLayer.Endoderm,
        position: [-0.1, 0.05, 0]
      },
      {
        id: 'upper_limb_bud',
        name: 'Upper Limb Bud',
        color: '#ec4899',
        description: 'A lateral paddle-like bump of mesoderm covered by ectoderm, which will elongate to form the arm, forearm, and hand.',
        germLayer: GermLayer.Mesoderm,
        position: [0.2, -0.2, 0.4]
      },
      {
        id: 'pharyngeal_arches',
        name: 'Pharyngeal Arches',
        color: '#f97316',
        description: 'Segmented neck ridges. The first arch forms the jaw and mastication muscles; the second arch forms the hyoid and facial expression muscles.',
        germLayer: GermLayer.None,
        position: [-0.5, 0.4, 0.3]
      },
      {
        id: 'umbilical_cord',
        name: 'Umbilical Cord (Connecting Stalk)',
        color: '#a78bfa',
        description: 'The stalk containing the umbilical arteries, vein, and allantois, connecting the embryo\'s blood supply to the chorionic villi of the placenta.',
        germLayer: GermLayer.Extraembryonic,
        position: [0.1, -0.5, 0.2]
      }
    ]
  }
];
