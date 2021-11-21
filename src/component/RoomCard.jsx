import React from "react";
import { useTheme, makeStyles, Theme } from "@material-ui/core";
import { useAuthContext } from "../context/authcontext";
import {
  Container,
  Grid,
  Card,
  TextField,
  Button,
  Paper,
  Box,
  Typography,
  CardMedia,
  CardActionArea,
  CardContent,
} from "@material-ui/core";

const RoomCard = (props) => {
  // 個別ページに飛ぶ関数（props.onClickを実行）
  const onClick = (id) => {
    props.onClick(id);
  };

  return (
    <Grid item xs={4} key={props.index}>
      {/* クリックしたら、個別動画ページに飛ぶように */}
      <Card sx={{ maxWidth: 345 }} onClick={() => props.onClick(props.movieid)}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="300"
            image={props.img}
            alt={props.title}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {props.title}
            </Typography>
            <Typography variant="body2">{props.desc}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default RoomCard;
