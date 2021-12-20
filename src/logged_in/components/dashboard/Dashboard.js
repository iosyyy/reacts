import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Fab,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import StatisticsArea from "./StatisticsArea";
import axios from "axios";
import {
  CHANGE_USER,
  DELETE_USER,
  INSERT_USER,
  SET_ADMIN,
  SET_COLD,
  SHOW_USERS,
} from "../../../utils/API";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import { Col, Form, message, Modal, Row, Space, Spin, Upload } from "antd";
import cookie from "react-cookies";
import { Add } from "@material-ui/icons";
import { UploadOutlined } from "@ant-design/icons";
import DeleteIcon from "@material-ui/icons/Delete";

const label = { inputProps: { "aria-label": "Switch demo" } };

function Dashboard(props) {
  const {
    selectDashboard,
    CardChart,
    statistics,
    pushMessageToSnackbar,
  } = props;
  const fontStyle = { fontWeight: 900, color: "rgb(127,125,142)" };

  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [cold, setCold] = useState(false);

  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const getData = () => {
    setIsLoading(true);
    axios
      .post(SHOW_USERS)
      .then((r) => {
        console.log(r);
        const { user } = r.data.data;
        setData(user);
      })
      .catch((r) => {
        console.log(r);
        message.error("服务错误请重试");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(selectDashboard, [selectDashboard]);
  useEffect(() => {
    if (cookie.load("showAdmin")) {
      getData();
    }
  }, []);

  return (
    <Fragment>
      <Spin spinning={isLoading}>
        <StatisticsArea CardChart={CardChart} data={statistics} />
        <Box mt={4}>
          <Typography variant="subtitle1" gutterBottom>
            user_list
          </Typography>
        </Box>
        {cookie.load("showAdmin") ? (
          <Grid key={data} container spacing={3}>
            {data.map((v, i) => {
              return (
                <Grid key={i} item xs={12} md={6}>
                  <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                      height={300}
                      component="img"
                      image={
                        v.icon ??
                        "https://tests-1305221371.cos.ap-nanjing.myqcloud.com/QQ%E6%88%AA%E5%9B%BE20211014114939.png"
                      }
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {v.user_name}
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => {
                              axios
                                .post(DELETE_USER, { id: v.id })
                                .then(() => {
                                  pushMessageToSnackbar({
                                    text: "修改成功",
                                  });
                                })
                                .catch((r) => {
                                  pushMessageToSnackbar({
                                    isErrorMessage: true,
                                    text: "服务失败请重试",
                                  });
                                })
                                .finally(() => {
                                  getData();
                                });
                            }}
                            disabled={isLoading}
                            aria-label="delete"
                            size="small"
                          >
                            {isLoading ? (
                              <ButtonCircularProgress />
                            ) : (
                              <DeleteIcon fontSize="inherit" />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {v.descition}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <TextField
                        defaultValue={v.user_name}
                        onChange={(e) => {
                          data[i].user_name = e.target.value;
                        }}
                        label="username"
                        variant="outlined"
                      />
                      <TextField
                        onChange={(e) => {
                          data[i].passWord = e.target.value;
                        }}
                        type={"password"}
                        label="password"
                        variant="outlined"
                      />
                      <Button
                        value={""}
                        onClick={() => {
                          if (data[i].user_name && data[i].passWord) {
                            setIsLoading(true);
                            axios
                              .post(CHANGE_USER, {
                                id: v.id,
                                userName: data[i].user_name,
                                passWord: data[i].passWord,
                              })
                              .then(() => {
                                pushMessageToSnackbar({
                                  text: "修改成功",
                                });
                              })
                              .catch((r) => {
                                pushMessageToSnackbar({
                                  isErrorMessage: true,
                                  text: "服务失败请重试",
                                });
                              })
                              .finally(() => {
                                getData();
                              });
                          } else {
                            message.error({
                              content:
                                "用户名或密码为空请重试或输入两次相同数据",
                              style: {
                                marginTop: "10vh",
                              },
                            });
                          }
                        }}
                        type="submit"
                        variant="contained"
                        color="secondary"
                        disabled={isLoading}
                        size="large"
                      >
                        change
                        {isLoading && <ButtonCircularProgress />}
                      </Button>
                    </CardActions>
                    <CardActions>
                      <FormControlLabel
                        control={
                          <Switch
                            onChange={(e) => {
                              console.log(e.target.checked);
                              setIsLoading(true);
                              axios
                                .post(SET_ADMIN, {
                                  id: v.id,
                                  admin: e.target.checked,
                                })
                                .then(() => {
                                  pushMessageToSnackbar({
                                    text: "修改成功",
                                  });
                                })
                                .catch((r) => {
                                  pushMessageToSnackbar({
                                    isErrorMessage: true,
                                    text: "服务失败请重试",
                                  });
                                })
                                .finally(() => {
                                  getData();
                                });
                            }}
                            {...label}
                            defaultChecked={v.is_admin}
                            color="secondary"
                          />
                        }
                        label={
                          <div style={{ color: "rgb(72,41,178)" }}>admin</div>
                        }
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            onChange={(e) => {
                              console.log(e.target.checked);
                              setIsLoading(true);
                              axios
                                .post(SET_COLD, {
                                  id: v.id,
                                  cold: e.target.checked,
                                })
                                .then(() => {
                                  pushMessageToSnackbar({
                                    text: "修改成功",
                                  });
                                })
                                .catch((r) => {
                                  pushMessageToSnackbar({
                                    isErrorMessage: true,
                                    text: "服务失败请重试",
                                  });
                                })
                                .finally(() => {
                                  getData();
                                });
                            }}
                            {...label}
                            defaultChecked={v.is_cold}
                            color="secondary"
                          />
                        }
                        label={
                          <div style={{ color: "rgb(72,41,178)" }}>cold</div>
                        }
                      />
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
            <Grid item xs={12} md={6}>
              <Tooltip title="添加新用户">
                <Fab
                  onClick={() => {
                    setModal(true);
                  }}
                  color="secondary"
                  aria-label="add"
                >
                  <Add />
                </Fab>
              </Tooltip>
            </Grid>
          </Grid>
        ) : (
          <>非管理员无法显示user_list或者当前用户权限超时请重试登录</>
        )}
        <Modal
          footer={null}
          title="添加用户"
          width={"33vw"}
          destroyOnClose
          visible={modal}
          onCancel={() => {
            setModal(false);
          }}
        >
          <Form
            onFinish={(e) => {
              console.log(e);
              setLoading(true);

              const formData = new FormData();
              formData.append("file", e.file.file);
              formData.append("username", e.username);
              formData.append("password", e.file.file);
              formData.append("isAdmin", admin ? "true" : "false");
              formData.append("isCold", cold ? "true" : "false");
              axios
                .post(INSERT_USER, formData)
                .then((r) => {
                  if (r.data.code !== 0) {
                    pushMessageToSnackbar({
                      isErrorMessage: true,
                      text: "服务失败请重试",
                    });
                  } else {
                    pushMessageToSnackbar({
                      text: "服务成功",
                    });
                  }
                })
                .catch((r) => {
                  pushMessageToSnackbar({
                    isErrorMessage: true,
                    text: "服务失败请重试",
                  });
                })
                .finally(() => {
                  setLoading(false);
                  setModal(false);

                  getData();
                });
            }}
            wrapperCol={{ span: 24 }}
            layout={"vertical"}
          >
            <Row justify={"center"}>
              <Col span={24}>
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: "请输入用户名" }]}
                >
                  <TextField label="username" variant="outlined" />
                </Form.Item>
              </Col>
            </Row>
            <Row justify={"center"}>
              <Col span={24}>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: "请输入密码" }]}
                >
                  <TextField
                    type={"password"}
                    label="password"
                    variant="outlined"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row justify={"center"}>
              <Col span={24}>
                <Form.Item>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={cold}
                        onChange={(e) => {
                          setCold(e.target.checked);
                        }}
                        inputProps={{ "aria-label": "controlled" }}
                        color="secondary"
                      />
                    }
                    label={"cold"}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row justify={"center"}>
              <Col span={24}>
                <Form.Item>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={admin}
                        onChange={(e) => {
                          setAdmin(e.target.checked);
                        }}
                        inputProps={{ "aria-label": "controlled" }}
                        color="secondary"
                      />
                    }
                    label={"admin"}
                  />
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
                  rules={[{ required: true, message: "请上传图片" }]}
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
            <Row justify={"end"}>
              <Space>
                <Col>
                  <Form.Item>
                    <Button
                      color="black"
                      variant="contained"
                      onClick={() => {
                        setModal(false);
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
      </Spin>
    </Fragment>
  );
}

Dashboard.propTypes = {
  CardChart: PropTypes.elementType,
  statistics: PropTypes.object.isRequired,
  toggleAccountActivation: PropTypes.func,
  pushMessageToSnackbar: PropTypes.func,
  targets: PropTypes.arrayOf(PropTypes.object).isRequired,
  setTargets: PropTypes.func.isRequired,
  isAccountActivated: PropTypes.bool.isRequired,
  selectDashboard: PropTypes.func.isRequired,
};

export default Dashboard;
