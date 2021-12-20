import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { List, Divider, Paper, withStyles } from "@material-ui/core";
import SubscriptionTable from "./SubscriptionTable";
import SubscriptionInfo from "./SubscriptionInfo";
import axios from "axios";
import { GET_ALL_CART } from "../../../utils/API";
import { Spin } from "antd";

const styles = {
  divider: {
    backgroundColor: "rgba(0, 0, 0, 0.26)",
  },
};

function Subscription(props) {
  const {
    transactions,
    classes,
    openAddBalanceDialog,
    selectSubscription,
    pushMessageToSnackbar,
    setTransactions,
  } = props;

  const [loading, setLoading] = useState(false);

  useEffect(selectSubscription, [selectSubscription]);
  useEffect(() => {
    setLoading(true);
    axios
      .get(GET_ALL_CART)
      .then((r) => {
        const { data, code } = r.data;
        if (code !== 0) {
          pushMessageToSnackbar({
            text: "查询失败请重试",
            error: true,
          });
          return;
        }
        const { cart } = data;
        const transactions = cart.map((v) => {
          return {
            id: v.id,
            description: v.name,

            balanceChange: -v.price,
            isSubscription: true,
            paidUntil: new Date(v.createdAt).getTime() / 1000,
            timestamp: new Date(v.updatedAt).getTime() / 1000,
            imageUrl: v.imageUrl,
          };
        });
        setTransactions(transactions);
      })
      .catch((r) => {
        pushMessageToSnackbar({
          text: "查询失败请重试",
          error: true,
        });
      })
      .finally((r) => {
        setLoading(false);
      });
  }, []);
  return (
    <Paper>
      <Spin spinning={loading}>
        <List disablePadding>
          <SubscriptionInfo openAddBalanceDialog={openAddBalanceDialog} />
          <Divider className={classes.divider} />
          <SubscriptionTable transactions={transactions} />
        </List>
      </Spin>
    </Paper>
  );
}

Subscription.propTypes = {
  classes: PropTypes.object.isRequired,
  transactions: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectSubscription: PropTypes.func.isRequired,
  openAddBalanceDialog: PropTypes.func.isRequired,
};

export default withStyles(styles)(Subscription);
