/* eslint react/jsx-props-no-spreading: off */
// ☝️ we want this component to be usable with chakra props
import React from "react";
import { chakra, useColorModeValue } from "@chakra-ui/react";
import speedrunLogo from "./speedrun-logo.png";

const HeroLogo = props => {
  const fillColor = useColorModeValue("sre.default", "sreDark.default");

  return (
    <chakra.img
      src={speedrunLogo}
      width="500px"
      height="auto"
      {...props} // This allows props to override default values
    />
  );
};

export default HeroLogo;