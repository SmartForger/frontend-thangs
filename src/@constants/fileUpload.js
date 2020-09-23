export const MODEL_FILE_EXTS = [
  '.3dxml', // THREE_D_XML
  '.CATPart', // CATIAV5
  '.dwg',
  '.dxf',
  '.iges',
  '.igs',
  '.ipt', // Inventor
  '.jt',
  '.model', // CATIAV4
  '.par', // SolidEdge
  '.prt', // NX, ProE_Creo
  '.sab', // ACIS_Binary
  '.sat', // ACIS
  '.sldprt', // SolidWorks
  '.step',
  '.stl',
  '.stp',
  '.vda',
  '.x_b', // ParaSolid_Binary
  '.x_t', // ParaSolid
  '.xcgm',
  '.xml', // XMLEBOM
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
