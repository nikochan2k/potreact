import React, { VFC } from "react";
import { Potree } from "./Potree";

const App: VFC = () => {
  return (
    <Potree
      url="http://localhost:3000/pointclouds/lion_takanawa/cloud.js"
      name="lion"
      /*
      edlEnabled={false}
      fov={60}
      pointBudget={1000000}
      background={"skybox"}
      material={{
        size: 1,
        pointSizeType: PointSizeType.ADAPTIVE,
        pointShape: PointShape.SQUARE,
      }}
      */
      flipMouseButton={true}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default App;
