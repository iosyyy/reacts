import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  TablePagination,
  Toolbar,
  Typography,
  withStyles,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import Accessible from "@material-ui/icons/AddToPhotos";
import AddCircleIcon from "@material-ui/icons/AddAlarm";
import SelfAligningImage from "../../../shared/components/SelfAligningImage";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";
import ConfirmationDialog from "../../../shared/components/ConfirmationDialog";
import {
  DELETE_HEA,
  GET_ALL_HEA,
  INSERT_CART,
  UPDATE_HEA,
} from "../../../utils/API";
import axios from "axios";
import {
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Space,
  Spin,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import "antd/es/date-picker/style/index";
import moment from "moment";
import "moment/locale/zh-cn";
import locale from "antd/es/date-picker/locale/zh_CN";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";

const styles = {
  dBlock: { display: "block" },
  dNone: { display: "none" },
  toolbar: {
    justifyContent: "space-between",
  },
};
const fontStyle = { fontWeight: 900, color: "rgb(127,125,142)" };

const rowsPerPage = 25;

function PostContent(props) {
  const {
    pushMessageToSnackbar,
    setPosts,
    posts,
    openAddPostModal,
    classes,
  } = props;
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [model, showModel] = useState(false);
  const [selectIndex, setSelectIndex] = useState(0);
  const [isDeletePostDialogOpen, setIsDeletePostDialogOpen] = useState(false);
  const [isDeletePostDialogLoading, setIsDeletePostDialogLoading] = useState(
    false
  );
  const getData = () => {
    setLoading(true);

    axios
      .get(GET_ALL_HEA + "?page=" + page)
      .then((r) => {
        const { data } = r.data;
        setCount(data.count);
        const { content } = data.hea;
        const post = content.map((v, i) => {
          return {
            id: v.id,
            createdAt: v.createdAt,
            src: v.imageUrl,
            title: v.name,
            timestamp: new Date(v.createdAt).getTime() / 1000,
            ...v,
          };
        });
        setPosts(post);
      })
      .finally((r) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const closeDeletePostDialog = useCallback(() => {
    setIsDeletePostDialogOpen(false);
    setIsDeletePostDialogLoading(false);
  }, [setIsDeletePostDialogOpen, setIsDeletePostDialogLoading]);

  const deletePost = useCallback(() => {
    setIsDeletePostDialogLoading(true);
    closeDeletePostDialog();
  }, [setIsDeletePostDialogLoading, closeDeletePostDialog]);

  const handleChangePage = useCallback(
    (__, page) => {
      setPage(page);
    },
    [setPage]
  );

  const printImageGrid = useCallback(() => {
    if (posts.length > 0) {
      return (
        <Box p={1}>
          <Grid container spacing={1}>
            {posts.map((post, i) => (
              <Grid item xs={6} sm={4} md={3} key={post.id}>
                <SelfAligningImage
                  src={post.src}
                  title={post.name}
                  timeStamp={post.timestamp}
                  options={[
                    {
                      name: "Add To Cart",
                      onClick: () => {
                        setLoading(true);
                        axios
                          .post(INSERT_CART, { id: post.id })
                          .then((r) => {
                            if (r.data.code !== 0) {
                              pushMessageToSnackbar({
                                text: "添加失败请重试",
                                error: true,
                              });
                            } else {
                              pushMessageToSnackbar({
                                text: "添加成功",
                              });
                            }
                          })
                          .catch(() => {
                            pushMessageToSnackbar({
                              text: "删除失败请重试",
                              error: true,
                            });
                          })
                          .finally(() => {
                            setLoading(false);
                            getData();
                          });
                      },
                      icon: <AddCircleIcon />,
                    },
                    {
                      name: "Change",
                      onClick: () => {
                        setSelectIndex(i);
                        showModel(true);
                      },
                      icon: <Accessible />,
                    },
                    {
                      name: "Delete",
                      onClick: () => {
                        setLoading(true);
                        axios
                          .post(DELETE_HEA, { id: post.id })
                          .then((r) => {
                            if (r.data.code !== 0) {
                              pushMessageToSnackbar({
                                text: "删除失败请重试",
                                error: true,
                              });
                            } else {
                              pushMessageToSnackbar({
                                text: "删除成功",
                              });
                            }
                          })
                          .catch(() => {
                            pushMessageToSnackbar({
                              text: "删除失败请重试",
                              error: true,
                            });
                          })
                          .finally(() => {
                            setLoading(false);
                            getData();
                          });
                      },
                      icon: <DeleteIcon />,
                    },
                  ]}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      );
    }
    return (
      <Box m={2}>
        <HighlightedInformation>
          No posts added yet. Click on &quot;NEW&quot; to create your first one.
        </HighlightedInformation>
      </Box>
    );
  }, [posts, pushMessageToSnackbar]);

  return (
    <Spin spinning={loading}>
      <Paper>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6">Heas</Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={openAddPostModal}
            disableElevation
          >
            Add Post
          </Button>
        </Toolbar>
        <Divider />
        {printImageGrid()}
        <TablePagination
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            "aria-label": "Previous Page",
          }}
          nextIconButtonProps={{
            "aria-label": "Next Page",
          }}
          onChangePage={handleChangePage}
          classes={{
            select: classes.dNone,
            selectIcon: classes.dNone,
            actions: posts.length > 0 ? classes.dBlock : classes.dNone,
            caption: posts.length > 0 ? classes.dBlock : classes.dNone,
          }}
          labelRowsPerPage=""
        />
        <ConfirmationDialog
          open={isDeletePostDialogOpen}
          title="Confirmation"
          content="Do you really want to delete the post?"
          onClose={closeDeletePostDialog}
          loading={isDeletePostDialogLoading}
          onConfirm={deletePost}
        />
        <Modal
          footer={null}
          title="hea"
          width={"33vw"}
          destroyOnClose
          visible={model}
          onCancel={() => {
            showModel(false);
          }}
        >
          <Form
            initialValues={{
              id: posts[selectIndex].id,
              name: posts[selectIndex].name,
              factory: posts[selectIndex].factory,
              price: posts[selectIndex].price,
              stock: posts[selectIndex].stock,
              describe: posts[selectIndex].describe,
              updatedAt: moment(posts[selectIndex].updatedAt),
            }}
            onFinish={(e) => {
              const formData = new FormData();
              formData.append("id", posts[selectIndex].id);
              formData.append("name", e.name);
              formData.append("factory", e.factory);
              formData.append("price", e.price);
              formData.append("stock", e.stock);
              formData.append("describe", e.describe);
              formData.append("updatedAt", e.updatedAt.toLocaleString());
              formData.append("file", e.file?.file ?? new File([], "null"));
              axios
                .post(UPDATE_HEA, formData)
                .then((r) => {
                  setLoading(true);
                  if (r.data.code !== 0) {
                    pushMessageToSnackbar({
                      text: "更新失败请重试",
                      error: true,
                    });
                  } else {
                    pushMessageToSnackbar({
                      text: "更新成功",
                    });
                  }
                })
                .catch((r) => {
                  pushMessageToSnackbar({
                    text: "更新失败请重试",
                    error: true,
                  });
                })
                .finally((r) => {
                  setLoading(false);
                  showModel(false);
                  getData();
                });
            }}
            wrapperCol={{ span: 24 }}
            layout={"vertical"}
          >
            <Row justify={"center"}>
              <Col span={24}>
                <Form.Item
                  name="name"
                  label={<div style={fontStyle}>name</div>}
                  rules={[{ required: true, message: "请输入name" }]}
                >
                  <Input placeholder={"请输入name"} />
                </Form.Item>
              </Col>
            </Row>
            <Row justify={"center"}>
              <Col span={24}>
                <Form.Item
                  name="factory"
                  label={<div style={fontStyle}>所在工厂</div>}
                  rules={[{ required: true, message: "请输入所在工厂" }]}
                >
                  <Input placeholder={"请输入所在工厂"} />
                </Form.Item>
              </Col>
            </Row>
            <Row justify={"center"}>
              <Col span={24}>
                <Form.Item
                  name="price"
                  label={<div style={fontStyle}>价格</div>}
                  rules={[{ required: true, message: "请输入价格" }]}
                >
                  <InputNumber min={1} />
                </Form.Item>
              </Col>
            </Row>
            <Row justify={"center"}>
              <Col span={24}>
                <Form.Item
                  name="stock"
                  label={<div style={fontStyle}>库存</div>}
                  rules={[{ required: true, message: "请输入库存" }]}
                >
                  <InputNumber min={1} />
                </Form.Item>
              </Col>
            </Row>
            <Row justify={"center"}>
              <Col span={24}>
                <Form.Item
                  name="updatedAt"
                  label={<div style={fontStyle}>更新时间</div>}
                  rules={[{ required: true, message: "请输入更新时间" }]}
                >
                  <DatePicker locale={locale} />
                </Form.Item>
              </Col>
            </Row>

            <Row justify={"center"}>
              <Col span={24}>
                <Form.Item
                  name="file"
                  label={
                    <div style={fontStyle}>
                      上传图片(注意此处为了性能考虑不支持预览图片)
                    </div>
                  }
                  beforeUpload={() => {
                    return false;
                  }}
                >
                  <Upload
                    beforeUpload={() => {
                      return false;
                    }}
                    style={{ width: "10px" }}
                    maxCount={1}
                  >
                    <Button variant="contained" color="secondary">
                      <UploadOutlined />
                      &nbsp; 上传图片 (Max: 1)
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
            <Row justify={"center"}>
              <Col span={24}>
                <Form.Item
                  name="describe"
                  label={<div style={fontStyle}>describe</div>}
                  rules={[{ required: true, message: "请输入describe" }]}
                >
                  <TextArea
                    autoSize={{ minRows: 6, maxRows: 6 }}
                    placeholder={"请输入describe"}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row justify={"end"}>
              <Space>
                <Col>
                  <Form.Item>
                    <Button
                      color="black"
                      variant="contained"
                      onClick={() => {
                        showModel(false);
                      }}
                    >
                      取消
                    </Button>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item>
                    <Button
                      disabled={loading}
                      variant="contained"
                      color="secondary"
                      type="submit"
                    >
                      提交更改
                      {loading && <ButtonCircularProgress />}
                    </Button>
                  </Form.Item>
                </Col>
              </Space>
            </Row>
          </Form>
        </Modal>
      </Paper>
    </Spin>
  );
}

PostContent.propTypes = {
  openAddPostModal: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  setPosts: PropTypes.func.isRequired,
  pushMessageToSnackbar: PropTypes.func,
};

export default withStyles(styles)(PostContent);
