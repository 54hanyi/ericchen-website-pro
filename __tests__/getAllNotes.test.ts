import { getAllNotes, type NoteMeta } from '../utils/getAllNotes'
import fs from 'fs/promises'


jest.mock('fs/promises')
const mockedFs = fs as jest.Mocked<typeof fs>

describe('getAllNotes', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return parsed notes with metadata', async () => {
    mockedFs.readdir.mockResolvedValue([
      { name: 'note-1', isDirectory: () => true },
      { name: 'note-2', isDirectory: () => true }
    ] as any)

    mockedFs.readFile.mockImplementation(async (filePath) => {
      if ((filePath as string).includes('note-1')) {
        return `export const metadata = { title: 'Note 1', description: 'Desc 1', tags: ['a'] }`
      } else {
        return `export const metadata = { title: 'Note 2', description: 'Desc 2' }`
      }
    })

    const result = await getAllNotes()

    expect(result).toEqual<NoteMeta[]>([
      {
        slug: 'note-1',
        title: 'Note 1',
        description: 'Desc 1',
        tags: ['a']
      },
      {
        slug: 'note-2',
        title: 'Note 2',
        description: 'Desc 2',
        tags: []
      }
    ])
  })

  it('should skip invalid folders or metadata', async () => {
    mockedFs.readdir.mockResolvedValue([
      { name: 'note-1', isDirectory: () => true },
      { name: '[slug]', isDirectory: () => true },
      { name: 'not-a-dir.tsx', isDirectory: () => false },
      { name: 'note-bad', isDirectory: () => true }
    ] as any)

    mockedFs.readFile.mockImplementation(async (filePath) => {
      if ((filePath as string).includes('note-1')) {
        return `export const metadata = { title: 'Valid', description: 'Yes' }`
      }
      return 'invalid js =' // 無法 eval 的 metadata
    })

    const result = await getAllNotes()

    expect(result).toEqual<NoteMeta[]>([
      {
        slug: 'note-1',
        title: 'Valid',
        description: 'Yes',
        tags: []
      }
    ])
  })
})
