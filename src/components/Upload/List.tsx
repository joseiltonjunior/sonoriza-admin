import { useModal } from '@/hooks/useModal'
import { useToast } from '@/hooks/useToast'
import AWS, { Lambda } from 'aws-sdk'
import { useEffect, useState } from 'react'
import { IoFolderOpenSharp, IoImage, IoMusicalNote } from 'react-icons/io5'
import { Button } from '../Button'

export function Upload() {
  const [folders, setFolders] = useState<string[]>([])
  const [subFolders, setSubFolders] = useState<string[]>([])
  const [selectedFolder, setSelectedFolder] = useState('')
  const [folderItems, setFolderItems] = useState<string[]>([])
  const [isAlbum, setIsAlbum] = useState('')
  const [isArtist, setIsArtist] = useState('')

  const { openModal } = useModal()
  const { showToast } = useToast()

  const fetchS3Folders = async (prefix = '') => {
    const s3 = new AWS.S3()
    const bucketName = 'sonoriza-media'

    const params = {
      Bucket: bucketName,
      Delimiter: '/',
      Prefix: prefix,
    }

    try {
      const response = await s3.listObjectsV2(params).promise()

      const newFolders =
        response.CommonPrefixes?.map((commonPrefix) => commonPrefix.Prefix) ||
        []
      return newFolders as string[]
    } catch (error) {
      console.error('Erro ao listar pastas:', error)
      return []
    }
  }

  const fetchS3Items = async (prefix = '') => {
    const s3 = new AWS.S3()
    const bucketName = 'sonoriza-media'

    const params = {
      Bucket: bucketName,
      Prefix: prefix,
    }

    try {
      const response = await s3.listObjectsV2(params).promise()

      const newItems =
        response.Contents?.map((content) => content.Key || '') || []
      return newItems as string[]
    } catch (error) {
      console.error('Erro ao listar itens:', error)
      return []
    }
  }

  const handleSubFolderClick = async (folder: string) => {
    if (folder === selectedFolder && subFolders.length > 0) {
      return
    }

    const items = (await fetchS3Items(folder)).filter(
      (_item, index) => index !== 0,
    )
    setFolderItems(items)
    setSelectedFolder(folder)
  }

  const handleFolderClick = async (folder: string) => {
    if (folder === selectedFolder && subFolders.length > 0) {
      return
    }

    try {
      const subFolders = await fetchS3Folders(folder)
      setSubFolders(subFolders)
      setSelectedFolder(folder)
    } catch (error) {
      console.error('Erro ao carregar subpastas ou itens:', error)
    }
  }

  const handleGetArchives = () => {
    fetchS3Folders()
      .then((initialFolders) => {
        setFolders(initialFolders)
      })
      .catch((error) =>
        console.error('Erro ao carregar pastas principais:', error),
      )
  }

  const handleCopyClick = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      showToast('Text copied to clipboard', {
        type: 'success',
        theme: 'light',
      })
    } catch (err) {
      showToast('Error copying to clipboard', {
        type: 'warning',
        theme: 'light',
      })
    }
  }

  const handleSignedUrl = async (url: string) => {
    const region = 'sa-east-1'
    const lambda = new Lambda({ region })

    const params = {
      FunctionName: 'cloudfront-presign-url',
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({ url }),
    }

    try {
      const response = await lambda.invoke(params).promise()
      const responseObject = await JSON.parse(String(response.Payload))

      openModal({
        children: (
          <div className="flex gap-6">
            <div className=" w-full flex items-center justify-center">
              {url.includes('mp3') ? (
                <div className="flex flex-col items-center">
                  <p className="font-bold mb-2">Listen now</p>
                  <audio controls>
                    <source src={responseObject.signedUrl} type="audio/mp3" />
                  </audio>
                </div>
              ) : (
                <img
                  className="rounded-md w-96 h-96"
                  src={responseObject.signedUrl}
                  alt=""
                />
              )}
            </div>
            <div className="flex flex-col gap-2 items-center w-full">
              <p>
                <strong>Archive Name: </strong>
                {url
                  .split('/')
                  .filter(
                    (item) =>
                      item.endsWith('.jpg') ||
                      item.endsWith('jpeg') ||
                      item.endsWith('mp3'),
                  )}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  title="Copy URL Signed"
                  variant="outline"
                  onClick={() => handleCopyClick(responseObject.signedUrl)}
                />
                <Button
                  title="Copy URL No-Signed"
                  variant="purple"
                  onClick={() => handleCopyClick(url)}
                />
              </div>
            </div>
          </div>
        ),
      })
    } catch (error) {
      showToast('Error calling Lambda function', {
        type: 'error',
        theme: 'light',
      })
    }
  }

  useEffect(() => {
    handleGetArchives()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div className="h-[1px] bg-gray-300/50 my-7" />

      {selectedFolder && (
        <div className="flex gap-1">
          <button
            className="hover:text-purple-600 font-bold"
            onClick={() => {
              setIsAlbum('')
              setIsArtist('')
              setSelectedFolder('')
            }}
          >
            Bucket
          </button>
          <p>/</p>

          {selectedFolder && (
            <button
              onClick={() => {
                setIsAlbum('')
                setIsArtist('')
              }}
              className="hover:underline"
            >
              {selectedFolder.split('/')[0]}
            </button>
          )}

          {isArtist && (
            <button
              onClick={() => {
                setIsAlbum('')
              }}
              className="flex gap-1"
            >
              / <p className="hover:underline"> {isArtist}</p>
            </button>
          )}
          <p>/ {isAlbum.split('/')[2]}</p>
        </div>
      )}

      <div className="flex flex-col items-start mt-4">
        {!selectedFolder &&
          folders.map((item, index) => (
            <button
              className="hover:underline flex gap-2 items-center text-gray-700"
              key={index}
              onClick={() => {
                setSubFolders([])
                setFolderItems([])
                if (item.includes('artists')) {
                  handleSubFolderClick(item)
                  return
                }
                handleFolderClick(item)
              }}
            >
              <IoFolderOpenSharp />
              {item === selectedFolder ? <strong>{item}</strong> : item}
            </button>
          ))}

        {selectedFolder.includes('musics') && !isArtist && (
          <div className="flex flex-col items-start rounded border-2 border-dashed border-purple-600 p-6 w-full">
            {subFolders.map((item, index) => (
              <button
                className="hover:underline flex gap-2 text-gray-700 items-center"
                key={index}
                onClick={() => {
                  setIsArtist(item.replace('musics/', '').replace('/', ''))
                  handleSubFolderClick(item)
                }}
              >
                <IoFolderOpenSharp />
                {item.replace('musics/', '')}
              </button>
            ))}
          </div>
        )}

        {isArtist && selectedFolder.includes('musics') && (
          <>
            {!isAlbum &&
              folderItems.filter((item) => item.endsWith('/')).length > 0 && (
                <div className="flex flex-col items-start rounded border-2 border-dashed border-purple-600 p-6 w-full">
                  {folderItems
                    .filter((item) => item.endsWith('/'))
                    .map((item, index) => (
                      <button
                        key={index}
                        className="hover:underline flex gap-2 text-gray-700 items-center"
                        onClick={() => {
                          if (isAlbum === item) {
                            setIsAlbum('')
                          } else {
                            setIsAlbum(item)
                          }
                        }}
                      >
                        <IoFolderOpenSharp />
                        {item.replace(`musics/${isArtist}/`, '')}
                      </button>
                    ))}
                </div>
              )}
            {isAlbum && (
              <div className="flex flex-col items-start rounded border-2 border-dashed border-purple-600 p-6 w-full">
                {folderItems
                  .filter(
                    (item) => item.includes(isAlbum) && !item.endsWith('/'),
                  )
                  .map((item, index) => (
                    <button
                      key={index}
                      className="hover:underline text-left flex gap-2 text-gray-700 items-center"
                      onClick={() => {
                        if (item.endsWith('/')) {
                          setIsAlbum(item)
                        } else {
                          handleSignedUrl(
                            import.meta.env.VITE_CLOUD_FRONT_DOMAIN + item,
                          )
                        }
                      }}
                    >
                      {item.endsWith('mp3') ? <IoMusicalNote /> : <IoImage />}
                      {item.replace(isAlbum, '')}
                    </button>
                  ))}
              </div>
            )}
            {!isAlbum &&
              folderItems
                .filter((item) => !item.endsWith('/'))
                .filter((file) => {
                  const directory = file.replace(/[^/]+$/, '')
                  return (
                    !folderItems.includes(directory) &&
                    folderItems.some((dir) => dir.startsWith(directory))
                  )
                }).length > 0 && (
                <div className="flex flex-col items-start rounded border-2 border-dashed border-purple-600 p-6 w-full">
                  {folderItems
                    .filter((item) => !item.endsWith('/'))
                    .filter((file) => {
                      const directory = file.replace(/[^/]+$/, '')
                      return (
                        !folderItems.includes(directory) &&
                        folderItems.some((dir) => dir.startsWith(directory))
                      )
                    })
                    .map((file, index) => (
                      <button
                        className="hover:underline text-left flex gap-2 text-gray-700 items-center"
                        key={index}
                        onClick={() => {
                          handleSignedUrl(
                            import.meta.env.VITE_CLOUD_FRONT_DOMAIN + file,
                          )
                        }}
                      >
                        {file.endsWith('mp3') ? <IoMusicalNote /> : <IoImage />}
                        {file.replace(`musics/${isArtist}/`, '')}
                      </button>
                    ))}
                </div>
              )}
          </>
        )}

        {selectedFolder.includes('artists') && (
          <div className="flex flex-col items-start rounded border-2 border-dashed border-purple-600 p-6 w-full">
            {folderItems.map((item, index) => (
              <button
                className="hover:underline flex gap-2 text-gray-700 items-center"
                key={index}
                onClick={() => {
                  handleSignedUrl(
                    import.meta.env.VITE_CLOUD_FRONT_DOMAIN + item,
                  )
                }}
              >
                <IoImage />
                {item.replace('artists/', '')}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
