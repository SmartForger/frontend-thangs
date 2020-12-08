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
            name: 'Part 6.stl',
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
    size: '1KB',
    isLoading: false,
    isError: false,
    isWarning: false,
  },
  '2': {
    name: 'Part 1.stl',
    size: '1KB',
    isLoading: false,
    isError: false,
    isWarning: false,
  },
  '3': {
    name: 'Part 2.stl',
    size: '1KB',
    isLoading: false,
    isError: false,
    isWarning: false,
  },
  '4': {
    name: 'Part 3.stl',
    size: '1KB',
    isLoading: false,
    isError: false,
    isWarning: false,
  },
  '5': {
    name: 'Sub-Assembly.asm',
    size: '1KB',
    isLoading: false,
    isError: false,
    isWarning: false,
  },
  '6': {
    name: 'Part 4.stl',
    size: '1KB',
    isLoading: false,
    isError: false,
    isWarning: false,
  },
  '7': {
    name: 'Part 5.stl',
    size: '1KB',
    isLoading: false,
    isError: false,
    isWarning: false,
  },
  '8': {
    name: 'Part 6.stl',
    size: '1KB',
    isLoading: false,
    isError: false,
    isWarning: false,
  },
}
