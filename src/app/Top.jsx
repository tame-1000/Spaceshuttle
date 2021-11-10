import React from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { useHistory, Redirect } from "react-router-dom";
import { useTheme, makeStyles, Theme, Avatar } from "@material-ui/core";
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

import MovieCard from "../component/MovieCard";
import ImageSrc from "../img/seats.jpg";

const useStyles = (theme) => {
  return makeStyles({
    container: {
      height: "70%",
      margin: "16px 0",
    },
    textField: {
      width: "90%",
      height: 100,
    },
    personIcon: {
      marginTop: "1em",
    },
  });
};

const Top = () => {
  const history = useHistory();
  const { user } = useAuthContext();
  const theme = useTheme();
  const styles = useStyles(theme)();

  const list = [
    ["title1", "説明1", ImageSrc, 3],
    ["title2", "説明2", ImageSrc, 2],
    ["title3", "説明3", ImageSrc, 0],
    ["title4", "説明4", ImageSrc, 8],
    ["title5", "説明5", ImageSrc, 14],
  ];

  if (!user) {
    return <Redirect to="/signin" />;
  } else {
    return (
      <Container>
        <Grid container spacing={5}>
          {list.map((content, index) => (
            <MovieCard
              title={content[0]}
              desc={content[1]}
              img={content[2]}
              num={content[3]}
              index={index}
            ></MovieCard>
          ))}
        </Grid>
      </Container>
    );
  }
};

export default Top;

/*
            <Grid item xs={4} key={index}>
              <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image={content[2]}
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {content[0]}
                    </Typography>
                    <Typography variant="body2">{content[1]}</Typography>
                    {content[3] ? (
                      content[3] > 10 ? (
                        [...Array(10)].map((num, iconIndex) => (
                          <PersonIcon
                            className={styles.personIcon}
                            key={index + iconIndex}
                          ></PersonIcon>
                        ))
                      ) : (
                        [...Array(content[3])].map((num, iconIndex) => (
                          <PersonIcon
                            className={styles.personIcon}
                            key={index + iconIndex}
                          ></PersonIcon>
                        ))
                      )
                    ) : (
                      <PersonOutlineIcon
                        className={styles.personIcon}
                        key={index + "0"}
                      ></PersonOutlineIcon>
                    )}
                    {content[3] > 10 && <AddIcon></AddIcon>}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>*/
