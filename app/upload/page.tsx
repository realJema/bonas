'use client'

import { CldUploadWidget } from 'next-cloudinary';

const UploadPage = () => {
    return  (
        <CldUploadWidget uploadPreset='lymdepzy'>
          {({open }) =>  <button onClick={() => open()}>Upload</button>}
        </CldUploadWidget>
    )
}

export default UploadPage;