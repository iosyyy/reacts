import React from "react";
import PropTypes from "prop-types";
import {Grid, isWidthUp, Typography, withWidth} from "@material-ui/core";
import BuildIcon from "@material-ui/icons/Build";
import ComputerIcon from "@material-ui/icons/Computer";
import BarChartIcon from "@material-ui/icons/BarChart";
import HeadsetMicIcon from "@material-ui/icons/HeadsetMic";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import MeassageIcon from "@material-ui/icons/Message";
import calculateSpacing from "./calculateSpacing";
import FeatureCard from "./FeatureCard";

const iconSize = 30;

const features = [
  {
    color: "#00C853",
    headline: "Feature 1",
    text:
      "后端的鉴权服务",
    icon: <BuildIcon style={{fontSize: iconSize}}/>,
    mdDelay: "0",
    smDelay: "0"
  },
  {
    color: "#6200EA",
    headline: "Feature 2",
    text:
      "会员用户以及普通用户的权限分发",
    icon: <CalendarTodayIcon style={{fontSize: iconSize}}/>,
    mdDelay: "200",
    smDelay: "200"
  },
  {
    color: "#0091EA",
    headline: "Feature 3",
    text:
      "使用最火热的reactui库",
    icon: <MeassageIcon style={{fontSize: iconSize}}/>,
    mdDelay: "400",
    smDelay: "0"
  },
  {
    color: "#d50000",
    headline: "Feature 4",
    text:
      "使用spring-jpa操作数据库",
    icon: <ComputerIcon style={{fontSize: iconSize}}/>,
    mdDelay: "0",
    smDelay: "200"
  },
  {
    color: "#DD2C00",
    headline: "Feature 5",
    text:
      "后端功能比较完善",
    icon: <BarChartIcon style={{fontSize: iconSize}}/>,
    mdDelay: "200",
    smDelay: "0"
  },
  {
    color: "#64DD17",
    headline: "Feature 6",
    text:
      "有很好的可拓展性",
    icon: <HeadsetMicIcon style={{fontSize: iconSize}}/>,
    mdDelay: "400",
    smDelay: "200"
  },
];

function FeatureSection(props) {
  const {width} = props;
  return (
    <div style={{backgroundColor: "#FFFFFF"}}>
      <div className="container-fluid lg-p-top">
        <Typography variant="h3" align="center" className="lg-mg-bottom">
          Features
        </Typography>
        <div className="container-fluid">
          <Grid container spacing={calculateSpacing(width)}>
            {features.map(element => (
              <Grid
                item
                xs={6}
                md={4}
                data-aos="zoom-in-up"
                data-aos-delay={
                  isWidthUp("md", width) ? element.mdDelay : element.smDelay
                }
                key={element.headline}
              >
                <FeatureCard
                  Icon={element.icon}
                  color={element.color}
                  headline={element.headline}
                  text={element.text}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </div>
  );
}

FeatureSection.propTypes = {
  width: PropTypes.string.isRequired
};

export default withWidth()(FeatureSection);
