// Mock data for assembly upload

export const mockValidationTree = [
  {
    name: 'Assembly.asm',
    isAssembly: true,
    valid: true,
    subs: [
      {
        name: 'Part 1.stl',
        isAssembly: false,
        valid: true,
      },
      {
        name: 'Part 2.stl',
        isAssembly: false,
        valid: true,
      },
      {
        name: 'Part 3.stl',
        isAssembly: false,
        valid: true,
      },
      {
        name: 'Sub-Assembly.asm',
        isAssembly: true,
        valid: true,
        subs: [
          {
            name: 'Part 4.stl',
            isAssembly: false,
            valid: true,
          },
          {
            name: 'Part 5.stl',
            isAssembly: false,
            valid: false,
            skipped: true,
          },
          {
            name: 'Part 6.STP',
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
  }
}
