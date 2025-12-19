import React from "react";

export default class CrashBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { crashed: false };
  }

  static getDerivedStateFromError() {
    return { crashed: true };
  }

  componentDidCatch(err) {
    console.error("App crashed:", err);
  }

  render() {
    if (this.state.crashed) {
      return (
        <div style={{ color: "red", padding: 6 }}>
          Application crashed
        </div>
      );
    }
    return this.props.children;
  }
}
