import React, { PureComponent } from "react";

const P = (window as any).Potree;

export enum PointSizeType {
  FIXED = 0,
  ATTENUATED = 1,
  ADAPTIVE = 2,
}

export enum PointShape {
  SQUARE = 0,
  CIRCLE = 1,
  PARABOLOID = 2,
}

interface Coordinate {
  x: number;
  y: number;
  z: number;
}

interface MaterialProps {
  size?: number;
  pointSizeType?: PointSizeType;
  pointShape?: PointShape;
  activeAttributeName?:
    | "composite"
    | "elevation"
    | "rgba"
    | "color"
    | "intensity"
    | "intensity gradient"
    | "indices"
    | "matcap"
    | "gps-time"
    | "number of returns"
    | "return number"
    | "source id"
    | "point source id";
  rgbGamma?: number;
}

interface PotreeProps {
  url: string;
  name: string;
  edlEnabled?: boolean;
  fov?: number;
  pointBudget?: number;
  background?: "skybox" | "gradient" | "black" | "white" | "null";
  description?: string;
  material?: MaterialProps;
  position?: Coordinate;
  lookAt?: Coordinate;
  flipMouseButton?: boolean;
  style?: React.CSSProperties;
}

export class Potree extends PureComponent<PotreeProps> {
  private element?: HTMLDivElement;
  public viewer?: any;

  componentDidMount() {
    const props = this.props;

    P.MOUSE.LEFT = props.flipMouseButton ? 2 : 1;
    P.MOUSE.RIGHT = props.flipMouseButton ? 1 : 2;

    const viewer = new P.Viewer(this.element);
    if (props.edlEnabled != null) viewer.setEDLEnabled(props.edlEnabled);
    if (props.fov != null) viewer.setFOV(props.fov);
    if (props.pointBudget) viewer.setPointBudget(props.pointBudget);
    viewer.loadSettingsFromURL();
    if (props.background) viewer.setBackground(props.background);
    if (props.description) viewer.setDescription(props.description);

    P.loadPointCloud(props.url, props.name, (e: any) => {
      const scene = viewer.scene;
      const pointcloud = e.pointcloud;

      if (props.material) {
        const m = props.material;
        const material = pointcloud.material;
        if (m.size != null) material.size = m.size;
        if (m.pointSizeType != null) material.pointSizeType = m.pointSizeType;
        if (m.pointShape != null) material.shape = m.pointShape;
        if (m.activeAttributeName != null)
          material.activeAttributeName = m.activeAttributeName;
        if (m.rgbGamma != null) material.rgbGamma = m.rgbGamma;
      }

      scene.addPointCloud(pointcloud);

      if (props.position) {
        const from = props.position;
        if (props.lookAt) {
          const to = props.lookAt;
          viewer.scene.view.setView(
            [from.x, from.y, from.z],
            [to.x, to.y, to.z]
          );
        } else {
          scene.view.position.set(from.x, from.y, from.z);
        }
      } else {
        viewer.fitToScreen();
      }
    });
  }

  render() {
    return (
      <div
        style={this.props.style}
        ref={(ref) => {
          if (ref) {
            this.element = ref;
          }
        }}
      ></div>
    );
  }
}
