import React, { Fragment, useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { Button, Box } from "@material-ui/core";
import ActionPaper from "../../../shared/components/ActionPaper";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import AddPostOptions from "./AddPostOptions";
import axios from "axios";
import { INSERT_HEA } from "../../../utils/API";

function AddPost(props) {
  const {
    pushMessageToSnackbar,
    Dropzone,
    EmojiTextArea,
    DateTimePicker,
    ImageCropper,
    onClose,
  } = props;

  const [files, setFiles] = useState([]);
  const [uploadAt, setUploadAt] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [cropperFile, setCropperFile] = useState(null);
  const factory = useRef();
  const price = useRef();
  const stock = useRef();
  const name = useRef();
  const describe = useRef();

  const acceptDrop = useCallback(
    (file) => {
      setFiles([file]);
    },
    [setFiles]
  );

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (acceptedFiles.length + rejectedFiles.length > 1) {
        pushMessageToSnackbar({
          isErrorMessage: true,
          text: "You cannot upload more than one file at once",
        });
      } else if (acceptedFiles.length === 0) {
        pushMessageToSnackbar({
          isErrorMessage: true,
          text: "The file you wanted to upload isn't an image",
        });
      } else if (acceptedFiles.length === 1) {
        const file = acceptedFiles[0];
        file.preview = URL.createObjectURL(file);
        file.key = new Date().getTime();
        setCropperFile(file);
      }
    },
    [pushMessageToSnackbar, setCropperFile]
  );

  const onCropperClose = useCallback(() => {
    setCropperFile(null);
  }, [setCropperFile]);

  const deleteItem = useCallback(() => {
    setCropperFile(null);
    setFiles([]);
  }, [setCropperFile, setFiles]);

  const onCrop = useCallback(
    (dataUrl) => {
      const file = { ...cropperFile };
      file.preview = dataUrl;
      acceptDrop(file);
      setCropperFile(null);
    },
    [acceptDrop, cropperFile, setCropperFile]
  );
  const base64ToBlob = function (base64Data) {
    let arr = base64Data.split(","),
      fileType = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      l = bstr.length,
      u8Arr = new Uint8Array(l);

    while (l--) {
      u8Arr[l] = bstr.charCodeAt(l);
    }
    return new Blob([u8Arr], {
      type: fileType,
    });
  };

  const handleUpload = useCallback(() => {
    setLoading(true);

    console.log(files[0]);
    console.log(factory.current.value);
    console.log(price.current.value);
    console.log(stock.current.value);
    console.log(name.current.value);
    console.log(describe.current.value);
    const formData = new FormData();
    const hea = {
      factory: factory.current.value,
      price: price.current.value,
      stock: stock.current.value,
      describe: describe.current.value,
      name: name.current.value,
      updatedAt: uploadAt,
      createdAt: uploadAt,
    };
    for (const heaKey in hea) {
      formData.append(heaKey, hea[heaKey]);
    }

    formData.append(
      "file",
      new File([base64ToBlob(files[0].preview)], files[0].path)
    );
    axios.post(INSERT_HEA, formData).then((r) => {
      console.log(r);
    });
    setTimeout(() => {
      pushMessageToSnackbar({
        text: "Your post has been uploaded",
      });
      onClose();
    }, 1500);
  }, [
    setLoading,
    onClose,
    pushMessageToSnackbar,
    files,
    uploadAt,
    factory,
    price,
    stock,
    name,
    describe,
  ]);

  return (
    <Fragment>
      <ActionPaper
        helpPadding
        content={
          <AddPostOptions
            describe={describe}
            factory={factory}
            price={price}
            stock={stock}
            name={name}
            EmojiTextArea={EmojiTextArea}
            Dropzone={Dropzone}
            files={files}
            onDrop={onDrop}
            deleteItem={deleteItem}
            DateTimePicker={DateTimePicker}
            uploadAt={uploadAt}
            onChangeUploadAt={setUploadAt}
            onCrop={onCrop}
            ImageCropper={ImageCropper}
            cropperFile={cropperFile}
            onCropperClose={onCropperClose}
          />
        }
        actions={
          <Fragment>
            <Box mr={1}>
              <Button onClick={onClose} disabled={loading}>
                Back
              </Button>
            </Box>
            <Button
              onClick={handleUpload}
              variant="contained"
              color="secondary"
              disabled={files.length === 0 || loading}
            >
              Upload {loading && <ButtonCircularProgress />}
            </Button>
          </Fragment>
        }
      />
    </Fragment>
  );
}

AddPost.propTypes = {
  pushMessageToSnackbar: PropTypes.func,
  onClose: PropTypes.func,
  Dropzone: PropTypes.elementType,
  EmojiTextArea: PropTypes.elementType,
  DateTimePicker: PropTypes.elementType,
  ImageCropper: PropTypes.elementType,
};

export default AddPost;
