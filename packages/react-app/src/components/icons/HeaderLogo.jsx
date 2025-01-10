/* eslint react/jsx-props-no-spreading: off */
// ☝️ we want this component to be usable with chakra props
import React from "react";
import { chakra, useColorModeValue, useToken } from "@chakra-ui/react";
import speedrunLogo from "../../speedrun-logo.png";

const HeaderLogo = props => {
  const [sreDefault, sreDarkDefault] = useToken("colors", ["sre.default", "sreDark.default"]);
  const fillColor = useColorModeValue(sreDefault, sreDarkDefault);

  return (
    <chakra.img
      src={speedrunLogo}
      width="200px"
      height="auto"
      {...props} // This allows props to override default values
    />
  );
};

export default HeaderLogo;
