import { schedule } from "../kernel/Scheduler";

let pending = null;

const drag = (e) => {
  pending = e;
};

schedule(() => {
  if (!pending) return;
  onMove(
    data.id,
    pending.clientX - offset.current.x,
    pending.clientY - offset.current.y
  );
  pending = null;
});

export default function Window({ data, onFocus, onMove }) {
  const ref = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  const startDrag = (e) => {
    onFocus(data.id);
    offset.current = {
      x: e.clientX - data.x,
      y: e.clientY - data.y,
    };
    window.addEventListener("mousemove", drag);
    window.addEventListener("mouseup", stop);
  };

  const drag = (e) => {
    onMove(
      data.id,
      e.clientX - offset.current.x,
      e.clientY - offset.current.y
    );
  };

  const stop = () => {
    window.removeEventListener("mousemove", drag);
    window.removeEventListener("mouseup", stop);
  };

  const App = data.app.component;

  return (
    <div
      ref={ref}
      onMouseDown={() => onFocus(data.id)}
      style={{
        position: "absolute",
        left: data.x,
        top: data.y,
        width: data.w,
        height: data.h,
        zIndex: data.z,
        background: "#0a0a0a",
        border: "1px solid #1f2937",
      }}
    >
      <div
        onMouseDown={startDrag}
        style={{
          height: 24,
          background: "#020617",
          cursor: "move",
          padding: "4px 8px",
          fontSize: 11,
        }}
      >
        {data.app.name}
      </div>

      <div style={{ height: "calc(100% - 24px)" }}>
        <App />
      </div>
    </div>
  );
}
