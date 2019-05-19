import React, { Component } from "react";
import PropTypes from "prop-types";
import { render, unmountComponentAtNode } from "react-dom";
import Circles from "./Circles";

/**
 * Adapted from https://github.com/TeamWertarbyte/material-ui-feature-discovery-prompt.
 * Modifications made to allow for multiple FDP components in a single page application.
 */

/**
 * Material design feature discovery prompt
 * @see [Feature discovery](https://material.io/guidelines/growth-communications/feature-discovery.html#feature-discovery-design)
 */
export default class FeatureDiscoveryPrompt extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pos: {
        top: 1,
        right: 1,
        bottom: 1,
        left: 1,
        width: 1
      }
    };
  }

  componentDidMount() {
    this.portal = document.createElement("div");
    document.body.appendChild(this.portal);
    this.portal.style.position = "fixed";
    this.portal.style.zIndex = 1;
    this.portal.style.top = 0;
    this.portal.style.left = 0;
    this.renderCircle();
  }

  componentWillUnmount() {
    unmountComponentAtNode(this.portal);
    this.portal = null;
  }

  componentWillReceiveProps(nextProps) {
    if (this.circles !== null && this.circles !== undefined) {
      if (nextProps.open && !this.props.open) {
        this.circles.open();
      } else if (!nextProps.open && this.props.open) {
        this.circles.close();
      }
    }
  }

  componentDidUpdate() {
    this.renderCircle();
  }

  renderCircle() {
    if (this.circles == null) {
      const { backgroundColor, description, onClose, title } = this.props;

      render(
        <Circles
          backgroundColor={backgroundColor}
          description={description}
          element={this}
          onClose={onClose}
          {...this.props}
          ref={ref => {
            this.circles = ref;
          }}
          title={title}
        />,
        this.portal
      );
    }
  }

  render() {
    const child = React.Children.only(this.props.children);
    return React.cloneElement(child, {
      style: {
        ...child.props.style,
        position:
          child.props.style != null &&
          child.props.style.position != null &&
          child.props.style.position !== "static"
            ? child.props.style.position
            : "relative",
        zIndex: this.props.open ? 2 : 1
      }
    });
  }
}

FeatureDiscoveryPrompt.propTypes = {
  /** Defines if the prompt is visible. */
  open: PropTypes.bool.isRequired,
  /** Defines opacity of the circle. */
  opacity: PropTypes.number,
  /** Defines offset of the central circle in the y-direction. */
  subtractFromTopPos: PropTypes.number,
  /** Defines left padding for the textbox. */
  customPaddingLeft: PropTypes.number,
  /** Fired when the the prompt is visible and clicked. */
  onClose: PropTypes.func.isRequired,
  /** The node which will be featured. */
  children: PropTypes.node.isRequired,
  /** Override the inline-styles of the circles element. */
  style: PropTypes.object,
  /** Defines the title text **/
  title: PropTypes.string.isRequired,
  /** Defines the description text **/
  description: PropTypes.string.isRequired
};
