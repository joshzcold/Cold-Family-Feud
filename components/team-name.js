export default function TeamName(props) {
  return (
    <div
      className="text-3xl flex flex-col text-center space-y-2"
      style={{
        minWidth: 0,
      }}
    >
      <div className="bg-gradient-to-tr from-primary-900 to-primary-500">
        <p
          className="p-5 uppercase text-white"
          style={{
            fontWeight: 600,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            flex: 1,
            textShadow: "1px 2px 4px black",
          }}
        >
          {props.game.teams[props.team].name}
        </p>
      </div>
      <div className="flex justify-center flex-row text-center space-x-2">
        {Array(props.game.teams[props.team].mistakes).fill(
          <div className="flex-shrink">
            <img src="x.png" />
          </div>
        )}
      </div>
    </div>
  );
}
