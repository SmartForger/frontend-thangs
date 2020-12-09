// Mock data for assembly upload

export const mockValidationTree = [
  {
    name: 'asdf_1.asm',
    isAssembly: true,
    valid: true,
    subs: [
      {
        name: 'asdf_2.stl',
        isAssembly: false,
        valid: true,
      },
      {
        name: 'asdf_3.stl',
        isAssembly: false,
        valid: true,
      },
      {
        name: 'asdf_4.stl',
        isAssembly: false,
        valid: true,
      },
      {
        name: 'asdf_5.asm',
        isAssembly: true,
        valid: true,
        subs: [
          {
            name: 'asdf_6.stl',
            isAssembly: false,
            valid: true,
          },
          {
            name: 'asdf_7.stl',
            isAssembly: false,
            valid: false,
            skipped: true,
          },
          {
            name: 'asdf_8.stl',
            isAssembly: false,
            valid: false,
          },
        ],
      },
    ],
  },
]

export const mockUploadedFiles = {
  '1': {
    name: 'Assembly.asm',
    size: 200,
    isLoading: false,
    isError: false,
    isWarning: false,
    fileName: 'Assembly.asm',
    signedUrl: 'https://storage.googleapis.com/staging-thangs-uploads/uploads/modesl/random_1',
    newFileName: 'asdf_1.asm',
  },
  '2': {
    name: 'Part 1.stl',
    size: 1000,
    isLoading: false,
    isError: false,
    isWarning: false,
    fileName: 'Part 1.stl',
    signedUrl: 'https://storage.googleapis.com/staging-thangs-uploads/uploads/modesl/random_2',
    newFileName: 'asdf_2.stl',
  },
  '3': {
    name: 'Part 2.stl',
    size: 3000,
    isLoading: false,
    isError: false,
    isWarning: false,
    fileName: 'Part 2.stl',
    signedUrl: 'https://storage.googleapis.com/staging-thangs-uploads/uploads/modesl/random_3',
    newFileName: 'asdf_3.stl',
  },
  '4': {
    name: 'Part 3.stl',
    size: 1000,
    isLoading: false,
    isError: false,
    isWarning: false,
    fileName: 'Part 3.stl',
    signedUrl: 'https://storage.googleapis.com/staging-thangs-uploads/uploads/modesl/random_4',
    newFileName: 'asdf_4.stl',
  },
  '5': {
    name: 'Sub-Assembly.asm',
    size: 500,
    isLoading: false,
    isError: false,
    isWarning: false,
    fileName: 'Sub-Assembly.asm',
    signedUrl: 'https://storage.googleapis.com/staging-thangs-uploads/uploads/modesl/random_5',
    newFileName: 'asdf_5.asm',
  },
  '6': {
    name: 'Part 4.stl',
    size: 20000,
    isLoading: false,
    isError: false,
    isWarning: false,
    fileName: 'Part 4.stl',
    signedUrl: 'https://storage.googleapis.com/staging-thangs-uploads/uploads/modesl/random_6',
    newFileName: 'asdf_6.stl',
  },
  '7': {
    name: 'Part 5.stl',
    size: 6000,
    isLoading: false,
    isError: false,
    isWarning: false,
    fileName: 'Part 5.stl',
    signedUrl: 'https://storage.googleapis.com/staging-thangs-uploads/uploads/modesl/random_7',
    newFileName: 'asdf_7.stl',
  },
  '8': {
    name: 'Part 6.stl',
    size: 10000,
    isLoading: false,
    isError: false,
    isWarning: false,
    fileName: 'Part 6.stl',
    signedUrl: 'https://storage.googleapis.com/staging-thangs-uploads/uploads/modesl/random_8',
    newFileName: 'asdf_8.stl',
  },
}
