import React from 'react'
import { Box, Button, Text } from '@chakra-ui/react';
import { useBundler } from '@/state/bundlr.context';
import { useRef, useState } from 'react';

const UploadJson = () => {
    const { balance, uploadFile } = useBundler();
    const [URI, setURI] = useState('')
    const [file, setFile] = useState<Buffer>()
    const [jsonFile, setJsonFile] = useState('')
    const hiddenFileInput = useRef(null);
    const [fileContent, setFileContent] = useState(null);

    // this function is called when user select file
    function onFileChange(e: any) {
        const file = e.target.files[0];
        if (file) {
            const jsonFile = URL.createObjectURL(file);
            setJsonFile(jsonFile)
            var reader = new FileReader();
            reader.readAsText(e.target.files[0]);
            reader.onload = function (e) {
                const content = e.target.result;
                
                // content is json file's content
                setFileContent(content);
                if (reader.result) {
                    setFile(Buffer.from(reader.result as any))
                }
            }
        }
    }

    const handleClick = event => {
        hiddenFileInput.current.click();
    };

    // function to upload file
    const handleUpload = async () => {
        const res = await uploadFile(file);
        if (res) {
            console.log('res.data', res.data);
            setURI(`http://arweave.net/${res.data.id}`)
        }
    }

    return (
        <>
            {
                balance && (
                    <div className='flex flex-col mt-20 justify-center items-center'>
                        <>
                            <Button onClick={handleClick} className='mb-4'>
                                {jsonFile ? 'Change Selection' : 'Select jsonFile'}
                            </Button>
                            <input
                                accept="application/json"
                                type="file"
                                ref={hiddenFileInput}
                                onChange={onFileChange}
                                style={{ display: 'none' }}
                            />
                        </>
                        {
                            jsonFile &&
                            <>
                                <Box
                                    display='flex'
                                    alignItems='center'
                                    justifyContent='center'
                                    width='100%'
                                    py={5}
                                    mb={2}
                                >
                                    {fileContent}
                                </Box>
                                <button className='bg-gray-200 rounded px-8 py-2 text-black hover:bg-gray-100' onClick={handleUpload}>Upload File</button>
                            </>
                        }
                        {
                            URI &&
                            <Text className='mt-4'>
                                <Text fontSize='xl'> Uploaded File:</Text> <a href={URI} target="_blank">{URI}</a>
                            </Text>
                        }
                    </div>
                )
            }
        </>
    )
}

export default UploadJson