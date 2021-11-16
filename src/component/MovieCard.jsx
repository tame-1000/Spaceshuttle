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

import PersonIcon from "@material-ui/icons/Person";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import AddIcon from "@material-ui/icons/Add";

const useStyles = (theme) => {
  return makeStyles({
    personIcon: {
      marginTop: "1em",
    },
  });
};

const MovieCard = (props) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <Grid item xs={4} key={props.index}>
      <Card sx={{ maxWidth: 345 }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image={props.img}
            alt={props.title}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {props.title}
            </Typography>
            <Typography variant="body2">{props.desc}</Typography>
            {props.num ? (
              props.num > 10 ? (
                [...Array(10)].map((n, iconIndex) => (
                  <PersonIcon
                    className={styles.personIcon}
                    key={props.index + iconIndex}
                  ></PersonIcon>
                ))
              ) : (
                [...Array(props.num)].map((num, iconIndex) => (
                  <PersonIcon
                    className={styles.personIcon}
                    key={props.index + iconIndex}
                  ></PersonIcon>
                ))
              )
            ) : (
              <PersonOutlineIcon
                className={styles.personIcon}
                key={props.index + "0"}
              ></PersonOutlineIcon>
            )}
            {props.num > 10 && <AddIcon></AddIcon>}
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default MovieCard;
