export const MODEL_FILE_EXTS = [
  '.3dxml', // THREE_D_XML
  '.asab', // ACIS_Assembly_Binary
  '.asat', // ACIS_Assembly
  '.catpart', // CATIAV5
  '.catproduct', // CATIAV5_Assembly
  '.dwg',
  '.dxf',
  '.iges',
  '.igs',
  '.ipt', // Inventor
  '.jt',
  '.obj',
  '.model', // CATIAV4
  '.par', // SolidEdge
  '.prt', // NX, ProE_Creo
  '.sab', // ACIS_Binary
  '.sat', // ACIS
  '.sldasm', // SolidWorks_Assembly
  '.sldprt', // SolidWorks
  '.step',
  '.stl',
  '.stp',
  '.vda',
  '.x_b', // ParaSolid_Binary
  '.x_t', // ParaSolid
  '.xcgm',
  '.asm',
  '.par',
]

export const PHOTO_FILE_EXTS = [
  '.jpg',
  '.jpeg',
  '.png',
]

export const FILE_SIZE_LIMITS = {
  hard: {
    size: 250_000_000,
    pretty: '250MB',
  },
  soft: {
    size: 50_000_000,
    pretty: '50MB',
  },
}

export const ERROR_STATES = {
  FILE_EXT: 'FILE_EXT',
  TOO_BIG: 'TOO_BIG',
  SIZE_WARNING: 'SIZE_WARNING',
}

export const CATEGORIES = [
  { value: 'automotive', label: 'Automotive' },
  { value: 'aerospace', label: 'Aerospace' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'home', label: 'Home' },
  { value: 'safety', label: 'Safety' },
  { value: 'characters', label: 'Characters' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'technology', label: 'Technology' },
  { value: 'hobbyist', label: 'Hobbyist' },
]
