import React, { Fragment, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Typography,
  withStyles,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Bordered from "../../../shared/components/Bordered";
import ImageCropperDialog from "../../../shared/components/ImageCropperDialog";

const styles = (theme) => ({
  floatButtonWrapper: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
    zIndex: 1000,
  },
  inputRoot: {
    width: 190,
    "@media (max-width:  400px)": {
      width: 160,
    },
    "@media (max-width:  360px)": {
      width: 140,
    },
    "@media (max-width:  340px)": {
      width: 120,
    },
  },
  uploadIcon: {
    fontSize: 48,
    transition: theme.transitions.create(["color", "box-shadow", "border"], {
      duration: theme.transitions.duration.short,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
  imgWrapper: { position: "relative" },
  img: {
    width: "100%",
    border: "1px solid rgba(0, 0, 0, 0.23)",
    borderRadius: theme.shape.borderRadius,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  uploadText: {
    transition: theme.transitions.create(["color", "box-shadow", "border"], {
      duration: theme.transitions.duration.short,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
  numberInput: {
    width: 110,
  },
  numberInputInput: {
    padding: "9px 34px 9px 14.5px",
  },
  emojiTextArea: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    marginRight: -1,
  },
  dNone: {
    display: "none",
  },
});

function AddPostOptions(props) {
  const {
    Dropzone,
    classes,
    files,
    deleteItem,
    onDrop,
    EmojiTextArea,
    ImageCropper,
    DateTimePicker,
    cropperFile,
    onCrop,
    onCropperClose,
    uploadAt,
    onChangeUploadAt,
    name,
    describe,
    stock,
    price,
    factory,
  } = props;

  const printFile = useCallback(() => {
    if (files[0]) {
      return (
        <div className={classes.imgWrapper}>
          <img
            alt="uploaded item"
            src={files[0].preview}
            className={classes.img}
            style={{ height: 148 }}
          />
          <div className={classes.floatButtonWrapper}>
            <IconButton onClick={deleteItem}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>
      );
    }
    return (
      <Dropzone accept="image/png, image/jpeg" onDrop={onDrop} fullHeight>
        <span className={classes.uploadText}>
          Click / Drop file <br /> here
        </span>
      </Dropzone>
    );
  }, [onDrop, files, classes, deleteItem]);
  return (
    <Fragment>
      {ImageCropper && (
        <ImageCropperDialog
          open={cropperFile ? true : false}
          ImageCropper={ImageCropper}
          src={cropperFile ? cropperFile.preview : ""}
          onCrop={onCrop}
          onClose={onCropperClose}
          aspectRatio={4 / 3}
        />
      )}
      <Typography paragraph variant="h6">
        Upload Image
      </Typography>
      <Box mb={2}>
        {EmojiTextArea && (
          <EmojiTextArea
            onRef={describe}
            inputClassName={classes.emojiTextArea}
            maxCharacters={220}
            rightContent={printFile()}
            emojiSet="google"
            onChange={() => {}}
          />
        )}
      </Box>
      <Typography paragraph variant="h6">
        Options
      </Typography>
      <List disablePadding>
        <Bordered disableVerticalPadding disableBorderRadius>
          <ListItem divider disableGutters className="listItemLeftPadding">
            <ListItemText>
              <Typography variant="body2">上传时间</Typography>
            </ListItemText>
            <ListItemSecondaryAction>
              {DateTimePicker && (
                <DateTimePicker
                  value={uploadAt}
                  format="yyyy/MM/dd hh:mm a"
                  onChange={onChangeUploadAt}
                  disablePast
                />
              )}
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem
            className="listItemLeftPadding"
            disableGutters
            divider={true}
          >
            <ListItemText>
              <Typography variant="body2">名称</Typography>
            </ListItemText>
            <ListItemSecondaryAction>
              <TextField
                inputRef={name}
                size={"small"}
                label="名称"
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                variant="outlined"
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem
            className="listItemLeftPadding"
            disableGutters
            divider={true}
          >
            <ListItemText>
              <Typography variant="body2">库存</Typography>
            </ListItemText>
            <ListItemSecondaryAction>
              <TextField
                inputRef={stock}
                size={"small"}
                label="库存"
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                variant="outlined"
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem
            className="listItemLeftPadding"
            disableGutters
            divider={true}
          >
            <ListItemText>
              <Typography variant="body2">价格</Typography>
            </ListItemText>
            <ListItemSecondaryAction>
              <TextField
                inputRef={price}
                size={"small"}
                label="价格"
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                variant="outlined"
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem className="listItemLeftPadding" disableGutters>
            <ListItemText>
              <Typography variant="body2">所属工厂</Typography>
            </ListItemText>
            <ListItemSecondaryAction>
              <TextField
                inputRef={factory}
                label="工厂"
                size={"small"}
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                variant="outlined"
              />
            </ListItemSecondaryAction>
          </ListItem>
        </Bordered>
      </List>
    </Fragment>
  );
}

AddPostOptions.propTypes = {
  onEmojiTextareaChange: PropTypes.func,
  DateTimePicker: PropTypes.elementType,
  EmojiTextArea: PropTypes.elementType,
  Dropzone: PropTypes.elementType,
  ImageCropper: PropTypes.elementType,
  classes: PropTypes.object,
  cropperFile: PropTypes.object,
  onCrop: PropTypes.func,
  onCropperClose: PropTypes.func,
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
  deleteItem: PropTypes.func,
  onDrop: PropTypes.func,
  value: PropTypes.string,
  characters: PropTypes.number,
  uploadAt: PropTypes.instanceOf(Date),
  onChangeUploadAt: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(AddPostOptions);
