import React, {Fragment, useEffect, useState} from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography
} from "@material-ui/core";
import StatisticsArea from "./StatisticsArea";
import axios from "axios";
import {CHANGE_USER, SET_ADMIN, SET_COLD, SHOW_USERS} from "../../../utils/API";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import {message, Spin} from "antd";
import cookie from "react-cookies";

const label = {inputProps: {'aria-label': 'Switch demo'}};

function Dashboard(props) {
  const {
    selectDashboard,
    CardChart,
    statistics,
    pushMessageToSnackbar
  } = props;

  const [isLoading, setIsLoading] = useState(false)


  const [data, setData] = useState([])
  const getData = () => {
    setIsLoading(true)
    axios.post(SHOW_USERS).then((r) => {
      console.log(r)
      const {user} = r.data.data;
      setData(user)
    }).catch(r => {
      console.log(r)
      message.error("服务错误请重试")
    }).finally(() => {
      setIsLoading(false)
    })
  }
  useEffect(selectDashboard, [selectDashboard]);
  useEffect(() => {
    getData();
  }, []);

  return (
    <Fragment>
      <Spin spinning={isLoading}>
        <StatisticsArea CardChart={CardChart} data={statistics}/>
        <Box mt={4}>
          <Typography variant="subtitle1" gutterBottom>
            user_list
          </Typography>
        </Box>
        {cookie.load("showAdmin") ? <Grid key={data} container spacing={3}>
          {
            data.map((v, i) => {
              return <Grid key={i} item xs={12} md={6}>
                <Card sx={{maxWidth: 345}}>
                  <CardMedia
                    height={300}
                    component="img"
                    image={v.icon ?? "https://tests-1305221371.cos.ap-nanjing.myqcloud.com/QQ%E6%88%AA%E5%9B%BE20211014114939.png"}
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {v.user_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {v.descition}
                    </Typography>
                  </CardContent>
                  <CardActions>

                    <TextField defaultValue={v.user_name} onChange={(e) => {
                      data[i].user_name = e.target.value
                    }
                    } label="username" variant="outlined"/>
                    <TextField onChange={(e) => {
                      data[i].passWord = e.target.value
                    }} type={"password"} label="password" variant="outlined"/>
                    <Button
                      value={""}
                      onClick={() => {
                        if (data[i].user_name && data[i].passWord) {
                          setIsLoading(true)
                          axios.post(CHANGE_USER, {
                            id: v.id,
                            userName: data[i].user_name,
                            passWord: data[i].passWord
                          }).then(() => {
                            pushMessageToSnackbar({
                                text: "修改成功"
                              }
                            )
                          }).catch((r) => {
                            pushMessageToSnackbar({
                              isErrorMessage: true,
                              text: "服务失败请重试",
                            });
                          }).finally(() => {
                            getData();
                          })
                        } else {
                          message.error({
                            content: '用户名或密码为空请重试或输入两次相同数据',
                            style: {
                              marginTop: '10vh',
                            },
                          })
                        }
                      }
                      }
                      type="submit"
                      variant="contained"
                      color="secondary"
                      disabled={isLoading}
                      size="large"
                    >
                      change
                      {isLoading && <ButtonCircularProgress/>}
                    </Button>
                  </CardActions>
                  <CardActions>


                    <FormControlLabel
                      control={
                        <Switch onChange={(e) => {
                          console.log(e.target.checked)
                          setIsLoading(true)
                          axios.post(SET_ADMIN, {
                            id: v.id,
                            admin: e.target.checked
                          }).then(() => {
                            pushMessageToSnackbar({
                                text: "修改成功"
                              }
                            )
                          }).catch((r) => {
                            pushMessageToSnackbar({
                              isErrorMessage: true,
                              text: "服务失败请重试",
                            });
                          }).finally(() => {
                            getData();

                          })
                        }
                        } {...label} defaultChecked={v.is_admin} color="secondary"/>
                      }
                      label={<div style={{color: "rgb(72,41,178)"}}>admin</div>}
                    />
                    <FormControlLabel
                      control={
                        <Switch onChange={(e) => {
                          console.log(e.target.checked)
                          setIsLoading(true)
                          axios.post(SET_COLD, {
                            id: v.id,
                            cold: e.target.checked
                          }).then(() => {
                            pushMessageToSnackbar({
                                text: "修改成功"
                              }
                            )
                          }).catch((r) => {
                            pushMessageToSnackbar({
                              isErrorMessage: true,
                              text: "服务失败请重试",
                            });
                          }).finally(() => {
                            getData();
                          })
                        }}  {...label} defaultChecked={v.is_cold} color="secondary"/>
                      }
                      label={<div style={{color: "rgb(72,41,178)"}}>cold</div>}
                    />
                  </CardActions>
                </Card>
              </Grid>
            })
          }
        </Grid> : <>非管理员无法显示user_list或者当前用户权限超时请重试登录</>}

        
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
