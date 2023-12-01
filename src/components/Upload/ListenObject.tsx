import { Button } from '../Button'
import { useUpload } from '@/hooks/useUpload'

interface ListenObjectProps {
  url: string
  responseObject: {
    signedUrl: string
  }
}

export function ListenObject({ responseObject, url }: ListenObjectProps) {
  const { copyObjectUrl } = useUpload()

  return (
    <div className="grid grid-cols-[1fr,auto] justify-center gap-6">
      <div className="w-full flex justify-center">
        {url.includes('mp3') ? (
          <div className="flex flex-col">
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
      <div className="flex flex-col gap-4 w-full">
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
        <div className="grid grid-cols-1 gap-2">
          <Button
            title="Copy URL Signed"
            variant="outline"
            onClick={() => copyObjectUrl(responseObject.signedUrl)}
          />
          <Button
            title="Copy URL No-Signed"
            variant="purple"
            onClick={() => copyObjectUrl(url)}
          />
        </div>
      </div>
    </div>
  )
}
