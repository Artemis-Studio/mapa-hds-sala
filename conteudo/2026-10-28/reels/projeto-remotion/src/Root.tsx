import React from "react";
import { Composition } from "remotion";
import { FPS, H, W, sec } from "./theme";
import { V1, V1_DUR, V2, V2_DUR, V3, V3_DUR } from "./videos";

export const Root: React.FC = () => (
  <>
    <Composition id="V1" component={V1} durationInFrames={sec(V1_DUR)} fps={FPS} width={W} height={H} />
    <Composition id="V2" component={V2} durationInFrames={sec(V2_DUR)} fps={FPS} width={W} height={H} />
    <Composition id="V3" component={V3} durationInFrames={sec(V3_DUR)} fps={FPS} width={W} height={H} />
  </>
);
