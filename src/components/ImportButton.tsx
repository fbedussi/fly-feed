import { doc, setDoc } from 'firebase/firestore';
import { Component } from 'solid-js'
import { convertOpmlToJson, parseXml, readFile } from '../libs/files';
import { Button, FileUploadIcon } from '../styleguide'
import { db } from '../backend/init'
import { user } from '../state';

const ImportButton: Component = () => {
  const userId = user()?.id

  return (
    <label>
      <input
        style={{ display: 'none' }}
        accept=".xml"
        type="file"
        onChange={async (e) => {
          if (!userId) {
            return alert('missing user id')
          }
          const selectedFile = e.currentTarget.files && e.currentTarget.files[0];
          const dataTxt = await readFile(selectedFile)
          const dataDoc = parseXml(dataTxt)
          const subscriptions = convertOpmlToJson(dataDoc)
          await setDoc(doc(db, 'subscriptions', userId), { userId, ...subscriptions })
        }}
      />
      <Button
        disabled={!userId}
        variant="outlined"
        fullWidth
        component="span"
        startIcon={<FileUploadIcon />}
      >
        Import
      </Button>
    </label>
  )
}

export default ImportButton
